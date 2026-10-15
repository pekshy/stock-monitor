#!/usr/bin/env node
/**
 * write_note.mjs — 把一条「研究笔记」写入 Supabase research_notes 表
 *
 * 用法：
 *   node write_note.mjs <note.json> [选项]
 *
 * note.json 字段（除 title/body 外均可省略）：
 *   {
 *     "title":       "标题（<= 40 字）",
 *     "body":        "正文（支持多段、缩进、序号）",
 *     "kind":        "观点 | 纪要 | 资料 | 研报",       // 默认 观点
 *     "industry":    "semiconductor | ai | robotics",   // 可空
 *     "seg":         "环节 id，如 equipment",            // 可空
 *     "sub":         "细分名，通常是 TREE 的 leaf 名",    // 可空
 *     "companies":   ["企业简称", ...],                  // 关联企业，须在 COMPANIES 内
 *     "tags":        ["话题标签", ...],                  // 页面显示为 #标签
 *     "occurred_at": "2026-10-15",                      // 内容日期
 *     "source":      "https://...",                     // 原文链接
 *     "file_path":   "https://... 原件地址"              // 可空
 *   }
 *
 * 选项：
 *   --data-ts <path>   校验 companies 是否在研究池内（默认自动探测常见路径）
 *   --env <path>       指定 Supabase 凭据所在的 env 文件
 *   --no-check         跳过企业名校验
 *   --dry-run          只校验与打印，不写库
 *   --sql-dir <dir>    额外输出一份幂等 SQL 备档到该目录
 *
 * 凭据（脚本内不硬编码任何密钥，按优先级读取）：
 *   1) 环境变量 RESEARCH_SUPABASE_URL / RESEARCH_SUPABASE_KEY
 *   2) --env <path> 指定的 env 文件
 *   3) 项目 .env.local / .env 中的 SUPABASE_URL、SUPABASE_PUBLISHABLE_KEY（或 VITE_ 前缀同名项）
 *
 * 幂等：hash = sha1(`title\nbody`)，与前端 noteHash 完全一致；同内容不重复入库。
 */

import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

// ---------- 常量 ----------
const KINDS = ['观点', '纪要', '资料', '研报']
const INDUSTRIES = ['semiconductor', 'ai', 'robotics']
const TITLE_MAX = 40

// Supabase 凭据来源（按优先级）：环境变量 → --env 指定文件 → 项目 .env* 自动探测
// 注意：脚本内不硬编码任何密钥，便于随项目一起提交到公开仓库。
const ENV_FILE_CANDIDATES = [
  '/workspace/stock-monitor/.env.local',
  '/workspace/stock-monitor/.env',
]
const URL_KEYS = ['SUPABASE_URL', 'VITE_SUPABASE_URL']
const KEY_KEYS = [
  'SUPABASE_PUBLISHABLE_KEY', 'SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_KEY', 'VITE_SUPABASE_SERVICE_KEY',
]

function parseEnvFile(p) {
  const out = {}
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
    if (!m) continue
    let v = m[2].trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
    out[m[1]] = v
  }
  return out
}

const DATA_TS_CANDIDATES = [
  '/workspace/stock-monitor/src/research/data.ts',
  '/workspace/stock-monitor/src/research/data.tsx',
]

// ---------- 参数解析 ----------
const argv = process.argv.slice(2)
if (!argv.length || argv[0] === '-h' || argv[0] === '--help') {
  console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1, 32).join('\n'))
  process.exit(argv.length ? 0 : 1)
}

const notePath = argv[0]
const opts = { dataTs: null, noCheck: false, dryRun: false, sqlDir: null, env: null }
for (let i = 1; i < argv.length; i++) {
  const a = argv[i]
  if (a === '--data-ts') opts.dataTs = argv[++i]
  else if (a === '--no-check') opts.noCheck = true
  else if (a === '--dry-run') opts.dryRun = true
  else if (a === '--sql-dir') opts.sqlDir = argv[++i]
  else if (a === '--env') opts.env = argv[++i]
  else { console.error(`未知参数：${a}`); process.exit(1) }
}

