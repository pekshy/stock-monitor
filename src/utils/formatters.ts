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
