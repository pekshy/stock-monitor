import React from 'react'
import { TradeRecord } from '../types'
import { Pencil, Trash2, TrendingUp, TrendingDown, ArrowDownRight } from 'lucide-react'

interface TradeRecordItemProps {
  record: TradeRecord
  onEdit: (record: TradeRecord) => void
  onDelete: (id: number) => void
  onSell?: (record: TradeRecord) => void
  currentPrice?: number
  allRecords?: TradeRecord[]
}

export const TradeRecordItem: React.FC<TradeRecordItemProps> = ({
  record,
  onEdit,
  onDelete,
  onSell,
  currentPrice,
  allRecords = []
}) => {
  const isBuy = record.direction === 'buy'
  const isOpen = record.status === 'open'

  // 计算收益率
  const getReturnDisplay = () => {
    // 卖出的记录：如果有 buy_price（卖出时的价格），计算总收益
    if (!isBuy && record.buy_price) {
      // 尝试找到对应的买入记录来获取买入价格
      let buyPriceForCalc: number | null = null

      if (record.linked_id) {
        const linkedBuy = allRecords.find(r => r.id === record.linked_id)
        if (linkedBuy?.buy_price) {
          buyPriceForCalc = linkedBuy.buy_price
        }
      }

      // 如果没有 linked_id，直接用 record.buy_price 作为卖出价，找到对应的买入价
      if (!buyPriceForCalc && isOpen === false) {
        // 对于已卖出的记录，buy_price 是卖出价，需要找到买入价
        // 简单策略：找同一标的的更早的买入记录
        const symbolBuys = allRecords
          .filter(r => r.symbol === record.symbol && r.direction === 'buy' && r.trade_date < record.trade_date)
          .sort((a, b) => b.trade_date.localeCompare(a.trade_date))
        if (symbolBuys.length > 0 && symbolBuys[0].buy_price) {
          buyPriceForCalc = symbolBuys[0].buy_price
        }
      }

      if (buyPriceForCalc) {
        const returnPct = ((record.buy_price! - buyPriceForCalc) / buyPriceForCalc) * 100
        const isPositive = returnPct >= 0
        return {
          label: '总收益',
          value: `${isPositive ? '+' : ''}${returnPct.toFixed(2)}%`,
          isPositive,
          className: isPositive ? 'text-red-600' : 'text-green-600'
        }
      }
    }

    // 买入记录：如果有 buy_price 且有现价，显示当前收益率
    if (isBuy && record.buy_price && currentPrice && currentPrice > 0) {
      const returnPct = ((currentPrice - record.buy_price) / record.buy_price) * 100
      const isPositive = returnPct >= 0
      return {
        label: '当前收益',
        value: `${isPositive ? '+' : ''}${returnPct.toFixed(2)}%`,
        isPositive,
        className: isPositive ? 'text-red-600' : 'text-green-600'
      }
    }

    return null
  }

  const returnInfo = getReturnDisplay()

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
          {isOpen && isBuy && <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">持仓中</span>}
        </div>

        <div className="flex items-center gap-4 mt-1 text-sm">
          <span className="text-gray-700">
            总额：<span className="font-semibold">¥{record.amount.toLocaleString()}</span>
          </span>
          {record.buy_price && (
            <span className="text-gray-600 text-xs">
              {isBuy ? `成本 ¥${record.buy_price.toFixed(3)}` : `卖出价 ¥${record.buy_price.toFixed(3)}`}
            </span>
          )}
          {record.stop_loss_pct && (
            <span className="text-green-600 text-xs">止损：-{record.stop_loss_pct}%</span>
          )}
          {record.take_profit_pct && (
            <span className="text-red-600 text-xs">止盈：+{record.take_profit_pct}%</span>
          )}
        </div>

        {returnInfo && (
          <div className={`flex items-center gap-1 mt-1 text-sm font-semibold ${returnInfo.className}`}>
            <span>{returnInfo.label}：</span>
            <span>{returnInfo.value}</span>
          </div>
        )}

        {record.notes && (
          <p className="text-xs text-gray-500 mt-1">{record.notes}</p>
        )}
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        {isBuy && isOpen && onSell && (
          <button
            onClick={() => onSell(record)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-sm font-semibold text-white hover:text-green-600 bg-green-500 hover:bg-green-50 border border-green-200 rounded transition-colors"
            title="卖出"
          >
            <ArrowDownRight className="h-3.5 w-3.5" />
            <span>卖出</span>
          </button>
        )}
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
