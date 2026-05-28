import { useMemo } from 'react'
import { StockWithQuote, IndustrySummary } from '../types'

export function useIndustrySummaries(stocks: StockWithQuote[]): IndustrySummary[] {
  return useMemo(() => {
    const industryMap = new Map<string, { 
      count: number; 
      totalChange: number; 
      upCount: number; 
      downCount: number;
      peTtmValues: number[];
      pbValues: number[];
    }>()

    stocks.forEach((stock) => {
      const industry = stock.industry1 || '其他'
      const pctChange = stock.latest_quote?.pct_change || 0
      
      const existing = industryMap.get(industry) || { 
        count: 0, 
        totalChange: 0, 
        upCount: 0, 
        downCount: 0,
        peTtmValues: [],
        pbValues: [],
      }
      
      // 累加估值数据，过滤异常值
      const peTtm = stock.latest_valuation?.pe_ttm
      const pb = stock.latest_valuation?.pb
      
      const newPeTtmValues = [...existing.peTtmValues]
      const newPbValues = [...existing.pbValues]
      
      // PE(TTM)：排除负数（亏损）和大于300的异常值
      if (peTtm != null && peTtm > 0 && peTtm <= 300) {
        newPeTtmValues.push(peTtm)
      }
      
      // PB：排除负数和大于50的异常值
      if (pb != null && pb > 0 && pb <= 50) {
        newPbValues.push(pb)
      }
      
      industryMap.set(industry, {
        count: existing.count + 1,
        totalChange: existing.totalChange + pctChange,
        upCount: existing.upCount + (pctChange > 0 ? 1 : 0),
        downCount: existing.downCount + (pctChange < 0 ? 1 : 0),
        peTtmValues: newPeTtmValues,
        pbValues: newPbValues,
      })
    })

    // 计算中位数更稳健
    const getMedian = (arr: number[]) => {
      if (arr.length === 0) return null
      const sorted = [...arr].sort((a, b) => a - b)
      const mid = Math.floor(sorted.length / 2)
      return sorted.length % 2 !== 0 
        ? sorted[mid] 
        : (sorted[mid - 1] + sorted[mid]) / 2
    }

    return Array.from(industryMap.entries())
      .map(([industry1, data]) => ({
        industry1,
        stock_count: data.count,
        avg_pct_change: data.count > 0 ? data.totalChange / data.count : 0,
        up_count: data.upCount,
        down_count: data.downCount,
        avg_pe_ttm: getMedian(data.peTtmValues),
        avg_pb: getMedian(data.pbValues),
      }))
      .sort((a, b) => b.avg_pct_change - a.avg_pct_change)
  }, [stocks])
}

export function useIndustryStocks(stocks: StockWithQuote[], industryName: string): StockWithQuote[] {
  return useMemo(() => {
    return stocks.filter((stock) => (stock.industry1 || '其他') === industryName)
  }, [stocks, industryName])
}
