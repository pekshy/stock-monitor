import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { TradeRecord } from '../types'

interface TradeModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (record: Omit<TradeRecord, 'id' | 'created_at' | 'status' | 'linked_id'>) => void
  editRecord?: TradeRecord | null
  etfSymbols?: { symbol: string; name: string }[]
  priceMapsBySymbol?: Map<string, Map<string, number>>  // symbol → (date → close price)
}

export const TradeModal: React.FC<TradeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editRecord,
  etfSymbols = [],
  priceMapsBySymbol
}) => {
  const [symbol, setSymbol] = useState('')
  const [name, setName] = useState('')
  const [direction, setDirection] = useState<'buy' | 'sell'>('buy')
  const [tradeDate, setTradeDate] = useState(new Date().toISOString().split('T')[0])
  const [amount, setAmount] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
  const [stopLossPct, setStopLossPct] = useState('')
  const [takeProfitPct, setTakeProfitPct] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [buyPriceEdited, setBuyPriceEdited] = useState(false)

  useEffect(() => {
    if (editRecord) {
      setSymbol(editRecord.symbol)
      setName(editRecord.name || '')
      setDirection(editRecord.direction)
      setTradeDate(editRecord.trade_date)
      setAmount(editRecord.amount.toString())
      setBuyPrice(editRecord.buy_price?.toString() || '')
      setStopLossPct(editRecord.stop_loss_pct?.toString() || '')
      setTakeProfitPct(editRecord.take_profit_pct?.toString() || '')
      setNotes(editRecord.notes || '')
      setBuyPriceEdited(!!editRecord.buy_price)
    } else {
      setSymbol('')
      setName('')
      setDirection('buy')
      setTradeDate(new Date().toISOString().split('T')[0])
      setAmount('')
      setBuyPrice('')
      setStopLossPct('5')
      setTakeProfitPct('15')
      setNotes('')
      setBuyPriceEdited(false)
    }
  }, [editRecord, isOpen])

  // 当标的或日期改变时，自动从历史收盘价填入价格（如果用户还没手动编辑过）
  useEffect(() => {
    if (buyPriceEdited) return
    if (!symbol || !tradeDate || !priceMapsBySymbol) return
    const symbolMap = priceMapsBySymbol.get(symbol.toUpperCase())
    if (!symbolMap) return
    const close = symbolMap.get(tradeDate)
    if (close != null) {
      setBuyPrice(close.toFixed(3))
    }
  }, [symbol, tradeDate, priceMapsBySymbol, buyPriceEdited])

  const handleSymbolChange = (value: string) => {
    setSymbol(value.toUpperCase())
    const found = etfSymbols.find(e => e.symbol.toUpperCase() === value.toUpperCase())
    if (found) {
      setName(found.name)
    }
  }

  const handleBuyPriceChange = (value: string) => {
    setBuyPrice(value)
    setBuyPriceEdited(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!symbol.trim() || !amount.trim()) return

    setSaving(true)
    try {
      await onSave({
        symbol: symbol.trim().toUpperCase(),
        name: name.trim() || undefined,
        direction,
        trade_date: tradeDate,
        amount: parseFloat(amount),
        buy_price: buyPrice ? parseFloat(buyPrice) : null,
        stop_loss_pct: stopLossPct ? parseFloat(stopLossPct) : null,
        take_profit_pct: takeProfitPct ? parseFloat(takeProfitPct) : null,
        notes: notes.trim() || null
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {editRecord ? '编辑交易' : '添加交易'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标的代码</label>
            <input
              type="text"
              value={symbol}
              onChange={e => handleSymbolChange(e.target.value)}
              placeholder="如：513100"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              list="etf-symbols"
              required
            />
            <datalist id="etf-symbols">
              {etfSymbols.map(e => (
                <option key={e.symbol} value={e.symbol}>{e.name}</option>
              ))}
            </datalist>
          </div>

          {name && (
            <div className="text-sm text-gray-600 -mt-2">{name}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">交易日期</label>
              <input
                type="date"
                value={tradeDate}
                onChange={e => setTradeDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">交易总额（元）</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="10000"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {direction === 'sell' ? '卖出单价' : '买入单价'}（元）
              {(() => {
                if (!symbol || !priceMapsBySymbol) return null
                const symbolMap = priceMapsBySymbol.get(symbol.toUpperCase())
                if (!symbolMap) return null
                const hasPrice = symbolMap.has(tradeDate)
                return (
                  <span className="ml-2 text-xs text-gray-400 font-normal">
                    {hasPrice ? '已自动填入当日收盘价' : '当日暂无收盘价，请手动输入'}
                  </span>
                )
              })()}
            </label>
            <input
              type="number"
              value={buyPrice}
              onChange={e => handleBuyPriceChange(e.target.value)}
              placeholder={direction === 'sell' ? '如：1.180' : '如：1.230'}
              step="0.001"
              min="0"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <p className="text-xs text-gray-400 mt-1">
              {direction === 'sell'
                ? '记录卖出单价，用于计算总收益'
                : '记录买入成本，用于计算每日收益率'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">止损（%，选填）</label>
              <input
                type="number"
                value={stopLossPct}
                onChange={e => setStopLossPct(e.target.value)}
                placeholder="8"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <p className="text-xs text-gray-400 mt-1">亏 8% 触发</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">止盈（%，选填）</label>
              <input
                type="number"
                value={takeProfitPct}
                onChange={e => setTakeProfitPct(e.target.value)}
                placeholder="15"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <p className="text-xs text-gray-400 mt-1">赚 15% 触发</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">备注（选填）</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="交易理由..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving || !symbol.trim() || !amount.trim()}
              className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
            >
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
