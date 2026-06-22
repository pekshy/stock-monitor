import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
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

      const stocksWithData = watchlist.map((stock) => ({
        ...stock,
        latest_quote: latestQuotes.get(stock.stock_code),
        latest_valuation: latestValuations.get(stock.stock_code),
      }))

      setStocks(stocksWithData)
      
      if (quotes.length > 0) {
        setLatestDate(quotes[0].trade_date)
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
