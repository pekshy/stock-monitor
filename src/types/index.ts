export interface WatchlistItem {
  id: number
  stock_name: string
  stock_code: string
  industry1: string | null
  industry2: string | null
  market: string | null
  highlights: string | null
  created_at: string
  updated_at: string
}

export interface DailyQuote {
  id: number
  stock_code: string
  trade_date: string
  open_price: number | null
  close_price: number | null
  high_price: number | null
  low_price: number | null
  volume: number | null
  amount: number | null
  pct_change: number | null
  amplitude: number | null
  price_change: number | null
  turnover_rate: number | null
  pct_change_5d: number | null
  pct_change_10d: number | null
  pct_change_20d: number | null
  pct_change_30d: number | null
  pct_change_60d: number | null
  created_at: string
}

export interface DailyValuation {
  id: number
  stock_code: string
  trade_date: string
  pe_ttm: number | null
  pe_static: number | null
  pb: number | null
  psr: number | null
  total_market_cap: number | null
  circulating_market_cap: number | null
  created_at: string
}

export interface StockWithQuote extends WatchlistItem {
  latest_quote?: DailyQuote
  latest_valuation?: DailyValuation
}

export interface IndustrySummary {
  industry1: string
  stock_count: number
  avg_pct_change: number
  up_count: number
  down_count: number
  avg_pe_ttm: number | null
  avg_pb: number | null
}

// ETF相关类型
export interface EtfInfo {
  symbol: string
  name: string | null
  category: string | null
  tracking_index_name: string | null
  tracking_index_code: string | null
  created_at: string
  updated_at: string
}

export interface EtfDailyData {
  id: number
  symbol: string
  trade_date: string
  open: number | null
  high: number | null
  low: number | null
  close: number | null
  volume: number | null
  amount: number | null
  change_pct: number | null
  created_at: string
}

export interface EtfIndicators {
  id: number
  symbol: string
  trade_date: string
  data_type: string
  ma5: number | null
  ma10: number | null
  ma20: number | null
  ma60: number | null
  macd: number | null
  macd_signal: number | null
  macd_hist: number | null
  k: number | null
  d: number | null
  j: number | null
  rsi6: number | null
  rsi12: number | null
  rsi24: number | null
  boll_upper: number | null
  boll_middle: number | null
  boll_lower: number | null
  plus_di: number | null
  minus_di: number | null
  adx: number | null
  adxr: number | null
  created_at: string
}

export interface EtfClawSignal {
  id: number
  symbol: string
  trade_date: string
  name: string | null
  close: number | null
  k: number | null
  d: number | null
  j: number | null
  rsi: number | null
  macd_hist: number | null
  buy_count: number | null
  sell_count: number | null
  buy_signals: string | null
  sell_signals: string | null
  action: string | null
  action_type: string | null
  created_at: string
}

export interface ChinaIndicator {
  id: number
  indicator_id: string
  date: string
  value: number
  updated_at: string | null
}

export interface FredIndicator {
  id: number
  indicator_id: string
  date: string
  value: number
  updated_at: string | null
}

export interface EtfWithData extends EtfInfo {
  latest_daily?: EtfDailyData
  latest_indicator?: EtfIndicators
  latest_signal?: EtfClawSignal
}
