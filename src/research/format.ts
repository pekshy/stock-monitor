// 行业研究模块 · 展示口径工具
// 约定与原工作台一致：日期统一「年月日」，货币 ¥，A股红涨绿跌

/** ISO(2026-09-21) / 中文(2026年9月21日) / 精确到月或年 → 统一「年月日」 */
export function fmtDate(s?: string | null): string {
  if (!s) return '—'
  const m = s.match(/^(\d{4})[-/年](\d{1,2})?[-/月]?(\d{1,2})?/)
  if (!m) return s
  const y = m[1]
  const mo = m[2] ? parseInt(m[2], 10) : null
  const d = m[3] ? parseInt(m[3], 10) : null
  if (mo == null) return `${y}年`
  if (d == null) return `${y}年${mo}月`
  return `${y}年${mo}月${d}日`
}

/** 融资/日期排序键：披露越细越靠前（只到月按当月01，只到年按1月01），无日期排最后 */
export function fundDateNum(s?: string | null): number {
  if (!s) return 0
  const m = s.match(/(\d{4})[-/年](\d{1,2})?[-/月]?(\d{1,2})?/)
  if (!m) return 0
  const y = parseInt(m[1], 10)
  const mo = m[2] ? parseInt(m[2], 10) : 1
  const d = m[3] ? parseInt(m[3], 10) : 1
  return y * 10000 + mo * 100 + d
}

type Num = number | string | null | undefined

/** 市值 / 估值（亿元） */
export function fmtCap(v?: Num): string {
  if (v == null || v === '') return '—'
  return `¥${Number(v).toLocaleString('zh-CN', { maximumFractionDigits: 1 })}亿`
}

/** 营收（亿元） */
export function fmtRev(v?: Num): string {
  if (v == null || v === '') return '—'
  return `¥${Number(v).toLocaleString('zh-CN', { maximumFractionDigits: 1 })}亿`
}

/** 百分比 */
export function fmtPct(v?: Num): string {
  if (v == null || v === '') return '—'
  return `${Number(v).toFixed(1)}%`
}

/** 数值兜底转换（非法/空 → null） */
export function toNum(v?: Num): number | null {
  if (v == null || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

/** 剔除代码后缀：688981.SH / 688981 → 688981 */
export function bareCode(code?: string | null): string {
  if (!code) return ''
  return code.split('.')[0]
}
