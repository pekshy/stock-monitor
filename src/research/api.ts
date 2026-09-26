import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../utils/supabase'
import { COMPANIES, INTEL_FALLBACK, ANN_FALLBACK, type ResearchCompany } from './data'
import { bareCode } from './format'
import { noteHash } from './notes'

// ---------- 云端行类型（research_ 前缀表） ----------

export interface CloudReport {
  url: string; date: string; org: string; title: string
  industry: string; seg: string | null; sub: string | null
  rtype: string | null; industry_name: string | null
  researcher: string | null; rating: string | null
}

export interface CloudEvent {
  url: string; time: string; date: string; type: string
  industry: string; seg: string | null; sub: string | null
  title: string; summary: string | null; companies: string | string[] | null
}

export interface CloudNote {
  id: number; hash: string; kind: string; title: string; body: string | null
  source: string | null; industry: string | null; seg: string | null; sub: string | null
  companies: string | null; tags: string | null; occurred_at: string
  file_path: string | null; created_at: string; updated_at: string | null
}

export interface CloudAnnouncement {
  id: number; code: string; date: string; tag: string; title: string
  attach_url: string | null; detail_url: string | null
}

export interface CloudCompanyRow {
  name: string; code: string | null; industry: string; seg: string | null
  listed: boolean; round: string | null; cap: number | null
  valuation: number | null; rev: number | null; last_funding: string | null
  data: ResearchCompany
}

// ---------- 通用取数（失败静默降级） ----------

async function fetchTable<T>(table: string, order: string, limit = 2000): Promise<T[] | null> {
  try {
    const { data, error } = await supabase
      .from(table).select('*').order(order, { ascending: false }).limit(limit)
    if (error) throw error
    return (data ?? []) as T[]
  } catch {
    return null  // 云端不可达 / 表不存在 / RLS 拦截
  }
}

/** 解析 events.companies / notes.companies / notes.tags（JSON 数组字符串或原生数组） */
export function parseList(s: string | string[] | null | undefined): string[] {
  if (!s) return []
  if (Array.isArray(s)) return s.map(String)
  try {
    const v = JSON.parse(s)
    return Array.isArray(v) ? v.map(String) : []
  } catch {
    return []
  }
}

// ---------- 行业情报（研报 / 事件 / 笔记） ----------

export interface IntelData {
  reports: CloudReport[]
  events: CloudEvent[]
  notes: CloudNote[]
  /** true = 已连上云端；false = 使用内置兜底（研报/事件为空） */
  cloudOk: boolean
  loading: boolean
  refresh: () => void
}

export function useIntel(): IntelData {
  const [reports, setReports] = useState<CloudReport[]>(() => INTEL_FALLBACK.reports as CloudReport[])
  const [events, setEvents] = useState<CloudEvent[]>(() => INTEL_FALLBACK.events as CloudEvent[])
  const [notes, setNotes] = useState<CloudNote[]>([])
  const [cloudOk, setCloudOk] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  const refresh = useCallback(() => setTick(t => t + 1), [])

  useEffect(() => {
    let alive = true
    setLoading(true)
    ;(async () => {
      const [r, e, n] = await Promise.all([
        fetchTable<CloudReport>('research_reports', 'date'),
        fetchTable<CloudEvent>('research_events', 'date'),
        fetchTable<CloudNote>('research_notes', 'occurred_at'),
      ])
      if (!alive) return
      const ok = r !== null || e !== null
      setCloudOk(ok)
      // 云端可用用云端（云端为空表也尊重空表）；不可达才用兜底
      setReports(ok ? (r ?? []) : INTEL_FALLBACK.reports as CloudReport[])
      setEvents(ok ? (e ?? []) : INTEL_FALLBACK.events as CloudEvent[])
      setNotes(n ?? [])
      setLoading(false)
    })()
    return () => { alive = false }
  }, [tick])

  return { reports, events, notes, cloudOk, loading, refresh }
}

// ---------- 企业库（云端为准，内置兜底） ----------

export interface CompanyRecord extends ResearchCompany {
  /** 云端行补充的规范化字段 */
  cloudRound?: string | null
}

export function useCloudCompanies() {
  const [companies, setCompanies] = useState<CompanyRecord[]>(COMPANIES)
  const [cloudOk, setCloudOk] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const rows = await fetchTable<CloudCompanyRow>('research_companies', 'name')
      if (!alive) return
      if (rows && rows.length > 0) {
        setCompanies(rows.map(r => ({ ...r.data, cloudRound: r.round })))
        setCloudOk(true)
      }
      setLoading(false)
    })()
    return () => { alive = false }
  }, [])

  return { companies, cloudOk, loading }
}

// ---------- 公司公告（企业详情页） ----------

