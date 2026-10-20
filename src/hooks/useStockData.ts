import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { classifyOf } from '../research/watchlist'
import { WatchlistItem, DailyQuote, DailyValuation, StockWithQuote } from '../types'

export function useStocks() {
  const [stocks, setStocks] = useState<StockWithQuote[]>([])
  const [latestDate, setLatestDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStocks()
  }, [])

  async function fetchStocks() {
    try {
      setLoading(true)
      
      const { data: watchlist, error: watchlistError } = await supabase
        .from('watchlist')
        .select('*')
        .order('industry1', { ascending: true })

      if (watchlistError) throw watchlistError

      const stockCodes = watchlist.map((s) => s.stock_code)

      // 行业分类以研究池为准：watchlist 里的 industry1/2 只是写入当时的快照。
      // 这里按代码回查 research_companies，展示时始终用研究池当前的 industry / seg，
      // 研究池改了分类，股票板块的行业卡片、筛选、详情页会一起变。
      const classMap = new Map<string, { industry1: string; industry2: string }>()
      if (stockCodes.length > 0) {
        const { data: companies } = await supabase
          .from('research_companies')
          .select('code,industry,seg')
          .in('code', stockCodes)

        ;(companies ?? []).forEach(
          (c: { code: string | null; industry: string | null; seg: string | null }) => {
            if (c.code) classMap.set(c.code, classifyOf(c.industry, c.seg))
          },
        )
      }

      const { data: quotes, error: quotesError } = await supabase
        .from('daily_quotes')
        .select('*')
        .in('stock_code', stockCodes)
        .order('trade_date', { ascending: false })

      if (quotesError) throw quotesError

      const { data: valuations, error: valuationsError } = await supabase
        .from('daily_valuations')
        .select('*')
        .in('stock_code', stockCodes)
        .order('trade_date', { ascending: false })

      if (valuationsError) throw valuationsError

      const latestQuotes = new Map<string, DailyQuote>()
      const latestValuations = new Map<string, DailyValuation>()

      quotes.forEach((quote) => {
        if (!latestQuotes.has(quote.stock_code)) {
          latestQuotes.set(quote.stock_code, quote)
        }
      })

      valuations.forEach((valuation) => {
        if (!latestValuations.has(valuation.stock_code)) {
          latestValuations.set(valuation.stock_code, valuation)
        }
      })

      // 兜底：daily_quotes 按日批跑，新加入关注的标的可能完全没有记录，
      // 或者只停在很早的历史日期上。这里用研究池行情（research_quotes，腾讯源，
      // 每股仅保留最新一个交易日）做当日补位：
      //   - daily_quotes 没有该股 → 直接补
      //   - research_quotes 的交易日更新 → 用当日价格/估值覆盖，多周期涨跌幅置空（前端显示 --）
      // 若 daily_quotes 已是最新交易日，则保持原样，不动历史口径。
      if (stockCodes.length > 0) {
        const { data: researchQuotes } = await supabase
          .from('research_quotes')
          .select('*')
          .in('code', stockCodes)

        ;(researchQuotes ?? []).forEach((r: Record<string, any>) => {
          const code = String(r.code)
          const tradeDate = String(r.trade_date ?? '')
          const current = latestQuotes.get(code)
          if (current && current.trade_date >= tradeDate) return
          // 市值单位对齐 daily_valuations 的口径：A 股存「亿」，美股/港股存「元」。
          // research_quotes 全市场都存「亿」，这里对境外市场乘 1e8 还原，
          // 否则列表里的市值会被 StockList 的 ÷1e8 再缩一次，显示成 0。
          const suffix = code.split('.').pop()?.toUpperCase() ?? ''
          const capFactor = ['SH', 'SZ', 'BJ'].includes(suffix) ? 1 : 1e8
          // 昨日行情与新行情相差超过 7 天，说明中间缺了数据，旧的多周期涨跌幅不可信
          const keepPeriods =
            !!current &&
            !!current.trade_date &&
            (Date.parse(tradeDate) - Date.parse(current.trade_date)) / 86400000 <= 7
          latestQuotes.set(code, {
            id: -1,
            stock_code: code,
            trade_date: tradeDate,
            open_price: r.open ?? null,
            close_price: r.close ?? null,
            high_price: r.high ?? null,
            low_price: r.low ?? null,
            volume: r.volume ?? null,
            amount: r.amount ?? null,
            pct_change: r.pct_change ?? null,
            amplitude: null,
            price_change:
              r.close != null && r.prev_close != null
                ? Number((Number(r.close) - Number(r.prev_close)).toFixed(2))
                : null,
            turnover_rate: r.turnover_rate ?? null,
            // 多周期涨跌幅沿用 daily_quotes 的口径（腾讯接口不分发，由批跑脚本算）。
            // 仅当昨日行情就在 1 周内时才沿用，否则多周期是旧价格算出来的，会失真（如期间除权），置空。
            pct_change_5d: keepPeriods ? current!.pct_change_5d : null,
            pct_change_10d: keepPeriods ? current!.pct_change_10d : null,
            pct_change_20d: keepPeriods ? current!.pct_change_20d : null,
            pct_change_30d: keepPeriods ? current!.pct_change_30d : null,
            pct_change_60d: keepPeriods ? current!.pct_change_60d : null,
            created_at: r.fetched_at ?? '',
          })
          latestValuations.set(code, {
            id: -1,
            stock_code: code,
            trade_date: tradeDate,
            pe_ttm: r.pe_ttm ?? null,
            pe_static: null,
            pb: r.pb ?? null,
            psr: r.psr ?? null,
            total_market_cap:
              r.total_market_cap != null ? Number(r.total_market_cap) * capFactor : null,
            circulating_market_cap: null,
            created_at: r.fetched_at ?? '',
          })
        })
      }

      const stocksWithData = watchlist.map((stock) => {
        const labels = classMap.get(stock.stock_code)
        return {
          ...stock,
          industry1: labels?.industry1 ?? stock.industry1,
          industry2: labels?.industry2 ?? stock.industry2,
          latest_quote: latestQuotes.get(stock.stock_code),
          latest_valuation: latestValuations.get(stock.stock_code),
        }
      })

      setStocks(stocksWithData)

      // 最新交易日取「已有行情 + 兜底行情」里的最大值
      const dates = Array.from(latestQuotes.values())
        .map((quote) => quote.trade_date)
        .filter(Boolean)
        .sort()
      if (dates.length > 0) {
        setLatestDate(dates[dates.length - 1])
      }
    } catch (error) {
      console.error('Error fetching stocks:', error)
    } finally {
      setLoading(false)
    }
  }

  return { stocks, latestDate, loading, refresh: fetchStocks }
}

