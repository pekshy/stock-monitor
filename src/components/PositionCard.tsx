import React from 'react'
import { Position } from '../types'
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'

interface PositionCardProps {
  position: Position
}

export const PositionCard: React.FC<PositionCardProps> = ({ position }) => {
  const profitLossColor = position.profitLoss >= 0 ? 'text-red-600' : 'text-green-600'
  const profitLossBg = position.profitLoss >= 0 ? 'bg-red-50' : 'bg-green-50'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-semibold text-gray-900">{position.name || position.symbol}</div>
          <div className="text-xs text-gray-500">{position.symbol}</div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${profitLossBg}`}>
          {position.profitLoss >= 0 ? (
            <TrendingUp className="h-4 w-4 text-red-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-green-600" />
          )}
          <span className={`text-sm font-semibold ${profitLossColor}`}>
            {position.profitLoss >= 0 ? '+' : ''}{position.profitLossPct.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-xs text-gray-500">持仓金额</div>
          <div className="text-lg font-semibold text-gray-900">¥{position.netPosition.toLocaleString()}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">盈亏</div>
          <div className={`text-lg font-semibold ${profitLossColor}`}>
            {position.profitLoss >= 0 ? '+' : ''}¥{position.profitLoss.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <span>成本 ¥{position.costPrice.toFixed(3)}</span>
        <span>现价 ¥{position.currentPrice.toFixed(3)}</span>
      </div>

      {(position.stopLossPct || position.takeProfitPct) && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          {position.stopLossPct && (
            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
              position.stopLossAlert === 'hit' ? 'bg-red-100 text-red-700' :
              position.stopLossAlert === 'near' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              <AlertTriangle className="h-3 w-3" />
              止损 -{position.stopLossPct}%
            </div>
          )}
          {position.takeProfitPct && (
            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
              position.takeProfitAlert === 'hit' ? 'bg-green-100 text-green-700' :
              position.takeProfitAlert === 'near' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              <AlertTriangle className="h-3 w-3" />
              止盈 +{position.takeProfitPct}%
            </div>
          )}
        </div>
      )}
    </div>
  )
}
