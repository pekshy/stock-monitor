import React, { useState, useMemo } from 'react'
import { Plus, AlertTriangle, X } from 'lucide-react'
import { useTradeRecords } from '../hooks/useTradeRecords'
import { useStockContext } from '../context/StockContext'
import { TradeRecord, Position } from '../types'
import { TradeRecordItem } from './TradeRecordItem'
import { TradeModal } from './TradeModal'
import { SellConfirmModal } from './SellConfirmModal'
import { PositionCard } from './PositionCard'

interface StockTradeBoardProps {
  onAlertClick?: (stockCode: string) => void
}

export const StockTradeBoard: React.FC<StockTradeBoardProps> = ({ onAlertClick }) => {
  const { records, loading, addRecord, updateRecord, deleteRecord } = useTradeRecords()
  const { stocks } = useStockContext()
  const [modalOpen, setModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<TradeRecord | null>(null)
  const [sellModalOpen, setSellModalOpen] = useState(false)
  const [sellRecord, setSellRecord] = useState<TradeRecord | null>(null)

  // 判断是否为股票代码（非 ETF）
  const isStockCode = (symbol: string) => {
    const s = symbol.toUpperCase()
    // ETF 代码通常是纯数字（如 513100）或包含 ETF 字样
    if (/^\d{6}$/.test(s)) return false
    if (s.includes('ETF')) return false
    return true
  }

  // 过滤出股票的交易记录
  const stockRecords = useMemo(() => {
    return records.filter(r => isStockCode(r.symbol))
  }, [records])

  // 构建股票标的列表用于自动补全
  const stockSymbols = useMemo(() => {
    return stocks.map(s => ({ symbol: s.stock_code, name: s.stock_name }))
  }, [stocks])

  // 计算持仓概览 — 只统计 status='open' 的买入记录
  const positions = useMemo(() => {
    const symbolMap = new Map<string, Position>()

    stockRecords.forEach(record => {
      if (record.direction !== 'buy' || record.status !== 'open') return
      const { symbol, name, amount, buy_price, stop_loss_pct, take_profit_pct } = record
      if (!symbolMap.has(symbol)) {
        symbolMap.set(symbol, {
          symbol,
          name: name || symbol,
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
      const shares = buy_price && buy_price > 0 ? amount / buy_price : 0
      pos.totalBuy += amount
      pos.totalShares += shares
      pos.netPosition += amount
      if (stop_loss_pct) pos.stopLossPct = stop_loss_pct
      if (take_profit_pct) pos.takeProfitPct = take_profit_pct
    })

    symbolMap.forEach(pos => {
      pos.costPrice = pos.totalShares > 0 ? pos.totalBuy / pos.totalShares : 0
    })

    return Array.from(symbolMap.values()).filter(p => p.netPosition > 0)
  }, [stockRecords])

  // 获取现价（从股票数据中获取）
  const stockPriceMap = useMemo(() => {
    const map = new Map<string, number>()
    stocks.forEach(s => {
      if (s.latest_quote?.close_price) {
        map.set(s.stock_code, s.latest_quote.close_price)
      }
    })
    return map
  }, [stocks])

  const positionsWithPrice = useMemo(() => {
    return positions.map(pos => {
      const currentPrice = stockPriceMap.get(pos.symbol) || pos.costPrice
      // 基于成本价与现价的比值计算收益率
      const profitLossPct = pos.costPrice > 0 ? (currentPrice / pos.costPrice - 1) * 100 : 0
      const profitLoss = pos.netPosition * profitLossPct / 100

      // 检查止损止盈提醒
      let stopLossAlert: 'hit' | 'near' | null = null
      let takeProfitAlert: 'hit' | 'near' | null = null

      if (pos.stopLossPct && pos.costPrice > 0) {
        const stopLossPrice = pos.costPrice * (1 - pos.stopLossPct / 100)
        const nearPrice = stopLossPrice * 1.02
        if (currentPrice <= stopLossPrice) {
          stopLossAlert = 'hit'
        } else if (currentPrice <= nearPrice) {
          stopLossAlert = 'near'
        }
      }
      if (pos.takeProfitPct && pos.costPrice > 0) {
        const takeProfitPrice = pos.costPrice * (1 + pos.takeProfitPct / 100)
        const nearPrice = takeProfitPrice * 0.98
        if (currentPrice >= takeProfitPrice) {
          takeProfitAlert = 'hit'
        } else if (currentPrice >= nearPrice) {
          takeProfitAlert = 'near'
        }
      }

      return {
        ...pos,
        currentPrice,
        profitLoss,
        profitLossPct,
        stopLossAlert,
        takeProfitAlert
      }
    })
  }, [positions, stockPriceMap])

  // 有提醒的持仓
  const alertedPositions = useMemo(() => {
    return positionsWithPrice.filter(p => p.stopLossAlert || p.takeProfitAlert)
  }, [positionsWithPrice])

  const handleEdit = (record: TradeRecord) => {
    setEditRecord(record)
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这条交易记录吗？')) {
      await deleteRecord(id)
    }
  }

  const handleSell = (record: TradeRecord) => {
    setSellRecord(record)
    setSellModalOpen(true)
  }

  const handleSellConfirm = async (sellPrice: number, sellDate: string) => {
    if (!sellRecord) return
    await updateRecord(sellRecord.id, {
      symbol: sellRecord.symbol,
      name: sellRecord.name,
      direction: 'buy',
      trade_date: sellRecord.trade_date,
      amount: sellRecord.amount,
      buy_price: sellRecord.buy_price,
      stop_loss_pct: sellRecord.stop_loss_pct,
      take_profit_pct: sellRecord.take_profit_pct,
      notes: sellRecord.notes,
      status: 'closed'
    })
    await addRecord({
      symbol: sellRecord.symbol,
      name: sellRecord.name,
      direction: 'sell',
      trade_date: sellDate,
      amount: sellRecord.amount,
      buy_price: sellPrice,
      stop_loss_pct: null,
      take_profit_pct: null,
      notes: null,
      status: 'closed',
      linked_id: sellRecord.id
    })
    setSellModalOpen(false)
    setSellRecord(null)
  }

  const handleSave = async (record: Omit<TradeRecord, 'id' | 'created_at' | 'status' | 'linked_id'>) => {
    if (editRecord) {
      await updateRecord(editRecord.id, record)
    } else {
      await addRecord(record)
    }
    setEditRecord(null)
  }

  // 构建价格日期 Map（用于自动填充收盘价）
  const priceMapsBySymbol = useMemo(() => {
    const map = new Map<string, Map<string, number>>()
    // 股票历史数据暂不在此构建，详情页有 quotes 数据
    return map
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">股票交易记录</h2>
        <button
          onClick={() => { setEditRecord(null); setModalOpen(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          添加交易
        </button>
      </div>

      {/* 提醒横幅 */}
      {alertedPositions.length > 0 && (
        <div className="mb-4 space-y-2">
          {alertedPositions.map(pos => (
            <div
              key={pos.symbol}
              className={`flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                pos.stopLossAlert === 'hit' || pos.takeProfitAlert === 'hit'
                  ? 'bg-red-50 text-red-700 hover:bg-red-100'
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
              }`}
              onClick={() => onAlertClick?.(pos.symbol)}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {pos.name || pos.symbol} 现价 ¥{pos.currentPrice.toFixed(2)}
                </span>
                {pos.stopLossAlert === 'hit' && (
                  <span className="text-xs">触及止损 -{pos.stopLossPct}%</span>
                )}
                {pos.stopLossAlert === 'near' && (
                  <span className="text-xs">接近止损 -{pos.stopLossPct}%</span>
                )}
                {pos.takeProfitAlert === 'hit' && (
                  <span className="text-xs">触及止盈 +{pos.takeProfitPct}%</span>
                )}
                {pos.takeProfitAlert === 'near' && (
                  <span className="text-xs">接近止盈 +{pos.takeProfitPct}%</span>
                )}
              </div>
              <X className="h-4 w-4 opacity-50" />
            </div>
          ))}
        </div>
      )}

      {/* 持仓概览 */}
      {positionsWithPrice.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">持仓概览</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {positionsWithPrice.map(pos => (
              <PositionCard key={pos.symbol} position={pos} />
            ))}
          </div>
        </div>
      )}

      {/* 交易记录列表 */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">加载中...</div>
      ) : stockRecords.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          暂无股票交易记录，点击上方按钮添加
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {stockRecords.map(record => (
            <TradeRecordItem
              key={record.id}
              record={record}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSell={handleSell}
              currentPrice={stockPriceMap.get(record.symbol)}
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
        symbolOptions={stockSymbols}
        priceMapsBySymbol={priceMapsBySymbol}
      />

      <SellConfirmModal
        isOpen={sellModalOpen}
        record={sellRecord}
        currentPrice={sellRecord ? stockPriceMap.get(sellRecord.symbol) : undefined}
        onConfirm={handleSellConfirm}
        onClose={() => { setSellModalOpen(false); setSellRecord(null) }}
      />
    </div>
  )
}