export function useStockDetail(stockCode: string) {
  const [stock, setStock] = useState<WatchlistItem | null>(null)
  const [quotes, setQuotes] = useState<DailyQuote[]>([])
  const [valuations, setValuations] = useState<DailyValuation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (stockCode) {
      fetchStockDetail(stockCode)
    }
  }, [stockCode])

  async function fetchStockDetail(code: string) {
    try {
      setLoading(true)

      const { data: stockData, error: stockError } = await supabase
        .from('watchlist')
        .select('*')
        .eq('stock_code', code)
        .single()

      if (stockError) throw stockError

      const { data: quotesData, error: quotesError } = await supabase
        .from('daily_quotes')
        .select('*')
        .eq('stock_code', code)
        .order('trade_date', { ascending: false })
        .limit(90)

      if (quotesError) throw quotesError

      const { data: valuationsData, error: valuationsError } = await supabase
        .from('daily_valuations')
        .select('*')
        .eq('stock_code', code)
        .order('trade_date', { ascending: false })
        .limit(90)

      if (valuationsError) throw valuationsError

      setStock(stockData)
      setQuotes(quotesData)
      setValuations(valuationsData)
    } catch (error) {
      console.error('Error fetching stock detail:', error)
    } finally {
      setLoading(false)
    }
  }

  return { stock, quotes, valuations, loading }
}
