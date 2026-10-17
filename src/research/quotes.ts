// 行业研究 · 研究池行情展示口径（数据来自 research_quotes 表）
//
// 与行情板块的 daily_quotes / daily_valuations 完全独立：那是「关注子集」，
// 这里覆盖研究池全部上市企业。抓取任务每次覆盖写同一行（主键 code），
// 因此表里永远只有最新一个交易日的快照。
//
// 取数与合并放在 research/api.ts 的 useCloudCompanies：
// 它把 research_companies（企业档案）与 research_quotes（实时行情）按 code
// 合成 CompanyRecord 的 live* 字段，页面层直接消费。

export interface ResearchQuote {
  code: string
  trade_date: string
  name: string | null
  market: string | null
  currency: string | null
  close: number | null
  prev_close: number | null
  pct_change: number | null
  volume: number | null
  amount: number | null
  turnover_rate: number | null
  total_market_cap: number | null
  pe_ttm: number | null
  pb: number | null
  psr: number | null
  source: string | null
}

/** 币种符号：市值/估值统一按「亿」计量，符号随币种变化 */
const SYMBOL: Record<string, string> = {
  CNY: '¥', USD: '$', HKD: 'HK$', JPY: 'JP¥', EUR: '€',
  GBP: '£', KRW: '₩', TWD: 'NT$', NOK: 'kr', SEK: 'kr', CHF: 'CHF',
}

export function currencySymbol(currency?: string | null): string {
  return SYMBOL[(currency ?? '').toUpperCase()] ?? ''
}

/** 币种全称（用于悬停提示，避免 ¥ 同时表示人民币和日元时产生歧义） */
const CCY_NAME: Record<string, string> = {
  CNY: '人民币', USD: '美元', HKD: '港元', JPY: '日元', EUR: '欧元',
  GBP: '英镑', KRW: '韩元', TWD: '新台币', NOK: '挪威克朗', SEK: '瑞典克朗', CHF: '瑞士法郎',
}

export function currencyName(currency?: string | null): string {
  return CCY_NAME[(currency ?? '').toUpperCase()] ?? ''
}

/** 金额单位提示，如「人民币亿元」 */
export function amountUnit(currency?: string | null): string {
  const n = currencyName(currency)
  return n ? `${n}亿元` : '亿元'
}

/**
 * 按代码后缀判断计价币种。
 * 比 data.market 可靠——企业档案里的 market 字段存在错标（如三星电子被标 US）。
 * 日元用 JP¥ 与人民币 ¥ 区分，避免同符号混淆。
 */
const SUFFIX_CCY: Record<string, string> = {
  SH: 'CNY', SZ: 'CNY', BJ: 'CNY', HK: 'HKD', US: 'USD', T: 'JPY',
  TW: 'TWD', TWO: 'TWD', DE: 'EUR', PA: 'EUR', VI: 'EUR',
  OL: 'NOK', L: 'GBP', KS: 'KRW',
}

export function currencyOfCode(code?: string | null): string | null {
  if (!code) return null
  if (!code.includes('.')) return 'USD'
  return SUFFIX_CCY[code.split('.').pop()!.toUpperCase()] ?? null
}

/** 市值（亿元）→「¥8,790.1亿」；币种缺省时不带符号，只出数字 */
export function fmtCapLive(
  v: number | string | null | undefined,
  currency?: string | null,
): string {
  if (v == null || v === '') return '—'
  const n = Number(v)
  if (!Number.isFinite(n)) return '—'
  return `${currencySymbol(currency)}${n.toLocaleString('zh-CN', { maximumFractionDigits: 1 })}亿`
}

/**
 * 近似汇率（1 单位外币 = N 人民币），仅用于「跨市场市值排序」，不参与任何展示数值。
 * 数据本身仍按各自币种原样存储；若需要精确可比，应在抓取时写入折算列。
 */
const FX_TO_CNY: Record<string, number> = {
  CNY: 1, HKD: 0.92, USD: 7.1, JPY: 0.047, KRW: 0.0052,
  EUR: 7.7, TWD: 0.22, GBP: 9.1, NOK: 0.66, CHF: 7.9,
}

/** 折算成人民币口径的数值，用于排序（不同币种的市值直接比大小没有意义） */
export function capInCny(v?: number | string | null, currency?: string | null): number {
  if (v == null || v === '') return 0
  const n = Number(v)
  if (!Number.isFinite(n)) return 0
  return n * (FX_TO_CNY[(currency ?? 'CNY').toUpperCase()] ?? 1)
}

/** 涨跌幅配色：红涨绿跌（A 股口径） */
export function pctClass(v?: number | null): string {
  if (v == null || !Number.isFinite(v) || v === 0) return 'text-gray-500'
  return v > 0 ? 'text-red-600' : 'text-green-600'
}

export function fmtPctLive(v?: number | null): string {
  if (v == null || !Number.isFinite(v)) return '—'
  return `${v > 0 ? '+' : ''}${v.toFixed(2)}%`
}

/** 估值倍数：保留指定位小数，非数值（如「亏损」）原样呈现 */
export function fmtMultiple(v: number | string | null | undefined, digits = 1): string {
  if (v == null || v === '') return '—'
  const n = Number(v)
  if (!Number.isFinite(n)) return String(v)
  return n.toFixed(digits)
}