// ---------- 解析 Supabase 凭据 ----------
function resolveCreds(envPath) {
  let url = process.env.RESEARCH_SUPABASE_URL || null
  let key = process.env.RESEARCH_SUPABASE_KEY || null
  const files = envPath ? [envPath] : ENV_FILE_CANDIDATES
  for (const f of files) {
    if (!fs.existsSync(f)) continue
    const e = parseEnvFile(f)
    if (!url) url = URL_KEYS.map(k => e[k]).find(Boolean) || null
    if (!key) key = KEY_KEYS.map(k => e[k]).find(Boolean) || null
    if (url && key) break
  }
  return { url, key }
}

const creds = resolveCreds(opts.env)
if (!creds.url || !creds.key) {
  console.error('缺少 Supabase 凭据。任选一种方式提供：')
  console.error('  1) 在项目 .env.local 中设置 SUPABASE_URL 与 SUPABASE_PUBLISHABLE_KEY（默认自动读取）')
  console.error('  2) 用 --env <path> 指定其他 env 文件')
  console.error('  3) 设置环境变量 RESEARCH_SUPABASE_URL / RESEARCH_SUPABASE_KEY')
  if (opts.env) console.error(`\n（已尝试的 env 文件：${opts.env}）`)
  else console.error(`\n（已尝试探测：${ENV_FILE_CANDIDATES.join(' , ')}）`)
  process.exit(1)
}
const SB_URL = creds.url
const SB_KEY = creds.key

// ---------- 读取与校验 ----------
if (!fs.existsSync(notePath)) { console.error(`找不到输入文件：${notePath}`); process.exit(1) }
let raw
try { raw = JSON.parse(fs.readFileSync(notePath, 'utf8')) }
catch (e) { console.error(`note.json 不是合法 JSON：${e.message}`); process.exit(1) }

const errors = []
const title = String(raw.title ?? '').trim()
const body = String(raw.body ?? '').trim()
const kind = String(raw.kind ?? '观点').trim()
const industry = raw.industry == null || raw.industry === '' ? null : String(raw.industry).trim()
const seg = raw.seg == null || raw.seg === '' ? null : String(raw.seg).trim()
const sub = raw.sub == null || raw.sub === '' ? null : String(raw.sub).trim()
const companies = Array.isArray(raw.companies) ? raw.companies.map(s => String(s).trim()).filter(Boolean) : []
const tags = Array.isArray(raw.tags) ? raw.tags.map(s => String(s).trim()).filter(Boolean) : []
const occurred_at = raw.occurred_at == null || raw.occurred_at === '' ? null : String(raw.occurred_at).trim()
const source = raw.source == null || raw.source === '' ? null : String(raw.source).trim()
const file_path = raw.file_path == null || raw.file_path === '' ? null : String(raw.file_path).trim()

if (!title && !body) errors.push('title 与 body 至少要有一项')
if (title.length > TITLE_MAX) errors.push(`title 超长（${title.length} > ${TITLE_MAX}）`)
if (!KINDS.includes(kind)) errors.push(`kind 必须是 ${KINDS.join(' / ')} 之一，当前为「${kind}」`)
if (industry && !INDUSTRIES.includes(industry)) errors.push(`industry 必须是 ${INDUSTRIES.join(' / ')} 之一，当前为「${industry}」`)
if (occurred_at && !/^\d{4}-\d{2}-\d{2}$/.test(occurred_at)) errors.push(`occurred_at 需为 YYYY-MM-DD，当前为「${occurred_at}」`)

