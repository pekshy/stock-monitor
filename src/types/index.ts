export interface WatchlistItem {
  id: number
  stock_name: string
  stock_code: string
  industry1: string | null
  industry2: string | null
  market: string | null
  core_highlight: string | null
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

export interface EtfTrackedIndexHistory {
  id: number
  index_code: string
  index_name: string
  trade_date: string
  price: number | null
  change_percent: number | null
  pe: number | null
  pe_percent: number | null
  pb: number | null
  pb_percent: number | null
  peg: number | null
  roe: number | null
  revenue: number | null
  revenue_growth: number | null
  net_profit: number | null
  net_profit_growth: number | null
  valuation: string | null
  this_year: number | null
  one_year: number | null
  three_years: number | null
  five_years: number | null
  scale: number | null
  etf_scale: number | null
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

export interface MarketIndicator {
  id: number
  indicator_id: string
  date: string
  value: number
  classification?: string | null
  updated_at: string | null
}

export interface StockMarketVolume {
  id: number
  indicator_id: string
  date: string
  value: number
  updated_at: string | null
}

// ETF 笔记
export interface EtfNote {
  id: number
  symbol: string
  note: string
  created_at: string
  updated_at?: string
}

// 股票笔记
export interface StockNote {
  id: number
  stock_code: string
  note: string
  created_at: string
  updated_at?: string
}

// 交易记录
export interface TradeRecord {
  id: number
  symbol: string
  name?: string
  direction: 'buy' | 'sell'
  trade_date: string
  amount: number
  buy_price?: number | null
  stop_loss_pct?: number | null
  take_profit_pct?: number | null
  status: 'open' | 'closed'
  linked_id?: number | null
  notes?: string | null
  created_at: string
}

// 持仓概览
export interface Position {
  symbol: string
  name?: string
  totalBuy: number
  totalSell: number
  netPosition: number
  costBasis?: number
  costPrice: number
  currentPrice: number
  profitLoss: number
  profitLossPct: number
  stopLossPct?: number | null
  takeProfitPct?: number | null
  stopLossAlert?: 'hit' | 'near' | null
  takeProfitAlert?: 'hit' | 'near' | null
}

export interface EtfWithData extends EtfInfo {
  latest_daily?: EtfDailyData
  latest_indicator?: EtfIndicators
  latest_signal?: EtfClawSignal
  latest_index_valuation?: EtfTrackedIndexHistory
  butterworth_fit?: ButterworthFit[]  // Butterworth 滤波器拟合曲线数据
}

export interface IndicatorSeries {
  indicator_id: string
  latest_value: number | null
  latest_date: string | null
  history: { date: string; value: number; classification?: string | null }[]
}

export interface FedForecast {
  id: number
  indicator_id: string
  date: string
  value: string
  updated_at: string | null
}

export interface IndicatorCategory {
  id: string             // 类别内部标识
  label: string        // 类别显示名
  color: string       // 图表/标签颜色
  members: IndicatorSeries[]  // 该类下的所有指标时序数据
  default_indicator_id: string | null  // 默认展示的 indicator_id
}

// 恐贪指数专用类型
export interface FearGreedSeries {
  indicator_id: string
  latest_value: number | null
  latest_date: string | null
  latest_classification: string | null
  history: { date: string; value: number; classification?: string | null }[]
}

// Butterworth 滤波器拟合数据（K 线图上的拟合曲线）
export interface ButterworthFit {
  symbol: string
  trade_date: string
  close: number | null
  fitted: number | null
  upper_band: number | null
  lower_band: number | null
  residual: number | null
  std_residual: number | null
  rmse: number | null
  mae: number | null
  signal: string | null
  order: number | null
  cutoff: number | null
}
