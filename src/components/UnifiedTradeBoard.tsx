import React, { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useTradeRecords } from '../hooks/useTradeRecords'
import { useEtfContext } from '../context/EtfContext'
import { useStockContext } from '../context/StockContext'
import { TradeRecord, Position } from '../types'
import { TradeRecordItem } from './TradeRecordItem'
import { TradeModal } from './TradeModal'
import { SellConfirmModal } from './SellConfirmModal'
import { PositionCard } from './PositionCard'

type TradeFilter = 'all' | 'etf' | 'stock'

export const UnifiedTradeBoard: React.FC = () => {
  const { records, loading, addRecord, updateRecord, deleteRecord } = useTradeRecords()
  const { etfs, priceByDateMap: etfPriceMap } = useEtfContext()
  const { stocks } = useStockContext()
  const [filter, setFilter] = useState<TradeFilter>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<TradeRecord | null>(null)
  const [sellModalOpen, setSellModalOpen] = useState(false)
  const [sellRecord, setSellRecord] = useState<TradeRecord | null>(null)

  const isEtfCode = (symbol: string) => {
    const s = symbol.toUpperCase()
    if (/^\d{6}$/.test(s)) return true
    if (s.includes('ETF')) return true
    return false
  }

  const filteredRecords = useMemo(() => {
    if (filter === 'all') return records
    if (filter === 'etf') return records.filter(r => isEtfCode(r.symbol))
    return records.filter(r => !isEtfCode(r.symbol))
  }, [records, filter])

  const etfSymbols = useMemo(() => {
    return etfs.map(e => ({ symbol: e.symbol, name: e.name || e.symbol }))
  }, [etfs])

  const stockSymbols = useMemo(() => {
    return stocks.map(s => ({ symbol: s.stock_code, name: s.stock_name }))
  }, [stocks])

  const allSymbolOptions = useMemo(() => {
    return [...etfSymbols, ...stockSymbols]
  }, [etfSymbols, stockSymbols])

  const stockPriceMap = useMemo(() => {
    const map = new Map<string, number>()
    stocks.forEach(s => {
      const price = s.latest_quote?.close_price
      if (price != null && !isNaN(price)) {
        map.set(s.stock_code, price)
      }
    })
    return map
  }, [stocks])

  const positions = useMemo(() => {
    const symbolMap = new Map<string, Position & { type: 'etf' | 'stock' }>()

    filteredRecords.forEach(record => {
      if (record.direction !== 'buy' || record.status !== 'open') return
      const { symbol, name, amount, buy_price, stop_loss_pct, take_profit_pct } = record
      if (!symbolMap.has(symbol)) {
        symbolMap.set(symbol, {
          symbol,
          name: name || symbol,
          type: isEtfCode(symbol) ? 'etf' : 'stock',
          totalBuy: 0,
          totalSell: 0,
          totalShares: 0,
          netPosition: 0,
          costBasis: 0,
          costPrice: 0,
          currentPrice: 0,
          profitLoss: 0,
          profitLossPct: 0,
          stopLossPct: stop_loss_pct,
          takeProfitPct: take_profit_pct
        })
      }
      const pos = symbolMap.get(symbol)!
      // amount 为买入金额，计算股数
      const shares = buy_price && buy_price > 0 ? amount / buy_price : 0
      pos.totalBuy += amount
      pos.totalShares += shares
      pos.netPosition += amount
      if (stop_loss_pct) pos.stopLossPct = stop_loss_pct
      if (take_profit_pct) pos.takeProfitPct = take_profit_pct
    })

    symbolMap.forEach(pos => {
      pos.costPrice = pos.totalShares > 0 ? pos.totalBuy / pos.totalShares : 0
      const price = pos.type === 'etf'
        ? (() => {
            const history = etfPriceMap.get(pos.symbol)
            if (!history || history.size === 0) return 0
            const dates = Array.from(history.keys()).sort()
            return history.get(dates[dates.length - 1]) || 0
          })()
        : stockPriceMap.get(pos.symbol) || 0
      pos.currentPrice = price
      if (pos.costPrice > 0 && price > 0) {
        pos.profitLoss = (price - pos.costPrice) * pos.totalShares
        pos.profitLossPct = (price / pos.costPrice - 1) * 100
      }
    })

    return Array.from(symbolMap.values()).filter(p => p.netPosition > 0)
  }, [filteredRecords, etfPriceMap, stockPriceMap])

  const getCurrentPrice = (symbol: string): number | undefined => {
    if (isEtfCode(symbol)) {
      const history = etfPriceMap.get(symbol)
      if (!history || history.size === 0) return undefined
      const dates = Array.from(history.keys()).sort()
      return history.get(dates[dates.length - 1])
    }
    return stockPriceMap.get(symbol)
  }

  const getPriceMap = (symbol: string): Map<string, number> | undefined => {
    if (isEtfCode(symbol)) {
      return etfPriceMap.get(symbol)
    }
    return undefined
  }

  const handleAdd = () => {
    setEditRecord(null)
    setModalOpen(true)
  }

  const handleEdit = (record: TradeRecord) => {
    setEditRecord(record)
    setModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (!window.confirm('确定删除这笔交易记录吗？')) return
    deleteRecord(id)
  }

  const handleSell = (record: TradeRecord) => {
    setSellRecord(record)
    setSellModalOpen(true)
  }

  const handleSave = async (record: Omit<TradeRecord, 'id' | 'created_at' | 'status' | 'linked_id'>) => {
    if (editRecord) {
      await updateRecord(editRecord.id!, record)
    } else {
      await addRecord(record)
    }
    setModalOpen(false)
    setEditRecord(null)
  }

  const handleSellConfirm = async (sellPrice: number, sellDate: string) => {
    if (!sellRecord) return
    await updateRecord(sellRecord.id!, {
      ...sellRecord,
      status: 'closed',
      sell_price: sellPrice,
      sell_date: sellDate
    } as Partial<TradeRecord>)
    setSellModalOpen(false)
    setSellRecord(null)
  }

  const countRecords = (type: 'etf' | 'stock') => {
    return records.filter(r => type === 'etf' ? isEtfCode(r.symbol) : !isEtfCode(r.symbol)).length
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">交易记录</h2>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              全部 ({records.length})
            </button>
            <button
              onClick={() => setFilter('etf')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === 'etf'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ETF ({countRecords('etf')})
            </button>
            <button
              onClick={() => setFilter('stock')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === 'stock'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              股票 ({countRecords('stock')})
            </button>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            添加交易
          </button>
        </div>
      </div>

      {/* 持仓概览 */}
      {positions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">持仓概览</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {positions.map(pos => (
              <PositionCard key={pos.symbol} position={pos} />
            ))}
          </div>
        </div>
      )}

      {/* 交易记录列表 */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">加载中...</div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          暂无交易记录，点击上方按钮添加
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredRecords.map(record => (
            <TradeRecordItem
              key={record.id}
              record={record}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSell={handleSell}
              currentPrice={getCurrentPrice(record.symbol)}
              allRecords={records}
            />
          ))}
        </div>
      )}

      <TradeModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditRecord(null) }}
        onSave={handleSave}
        editRecord={editRecord}
        symbolOptions={allSymbolOptions}
        priceMapsBySymbol={etfPriceMap}
      />

      <SellConfirmModal
        isOpen={sellModalOpen}
        record={sellRecord}
        currentPrice={sellRecord ? getCurrentPrice(sellRecord.symbol) : undefined}
        priceMap={sellRecord ? getPriceMap(sellRecord.symbol) : undefined}
        onConfirm={handleSellConfirm}
        onClose={() => { setSellModalOpen(false); setSellRecord(null) }}
      />
    </div>
  )
}

export default UnifiedTradeBoard