// ---------- 企业名校验（防止凭印象写入池外名） ----------
let dataTs = opts.dataTs
if (!dataTs && !opts.noCheck) dataTs = DATA_TS_CANDIDATES.find(p => fs.existsSync(p)) || null
let pool = null
if (dataTs) {
  if (!fs.existsSync(dataTs)) { console.error(`--data-ts 指向的文件不存在：${dataTs}`); process.exit(1) }
  const src = fs.readFileSync(dataTs, 'utf8')
  const anchor = src.indexOf('export const COMPANIES')
  const region = anchor >= 0 ? src.slice(anchor) : src   // COMPANIES 通常位于 TREE 之后
  pool = new Set([...region.matchAll(/["']?name["']?\s*:\s*"([^"]+)"/g)].map(m => m[1]))
}
if (pool && companies.length && !opts.noCheck) {
  const missing = companies.filter(c => !pool.has(c))
  if (missing.length) {
    errors.push(`以下企业不在研究池内（COMPANIES）：${missing.join('、')}。` +
      `请改用池内简称，或先用 --no-check 跳过（仅当确属池外且有意为之）`)
  }
}

if (errors.length) {
  console.error('校验未通过：')
  for (const e of errors) console.error('  ✗ ' + e)
  process.exit(2)
}

const title2 = title || body.split(/\r?\n/).map(l => l.replace(/^[\s#>*+·\-　]+/, '').trim()).find(Boolean)?.slice(0, TITLE_MAX) || '未命名笔记'
const hash = crypto.createHash('sha1').update(`${title2}\n${body}`, 'utf8').digest('hex')

const row = {
  hash,
  kind,
  title: title2,
  body,
  source,
  industry,
  seg,
  sub,
  companies: JSON.stringify(companies),
  tags: JSON.stringify(tags),
  occurred_at,
  file_path,
  updated_at: new Date().toISOString(),
}

console.log('——— 研究笔记 · 待写入 ———')
console.log('标题    :', title2, `(${title2.length} 字)`)
console.log('类型    :', kind)
console.log('归属    :', [industry, seg, sub].filter(Boolean).join(' › ') || '(全局)')
console.log('关联企业:', companies.length ? companies.join('、') : '(无)')
console.log('标签    :', tags.length ? tags.map(t => '#' + t).join(' ') : '(无)')
console.log('内容日期:', occurred_at || '(空)')
console.log('正文长度:', body.length, '字')
console.log('hash    :', hash)

if (opts.dryRun) { console.log('\n[dry-run] 未写库。'); process.exit(0) }

// ---------- 写入（幂等） ----------
const hdr = { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' }
try {
  const chk = await fetch(`${SB_URL}/rest/v1/research_notes?hash=eq.${hash}&select=id,title`, { headers: hdr })
  if (chk.ok) {
    const exist = await chk.json()
    if (Array.isArray(exist) && exist.length) {
      console.log(`\n已存在同内容笔记（id=${exist[0].id}），未重复写入。`)
      process.exit(0)
    }
  } else {
    console.warn(`\n查重请求返回 ${chk.status}，继续尝试写入。`)
  }

  const res = await fetch(`${SB_URL}/rest/v1/research_notes`, {
    method: 'POST',
    headers: { ...hdr, Prefer: 'return=representation' },
    body: JSON.stringify(row),
  })
  const text = await res.text()
  if (!res.ok) {
    console.error(`\n写入失败 ${res.status} ${res.statusText}\n${text}`)
    process.exit(3)
  }
  const saved = JSON.parse(text)[0]
  console.log(`\n✓ 写入成功 id=${saved.id}  occurred_at=${saved.occurred_at ?? '(空)'}`)
  console.log(`  详情页验证：<站点>/#/research/company/${encodeURIComponent(companies[0] || '')}（在「研究笔记」卡片查看）`)

  // ---------- 可选：SQL 备档 ----------
  if (opts.sqlDir) {
    fs.mkdirSync(opts.sqlDir, { recursive: true })
    const q = s => s == null ? 'null' : "'" + String(s).replace(/'/g, "''") + "'"
    const fn = `note_${occurred_at || 'undated'}_${hash.slice(0, 8)}.sql`
    const sql = `-- 研究笔记备档：${title2}\n` +
      `-- 来源：${source || '(未填)'}\n` +
      `insert into research_notes (hash, kind, title, body, source, industry, seg, sub, companies, tags, occurred_at, updated_at)\n` +
      `values (${q(hash)}, ${q(kind)}, ${q(title2)}, ${q(body)}, ${q(source)}, ${q(industry)}, ${q(seg)}, ${q(sub)}, ${q(JSON.stringify(companies))}, ${q(JSON.stringify(tags))}, ${q(occurred_at)}, now())\n` +
      `on conflict (hash) do update set kind=excluded.kind, title=excluded.title, body=excluded.body, source=excluded.source, industry=excluded.industry, seg=excluded.seg, sub=excluded.sub, companies=excluded.companies, tags=excluded.tags, occurred_at=excluded.occurred_at, updated_at=now();\n`
    const out = path.join(opts.sqlDir, fn)
    fs.writeFileSync(out, sql)
    console.log(`  SQL 备档：${out}（${fs.statSync(out).size} 字节）`)
  }
} catch (e) {
  console.error(`\n网络或运行时错误：${e?.message || e}`)
  process.exit(4)
}
