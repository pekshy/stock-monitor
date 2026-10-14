/**
 * 投资机构的结构化解析与聚合。
 *
 * 数据现状：`funding[].inv` / `funding[].investors` 是历史遗留的自由文本
 * （如「领投：东方富海 / 纪源资本；跟投：徐汇资本」），不便统计；
 * 新的 `investorsStructured[]` 是机器可读版本。
 *
 * 本模块提供 parseInvestors()：把两种写法统一成 { name, role } 列表，
 * 让存量 99 家未结构化的企业无需手改也能被聚合统计。
 * 若企业已显式提供 investorsStructured，则优先用它（人工校正优先于机器解析）。
 */
import type { ResearchCompany } from './data'

export type InvestorRole = 'lead' | 'follow' | 'strategic' | 'other'

export type InvestorKind = 'vc' | 'pe' | 'gov' | 'cvc' | 'other'

export interface InvestorRef {
  /** 机构名 */
  name: string
  /** 角色：领投 / 跟投 / 战略投资 / 未标注 */
  role: InvestorRole
  /** 来源轮次 */
  round?: string
  /** 来源日期 YYYY-MM */
  date?: string
  /** 机构类型 */
  kind?: InvestorKind
  /** 备注 */
  note?: string
}

export const ROLE_LABEL: Record<InvestorRole, string> = {
  lead: '领投',
  follow: '跟投',
  strategic: '战投',
  other: '投资方',
}

export const ROLE_CLASS: Record<InvestorRole, string> = {
  lead: 'bg-indigo-50 text-indigo-700 font-medium',
  strategic: 'bg-purple-50 text-purple-700 font-medium',
  follow: 'bg-gray-100 text-gray-600',
  other: 'bg-gray-50 text-gray-500',
}

export const KIND_LABEL: Record<InvestorKind, string> = {
  vc: '风险投资',
  pe: '私募股权',
  gov: '国资基金',
  cvc: '产业资本',
  other: '其他',
}

const ROLE_RANK: Record<InvestorRole, number> = { lead: 3, strategic: 2, follow: 1, other: 0 }

/** 从文本推断角色 */
export function roleOf(word: string): InvestorRole {
  if (/领投/.test(word)) return 'lead'
  if (/战略/.test(word)) return 'strategic'
  if (/跟投|老股东|联合投资|参与投资|投资方/.test(word)) return 'follow'
  return 'other'
}

/**
 * 从机构名推断类型。规则基于半导体领域常见机构命名习惯，
 * 仅作粗分类，人工可通过 investorsStructured[].kind 覆盖。
 */
export function kindOf(name: string): InvestorKind {
  if (/产业投资|产投|创投|创业投资|资本管理|基金|投资管理|投资合伙|股权投资/.test(name)) {
    // 国资背景识别优先于普通基金
    if (/国资|国投|国新|国开|国有|政府|引导基金|产业基金|集成电路产业投资基金|大基金|地方|省|市|区|高新|金控|控股集团|城投|交投|建投|科投|产控/.test(name)) return 'gov'
    if (/半导体|集成电路|芯片|科技|电子|通讯|通信|光电|微电子|智能|汽车|新能源|医药|健康|制造/.test(name) && /产业|产投/.test(name)) return 'cvc'
    return 'vc'
  }
  if (/腾讯|阿里|百度|小米|美团|字节|华为|中兴|京东方|比亚迪|宁德时代|联想|伟创力|富士康|工业富联|长电|华天|通富|韦尔|闻泰|华勤|立讯/.test(name)) return 'cvc'
  if (/高瓴|红杉|经纬| IDG|启明|君联|达晨|深创投|中金|中信|华兴|源码|五源|云启|真格|蓝驰|顺为|东方富海|纪源|德同|松青|合创|赛智伯乐|英诺|丰源|华山| 峰瑞|启赋|毅达|松禾|同创伟业|基石|国科嘉和|中科创星|盈富泰克|浦东科投|张江科投/.test(name)) return 'vc'
  if (/投|资本|基金|投资/.test(name)) return 'pe'
  return 'other'
}

/**
 * 泛称 / 占位词，不是具体机构名，统计时会污染结果，直接剔除。
 * 这些词出现在历史数据里多是因为原始披露口径就是模糊的（如「多家产业资本参与」）。
 */
const GENERIC_NAMES = new Set([
  '产业资本', '产业投资', '产业投资人', '国资', '国资背景', '国有资本', '地方政府',
  '头部 VC', '头部VC', '头部机构', '知名机构', '多家机构', '战略投资者', '财务投资人',
  '市场化机构', '老股东', '管理层', '员工持股平台', '核心团队', '其他股东', '社会资本',
  '未披露', '—', '-', '不详', '战略投资方', '跟投方', '领投方', '投资方', '地方政府基金',
  '政府引导基金', '国家大基金', '大基金', '国家基金', '产业基金', '投资机构', '外部机构',
])

