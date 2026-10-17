import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Building2, TrendingUp, Star, MessageSquare, Plus, Lock } from 'lucide-react'
import { useStockDetail } from '../hooks/useStockData'
import { useStockContext } from '../context/StockContext'
import { useStockNotesByCode } from '../hooks/useStockNotes'
import { useTradeRecords } from '../hooks/useTradeRecords'
import { useAuth } from '../context/AuthContext'
import { NoteItem } from '../components/NoteItem'
import { NoteModal, type TradeAction, type NoteModalInitialValues } from '../components/NoteModal'
import { TradeRecordItem } from '../components/TradeRecordItem'
import { TradeModal } from '../components/TradeModal'
import { SellConfirmModal } from '../components/SellConfirmModal'
import { StockNote } from '../types'
import {
  formatPercent,
  formatPrice,
  getChangeColor,
  formatValuation
} from '../utils/formatters'

function getMarketType(stockCode: string): 'us' | 'hk' | 'cn' {
  const code = stockCode.toUpperCase()
  if (code.endsWith('.US') || code.endsWith('.US_A') || code.endsWith('.NASDAQ') || code.endsWith('.NYSE')) return 'us'
  if (code.endsWith('.HK')) return 'hk'
  return 'cn'
}

function calculateMA(closes: number[], period: number, index: number): number | null {
  if (index < period - 1) return null
  let sum = 0
  for (let i = index - period + 1; i <= index; i++) {
    if (closes[i] == null || isNaN(closes[i])) return null
    sum += closes[i]
  }
  return sum / period
}

export const KLineChart: React.FC<{ quotes: any[] }> = ({ quotes }) => {
  const data = useMemo(() => {
    const sorted = [...quotes]
      .filter(q => (q.close_price ?? 0) > 0)
      .sort((a, b) => new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime())
    const closes = sorted.map(q => q.close_price ?? null)
    return sorted.map((q, i) => {
      const close = q.close_price ?? 0
      const open = q.open_price > 0 ? q.open_price : close
      const high = q.high_price > 0 ? q.high_price : Math.max(open, close)
      const low = q.low_price > 0 ? q.low_price : Math.min(open, close)
      return {
        date: String(q.trade_date),
        open, close, high, low,
        isUp: close >= open,
        ma5: calculateMA(closes, 5, i),
        ma10: calculateMA(closes, 10, i),
        ma20: calculateMA(closes, 20, i),
        ma60: calculateMA(closes, 60, i),
      }
    })
  }, [quotes])

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">暂无数据</div>
  }

  // 纯 SVG 手绘：Recharts 的 Bar 基线始终是 0，坐标轴不从 0 起时蜡烛会被画到可视区外
  const W = 1000, H = 320, L = 58, R = 8, T = 10, B = 22
  const lows = data.map(d => d.low)
  const highs = data.map(d => d.high)
  const min = Math.min(...lows)
  const max = Math.max(...highs)
  const pad = (max - min) * 0.08 || 1
  const lo = min - pad
  const hi = max + pad
  const iw = (W - L - R) / data.length
  const px = (i: number) => L + (i + 0.5) * iw
  const py = (v: number) => T + ((hi - v) / (hi - lo)) * (H - T - B)
  const ticks = Array.from({ length: 5 }, (_, k) => lo + ((hi - lo) * k) / 4)
  const step = Math.max(1, Math.ceil(data.length / 8))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block select-none">
      {ticks.map((t, k) => (
        <g key={k}>
          <line x1={L} y1={py(t)} x2={W - R} y2={py(t)} stroke="#e5e7eb" strokeDasharray="3 3" />
          <text x={L - 6} y={py(t) + 3} textAnchor="end" fontSize="10" fill="#9ca3af">{t.toFixed(2)}</text>
        </g>
      ))}

      {data.map((d, i) => {
        const color = d.isUp ? '#ef4444' : '#22c55e'
        const bw = Math.max(iw * 0.6, 1)
        const yTop = py(Math.max(d.open, d.close))
        const yBot = py(Math.min(d.open, d.close))
        return (
          <g key={i}>
            <title>{`${d.date}  开 ${d.open.toFixed(2)} 高 ${d.high.toFixed(2)} 低 ${d.low.toFixed(2)} 收 ${d.close.toFixed(2)}`}</title>
            <line x1={px(i)} y1={py(d.high)} x2={px(i)} y2={py(d.low)} stroke={color} strokeWidth="1" />
            <rect x={px(i) - bw / 2} y={yTop} width={bw} height={Math.max(yBot - yTop, 1)} fill={color} />
          </g>
        )
      })}

      {([['ma5', '#f59e0b'], ['ma10', '#8b5cf6'], ['ma20', '#06b6d4'], ['ma60', '#ec4899']] as const).map(
        ([key, color]) => {
          const pts = data
            .map((d, i) => (d[key] != null ? `${px(i)},${py(d[key] as number)}` : null))
            .filter(Boolean)
            .join(' ')
          return pts ? (
            <polyline key={key} points={pts} fill="none" stroke={color} strokeWidth="1" opacity="0.85" />
          ) : null
        })}

      {data.map((d, i) =>
        i % step === 0 ? (
          <text key={i} x={px(i)} y={H - 6} textAnchor="middle" fontSize="9" fill="#9ca3af">
            {d.date.slice(5)}
          </text>
        ) : null,
      )}
    </svg>
  )
}

