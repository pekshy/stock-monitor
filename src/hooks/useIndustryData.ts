import { useMemo } from 'react'
import { StockWithQuote, IndustrySummary } from '../types'

export function useIndustrySummaries(stocks: StockWithQuote[]): IndustrySummary[] {
  return useMemo(() => {
    const industryMap = new Map<string, { count: number; totalChange: number; upCount: number; downCount: number }>()

    stocks.forEach((stock) => {
      const industry = stock.industry1 || '其他'
      const pctChange = stock.latest_quote?.pct_change || 0
      
      const existing = industryMap.get(industry) || { count: 0, totalChange: 0, upCount: 0, downCount: 0 }
      
      industryMap.set(industry, {
        count: existing.count + 1,
        totalChange: existing.totalChange + pctChange,
        upCount: existing.upCount + (pctChange > 0 ? 1 : 0),
        downCount: existing.downCount + (pctChange < 0 ? 1 : 0),
      })
    })

    return Array.from(industryMap.entries())
      .map(([industry1, data]) => ({
        industry1,
        stock_count: data.count,
        avg_pct_change: data.count > 0 ? data.totalChange / data.count : 0,
        up_count: data.upCount,
        down_count: data.downCount,
      }))
      .sort((a, b) => b.avg_pct_change - a.avg_pct_change)
  }, [stocks])
}

export function useIndustryStocks(stocks: StockWithQuote[], industryName: string): StockWithQuote[] {
  return useMemo(() => {
    return stocks.filter((stock) => (stock.industry1 || '其他') === industryName)
  }, [stocks, industryName])
}
