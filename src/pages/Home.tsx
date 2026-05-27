import React, { useState, useMemo } from 'react'
import { RefreshCw } from 'lucide-react'
import { useStockContext } from '../context/StockContext'
import { useIndustrySummaries } from '../hooks/useIndustryData'
import IndustryCard from '../components/IndustryCard'
import StockList from '../components/StockList'
import { StockWithQuote } from '../types'

type SortOrder = 'change_desc' | 'change_asc'

const Home: React.FC = () => {
  const { stocks, loading, refresh } = useStockContext()
  const industrySummaries = useIndustrySummaries(stocks)
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('change_desc')

  const industryOptions = useMemo(() => {
    const industries = industrySummaries.map(s => s.industry1)
    return ['all', ...industries]
  }, [industrySummaries])

  const filteredStocks = useMemo(() => {
    let filtered = stocks
    if (selectedIndustry !== 'all') {
      filtered = stocks.filter(s => s.industry1 === selectedIndustry)
    }
    
    return filtered.sort((a, b) => {
      const aChange = a.latest_quote?.pct_change || 0
      const bChange = b.latest_quote?.pct_change || 0
      
      if (sortOrder === 'change_desc') {
        return bChange - aChange
      } else {
        return aChange - bChange
      }
    })
  }, [stocks, selectedIndustry, sortOrder])

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
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <h2 className="text-2xl font-bold text-gray-900">股票列表</h2>
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {industryOptions.map(industry => (
                <option key={industry} value={industry}>
                  {industry === 'all' ? '全部行业' : industry}
                </option>
              ))}
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'change_desc' ? 'change_asc' : 'change_desc')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                sortOrder === 'change_desc'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {sortOrder === 'change_desc' ? '涨幅优先 ↓' : '跌幅优先 ↑'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <StockList stocks={filteredStocks} />
        </div>
      </div>
    </div>
  )
}

export default Home