/** 判断是否为可统计的具体机构名 */
function isRealInstitution(name: string): boolean {
  if (!name) return false
  if (GENERIC_NAMES.has(name)) return false
  // 以括号/书名号开头的都是残缺备注（原始数据里被误切）
  if (/^[（(【《]/.test(name)) return false
  // 结尾是残缺字符（如「（C」「加速 SiC」）说明是被截断的说明文字
  if (/[，,、：:]$/.test(name)) return false
  // 纯说明性短语：含动词性词汇且不含机构后缀
  if (/(持续引入|加速|用于|投向|资金|完成|增资|有利于|标志着)/.test(name) && !/公司|集团|基金|资本|投资|创投|产投|银行|信托|证券/.test(name)) return false
  // 至少 2 个字符，且不含「亿元/万元」这类金额
  if (name.length < 2) return false
  if (/亿元|万元|投资规模|突破亿元/.test(name)) return false
  // 排除估值/金额类尾注
  if (/投后估值|投前估值|估值约?[\d.]|本轮|股权|对应/.test(name)) return false
  // 过长的多半是整段说明文字而非机构名
  if (name.length > 40) return false
  return true
}

/**
 * 把融资记录里的机构自由文本拆成结构化列表。
 *
 * 兼容两种写法：
 *   1. 分段式（`inv`）：`领投：A / B；跟投：C`
 *   2. 行内式（`investors`）：`A（战略投资）· B · C（老股东追投）`
 */
export function splitInvestors(raw: string | string[] | undefined): { name: string; role: InvestorRole }[] {
  if (!raw) return []
  const text = Array.isArray(raw) ? raw.join('；') : raw
  const out: { name: string; role: InvestorRole }[] = []

  const segments = text.split(/[；;]/).map(s => s.trim()).filter(Boolean)
  for (const seg of segments) {
    // 先剥「领投：A / B；跟投：C」式的段首角色前缀
    const m = seg.match(/^(领投|联合领投|跟投|战略投资|战略投资人|老股东追投|老股东|联合投资|投资方|参与投资)\s*[:：]\s*(.+)$/)
    const segRole: InvestorRole = m ? roleOf(m[1]) : 'other'
    const body = m ? m[2] : seg
    // 段内当前生效的角色：遇逗号（isBoundary）重置为段首角色，
    // 遇「机构 领投」这类显式标注则更新，斜杠/顿号并列沿用当前角色。
    let role: InvestorRole = segRole
    for (const { text, isBoundary } of splitTopLevel(body)) {
      let piece = text.trim()
      if (!piece) continue
      if (isBoundary) role = segRole      // 逗号：回到段首角色，不继承前一块

      // 行内式尾缀（带括号）：「机构（战略投资）」
      let pieceRole: InvestorRole = role
      const inline = piece.match(/^(.+?)（(.+?)）$/)
      if (inline && /领投|跟投|战|投资|参与|加注|加码|追加/.test(inline[2])) {
        piece = inline[1].trim()
        pieceRole = roleOf(inline[2])
        // 括号角色只作用于自己，不向后继承给斜杠并列的机构；
        // 但同一段内的后续带角色标注块仍可自定角色。
        role = segRole
      }
      // 行内式后缀（无括号）：「机构 领投」——这类通常是一组的共同角色，需要继承
      const suffix = piece.match(/^(.+?)\s*(联合领投|领投|跟投|战略投资|战投|战略入股|追加投资|加注|参与投资|联合投资|联合参投|参投|加码|参与|等参与|等跟投)$/)
      if (suffix && suffix[1].trim()) {
        piece = suffix[1].trim()
        pieceRole = roleOf(suffix[2])
        role = pieceRole
      }

      piece = piece.replace(/（[^）]*）/g, '').replace(/\([^)]*\)/g, '')
      piece = piece.trim()
        .replace(/^等\s*/, '')
        .replace(/\s*等\s*[\d一二三四五六七八九十百]*\s*家?\s*(战略投资者|投资者|机构|投资平台|投资方|企业|公司|股东)?$/, '')
        .replace(/\s*(等|多家机构|家机构|等老股东|等股东|等投资方|等投资平台|等战略投资者)$/, '')
        .replace(/\s*(等参与|等跟投|等加码|等加注|等追投|联合参投|参投|参与|加码|加注|等老股东加码)$/, '')
        .trim()
      if (!piece) continue

      if (!isRealInstitution(piece)) continue
      out.push({ name: piece, role: pieceRole })
    }
  }

  // 去重（同一机构保留角色权重最高的那条）
  const dedup = new Map<string, { name: string; role: InvestorRole }>()
  for (const it of out) {
    const prev = dedup.get(it.name)
    if (!prev || ROLE_RANK[it.role] > ROLE_RANK[prev.role]) dedup.set(it.name, it)
  }
  return [...dedup.values()]
}

/**
 * 按顶层分隔符切分机构串，并记录每个切分点在原文里是「逗号」（角色边界）
 * 还是「顿号/斜杠」（同角色并列）。
 *
 * 中文融资披露的习惯：
 *   `A 领投，B / C 跟投`  → 逗号是角色边界，斜杠是并列
 * 所以切分时要把逗号之后的小块标记为「新角色段」，避免 A 的领投身份
 * 被错误继承给 B、C。
 */