export const VolumeChart: React.FC<{ quotes: any[] }> = ({ quotes }) => {
  const data = useMemo(() => {
    return [...quotes]
      .filter(q => (q.close_price ?? 0) > 0)
      .sort((a, b) => new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime())
      .map(q => ({
        date: String(q.trade_date),
        volume: q.volume ?? 0,
        isUp: (q.close_price ?? 0) >= (q.open_price > 0 ? q.open_price : q.close_price ?? 0),
      }))
  }, [quotes])

  if (data.length === 0) return null

  const W = 1000, H = 110, L = 58, R = 8, B = 16
  const maxV = Math.max(...data.map(d => d.volume)) || 1
  const iw = (W - L - R) / data.length
  const bw = Math.max(iw * 0.6, 1)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block select-none">
      <line x1={L} y1={H - B} x2={W - R} y2={H - B} stroke="#e5e7eb" />
      {data.map((d, i) => {
        const h = (d.volume / maxV) * (H - B - 8)
        return (
          <rect
            key={i}
            x={L + (i + 0.5) * iw - bw / 2}
            y={H - B - h}
            width={bw}
            height={Math.max(h, 1)}
            fill={d.isUp ? '#fca5a5' : '#86efac'}
          />
        )
      })}
      <text x={L - 6} y={12} textAnchor="end" fontSize="9" fill="#9ca3af">
        {(maxV / 1e6).toFixed(0)}M
      </text>
    </svg>
  )
}

