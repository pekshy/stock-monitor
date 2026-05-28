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
