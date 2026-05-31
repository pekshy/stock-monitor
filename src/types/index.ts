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
  id: number
  etf_code: string
  etf_name: string
  index_code: string | null
  index_name: string | null
  fund_company: string | null
  fund_type: string | null
  created_at: string
  updated_at: string
}

export interface EtfDailyData {
  id: number
  etf_code: string
  trade_date: string
  open: number | null
  close: number | null
  high: number | null
  low: number | null
  volume: number | null
  amount: number | null
  pct_change: number | null
  price_change: number | null
  turnover_rate: number | null
  pct_change_5d: number | null
  pct_change_10d: number | null
  pct_change_20d: number | null
  pct_change_60d: number | null
  created_at: string
}

export interface EtfIndicators {
  id: number
  etf_code: string
  trade_date: string
  pe: number | null
  pb: number | null
  ps: number | null
  pc: number | null
  dividend_yield: number | null
  created_at: string
}

export interface EtfClawSignal {
  id: number
  etf_code: string
  signal_date: string
  signal_type: string | null
  signal_level: string | null
  signal_score: number | null
  signal_desc: string | null
  created_at: string
}

export interface EtfTrackedIndexHistory {
  id: number
  index_code: string
  trade_date: string
  close: number | null
  pct_change: number | null
  created_at: string
}

export interface ChinaIndicator {
  id: number
  indicator_name: string
  indicator_code: string
  value: number | null
  value_date: string
  unit: string | null
  created_at: string
}

export interface FredIndicator {
  id: number
  indicator_name: string
  indicator_code: string
  value: number | null
  value_date: string
  unit: string | null
  created_at: string
}

export interface EtfWithData extends EtfInfo {
  latest_daily?: EtfDailyData
  latest_indicator?: EtfIndicators
  latest_signal?: EtfClawSignal
}