const StockDetail: React.FC = () => {
  const { stockCode } = useParams<{ stockCode: string }>()
  const navigate = useNavigate()
  const { stock, quotes, valuations, loading } = useStockDetail(stockCode || '')
  const { stocks } = useStockContext()
  const { isAuthenticated } = useAuth()
  const latestQuote = quotes[0]
  const latestValuation = valuations[0]

  const stockCodes = stocks.map(s => s.stock_code)
  const currentIndex = stockCodes.indexOf(stockCode || '')
  const prevStock = currentIndex > 0 ? stocks[currentIndex - 1] : null
  const nextStock = currentIndex < stockCodes.length - 1 ? stocks[currentIndex + 1] : null

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  if (!stock) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">股票不存在</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => {
            const lastTab: string | null = (() => {
              try { return localStorage.getItem('home_last_tab') } catch { return null }
            })()
            if (lastTab === 'etf') navigate('/etf')
            else if (lastTab === 'stock') navigate('/stocks')
            else navigate('/')
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          返回
        </button>

        <div className="flex gap-3">
          {prevStock && (
            <button
              onClick={() => navigate(`/company/${prevStock.stock_code}`)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors text-sm"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              上翻
            </button>
          )}
          {nextStock && (
            <button
              onClick={() => navigate(`/company/${nextStock.stock_code}`)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors text-sm"
            >
              下翻
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{stock.stock_name}</h2>
            <div className="text-gray-500 text-sm mt-0.5">{stock.stock_code}</div>
            <div className="flex gap-4 mt-1 text-xs text-gray-600">
              {stock.industry1 && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  {stock.industry1}
                </span>
              )}
              {stock.market && <span>{stock.market}</span>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(latestQuote?.close_price)}
            </div>
            <div className={`text-lg font-semibold mt-0.5 ${getChangeColor(latestQuote?.pct_change)}`}>
              {formatPercent(latestQuote?.pct_change)}
            </div>
          </div>
        </div>
      </div>

      {stock.core_highlight && (
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            核心亮点
          </h3>
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
            {stock.core_highlight}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl shadow-md p-3">
          <div className="text-gray-500 text-xs">5日涨跌幅</div>
          <div className={`text-lg font-bold mt-0.5 ${getChangeColor(latestQuote?.pct_change_5d)}`}>
            {formatPercent(latestQuote?.pct_change_5d)}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-3">
          <div className="text-gray-500 text-xs">10日涨跌幅</div>
          <div className={`text-lg font-bold mt-0.5 ${getChangeColor(latestQuote?.pct_change_10d)}`}>
            {formatPercent(latestQuote?.pct_change_10d)}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-3">
          <div className="text-gray-500 text-xs">20日涨跌幅</div>
          <div className={`text-lg font-bold mt-0.5 ${getChangeColor(latestQuote?.pct_change_20d)}`}>
            {formatPercent(latestQuote?.pct_change_20d)}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-3">
          <div className="text-gray-500 text-xs">60日涨跌幅</div>
          <div className={`text-lg font-bold mt-0.5 ${getChangeColor(latestQuote?.pct_change_60d)}`}>
            {formatPercent(latestQuote?.pct_change_60d)}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          K线走势
        </h3>
        <KLineChart quotes={quotes} />
        <VolumeChart quotes={quotes} />
      </div>

      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="text-base font-bold text-gray-900 mb-3">估值指标</h3>
        {latestValuation ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <div className="text-gray-500 text-xs">PE (TTM)</div>
              <div className="text-lg font-bold text-gray-900">
                {formatValuation(latestValuation.pe_ttm)}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">PE (静态)</div>
              <div className="text-lg font-bold text-gray-900">
                {formatValuation(latestValuation.pe_static)}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">PB</div>
              <div className="text-lg font-bold text-gray-900">
                {latestValuation.pb?.toFixed(2) || '--'}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">PS</div>
              <div className="text-lg font-bold text-gray-900">
                {latestValuation.psr?.toFixed(2) || '--'}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">总市值</div>
              <div className="text-lg font-bold text-gray-900">
                {latestValuation.total_market_cap == null
                  ? '--'
                  : (() => {
                      const market = getMarketType(stock.stock_code)
                      const cap = latestValuation.total_market_cap
                      const yiValue = market === 'cn' ? cap : cap / 1e8
                      return yiValue.toLocaleString(undefined, { maximumFractionDigits: 2 })
                    })()}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">流通市值</div>
              <div className="text-lg font-bold text-gray-900">
                {latestValuation.circulating_market_cap == null
                  ? '--'
                  : (() => {
                      const market = getMarketType(stock.stock_code)
                      const cap = latestValuation.circulating_market_cap
                      const yiValue = market === 'cn' ? cap : cap / 1e8
                      return yiValue.toLocaleString(undefined, { maximumFractionDigits: 2 })
                    })()}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-sm">暂无估值数据</div>
        )}
      </div>

      {isAuthenticated ? (
        <TradesSection stockCode={stock.stock_code} stockName={stock.stock_name} currentPrice={latestQuote?.close_price ?? undefined} quotes={quotes} />
      ) : (
        <TradeRecordsLocked />
      )}

      <NotesSection stockCode={stock.stock_code} stockName={stock.stock_name} closes={quotes.map(q => q.close_price ?? 0)} />
    </div>
  )
}

// ========== 股票交易记录登录引导（未登录时替换 TradesSection） ==========
const TradeRecordsLocked: React.FC = () => (
  <div className="bg-white rounded-xl shadow-md p-6 mb-6">
    <h2 className="text-lg font-bold text-gray-900 mb-4">交易记录</h2>
    <div className="py-10 flex flex-col items-center text-center">
      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md mb-3">
        <Lock className="h-6 w-6 text-white" />
      </div>
      <p className="text-sm font-semibold text-gray-900">交易记录需登录后查看</p>
      <p className="text-xs text-gray-500 mt-1.5 max-w-sm leading-relaxed">
        持仓、买卖点与成本收益属于个人交易信息，不对外公开。
      </p>
      <p className="text-xs text-gray-400 mt-3">可点击右上角「登录」输入暗号解锁</p>
    </div>
  </div>
)

export function TradesSection({ stockCode, stockName, currentPrice, quotes }: { stockCode: string; stockName: string; currentPrice?: number; quotes: any[] }) {
  const { records, addRecord, updateRecord, deleteRecord } = useTradeRecords()
  const [modalOpen, setModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<any>(null)
  const [sellModalOpen, setSellModalOpen] = useState(false)
  const [sellRecord, setSellRecord] = useState<any>(null)

  const filteredRecords = useMemo(() => {
    return records.filter(r => r.symbol.toUpperCase() === stockCode.toUpperCase())
  }, [records, stockCode])

  const priceMap = useMemo(() => {
    const map = new Map<string, number>()
    quotes.forEach(q => {
      if (q.trade_date && q.close_price != null) {
        map.set(q.trade_date, q.close_price)
      }
    })
    return map
  }, [quotes])

  const priceMapsBySymbol = useMemo(() => {
    const map = new Map<string, Map<string, number>>()
    map.set(stockCode.toUpperCase(), priceMap)
    return map
  }, [stockCode, priceMap])

  const handleEdit = (record: any) => {
    setEditRecord(record)
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这条交易记录吗？')) {
      await deleteRecord(id)
    }
  }

  const handleSell = (record: any) => {
    setSellRecord(record)
    setSellModalOpen(true)
  }

  const handleSellConfirm = async (sellPrice: number, sellDate: string) => {
    if (!sellRecord) return
    try {
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
    } catch (error) {
      console.error('卖出确认失败:', error)
      alert('卖出失败，请重试')
    }
  }

  const handleSave = async (record: any) => {
    if (editRecord) {
      await updateRecord(editRecord.id, record)
    } else {
      await addRecord(record)
    }
    setEditRecord(null)
  }

  const position = useMemo(() => {
    const openBuyRecords = filteredRecords.filter(r => r.direction === 'buy' && r.status === 'open')
    const totalBuy = openBuyRecords.reduce((sum: number, r: any) => sum + r.amount, 0)
    const costBasis = openBuyRecords.reduce((sum: number, r: any) => sum + (r.buy_price || 0) * r.amount, 0)
    const netPosition = totalBuy
    const costPrice = totalBuy > 0 ? costBasis / totalBuy : 0
    const latestStopLoss = openBuyRecords.find((r: any) => r.stop_loss_pct)?.stop_loss_pct
    const latestTakeProfit = openBuyRecords.find((r: any) => r.take_profit_pct)?.take_profit_pct
    return { totalBuy, costBasis, costPrice, netPosition, stopLossPct: latestStopLoss, takeProfitPct: latestTakeProfit }
  }, [filteredRecords])

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">交易记录</h2>
        <button
          onClick={() => { setEditRecord(null); setModalOpen(true) }}
          className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          添加
        </button>
      </div>

      {position.netPosition > 0 && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-xs text-gray-500">持仓金额</div>
              <div className="font-medium">¥{position.netPosition.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">成本均价</div>
              <div className="font-medium">¥{position.costPrice.toFixed(3)}</div>
            </div>
            {currentPrice && (
              <div>
                <div className="text-xs text-gray-500">当前收益</div>
                <div className={`font-medium ${((currentPrice / position.costPrice - 1) * 100) >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {((currentPrice / position.costPrice - 1) * 100).toFixed(2)}%
                </div>
              </div>
            )}
          </div>
          {(position.stopLossPct || position.takeProfitPct) && (
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-200">
              {position.stopLossPct && (
                <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">止损 -{position.stopLossPct}%</span>
              )}
              {position.takeProfitPct && (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">止盈 +{position.takeProfitPct}%</span>
              )}
            </div>
          )}
        </div>
      )}

      {filteredRecords.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-sm">暂无交易记录</div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredRecords.map((record: any) => (
            <TradeRecordItem
              key={record.id}
              record={record}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSell={handleSell}
              currentPrice={currentPrice}
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
        symbolOptions={[{ symbol: stockCode, name: stockName }]}
        priceMapsBySymbol={priceMapsBySymbol}
        readOnlySymbol
      />

      <SellConfirmModal
        isOpen={sellModalOpen}
        record={sellRecord}
        currentPrice={currentPrice}
        priceMap={priceMap}
        onConfirm={handleSellConfirm}
        onClose={() => { setSellModalOpen(false); setSellRecord(null) }}
      />
    </div>
  )
}

export function NotesSection({ stockCode, stockName, closes }: { stockCode: string; stockName: string; closes: number[] }) {
  const { notes, loading, addNote, updateNote, deleteNote } = useStockNotesByCode(stockCode)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalSubmitting, setModalSubmitting] = useState(false)
  const [editingNote, setEditingNote] = useState<{
    id: number
    initial: NoteModalInitialValues
  } | null>(null)

  const handleSave = async (values: { note: string; tradeAction: TradeAction; executionPrice: number | null }) => {
    setModalSubmitting(true)
    try {
      if (editingNote) {
        const action = values.tradeAction || null
        await updateNote(editingNote.id, {
          note: values.note,
          tradeAction: action,
          executionPrice: values.executionPrice,
        })
      } else {
        const action = values.tradeAction || null
        const execPrice = (action === 'buy' || action === 'sell') ? values.executionPrice : null
        await addNote(values.note, action, execPrice)
      }
      setIsModalOpen(false)
      setEditingNote(null)
    } finally {
      setModalSubmitting(false)
    }
  }

  const handleOpenAdd = () => {
    setEditingNote(null)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setEditingNote(null)
  }

  const handleEdit = (note: StockNote) => {
    setEditingNote({
      id: note.id,
      initial: {
        note: note.note,
        tradeAction: (note.trade_action as TradeAction) || '',
        executionPrice: note.execution_price != null ? note.execution_price.toString() : '',
      },
    })
    setIsModalOpen(true)
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        笔记
      </h2>

      <div className="mb-3">
        <button
          type="button"
          onClick={handleOpenAdd}
          className="w-full py-2 px-3 bg-green-50 text-green-600 hover:bg-green-100 border border-dashed border-green-200 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
        >
          <Plus className="h-3.5 w-3.5" />
          添加笔记
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-400 py-2">加载中...</div>
      ) : notes.length === 0 ? (
        <div className="text-sm text-gray-400 py-2">暂无笔记</div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {notes.map(note => (
            <NoteItem
              key={note.id}
              note={note}
              name={stockName}
              code={note.stock_code}
              navigatePath={`/company/${note.stock_code}`}
              onUpdate={updateNote}
              onDelete={deleteNote}
              onEdit={(n) => handleEdit(n as StockNote)}
              compact
              codeColor="green"
            />
          ))}
        </div>
      )}

      <NoteModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSave={handleSave}
        title={editingNote ? '编辑笔记' : '添加笔记'}
        submitText={editingNote ? '保存修改' : '添加笔记'}
        recentCloses={closes}
        initial={editingNote?.initial}
        theme="green"
        submitting={modalSubmitting}
      />
    </div>
  )
}

export default StockDetail
