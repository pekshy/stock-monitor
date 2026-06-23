import React from 'react'
import { TradeRecord } from '../types'
import { Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react'

interface TradeRecordItemProps {
  record: TradeRecord
  onEdit: (record: TradeRecord) => void
  onDelete: (id: number) => void
}

export const TradeRecordItem: React.FC<TradeRecordItemProps> = ({ record, onEdit, onDelete }) => {
  const isBuy = record.direction === 'buy'

  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
        isBuy ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
      }`}>
        {isBuy ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${isBuy ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {isBuy ? '买入' : '卖出'}
          </span>
          <span className="text-sm font-semibold text-gray-900">{record.name || record.symbol}</span>
          <span className="text-xs text-gray-500">{record.symbol}</span>
          <span className="text-xs text-gray-400">{record.trade_date}</span>
        </div>

        <div className="flex items-center gap-4 mt-1 text-sm">
          <span className="text-gray-700">
            总额：<span className="font-semibold">¥{record.amount.toLocaleString()}</span>
          </span>
          {record.stop_loss_pct && (
            <span className="text-red-600 text-xs">止损：-{record.stop_loss_pct}%</span>
          )}
          {record.take_profit_pct && (
            <span className="text-green-600 text-xs">止盈：+{record.take_profit_pct}%</span>
          )}
        </div>

        {record.notes && (
          <p className="text-xs text-gray-500 mt-1">{record.notes}</p>
        )}
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onEdit(record)}
          className="p-1.5 text-gray-500 hover:text-blue-600 bg-white hover:bg-blue-50 border border-gray-200 rounded transition-colors"
          title="编辑"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onDelete(record.id)}
          className="p-1.5 text-gray-500 hover:text-red-600 bg-white hover:bg-red-50 border border-gray-200 rounded transition-colors"
          title="删除"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
