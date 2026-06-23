import React, { useState, useMemo } from 'react'
import { Plus, AlertTriangle, X } from 'lucide-react'
import { useTradeRecords } from '../hooks/useTradeRecords'
import { useEtfData } from '../hooks/useEtfData'
import { TradeRecord, Position } from '../types'
import { TradeRecordItem } from './TradeRecordItem'
import { TradeModal } from './TradeModal'
import { SellConfirmModal } from './SellConfirmModal'
import { PositionCard } from './PositionCard'

interface TradeBoardProps {
  onAlertClick?: (symbol: string) => void
}

export const TradeBoard: React.FC<TradeBoardProps> = ({ onAlertClick }) => {
  const { records, loading, addRecord, updateRecord, deleteRecord } = useTradeRecords()
  const { etfs } = useEtfData()
  const [modalOpen, setModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<TradeRecord | null>(null)
  const [sellModalOpen, setSellModalOpen] = useState(false)
  const [sellRecord, setSellRecord] = useState<TradeRecord | null>(null)

  // 构建 ETF 标的列表用于自动补全
  const etfSymbols = useMemo(() => {
    return etfs.map(e => ({ symbol: e.symbol, name: e.name || e.symbol }))
  }, [etfs])

  // 计算持仓概览
  const positions = useMemo(() => {
    const symbolMap = new Map<string, Position>()

    // 按标的分组统计
    records.forEach(record => {
      const { symbol, name, direction, amount, stop_loss_pct, take_profit_pct } = record
      if (!symbolMap.has(symbol)) {
        symbolMap.set(symbol, {
          symbol,
          name: name || symbol,
          totalBuy: 0,
          totalSell: 0,
          netPosition: 0,
          costPrice: 0,
          currentPrice: 0,
          profitLoss: 0,
          profitLossPct: 0,
          stopLossPct: stop_loss_pct,
          takeProfitPct: take_profit_pct
        })
      }
      const pos = symbolMap.get(symbol)!
      if (direction === 'buy') {
        pos.totalBuy += amount
      } else {
        pos.totalSell += amount
      }
      // 取最新的止损止盈设置
      if (stop_loss_pct) pos.stopLossPct = stop_loss_pct
      if (take_profit_pct) pos.takeProfitPct = take_profit_pct
    })

    // 计算净持仓和成本均价
    symbolMap.forEach(pos => {
      pos.netPosition = pos.totalBuy - pos.totalSell
      pos.costPrice = pos.netPosition > 0 ? pos.totalBuy / pos.netPosition : 0
    })

    return Array.from(symbolMap.values()).filter(p => p.netPosition > 0)
  }, [records])

  // 获取现价（从 ETF 数据中获取）
  const etfPriceMap = useMemo(() => {
    const map = new Map<string, number>()
    etfs.forEach(e => {
      if (e.latest_daily?.close) {
        map.set(e.symbol, e.latest_daily.close)
      }
    })
    return map
  }, [etfs])

  const positionsWithPrice = useMemo(() => {
    return positions.map(pos => {
      const currentPrice = etfPriceMap.get(pos.symbol) || pos.costPrice
      const profitLoss = pos.netPosition * (currentPrice - pos.costPrice)
      const profitLossPct = pos.costPrice > 0 ? (profitLoss / pos.totalBuy) * 100 : 0

      // 检查止损止盈提醒（基于成本均价 × 百分比阈值）
      let stopLossAlert: 'hit' | 'near' | null = null
      let takeProfitAlert: 'hit' | 'near' | null = null

      if (pos.stopLossPct && pos.costPrice > 0) {
        const stopLossPrice = pos.costPrice * (1 - pos.stopLossPct / 100)
        const nearPrice = stopLossPrice * 1.02 // 2% 容差
        if (currentPrice <= stopLossPrice) {
          stopLossAlert = 'hit'
        } else if (currentPrice <= nearPrice) {
          stopLossAlert = 'near'
        }
      }
      if (pos.takeProfitPct && pos.costPrice > 0) {
        const takeProfitPrice = pos.costPrice * (1 + pos.takeProfitPct / 100)
        const nearPrice = takeProfitPrice * 0.98 // 2% 容差
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
  }, [positions, etfPriceMap])

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

  const handleSellConfirm = async (sellPrice: number) => {
    if (!sellRecord) return
    await updateRecord(sellRecord.id, {
      symbol: sellRecord.symbol,
      name: sellRecord.name,
      direction: 'sell',
      trade_date: new Date().toISOString().split('T')[0],
      amount: sellRecord.amount,
      buy_price: sellPrice,
      stop_loss_pct: null,
      take_profit_pct: null,
      notes: sellRecord.notes,
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

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">交易记录</h2>
        <button
          onClick={() => { setEditRecord(null); setModalOpen(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
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
                  {pos.name || pos.symbol} 现价 ¥{pos.currentPrice.toFixed(3)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {positionsWithPrice.map(pos => (
              <PositionCard key={pos.symbol} position={pos} />
            ))}
          </div>
        </div>
      )}

      {/* 交易记录列表 */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">加载中...</div>
      ) : records.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          暂无交易记录，点击上方按钮添加
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {records.map(record => (
            <TradeRecordItem
              key={record.id}
              record={record}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSell={handleSell}
              currentPrice={etfPriceMap.get(record.symbol)}
              allRecords={records}
            />
          ))}
        </div>
      )}

      {/* 添加/编辑弹窗 */}
      <TradeModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditRecord(null) }}
        onSave={handleSave}
        editRecord={editRecord}
        etfSymbols={etfSymbols}
      />

      {/* 卖出确认弹窗 */}
      <SellConfirmModal
        isOpen={sellModalOpen}
        record={sellRecord}
        currentPrice={sellRecord ? etfPriceMap.get(sellRecord.symbol) : undefined}
        onConfirm={handleSellConfirm}
        onClose={() => { setSellModalOpen(false); setSellRecord(null) }}
      />
    </div>
  )
}
