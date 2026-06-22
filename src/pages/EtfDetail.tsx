import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, TrendingUp, MessageSquare, Trash2, Plus } from 'lucide-react'
import { useEtfContext } from '../context/EtfContext'
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
import { supabase } from '../utils/supabase'
import { EtfDailyData, EtfIndicators, EtfClawSignal } from '../types'
import { formatPercent, formatPrice, formatDate, getChangeColor } from '../utils/formatters'
import { ButterworthFit } from '../types'
import { useEtfNotesBySymbol } from '../hooks/useEtfNotes'

interface EtfDetailData {
  etf: {
    symbol: string
    name: string | null
    category: string | null
    tracking_index_name: string | null
  }
  dailyData: EtfDailyData[]
  indicators: EtfIndicators[]
  signals: EtfClawSignal[]
  butterworthFit: ButterworthFit[]
}

function useEtfDetail(symbol: string) {
  const [data, setData] = useState<EtfDetailData | null>(null)
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    if (!symbol) return
    fetchData()
  }, [symbol])

  async function fetchData() {
    try {
      setLoading(true)

      const { data: etfInfo, error: etfErr } = await supabase
        .from('etf_info')
        .select('*')
        .eq('symbol', symbol)
        .single()
      if (etfErr) throw etfErr

      const { data: dailyData, error: dailyErr } = await supabase
        .from('etf_daily_data')
        .select('*')
        .eq('symbol', symbol)
        .order('trade_date', { ascending: false })
        .limit(90)
      if (dailyErr) throw dailyErr

      const { data: indicators, error: indErr } = await supabase
        .from('etf_indicators')
        .select('*')
        .eq('symbol', symbol)
        .order('trade_date', { ascending: false })
        .limit(90)
      if (indErr) throw indErr

      const { data: signals, error: sigErr } = await supabase
        .from('etf_claw_signals')
        .select('*')
        .eq('symbol', symbol)
        .order('trade_date', { ascending: false })
        .limit(90)
      if (sigErr) throw sigErr

      // 先取 dailyData 的日期范围，再查询该范围内的所有拟合数据
      const dailyDates = (dailyData || []).map(d => d.trade_date)
      const oldestDate = dailyDates.length > 0 ? dailyDates[dailyDates.length - 1] : null
      
      let fitQuery = supabase
        .from('etf_butterworth_fit')
        .select('*')
        .eq('symbol', symbol)
        .order('trade_date', { ascending: false })
      
      if (oldestDate) {
        fitQuery = fitQuery.gte('trade_date', oldestDate)
      }
      
      const { data: fitData, error: fitErr } = await fitQuery
      if (fitErr) throw fitErr

      setData({
        etf: etfInfo,
        dailyData: dailyData || [],
        indicators: indicators || [],
        signals: signals || [],
        butterworthFit: fitData || []
      })
    } catch (error) {
      console.error('Error fetching ETF detail:', error)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading }
}

