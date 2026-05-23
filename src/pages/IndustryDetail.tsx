import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useStocks } from '../hooks/useStockData'
import { useIndustryStocks, useIndustrySummaries } from '../hooks/useIndustryData'
import StockTable from '../components/StockTable'
import { formatPercent } from '../utils/formatters'

const IndustryDetail: React.FC = () => {
  const { industry1 } = useParams<{ industry1: string }>()
  const navigate = useNavigate()
  const { stocks, loading } = useStocks()
  const industryName = decodeURIComponent(industry1 || '')
  const industryStocks = useIndustryStocks(stocks, industryName)
  const industrySummaries = useIndustrySummaries(stocks)
  const industrySummary = industrySummaries.find(s => s.industry1 === industryName)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        返回首页
      </button>

      {industrySummary && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{industrySummary.industry1}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-gray-500 text-sm">股票数量</div>
              <div className="text-2xl font-bold text-gray-900">{industrySummary.stock_count} 只</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">平均涨跌幅</div>
              <div className={`text-2xl font-bold ${industrySummary.avg_pct_change >= 0 ? 'text-up' : 'text-down'}`}>
                {formatPercent(industrySummary.avg_pct_change)}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">上涨</div>
              <div className="text-2xl font-bold text-up">{industrySummary.up_count}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">下跌</div>
              <div className="text-2xl font-bold text-down">{industrySummary.down_count}</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">成分股</h3>
        <StockTable stocks={industryStocks} />
      </div>
    </div>
  )
}

export default IndustryDetail
