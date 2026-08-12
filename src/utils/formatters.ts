export function formatPercent(value: number | null | undefined): string {
  if (value == null) return '--'
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function formatPrice(value: number | null | undefined): string {
  if (value == null) return '--'
  return value.toFixed(2)
}

export function formatValuation(value: number | null | undefined): string {
  if (value == null) return '--'
  if (value >= 10000) {
    return (value / 10000).toFixed(2) + '万'
  }
  return value.toFixed(2)
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null) return '--'
  if (value >= 100000000) {
    return (value / 100000000).toFixed(2) + '亿'
  } else if (value >= 10000) {
    return (value / 10000).toFixed(2) + '万'
  }
  return value.toFixed(0)
}

export function formatMarketCap(value: number | null | undefined): string {
  if (value == null) return '--'
  if (value >= 1000000000000) { // 10^12 = 1万亿
    return (value / 1000000000000).toFixed(2) + '万亿'
  } else if (value >= 100000000) { // 10^8 = 1亿
    return (value / 100000000).toFixed(2) + '亿'
  } else if (value >= 10000) { // 10^4 = 1万
    return (value / 10000).toFixed(2) + '万'
  }
  return value.toFixed(0)
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN')
}

export function getChangeColor(value: number | null | undefined): string {
  if (value == null) return 'text-gray-600'
  if (value > 0) return 'text-up'
  if (value < 0) return 'text-down'
  return 'text-gray-600'
}

export function getChangeBgColor(value: number | null | undefined): string {
  if (value == null) return 'bg-gray-100'
  if (value > 0) return 'bg-red-50'
  if (value < 0) return 'bg-green-50'
  return 'bg-gray-100'
}

/**
 * 根据近一个月走势给出建议执行价格
 * 买入：取近30天收盘价的最低点作为底部支撑价
 * 卖出：取近30天收盘价的最高点作为顶部阻力价
 * @param closes 收盘价数组（按日期倒序，最新在前）
 * @param action 'buy' | 'sell'
 * @returns 建议价格或 null
 */
export function suggestExecutionPrice(
  closes: number[],
  action: 'buy' | 'sell'
): number | null {
  const recent = closes.slice(0, 30).filter(c => c != null && c > 0)
  if (recent.length < 3) return null

  if (action === 'buy') {
    // 找近30天的最低收盘价作为支撑位
    const min = Math.min(...recent)
    // 在最低价基础上加一点缓冲（1%），避免设在最低点正好触发
    return Math.round(min * 1.01 * 1000) / 1000
  } else {
    // 找近30天的最高收盘价作为阻力位
    const max = Math.max(...recent)
    // 在最高价基础上减一点缓冲（1%）
    return Math.round(max * 0.99 * 1000) / 1000
  }
}

export type TechDirection = 'buy' | 'sell' | 'neutral'

/**
 * 技术指标买卖判断：双维度阈值 + 信号评分绝对值综合判断
 * 优先使用 signal_score（-100 ~ 100）：
 *   - signal_score >= 40 → 买入
 *   - signal_score <= -40 → 卖出
 *   - 其他 → 观望
 * 若 signal_score 不存在，则回退到旧逻辑：
 *   - 用 event_buy_count / buy_count / event_sell_count / sell_count 的相对阈值判断
 *   - 并用 action 字段文字作为兜底
 */
export function resolveTechDirection(
  sig: {
    signal_score?: number | null
    event_buy_count?: number | null
    event_sell_count?: number | null
    buy_count?: number | null
    sell_count?: number | null
    action?: string | null
  } | null | undefined
): TechDirection {
  if (!sig) return 'neutral'

  if (sig.signal_score != null) {
    const score = Number(sig.signal_score)
    if (score >= 40) return 'buy'
    if (score <= -40) return 'sell'
    return 'neutral'
  }

  const buyCnt = Number(sig.event_buy_count ?? sig.buy_count ?? 0) || 0
  const sellCnt = Number(sig.event_sell_count ?? sig.sell_count ?? 0) || 0
  const diff = buyCnt - sellCnt
  const total = buyCnt + sellCnt
  const ratio = total > 0 ? diff / total : 0

  if (diff >= 2 && ratio >= 0.3) return 'buy'
  if (diff <= -2 && ratio <= -0.3) return 'sell'

  if (sig.action) {
    const act = sig.action.toLowerCase()
    if (act.includes('买入') || act.includes('加仓') || act.includes('buy') || act.includes('bull')) return 'buy'
    if (act.includes('卖出') || act.includes('减仓') || act.includes('sell') || act.includes('bear')) return 'sell'
  }
  return 'neutral'
}

/** 技术指标建议的展示文字 */
export function formatTechDirection(dir: TechDirection): string {
  if (dir === 'buy') return '买入'
  if (dir === 'sell') return '卖出'
  return '观望'
}