const MainChart: React.FC<{ dailyData: EtfDailyData[]; indicators: EtfIndicators[]; signals: EtfClawSignal[]; butterworthFit: ButterworthFit[] }> = ({ dailyData, indicators, signals, butterworthFit }) => {
  const indicatorMap = new Map(indicators.map(d => [d.trade_date, d]))
  const signalMap = new Map<string, EtfClawSignal>()
  signals.forEach(sig => {
    signalMap.set(sig.trade_date, sig)
  })
  // 拟合数据按 trade_date 索引
  const fitMap = new Map<string, ButterworthFit>()
  butterworthFit.forEach(f => fitMap.set(f.trade_date, f))
  
  const chartData = useMemo(() => {
    return [...dailyData].reverse().map(d => {
      const indicator = indicatorMap.get(d.trade_date)
      const signal = signalMap.get(d.trade_date)
      const fit = fitMap.get(d.trade_date)
      return {
        date: formatDate(d.trade_date),
        trade_date: d.trade_date,
        open: d.open ?? 0,
        high: d.high ?? 0,
        low: d.low ?? 0,
        close: d.close ?? 0,
        isUp: (d.close ?? 0) >= (d.open ?? 0),
        bodyTop: Math.max(d.open ?? 0, d.close ?? 0),
        bodyBottom: Math.min(d.open ?? 0, d.close ?? 0),
        ma5: indicator?.ma5,
        ma10: indicator?.ma10,
        ma20: indicator?.ma20,
        ma60: indicator?.ma60,
        volume: d.volume ?? 0,
        value: d.high ?? 0,
        signalAction: signal?.action,
        signalBuySignals: signal?.buy_signals,
        signalSellSignals: signal?.sell_signals,
        signalBuyCount: signal?.buy_count,
        signalSellCount: signal?.sell_count,
        signalK: signal?.k,
        signalD: signal?.d,
        signalJ: signal?.j,
        signalRsi: signal?.rsi,
        signalMacd: signal?.macd_hist,
        fitted: fit?.fitted ?? null,
      }
    })
  }, [dailyData, indicators, signals, butterworthFit])

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center min-h-[300px] text-gray-500 text-sm">暂无数据</div>
  }

  const prices = chartData.flatMap(d => [
    d.high,
    d.low,
    ...(d.fitted != null ? [d.fitted] : [])
  ])
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const padding = (maxPrice - minPrice) * 0.1

  const CustomBar = ({ x, y, width, height, payload }: any) => {
    if (!payload) return <g />
    
    const color = payload.isUp ? '#ef4444' : '#22c55e'
    const domainLow = minPrice - padding
    const domainHigh = maxPrice + padding
    const domainRange = domainHigh - domainLow

    // Recharts: y = 当前k线high值的Y坐标, y + height = 图表底部Y坐标(=domainLow)
    // 据此推算整图的像素高度和顶部Y坐标, 用于任意价格→Y坐标映射
    const barValue = payload.high ?? 0
    const chartBottomY = y + height
    const pixelsPerPriceUnit = height / Math.max(barValue - domainLow, 0.0001)
    const chartPixelHeight = domainRange * pixelsPerPriceUnit
    const chartTopY = chartBottomY - chartPixelHeight

    const getY = (price: number) => {
      return chartTopY + chartPixelHeight * (domainHigh - price) / domainRange
    }
    
    const highY = getY(payload.high)
    const lowY = getY(payload.low)
    const bodyTopY = getY(payload.bodyTop)
    const bodyBottomY = getY(payload.bodyBottom)
    const bodyHeight = Math.abs(bodyBottomY - bodyTopY) || 1
    
    const signal = signalMap.get(payload.trade_date)
    let signalMark = null
    if (signal) {
      const action = signal.action?.toLowerCase() || ''
      const isBuy = action.includes('买') || action.includes('加仓')
      const isSell = action.includes('卖') || action.includes('减仓')
      const markerX = x + width / 2
      if (isBuy) {
        signalMark = (
          <g>
            <path
              d={`M${markerX},${lowY + 8} L${markerX - 5},${lowY + 16} L${markerX + 5},${lowY + 16} Z`}
              fill="#ef4444"
            />
          </g>
        )
      } else if (isSell) {
        signalMark = (
          <g>
            <path
              d={`M${markerX},${highY - 8} L${markerX - 5},${highY - 16} L${markerX + 5},${highY - 16} Z`}
              fill="#22c55e"
            />
          </g>
        )
      }
    }
    
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
        {signalMark}
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
            domain={[minPrice - padding, maxPrice + padding]}
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => v.toFixed(2)}
          />
          <Tooltip
            position={{ y: 0 }}
            offset={10}
            allowEscapeViewBox={{ x: true, y: false }}
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.65)', border: '1px solid rgba(229, 231, 235, 0.6)', borderRadius: '8px', backdropFilter: 'blur(2px)' }}
            wrapperStyle={{ pointerEvents: 'none', zIndex: 50 }}
            formatter={(value: number, name: string) => {
              const labels: Record<string, string> = {
                open: '开盘',
                high: '最高',
                low: '最低',
                close: '收盘',
                ma5: 'MA5',
                ma10: 'MA10',
                ma20: 'MA20',
                ma60: 'MA60',
                fitted: '拟合值'
              }
              return [value?.toFixed(2) || '--', labels[name] || name]
            }}
            content={({ payload }: any) => {
              if (!payload || !payload[0]) return null
              const data = payload[0].payload
              return (
                <div className="bg-white/60 border border-gray-300/60 rounded-lg shadow-lg p-3 min-w-[200px] max-w-[260px] backdrop-blur-sm">
                  <div className="text-gray-600 text-sm mb-2">{data.date}</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <span className="text-gray-500">开盘:</span>
                    <span className="text-right font-medium">{data.open?.toFixed(2)}</span>
                    <span className="text-gray-500">最高:</span>
                    <span className="text-right font-medium">{data.high?.toFixed(2)}</span>
                    <span className="text-gray-500">最低:</span>
                    <span className="text-right font-medium">{data.low?.toFixed(2)}</span>
                    <span className="text-gray-500">收盘:</span>
                    <span className="text-right font-medium">{data.close?.toFixed(2)}</span>
                    <span className="text-gray-500">MA5:</span>
                    <span className="text-right font-medium">{data.ma5?.toFixed(2) || '--'}</span>
                    <span className="text-gray-500">MA10:</span>
                    <span className="text-right font-medium">{data.ma10?.toFixed(2) || '--'}</span>
                    <span className="text-gray-500">MA20:</span>
                    <span className="text-right font-medium">{data.ma20?.toFixed(2) || '--'}</span>
                    <span className="text-gray-500">MA60:</span>
                    <span className="text-right font-medium">{data.ma60?.toFixed(2) || '--'}</span>
                    {(data.fitted != null) && (
                      <>
                        <span className="text-gray-500">拟合值:</span>
                        <span className="text-right font-medium text-indigo-400">{data.fitted?.toFixed(2) || '--'}</span>
                      </>
                    )}
                  </div>
                  {data.signalAction && (
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <div className="text-sm font-medium text-red-500">交易信号</div>
                      <div className="text-sm mt-1">{data.signalAction}</div>
                      {data.signalBuySignals && (
                        <div className="mt-2">
                          <div className="text-xs font-medium text-green-600">
                            买入信号({data.signalBuyCount || 0}):
                          </div>
                          <div className="text-xs text-gray-700 mt-0.5">{data.signalBuySignals}</div>
                        </div>
                      )}
                      {data.signalSellSignals && (
                        <div className="mt-2">
                          <div className="text-xs font-medium text-red-600">
                            卖出信号({data.signalSellCount || 0}):
                          </div>
                          <div className="text-xs text-gray-700 mt-0.5">{data.signalSellSignals}</div>
                        </div>
                      )}
                      {(data.signalK != null || data.signalD != null || data.signalJ != null) && (
                        <div className="text-xs text-gray-500 mt-2">
                          K: {data.signalK?.toFixed(1)} | D: {data.signalD?.toFixed(1)} | J: {data.signalJ?.toFixed(1)}
                        </div>
                      )}
                      {data.signalRsi != null && (
                        <div className="text-xs text-gray-500">
                          RSI: {data.signalRsi?.toFixed(1)}
                        </div>
                      )}
                      {data.signalMacd != null && (
                        <div className="text-xs text-gray-500">
                          MACD: {data.signalMacd?.toFixed(3)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} payload={[
            { value: 'MA5', type: 'line', color: '#f59e0b' },
            { value: 'MA10', type: 'line', color: '#8b5cf6' },
            { value: 'MA20', type: 'line', color: '#06b6d4' },
            { value: 'MA60', type: 'line', color: '#ec4899' },
            { value: '拟合值', type: 'line', color: '#c4b5fd' },
          ]} />
          
          <Bar dataKey="value" barSize={5} shape={<CustomBar />} name="K线" legendType="none" />
          
          <Line type="monotone" dataKey="ma5" stroke="#f59e0b" dot={false} strokeWidth={1} name="MA5" />
          <Line type="monotone" dataKey="ma10" stroke="#8b5cf6" dot={false} strokeWidth={1} name="MA10" />
          <Line type="monotone" dataKey="ma20" stroke="#06b6d4" dot={false} strokeWidth={1} name="MA20" />
          <Line type="monotone" dataKey="ma60" stroke="#ec4899" dot={false} strokeWidth={1} name="MA60" />
          
          {/* Butterworth 拟合曲线 */}
          <Line type="monotone" dataKey="fitted" stroke="#c4b5fd" dot={false} strokeWidth={1} name="拟合值" legendType="none" connectNulls={true} />
          
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

const VolumeChart: React.FC<{ data: EtfDailyData[] }> = ({ data }) => {
  const chartData = useMemo(() => {
    return [...data].reverse().map(d => ({
      date: formatDate(d.trade_date),
      volume: d.volume ?? 0,
      isUp: (d.close ?? 0) >= (d.open ?? 0),
      value: d.volume ?? 0
    }))
  }, [data])

  if (chartData.length === 0) {
    return <div className="h-16 flex items-center justify-center text-gray-500 text-sm">暂无数据</div>
  }

  return (
    <div className="h-24 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => (v / 10000).toFixed(0) + '万'} />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.65)', border: '1px solid rgba(229, 231, 235, 0.6)', borderRadius: '8px', fontSize: 12, backdropFilter: 'blur(2px)' }}
            wrapperStyle={{ pointerEvents: 'none', zIndex: 50 }}
            formatter={(value: number) => [(value / 10000).toFixed(0) + ' 万份', '成交量']}
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

const EtfDetail: React.FC = () => {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const { data, loading } = useEtfDetail(code || '')
  const { etfs } = useEtfContext()

  const etfSymbols = etfs.map(e => e.symbol)
  const currentIndex = etfSymbols.indexOf(code || '')
  const prevEtf = currentIndex > 0 ? etfs[currentIndex - 1] : null
  const nextEtf = currentIndex < etfSymbols.length - 1 ? etfs[currentIndex + 1] : null

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">ETF不存在</div>
      </div>
    )
  }

  const latestDaily = data.dailyData[0]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => navigate('/etf')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          返回
        </button>
        
        <div className="flex gap-3">
          {prevEtf && (
            <button
              onClick={() => navigate(`/etf/${prevEtf.symbol}`)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors text-sm"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              上翻
            </button>
          )}
          {nextEtf && (
            <button
              onClick={() => navigate(`/etf/${nextEtf.symbol}`)}
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
            <h1 className="text-xl font-bold text-gray-900">{data.etf.name || data.etf.symbol}</h1>
            <div className="text-gray-500 text-sm mt-0.5">{data.etf.symbol}</div>
            {data.etf.category && (
              <div className="text-xs text-gray-600 mt-1">{data.etf.category}</div>
            )}
            {data.etf.tracking_index_name && (
              <div className="text-xs text-gray-500 mt-0.5">跟踪: {data.etf.tracking_index_name}</div>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(latestDaily?.close)}
            </div>
            {latestDaily?.change_pct != null && (
              <div className={`text-lg font-semibold mt-0.5 ${getChangeColor(latestDaily.change_pct)}`}>
                {formatPercent(latestDaily.change_pct)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4">
        <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          K线走势
        </h2>
        <MainChart 
          dailyData={data.dailyData} 
          indicators={data.indicators} 
          signals={data.signals}
          butterworthFit={data.butterworthFit}
        />
        <VolumeChart data={data.dailyData} />
      </div>

      <NotesSection symbol={data.etf.symbol} etfName={data.etf.name} />
    </div>
  )
}

function NotesSection({ symbol, etfName }: { symbol: string; etfName: string | null }) {
  const { notes, loading, addNote, deleteNote } = useEtfNotesBySymbol(symbol)
  const [input, setInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setSubmitting(true)
    try {
      await addNote(input)
      setInput('')
    } catch {
      // error already logged
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        笔记
      </h2>

      {/* 输入框 */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="添加笔记..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={submitting || !input.trim()}
          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg text-sm flex items-center gap-1 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          添加
        </button>
      </form>

      {/* 历史笔记列表 */}
      {loading ? (
        <div className="text-sm text-gray-400 py-2">加载中...</div>
      ) : notes.length === 0 ? (
        <div className="text-sm text-gray-400 py-2">暂无笔记</div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {notes.map(note => (
            <div key={note.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  {etfName && etfName !== note.symbol && (
                    <span className="text-xs text-gray-700 font-medium">{etfName}</span>
                  )}
                  <span className="text-xs text-gray-400">
                    {note.symbol} · {note.created_at.slice(0, 16).replace('T', ' ')}
                  </span>
                </div>
                <div className="text-sm text-gray-800 break-words">{note.note}</div>
              </div>
              <button
                onClick={() => deleteNote(note.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity flex-shrink-0"
                title="删除"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EtfDetail