export function useCompanyAnnouncements(code?: string | null) {
  const [anns, setAnns] = useState<CloudAnnouncement[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let alive = true
    const bare = bareCode(code)
    if (!bare) { setAnns([]); return }
    setLoading(true)
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from('research_announcements')
          .select('*')
          .eq('code', bare)
          .order('date', { ascending: false })
          .limit(200)
        if (error) throw error
        if (alive) setAnns((data ?? []) as CloudAnnouncement[])
      } catch {
        // 云端不可达：用注入的公告兜底（key 为裸代码）
        if (alive) {
          const fb = ANN_FALLBACK[bare]
          setAnns(fb ? fb.announcements.map((a, i) => ({
            id: i, code: bare, date: a.date, tag: a.tag, title: a.title,
            attach_url: a.attachUrl ?? null, detail_url: a.detailUrl ?? null,
          })) : [])
        }
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [code])

  return { anns, loading }
}

// ---------- 研究笔记 · 页面增改删（直连 Supabase） ----------

/** 正文留空时可直接当正文读入的文本扩展名（口径同 db.TEXT_EXTS） */
const TEXT_EXTS = ['md', 'txt', 'csv', 'json', 'html', 'log']

export function isTextFile(name: string): boolean {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  return TEXT_EXTS.includes(ext)
}

/** 上传原件到 GitHub 公开文件库（VITE_GH_REPO，如 pekshy/research-files），返回公开链接。
 *  链接用 jsDelivr CDN（国内可达）；新文件名为时间戳前缀，天然避开 CDN 缓存问题。
 *  token 用细粒度 PAT：只授权该仓库 Contents: Read and write（勿用全权限 token 放前端）。 */
export async function uploadNoteFile(file: File): Promise<{ path: string | null; error?: string }> {
  const repo = (import.meta.env.VITE_GH_REPO as string | undefined)?.trim()
  const token = (import.meta.env.VITE_GH_TOKEN as string | undefined)?.trim()
  if (!repo || !token) {
    return { path: null, error: '未配置 VITE_GH_REPO / VITE_GH_TOKEN（GitHub 文件库）' }
  }
  try {
    if (file.size > 100 * 1024 * 1024) {
      return { path: null, error: 'GitHub 单文件上限 100MB' }
    }
    // GitHub Contents API 对路径同样有 ASCII 校验口径，统一清洗成 '-'，保留扩展名
    const safe = file.name.replace(/[^\w.!*'() &$@=;:+,?-]+/g, '-').replace(/-{2,}/g, '-').replace(/^-|-$/g, '')
    const path = `notes/${Date.now()}-${safe || 'file'}`
    // FileReader 读成 dataURL 再剥前缀，比 btoa 分块稳（大文件也不炸栈）
    const b64: string = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
      reader.onerror = () => reject(new Error('读取文件失败'))
      reader.readAsDataURL(file)
    })
    const resp = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: `research file: ${path}`, content: b64, branch: 'main' }),
    })
    if (!resp.ok) {
      const body = await resp.text().catch(() => '')
      return { path: null, error: `GitHub 上传失败 HTTP ${resp.status}: ${body.slice(0, 200)}` }
    }
    return { path: `https://cdn.jsdelivr.net/gh/${repo}@main/${path}` }
  } catch (e) {
    return { path: null, error: String((e as Error)?.message || e) }
  }
}

export interface NoteWrite {
  kind: string
  title: string
  body: string
  industry: string | null
  seg: string | null
  sub: string | null
  companies: string[]
  tags: string[]
  occurred_at: string
  file_path?: string | null
}

function noteRow(w: NoteWrite, hash: string): Record<string, unknown> {
  return {
    hash,
    kind: w.kind,
    title: w.title,
    body: w.body,
    industry: w.industry,
    seg: w.seg,
    sub: w.sub,
    companies: JSON.stringify(w.companies ?? []),
    tags: JSON.stringify(w.tags ?? []),
    occurred_at: w.occurred_at,
    file_path: w.file_path ?? null,
    updated_at: new Date().toISOString(),
  }
}

/** 新增：按 hash 幂等（同一份内容不重复入库，返回已有条目） */
export async function insertNote(w: NoteWrite): Promise<{ created: boolean; note?: CloudNote; error?: string }> {
  try {
    const hash = await noteHash(w.title, w.body)
    const hit = await supabase.from('research_notes').select('*').eq('hash', hash).limit(1)
    if (!hit.error && hit.data && hit.data.length > 0) {
      return { created: false, note: hit.data[0] as CloudNote }
    }
    const { data, error } = await supabase.from('research_notes').insert(noteRow(w, hash)).select().single()
    if (error) return { created: false, error: error.message }
    return { created: true, note: data as CloudNote }
  } catch (e) {
    return { created: false, error: String((e as Error)?.message || e) }
  }
}

export async function updateNote(id: number, w: NoteWrite): Promise<{ error?: string }> {
  try {
    const hash = await noteHash(w.title, w.body)
    const { error } = await supabase.from('research_notes').update(noteRow(w, hash)).eq('id', id)
    if (error) return { error: error.message }
    return {}
  } catch (e) {
    return { error: String((e as Error)?.message || e) }
  }
}

export async function removeNote(id: number): Promise<{ error?: string }> {
  try {
    const { error } = await supabase.from('research_notes').delete().eq('id', id)
    if (error) return { error: error.message }
    return {}
  } catch (e) {
    return { error: String((e as Error)?.message || e) }
  }
}
