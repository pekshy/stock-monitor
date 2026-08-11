import React, { useState, useMemo, memo } from 'react'
import { Plus, Wallet, TrendingUp, TrendingDown, Edit3, Check } from 'lucide-react'
import { useTradeRecords } from '../hooks/useTradeRecords'
import { useEtfContext } from '../context/EtfContext'
import { useStockContext } from '../context/StockContext'
import { TradeRecord, Position } from '../types'
import { TradeRecordItem } from './TradeRecordItem'
import { TradeModal } from './TradeModal'
import { SellConfirmModal } from './SellConfirmModal'

type TradeFilter = 'all' | 'etf' | 'stock'

export const UnifiedTradeBoard: React.FC = memo(() => {
  const { records, loading, addRecord, updateRecord, deleteRecord } = useTradeRecords()
  const { etfs, priceByDateMap: etfPriceMap, momentumSignals } = useEtfContext()
  const { stocks } = useStockContext()
  const [filter, setFilter] = useState<TradeFilter>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<TradeRecord | null>(null)
  const [sellModalOpen, setSellModalOpen] = useState(false)
  const [sellRecord, setSellRecord] = useState<TradeRecord | null>(null)

  // 可配置本金
  const [principal, setPrincipal] = useState<number>(() => {
    const saved = localStorage.getItem('trade_principal')
    return saved ? parseFloat(saved) : 100000
  })
  const [editingPrincipal, setEditingPrincipal] = useState(false)
  const [principalInput, setPrincipalInput] = useState('')

  // ETF 指标映射：趋势信号 / 技术指标建议 / 动量评分
  const { etfSignalMap, momentumBySymbolMap } = useMemo(() => {
    const signalMap = new Map<string, {
      trend_signal: string | null
      tech_action: string | null
    }>()
    etfs.forEach(e => {
      signalMap.set(e.symbol, {
        trend_signal: e.latest_trend_signal || null,
        tech_action: e.latest_signal?.action || null
      })
    })

    const momentumMap = new Map<string, { final_score: number | null; rank: number | null; prev_score: number | null }>()
    if (momentumSignals && momentumSignals.length > 0) {
      const latestDate = momentumSignals[0]?.trade_date
      const prevDate = momentumSignals.find(s => s.trade_date !== latestDate)?.trade_date
      momentumSignals
        .filter(s => s.trade_date === latestDate)
        .forEach(s => {
          const prev = momentumSignals.find(p => p.symbol === s.symbol && p.trade_date === prevDate)
          momentumMap.set(s.symbol, {
            final_score: s.final_score != null ? Number(s.final_score) : null,
            rank: s.rank != null ? Number(s.rank) : null,
            prev_score: prev?.final_score != null ? Number(prev.final_score) : null
          })
        })
    }
    return { etfSignalMap: signalMap, momentumBySymbolMap: momentumMap }
  }, [etfs, momentumSignals])

  const getTrendSignalBadge = (trend: string | null | undefined) => {
    if (!trend) return null
    const t = trend.toUpperCase()
    const cls = t === 'BUY' ? 'bg-red-100 text-red-600' :
                t === 'SELL' ? 'bg-green-100 text-green-600' :
                'bg-blue-100 text-blue-600'
    const label = t === 'BUY' ? '买入' : t === 'SELL' ? '卖出' : '观望'
    return (
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${cls}`} title="趋势信号">
        趋势·{label}
      </span>
    )
  }

  const getTechSignalBadge = (action: string | null | undefined) => {
    if (!action) return null
    const act = action.toLowerCase()
    const cls = act.includes('买入') || act.includes('买') || act.includes('buy') || act.includes('bull') ? 'bg-red-100 text-red-600' :
                act.includes('卖出') || act.includes('卖') || act.includes('sell') || act.includes('bear') ? 'bg-green-100 text-green-600' :
                'bg-blue-100 text-blue-600'
    return (
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${cls}`} title="技术指标建议">
        技术·{action}
      </span>
    )
  }

  const getMomentumBadge = (symbol: string) => {
    const m = momentumBySymbolMap.get(symbol)
    if (!m || m.final_score == null) return null
    const score = m.final_score
    const cls = score >= 80 ? 'bg-red-100 text-red-600' :
                score >= 60 ? 'bg-orange-100 text-orange-600' :
                score >= 40 ? 'bg-blue-100 text-blue-600' :
                score >= 20 ? 'bg-gray-100 text-gray-600' :
                'bg-green-100 text-green-600'
    let changeTag = null
    if (m.prev_score != null) {
      const ch = score - m.prev_score
      if (Math.abs(ch) >= 0.01) {
        changeTag = (
          <span className={`ml-0.5 ${ch > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {ch > 0 ? '↑' : '↓'}{Math.abs(ch).toFixed(1)}
          </span>
        )
      }
    }
    return (
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${cls}`} title={`动量模型评分${m.rank != null ? ` · 排名#${m.rank}` : ''}`}>
        动量·{score.toFixed(1)}
        {changeTag}
      </span>
    )
  }

  const savePrincipal = () => {
    const val = parseFloat(principalInput)
    if (!isNaN(val) && val > 0) {
      setPrincipal(val)
      localStorage.setItem('trade_principal', String(val))
    }
    setEditingPrincipal(false)
    setPrincipalInput('')
  }

  const isEtfCode = (symbol: string) => {
    const s = symbol.toUpperCase()
    if (/^\d{6}$/.test(s)) return true
    if (s.includes('ETF')) return true
    return false
  }

  const filteredRecords = useMemo(() => {
    const base = filter === 'all' ? records : filter === 'etf' ? records.filter(r => isEtfCode(r.symbol)) : records.filter(r => !isEtfCode(r.symbol))
    // 过滤掉被配对的卖出记录：保留买入记录（含已清仓的），过滤掉卖出记录
    // 通过 linked_id 关联：卖出记录 linked_id 指向买入记录 id
    return base.filter(r => !(r.direction === 'sell' && r.linked_id != null))
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

  // 仓位配置与总收益
  const portfolioSummary = useMemo(() => {
    const totalCost = positions.reduce((sum, p) => sum + p.totalBuy, 0)
    const totalValue = positions.reduce((sum, p) => sum + p.currentPrice * p.totalShares, 0)
    const unrealizedProfitLoss = totalValue - totalCost

    // 已清仓损益：卖出记录 linked_id 指向买入记录
    // 损益 = 股数 × (卖出价 - 买入价)，股数 = 买入金额 / 买入价
    const realizedProfitLoss = records.reduce((sum, r) => {
      if (r.direction === 'sell' && r.linked_id != null) {
        const buyRecord = records.find(b => b.id === r.linked_id)
        if (buyRecord && buyRecord.buy_price && buyRecord.buy_price > 0 && r.buy_price) {
          const shares = buyRecord.amount / buyRecord.buy_price
          return sum + shares * (r.buy_price - buyRecord.buy_price)
        }
      }
      return sum
    }, 0)

    const totalProfitLoss = unrealizedProfitLoss + realizedProfitLoss
    const totalProfitLossPct = totalCost > 0 ? (unrealizedProfitLoss / totalCost) * 100 : 0
    const returnOnPrincipal = principal > 0 ? (totalProfitLoss / principal) * 100 : 0
    const cashRatio = principal > 0 ? ((principal - totalCost) / principal) * 100 : 0
    const positionRatio = principal > 0 ? (totalCost / principal) * 100 : 0

    return {
      totalCost,
      totalValue,
      unrealizedProfitLoss,
      realizedProfitLoss,
      totalProfitLoss,
      totalProfitLossPct,
      returnOnPrincipal,
      cashRatio: Math.max(0, cashRatio),
      positionRatio: Math.min(100, positionRatio),
      positions: positions.map(p => ({
        symbol: p.symbol,
        name: p.name || p.symbol,
        cost: p.totalBuy,
        ratio: principal > 0 ? (p.totalBuy / principal) * 100 : 0,
        profitLoss: p.profitLoss,
        profitLossPct: p.profitLossPct,
      })).sort((a, b) => b.cost - a.cost)
    }
  }, [positions, records, principal])

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

  const handleDelete = async (id: number) => {
    // 查找是否有卖出记录通过 linked_id 引用此记录
    const pairedSells = records.filter(r => r.direction === 'sell' && r.linked_id === id)
    const message = pairedSells.length > 0
      ? `该记录有关联的卖出记录（${pairedSells.length}条），将一并删除。确定删除吗？`
      : '确定删除这笔交易记录吗？'
    if (!window.confirm(message)) return
    try {
      // 先删除关联的卖出记录，避免外键约束失败
      for (const sell of pairedSells) {
        await deleteRecord(sell.id)
      }
      await deleteRecord(id)
    } catch (error) {
      console.error('删除交易记录失败:', error)
      alert('删除失败，请重试')
    }
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
    try {
      await updateRecord(sellRecord.id!, {
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
    } catch (error) {
      console.error('卖出确认失败:', error)
      alert('卖出失败，请重试')
    }
  }

  const countRecords = (type: 'etf' | 'stock') => {
    // 不统计被配对的卖出记录
    return records.filter(r => {
      if (r.direction === 'sell' && r.linked_id != null) return false
      return type === 'etf' ? isEtfCode(r.symbol) : !isEtfCode(r.symbol)
    }).length
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          交易记录
        </h2>
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

      {/* 仓位配置与总收益 */}
      <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-gray-700" />
            <span className="text-sm font-semibold text-gray-700">仓位配置与收益</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">总本金</span>
            {editingPrincipal ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={principalInput}
                  onChange={e => setPrincipalInput(e.target.value)}
                  placeholder={principal.toLocaleString()}
                  className="w-28 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') savePrincipal(); if (e.key === 'Escape') setEditingPrincipal(false) }}
                />
                <button onClick={savePrincipal} className="p-1 text-green-600 hover:bg-green-50 rounded">
                  <Check className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setPrincipalInput(String(principal)); setEditingPrincipal(true) }}
                className="flex items-center gap-1 text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                ¥{principal.toLocaleString()}
                <Edit3 className="h-3 w-3 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* 总览数据 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <div className="bg-white rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">持仓市值</div>
            <div className="text-lg font-bold text-gray-900">¥{portfolioSummary.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">投入成本</div>
            <div className="text-lg font-bold text-gray-900">¥{portfolioSummary.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">当前持仓损益</div>
            <div className={`text-lg font-bold flex items-center gap-1 ${portfolioSummary.unrealizedProfitLoss >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {portfolioSummary.unrealizedProfitLoss >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {portfolioSummary.unrealizedProfitLoss >= 0 ? '+' : ''}¥{portfolioSummary.unrealizedProfitLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              <span className="text-xs">({portfolioSummary.unrealizedProfitLoss >= 0 ? '+' : ''}{portfolioSummary.totalProfitLossPct.toFixed(2)}%)</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">已清仓损益</div>
            <div className={`text-lg font-bold flex items-center gap-1 ${portfolioSummary.realizedProfitLoss >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {portfolioSummary.realizedProfitLoss >= 0 ? '+' : ''}¥{portfolioSummary.realizedProfitLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">总收益率（vs本金）</div>
            <div className={`text-lg font-bold flex items-center gap-1 ${portfolioSummary.returnOnPrincipal >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {portfolioSummary.returnOnPrincipal >= 0 ? '+' : ''}{portfolioSummary.returnOnPrincipal.toFixed(2)}%
              <span className="text-xs whitespace-nowrap">
                ({portfolioSummary.totalProfitLoss >= 0 ? '+' : ''}¥{portfolioSummary.totalProfitLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })})
              </span>
            </div>
          </div>
        </div>

        {/* 仓位配置比例条 */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span>仓位配置</span>
            <span>持仓 {portfolioSummary.positionRatio.toFixed(1)}% · 现金 {portfolioSummary.cashRatio.toFixed(1)}%</span>
          </div>
          <div className="flex h-6 rounded-full overflow-hidden bg-gray-200">
            {portfolioSummary.positions.map((p, i) => {
              const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6']
              return p.ratio > 0 && (
                <div
                  key={p.symbol}
                  className="flex items-center justify-center text-xs text-white font-medium transition-all hover:brightness-110"
                  style={{ width: `${p.ratio}%`, backgroundColor: colors[i % colors.length] }}
                  title={`${p.name}: ${p.ratio.toFixed(1)}%`}
                >
                  {p.ratio > 5 ? `${p.ratio.toFixed(0)}%` : ''}
                </div>
              )
            })}
            {portfolioSummary.cashRatio > 0 && (
              <div className="flex items-center justify-center text-xs text-gray-600 font-medium bg-gray-200" style={{ width: `${portfolioSummary.cashRatio}%` }}>
                {portfolioSummary.cashRatio > 5 ? `${portfolioSummary.cashRatio.toFixed(0)}%` : ''}
              </div>
            )}
          </div>
        </div>

        {/* 各持仓明细 */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-200">
                <th className="text-left py-1.5 px-2 font-medium">名称</th>
                <th className="text-right py-1.5 px-2 font-medium">投入</th>
                <th className="text-right py-1.5 px-2 font-medium">占比</th>
                <th className="text-right py-1.5 px-2 font-medium">收益</th>
                <th className="text-right py-1.5 px-2 font-medium">收益率</th>
              </tr>
            </thead>
            <tbody>
              {portfolioSummary.positions.map((p, i) => {
                const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6']
                return (
                  <tr key={p.symbol} className="border-b border-gray-100">
                    <td className="py-1.5 px-2">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                          <span className="font-medium text-gray-700">{p.name}</span>
                        </span>
                        {isEtfCode(p.symbol) && (
                          <div className="flex flex-wrap items-center gap-1">
                            {getTrendSignalBadge(etfSignalMap.get(p.symbol)?.trend_signal)}
                            {getTechSignalBadge(etfSignalMap.get(p.symbol)?.tech_action)}
                            {getMomentumBadge(p.symbol)}
                            {!etfSignalMap.get(p.symbol)?.trend_signal &&
                             !etfSignalMap.get(p.symbol)?.tech_action &&
                             !momentumBySymbolMap.has(p.symbol) && (
                              <span className="text-[10px] text-gray-400">暂无指标数据</span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="text-right py-1.5 px-2 text-gray-600">¥{p.cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    <td className="text-right py-1.5 px-2 text-gray-600">{p.ratio.toFixed(1)}%</td>
                    <td className={`text-right py-1.5 px-2 font-medium ${p.profitLoss >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {p.profitLoss >= 0 ? '+' : ''}¥{p.profitLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className={`text-right py-1.5 px-2 font-medium ${p.profitLossPct >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {p.profitLossPct >= 0 ? '+' : ''}{p.profitLossPct.toFixed(2)}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

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
})

export default UnifiedTradeBoard
