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

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-xs text-gray-500">买入总额</div>
          <div className="font-medium">¥{position.totalBuy.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">卖出总额</div>
          <div className="font-medium">¥{position.totalSell.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">净买入</div>
          <div className="font-medium">¥{position.netPosition.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">成本均价</div>
          <div className="font-medium">¥{position.costPrice.toFixed(3)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">现价</div>
          <div className="font-medium">¥{position.currentPrice.toFixed(3)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">盈亏</div>
          <div className={`font-semibold ${profitLossColor}`}>
            {position.profitLoss >= 0 ? '+' : ''}¥{position.profitLoss.toFixed(2)}
          </div>
        </div>
      </div>

      {(position.stopLoss || position.takeProfit) && (
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
          {position.stopLoss && (
            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
              position.stopLossAlert === 'hit' ? 'bg-red-100 text-red-700' :
              position.stopLossAlert === 'near' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              <AlertTriangle className="h-3 w-3" />
              止损 ¥{position.stopLoss}
            </div>
          )}
          {position.takeProfit && (
            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
              position.takeProfitAlert === 'hit' ? 'bg-green-100 text-green-700' :
              position.takeProfitAlert === 'near' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              <AlertTriangle className="h-3 w-3" />
              止盈 ¥{position.takeProfit}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
