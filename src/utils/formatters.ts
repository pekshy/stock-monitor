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
 * 技术指标买卖判断：直接信任后端 action_type 字段（后端已完成最终决策）。
 * - action_type 为买入类 → buy
 * - action_type 为卖出类 → sell
 * - 其他或空 → 回退使用 action 文字兜底（兼容历史数据）
 */
export function resolveTechDirection(
  sig: {
    action_type?: string | null
    action?: string | null
    signal_score?: number | null
    event_buy_count?: number | null
    event_sell_count?: number | null
  } | null | undefined
): TechDirection {
  if (!sig) return 'neutral'

  // 1) 优先直接取 action_type（后端最终决策结果）
  if (sig.action_type) {
    const t = String(sig.action_type).toLowerCase()
    if (t === 'buy' || t.includes('买') || t.includes('bull') || t.includes('加仓')) return 'buy'
    if (t === 'sell' || t.includes('卖') || t.includes('bear') || t.includes('减仓')) return 'sell'
    if (t === 'watch' || t === 'hold' || t === 'neutral' || t.includes('观') || t.includes('持有')) return 'neutral'
  }

  // 2) 兜底：用 action 文字匹配（兼容 action_type 为空的历史数据）
  if (sig.action) {
    const act = String(sig.action).toLowerCase()
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
