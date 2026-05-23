import React from 'react'
import { ArrowUpRight, ArrowDownRight, Building2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { IndustrySummary } from '../types'
import { formatPercent, getChangeColor, getChangeBgColor } from '../utils/formatters'

interface IndustryCardProps {
  industry: IndustrySummary
}

const IndustryCard: React.FC<IndustryCardProps> = ({ industry }) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/industry/${encodeURIComponent(industry.industry1)}`)}
      className={`p-6 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${getChangeBgColor(industry.avg_pct_change)}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-bold text-gray-900">{industry.industry1}</h3>
        </div>
        {industry.avg_pct_change >= 0 ? (
          <ArrowUpRight className="h-5 w-5 text-up" />
        ) : (
          <ArrowDownRight className="h-5 w-5 text-down" />
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">平均涨跌幅</span>
          <span className={`text-xl font-bold ${getChangeColor(industry.avg_pct_change)}`}>
            {formatPercent(industry.avg_pct_change)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">股票数量</span>
          <span className="text-lg font-semibold text-gray-900">{industry.stock_count} 只</span>
        </div>
        
        <div className="flex gap-4 pt-2 border-t border-gray-200">
          <div className="text-center">
            <div className="text-up font-bold">{industry.up_count}</div>
            <div className="text-xs text-gray-500">上涨</div>
          </div>
          <div className="text-center">
            <div className="text-down font-bold">{industry.down_count}</div>
            <div className="text-xs text-gray-500">下跌</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IndustryCard
