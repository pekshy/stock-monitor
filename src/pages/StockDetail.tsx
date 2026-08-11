import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Building2, TrendingUp, Star, MessageSquare, Plus } from 'lucide-react'
import { useStockDetail } from '../hooks/useStockData'
import { useStockContext } from '../context/StockContext'
import { useStockNotesByCode } from '../hooks/useStockNotes'
import { useTradeRecords } from '../hooks/useTradeRecords'
import { NoteItem } from '../components/NoteItem'
import { NoteModal, type TradeAction, type NoteModalInitialValues } from '../components/NoteModal'
import { TradeRecordItem } from '../components/TradeRecordItem'
import { TradeModal } from '../components/TradeModal'
import { SellConfirmModal } from '../components/SellConfirmModal'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { StockNote } from '../types'
import {
  formatPercent,
  formatPrice,
  getChangeColor,
  formatDate,
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

const KLineChart: React.FC<{ quotes: any[] }> = ({ quotes }) => {
  const chartData = useMemo(() => {
    const sorted = [...quotes].sort((a, b) => new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime())
    const closes = sorted.map(q => q.close_price ?? null)
    return sorted.map((q, idx) => {
      const ma5 = calculateMA(closes, 5, idx)
      const ma10 = calculateMA(closes, 10, idx)
      const ma20 = calculateMA(closes, 20, idx)
      const ma60 = calculateMA(closes, 60, idx)
      // 若 open_price 为 null/0（美股数据常见），用 close_price 兜底，避免实体高度为0
      const open = q.open_price != null && q.open_price !== 0 ? q.open_price : (q.close_price ?? 0)
      const close = q.close_price ?? 0
      const high = q.high_price != null ? q.high_price : Math.max(open, close)
      const low = q.low_price != null ? q.low_price : Math.min(open, close)
      const prevClose = idx > 0 ? closes[idx - 1] : null
      const changePct = prevClose && prevClose > 0
        ? ((close - prevClose) / prevClose) * 100
        : null
      return {
        date: formatDate(q.trade_date),
        trade_date: q.trade_date,
        open,
        high,
        low,
        close,
        isUp: close >= open,
        bodyTop: Math.max(open, close),
        bodyBottom: Math.min(open, close),
        ma5,
        ma10,
        ma20,
        ma60,
        volume: q.volume ?? 0,
        changePct,
      }
    })
  }, [quotes])

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center min-h-[300px] text-gray-500 text-sm">暂无数据</div>
  }

  const prices = chartData.flatMap(d => [d.high, d.low])
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const padding = (maxPrice - minPrice) * 0.1
  const domainLow = minPrice - padding
  const domainHigh = maxPrice + padding

  const CustomBar = ({ x, y, width, height, payload }: any) => {
    if (!payload) return <g />
    const color = payload.isUp ? '#ef4444' : '#22c55e'
    const priceRange = domainHigh - domainLow

    const barValue = payload.high ?? 0
    const chartBottomY = y + height
    const pixelsPerPriceUnit = height / Math.max(barValue - domainLow, 0.0001)
    const chartPixelHeight = priceRange * pixelsPerPriceUnit
    const chartTopY = chartBottomY - chartPixelHeight

    const getY = (price: number) => {
      return chartTopY + chartPixelHeight * (domainHigh - price) / priceRange
    }

    const highY = getY(payload.high)
    const lowY = getY(payload.low)
    const bodyTopY = getY(payload.bodyTop)
    const bodyBottomY = getY(payload.bodyBottom)
    const bodyHeight = Math.abs(bodyBottomY - bodyTopY) || 1

    return (
      <g>
        <line
          x1={x + width / 2}
          y1={highY}
          x2={x + width / 2}
          y2={lowY}
          stroke={color}
          strokeWidth={1}
        />
        <rect
          x={x}
          y={bodyTopY}
          width={width}
          height={bodyHeight}
          fill={color}
        />
      </g>
    )
  }

  return (
    <div className="h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => v.slice(5)}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[domainLow, domainHigh]}
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => v.toFixed(2)}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: 12 }}
            content={({ payload }: any) => {
              if (!payload || !payload[0]) return null
              const data = payload[0].payload
              return (
                <div className="bg-white/60 border border-gray-200/60 rounded-lg shadow-lg p-3 min-w-[180px] max-w-[240px] backdrop-blur-sm">
                  <div className="text-gray-600 text-sm mb-2">{data.date}</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <span className="text-gray-500">开盘:</span>
                    <span className="text-right font-medium">{formatPrice(data.open)}</span>
                    <span className="text-gray-500">最高:</span>
                    <span className="text-right font-medium">{formatPrice(data.high)}</span>
                    <span className="text-gray-500">最低:</span>
                    <span className="text-right font-medium">{formatPrice(data.low)}</span>
                    <span className="text-gray-500">收盘:</span>
                    <span className="text-right font-medium">
                      {formatPrice(data.close)}
                      {data.changePct != null && (
                        <span className={`ml-2 ${data.changePct >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {data.changePct >= 0 ? '+' : ''}{data.changePct.toFixed(2)}%
                        </span>
                      )}
                    </span>
                    {data.ma5 != null && (
                      <>
                        <span className="text-gray-500">MA5:</span>
                        <span className="text-right font-medium text-amber-600">{data.ma5.toFixed(2)}</span>
                      </>
                    )}
                    {data.ma10 != null && (
                      <>
                        <span className="text-gray-500">MA10:</span>
                        <span className="text-right font-medium text-purple-600">{data.ma10.toFixed(2)}</span>
                      </>
                    )}
                    {data.ma20 != null && (
                      <>
                        <span className="text-gray-500">MA20:</span>
                        <span className="text-right font-medium text-cyan-600">{data.ma20.toFixed(2)}</span>
                      </>
                    )}
                    {data.ma60 != null && (
                      <>
                        <span className="text-gray-500">MA60:</span>
                        <span className="text-right font-medium text-pink-600">{data.ma60.toFixed(2)}</span>
                      </>
                    )}
                  </div>
                </div>
              )
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} payload={[
            { value: 'MA5', type: 'line', color: '#f59e0b' },
            { value: 'MA10', type: 'line', color: '#8b5cf6' },
            { value: 'MA20', type: 'line', color: '#06b6d4' },
            { value: 'MA60', type: 'line', color: '#ec4899' }
          ]} />

          <Bar dataKey="close" barSize={5} shape={<CustomBar />} name="K线" legendType="none" />

          <Line type="monotone" dataKey="ma5" stroke="#f59e0b" dot={false} strokeWidth={1} name="MA5" connectNulls />
          <Line type="monotone" dataKey="ma10" stroke="#8b5cf6" dot={false} strokeWidth={1} name="MA10" connectNulls />
          <Line type="monotone" dataKey="ma20" stroke="#06b6d4" dot={false} strokeWidth={1} name="MA20" connectNulls />
          <Line type="monotone" dataKey="ma60" stroke="#ec4899" dot={false} strokeWidth={1} name="MA60" connectNulls />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

const VolumeChart: React.FC<{ quotes: any[] }> = ({ quotes }) => {
  const chartData = useMemo(() => {
    const sorted = [...quotes].sort((a, b) => new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime())
    return sorted.map(q => {
      const open = q.open_price != null && q.open_price !== 0 ? q.open_price : (q.close_price ?? 0)
      const close = q.close_price ?? 0
      return {
        date: formatDate(q.trade_date),
        volume: q.volume ?? 0,
        amount: q.amount ?? 0,
        isUp: close >= open,
        value: q.volume ?? 0
      }
    })
  }, [quotes])

  if (chartData.length === 0) {
    return <div className="h-16 flex items-center justify-center text-gray-500 text-sm">暂无数据</div>
  }

  return (
    <div className="h-24 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => (v / 100000000).toFixed(1) + '亿'} />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.65)', border: '1px solid rgba(229, 231, 235, 0.6)', borderRadius: '8px', fontSize: 12, backdropFilter: 'blur(2px)' }}
            wrapperStyle={{ pointerEvents: 'none', zIndex: 50 }}
            formatter={(value: number) => [(value / 100000000).toFixed(2) + ' 亿', '成交量']}
          />
          <Bar dataKey="value" barSize={5} shape={(props: any) => {
            const { x, y, width, height, payload } = props
            return (
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={payload.isUp ? '#ef4444' : '#22c55e'}
              />
            )
          }} name="成交量" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

const StockDetail: React.FC = () => {
  const { stockCode } = useParams<{ stockCode: string }>()
  const navigate = useNavigate()
  const { stock, quotes, valuations, loading } = useStockDetail(stockCode || '')
  const { stocks } = useStockContext()
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
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          返回
        </button>

        <div className="flex gap-3">
          {prevStock && (
            <button
              onClick={() => navigate(`/stock/${prevStock.stock_code}`)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors text-sm"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              上翻
            </button>
          )}
          {nextStock && (
            <button
              onClick={() => navigate(`/stock/${nextStock.stock_code}`)}
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

      <TradesSection stockCode={stock.stock_code} stockName={stock.stock_name} currentPrice={latestQuote?.close_price ?? undefined} quotes={quotes} />

      <NotesSection stockCode={stock.stock_code} stockName={stock.stock_name} closes={quotes.map(q => q.close_price ?? 0)} />
    </div>
  )
}

function TradesSection({ stockCode, stockName, currentPrice, quotes }: { stockCode: string; stockName: string; currentPrice?: number; quotes: any[] }) {
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

function NotesSection({ stockCode, stockName, closes }: { stockCode: string; stockName: string; closes: number[] }) {
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
              navigatePath={`/stock/${note.stock_code}`}
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
