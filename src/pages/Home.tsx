import React, { useState } from 'react'
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'
import { useStocks } from '../hooks/useStockData'
import { useIndustrySummaries } from '../hooks/useIndustryData'
import IndustryCard from '../components/IndustryCard'
import StockTable from '../components/StockTable'
import { StockWithQuote } from '../types'

type Period = '1d' | '5d' | '10d' | '20d' | '60d'

const Home: React.FC = () => {
  const { stocks, loading, refresh } = useStocks()
  const industrySummaries = useIndustrySummaries(stocks)
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('1d')

  const getSortedStocks = (stocks: StockWithQuote[], period: Period, ascending: boolean) => {
    return [...stocks].sort((a, b) => {
      let aVal = 0, bVal = 0
      switch (period) {
        case '1d':
          aVal = a.latest_quote?.pct_change || 0
          bVal = b.latest_quote?.pct_change || 0
          break
        case '5d':
          aVal = a.latest_quote?.pct_change_5d || 0
          bVal = b.latest_quote?.pct_change_5d || 0
          break
        case '10d':
          aVal = a.latest_quote?.pct_change_10d || 0
          bVal = b.latest_quote?.pct_change_10d || 0
          break
        case '20d':
          aVal = a.latest_quote?.pct_change_20d || 0
          bVal = b.latest_quote?.pct_change_20d || 0
          break
        case '60d':
          aVal = a.latest_quote?.pct_change_60d || 0
          bVal = b.latest_quote?.pct_change_60d || 0
          break
      }
      return ascending ? aVal - bVal : bVal - aVal
    })
  }

  const topGainers = getSortedStocks(stocks, selectedPeriod, false).slice(0, 10)
  const topLosers = getSortedStocks(stocks, selectedPeriod, true).slice(0, 10)

  const periodLabels: Record<Period, string> = {
    '1d': '1日',
    '5d': '5日',
    '10d': '10日',
    '20d': '20日',
    '60d': '60日',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">行业概览</h2>
        <button
          onClick={refresh}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          刷新
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {industrySummaries.map((industry) => (
          <IndustryCard key={industry.industry1} industry={industry} />
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">热门涨跌</h2>
          <div className="flex gap-2">
            {(Object.keys(periodLabels) as Period[]).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedPeriod === period
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {periodLabels[period]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-up" />
              <h3 className="text-lg font-bold text-gray-900">涨幅榜</h3>
            </div>
            <StockTable stocks={topGainers} />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="h-5 w-5 text-down" />
              <h3 className="text-lg font-bold text-gray-900">跌幅榜</h3>
            </div>
            <StockTable stocks={topLosers} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
