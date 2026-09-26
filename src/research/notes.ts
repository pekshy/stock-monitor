// 研究笔记 · 表单口径（与原工作台 db.py / 页面极简表单一致）

export const NOTE_KINDS = ['观点', '纪要', '资料', '研报'] as const
export type NoteKind = (typeof NOTE_KINDS)[number]
export const TITLE_MAX = 40

/** 标题 + 正文的 sha1（口径同 db.note_hash），用于幂等去重 */
export async function noteHash(title: string, body: string): Promise<string> {
  const data = new TextEncoder().encode(`${title}\n${body}`)
  const buf = await crypto.subtle.digest('SHA-1', data)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

/** 标题留空时按内容推短标题：正文首个有内容行（剥 Markdown 行首符号）→ 原件文件名 */
export function autoTitle(body: string | null, fileName?: string | null): string {
  for (const line of (body || '').split(/\r?\n/)) {
    const text = line.replace(/^[\s#>*+·\-　]+/, '').trim()
    if (text) return text.length > TITLE_MAX ? text.slice(0, TITLE_MAX) + '…' : text
  }
  if (fileName) {
    const stem = fileName.replace(/\.[^.]+$/, '').trim()
    if (stem) return stem.slice(0, TITLE_MAX)
  }
  return ''
}

/** 今天（本地时区）YYYY-MM-DD */
export function todayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export interface NoteFormValues {
  title: string
  kind: string
  date: string          // YYYY-MM-DD，可空
  body: string
  companies: string[]
  tags: string[]
}

/** 新增态只校验「正文或原件至少一项」；编辑态才校验标题/日期/类型（口径同原工作台） */
export function validateNote(v: NoteFormValues, isNew: boolean, hasFile: boolean): string[] {
  const bad: string[] = []
  if (isNew && !v.body.trim() && !hasFile) bad.push('正文与原件至少要有一项')
  if (!isNew) {
    if (!v.title.trim()) bad.push('标题不能为空')
    const date = v.date.trim()
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) bad.push('内容日期格式需为 YYYY-MM-DD')
    if (!NOTE_KINDS.includes(v.kind as NoteKind)) bad.push(`类型必须是 ${NOTE_KINDS.join('/')} 之一`)
  }
  return bad
}
