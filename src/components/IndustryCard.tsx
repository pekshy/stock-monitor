import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IndustrySummary } from '../types'
import { formatPercent, formatValuation, getChangeColor } from '../utils/formatters'

interface IndustryCardProps {
  industry: IndustrySummary
}

const IndustryCard: React.FC<IndustryCardProps> = ({ industry }) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/industry/${encodeURIComponent(industry.industry1)}`)}
      className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow border border-gray-100"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-900">{industry.industry1}</h3>
        <div className={`text-2xl font-bold ${getChangeColor(industry.avg_pct_change)}`}>
          {industry.avg_pct_change > 0 ? '↑' : industry.avg_pct_change < 0 ? '↓' : ''}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">平均涨跌幅</p>
          <p className={`text-xl font-semibold ${getChangeColor(industry.avg_pct_change)}`}>
            {formatPercent(industry.avg_pct_change)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">股票数量</p>
          <p className="text-xl font-semibold text-gray-900">{industry.stock_count}只</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">平均PE(TTM)</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatValuation(industry.avg_pe_ttm)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">平均PB</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatValuation(industry.avg_pb)}
          </p>
        </div>
      </div>
      
      <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-up"></div>
          <span className="text-sm text-gray-600">上涨 {industry.up_count}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-down"></div>
          <span className="text-sm text-gray-600">下跌 {industry.down_count}</span>
        </div>
      </div>
    </div>
  )
}

export default IndustryCard