function splitTopLevel(s: string): { text: string; isBoundary: boolean }[] {
  const parts: { text: string; isBoundary: boolean }[] = []
  let buf = ''
  let depth = 0
  let boundary = false
  const push = () => { parts.push({ text: buf, isBoundary: boundary }); buf = '' }
  for (const ch of s) {
    if (ch === '（' || ch === '(') depth++
    else if (ch === '）' || ch === ')') depth = Math.max(0, depth - 1)

    if (depth === 0 && (ch === '，' || ch === ',' || ch === '；' || ch === ';')) {
      push()
      boundary = true          // 逗号：下一块属于新的角色段
    } else if (depth === 0 && (ch === '/' || ch === '、')) {
      push()
      boundary = false         // 斜杠/顿号：下一块与当前同角色
    } else {
      buf += ch
    }
  }
  push()
  return parts.filter(p => p.text.trim())
}

/**
 * 取一家企业的全部投资机构记录。
 * 优先用显式 investorsStructured（人工校正），否则从 funding 文本解析。
 */
export function companyInvestors(c: ResearchCompany): InvestorRef[] {
  if (c.investorsStructured?.length) {
    return c.investorsStructured.map(i => ({
      name: i.name,
      role: i.role,
      round: i.round,
      date: i.date,
      kind: i.kind ?? kindOf(i.name),
      note: i.note,
    }))
  }
  const refs: InvestorRef[] = []
  for (const f of c.funding ?? []) {
    for (const it of splitInvestors(f.inv ?? f.investors)) {
      refs.push({ name: it.name, role: it.role, round: f.round, date: f.date, kind: kindOf(it.name) })
    }
  }
  return refs
}

/** 单家机构在某企业里的投资足迹 */
export interface InvestorCompanyHit {
  company: string
  seg?: string
  industry: string
  listed?: boolean
  /** 该机构在这家企业参与过的轮次（去重、按日期倒序） */
  rounds: { round?: string; date?: string; role: InvestorRole }[]
  /** 最高角色权重（决定列表里显示领投还是跟投） */
  topRole: InvestorRole
}

/** 机构维度的聚合结果 */
export interface InvestorAggregate {
  name: string
  kind: InvestorKind
  /** 投资企业数 */
  companyCount: number
  /** 参与轮次总数 */
  dealCount: number
  /** 领投次数 */
  leadCount: number
  /** 上市 / 未上市分布 */
  listedCount: number
  unlistedCount: number
  /** 覆盖的细分环节（去重） */
  segs: string[]
  /** 具体企业明细（企业数倒序无所谓，按名称排序稳定） */
  hits: InvestorCompanyHit[]
}

/**
 * 把所有企业的机构记录聚合成「机构 → 投资版图」。
 * 这是「统计机构在半导体领域的投资情况」的核心函数。
 */
export function aggregateInvestors(companies: ResearchCompany[]): InvestorAggregate[] {
  const map = new Map<string, InvestorAggregate>()
  for (const c of companies) {
    // 同一企业内同一机构只算一次企业数，但轮次要都记上
    const byName = new Map<string, InvestorCompanyHit>()
    for (const ref of companyInvestors(c)) {
      let hit = byName.get(ref.name)
      if (!hit) {
        hit = { company: c.name, seg: c.seg, industry: c.industry, listed: c.listed, rounds: [], topRole: 'other' }
        byName.set(ref.name, hit)
      }
      hit.rounds.push({ round: ref.round, date: ref.date, role: ref.role })
      if (ROLE_RANK[ref.role] > ROLE_RANK[hit.topRole]) hit.topRole = ref.role
    }
    for (const [name, hit] of byName) {
      let agg = map.get(name)
      if (!agg) {
        agg = {
          name, kind: kindOf(name), companyCount: 0, dealCount: 0, leadCount: 0,
          listedCount: 0, unlistedCount: 0, segs: [], hits: [],
        }
        map.set(name, agg)
      }
      agg.companyCount++
      agg.dealCount += hit.rounds.length
      agg.leadCount += hit.rounds.filter(r => r.role === 'lead').length
      if (hit.listed) agg.listedCount++
      else agg.unlistedCount++
      if (hit.seg && !agg.segs.includes(hit.seg)) agg.segs.push(hit.seg)
      agg.hits.push(hit)
    }
  }
  // 默认按投资企业数降序，其次按领投次数
  const list = [...map.values()]
  for (const a of list) a.hits.sort((x, y) => x.company.localeCompare(y.company, 'zh'))
  list.sort((a, b) => b.companyCount - a.companyCount || b.leadCount - a.leadCount || a.name.localeCompare(b.name, 'zh'))
  return list
}

/** 机构在单个细分环节的投资集中度（可用于「哪些机构押注了设备」这类问题） */
export function investorsBySeg(companies: ResearchCompany[], seg: string): InvestorAggregate[] {
  return aggregateInvestors(companies.filter(c => c.seg === seg))
}
