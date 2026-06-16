import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp } from 'lucide-react'
import {
  ComposedChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts'
import { supabase } from '../utils/supabase'
import { EtfDailyData, EtfIndicators, EtfClawSignal } from '../types'
import { formatPercent, formatPrice, formatDate, getChangeColor } from '../utils/formatters'

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
        .limit(60)
      if (dailyErr) throw dailyErr

      const { data: indicators, error: indErr } = await supabase
        .from('etf_indicators')
        .select('*')
        .eq('symbol', symbol)
        .order('trade_date', { ascending: false })
        .limit(60)
      if (indErr) throw indErr

      const { data: signals, error: sigErr } = await supabase
        .from('etf_claw_signals')
        .select('*')
        .eq('symbol', symbol)
        .order('trade_date', { ascending: false })
        .limit(60)
      if (sigErr) throw sigErr

      setData({
        etf: etfInfo,
        dailyData: dailyData || [],
        indicators: indicators || [],
        signals: signals || []
      })
    } catch (error) {
      console.error('Error fetching ETF detail:', error)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading }
}

const MainChart: React.FC<{ dailyData: EtfDailyData[]; indicators: EtfIndicators[]; signals: EtfClawSignal[] }> = ({ dailyData, indicators, signals }) => {
  const indicatorMap = new Map(indicators.map(d => [d.trade_date, d]))
  
  const chartData = useMemo(() => {
    return [...dailyData].reverse().map(d => {
      const indicator = indicatorMap.get(d.trade_date)
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
        bollUpper: indicator?.boll_upper,
        bollMiddle: indicator?.boll_middle,
        bollLower: indicator?.boll_lower,
        value: d.high ?? 0
      }
    })
  }, [dailyData, indicators])

  const signalMap = useMemo(() => {
    const map = new Map<string, 'buy' | 'sell'>()
    signals.forEach(sig => {
      const action = sig.action?.toLowerCase()
      if (action?.includes('买') || action?.includes('加仓')) {
        map.set(sig.trade_date, 'buy')
      } else if (action?.includes('卖') || action?.includes('减仓')) {
        map.set(sig.trade_date, 'sell')
      }
    })
    return map
  }, [signals])

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center min-h-[500px] text-gray-500">暂无数据</div>
  }

  const prices = chartData.flatMap(d => [d.high, d.low])
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const padding = (maxPrice - minPrice) * 0.15

  const CustomBar = ({ x, y, width, height, payload }: any) => {
    if (!payload) return <g />
    
    const color = payload.isUp ? '#ef4444' : '#22c55e'
    const priceRange = maxPrice - minPrice + padding * 2
    
    const getY = (price: number) => {
      return y + height * ((maxPrice + padding) - price) / priceRange
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

  const CustomSignalDot = ({ payload, cx, cy }: any) => {
    const signal = signalMap.get(payload.trade_date)
    if (!signal) return <g />
    
    return (
      <g>
        {signal === 'buy' ? (
          <g>
            <path
              d={`M${cx},${cy + 12} L${cx - 6},${cy + 20} L${cx + 6},${cy + 20} Z`}
              fill="#ef4444"
            />
            <text
              x={cx}
              y={cy + 32}
              textAnchor="middle"
              fill="#ef4444"
              fontSize={10}
              fontWeight="bold"
            >
              买
            </text>
          </g>
        ) : (
          <g>
            <path
              d={`M${cx},${cy - 12} L${cx - 6},${cy - 20} L${cx + 6},${cy - 20} Z`}
              fill="#22c55e"
            />
            <text
              x={cx}
              y={cy - 24}
              textAnchor="middle"
              fill="#22c55e"
              fontSize={10}
              fontWeight="bold"
            >
              卖
            </text>
          </g>
        )}
      </g>
    )
  }

  return (
    <div className="h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart 
          data={chartData} 
          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
          syncId="etf-chart"
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
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
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
                bollUpper: 'UPPER',
                bollMiddle: 'MIDDLE',
                bollLower: 'LOWER'
              }
              return [value?.toFixed(2) || '--', labels[name] || name]
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          
          <Bar dataKey="value" barSize={5} shape={<CustomBar />} name="K线" />
          
          <Line type="monotone" dataKey="ma5" stroke="#f59e0b" dot={false} strokeWidth={1} name="MA5" />
          <Line type="monotone" dataKey="ma10" stroke="#8b5cf6" dot={false} strokeWidth={1} name="MA10" />
          <Line type="monotone" dataKey="ma20" stroke="#06b6d4" dot={false} strokeWidth={1} name="MA20" />
          <Line type="monotone" dataKey="ma60" stroke="#ec4899" dot={false} strokeWidth={1} name="MA60" />
          
          <Line type="monotone" dataKey="bollUpper" stroke="#ef4444" dot={false} strokeWidth={1} name="UPPER" strokeDasharray="3 3" />
          <Line type="monotone" dataKey="bollMiddle" stroke="#6b7280" dot={false} strokeWidth={1} name="MIDDLE" />
          <Line type="monotone" dataKey="bollLower" stroke="#22c55e" dot={false} strokeWidth={1} name="LOWER" strokeDasharray="3 3" />
          
          <Line
            type="monotone"
            dataKey="close"
            stroke="transparent"
            dot={<CustomSignalDot />}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

const MACDIndicator: React.FC<{ data: EtfIndicators[]; signals: EtfClawSignal[] }> = ({ data, signals }) => {
  const chartData = useMemo(() => {
    return [...data].reverse().map(d => ({
      date: formatDate(d.trade_date),
      trade_date: d.trade_date,
      macd: d.macd ?? 0,
      signal: d.macd_signal ?? 0,
      hist: d.macd_hist ?? 0
    }))
  }, [data])

  const signalMap = useMemo(() => {
    const map = new Map<string, 'buy' | 'sell'>()
    signals.forEach(sig => {
      const action = sig.action?.toLowerCase()
      if (action?.includes('买') || action?.includes('加仓')) {
        map.set(sig.trade_date, 'buy')
      } else if (action?.includes('卖') || action?.includes('减仓')) {
        map.set(sig.trade_date, 'sell')
      }
    })
    return map
  }, [signals])

  if (chartData.length === 0) {
    return <div className="h-32 flex items-center justify-center text-gray-500">暂无数据</div>
  }

  return (
    <div className="h-32">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} syncId="etf-chart">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: 12 }}
            formatter={(value: number, name: string) => [value?.toFixed(3) || '--', name.toUpperCase()]}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="hist" fill="#6b7280" name="HIST" barSize={4} />
          <Line type="monotone" dataKey="macd" stroke="#2563eb" dot={false} strokeWidth={1.5} name="MACD" />
          <Line type="monotone" dataKey="signal" stroke="#f59e0b" dot={false} strokeWidth={1.5} name="SIGNAL" />
          <Line
            type="monotone"
            dataKey="macd"
            stroke="transparent"
            dot={(props: any) => {
              const { payload, cx, cy } = props
              const signal = signalMap.get(payload.trade_date)
              if (!signal) return <g />
              return (
                <g>
                  {signal === 'buy' ? (
                    <path d={`M${cx},${cy + 8} L${cx - 4},${cy + 14} L${cx + 4},${cy + 14} Z`} fill="#ef4444" />
                  ) : (
                    <path d={`M${cx},${cy - 8} L${cx - 4},${cy - 14} L${cx + 4},${cy - 14} Z`} fill="#22c55e" />
                  )}
                </g>
              )
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

const RSIKDJIndicator: React.FC<{ data: EtfIndicators[]; signals: EtfClawSignal[] }> = ({ data, signals }) => {
  const chartData = useMemo(() => {
    return [...data].reverse().map(d => ({
      date: formatDate(d.trade_date),
      trade_date: d.trade_date,
      rsi6: d.rsi6,
      k: d.k,
      d: d.d,
      j: d.j
    }))
  }, [data])

  const signalMap = useMemo(() => {
    const map = new Map<string, 'buy' | 'sell'>()
    signals.forEach(sig => {
      const action = sig.action?.toLowerCase()
      if (action?.includes('买') || action?.includes('加仓')) {
        map.set(sig.trade_date, 'buy')
      } else if (action?.includes('卖') || action?.includes('减仓')) {
        map.set(sig.trade_date, 'sell')
      }
    })
    return map
  }, [signals])

  if (chartData.length === 0) {
    return <div className="h-32 flex items-center justify-center text-gray-500">暂无数据</div>
  }

  return (
    <div className="h-32">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} syncId="etf-chart">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: 12 }}
            formatter={(value: number, name: string) => [value?.toFixed(2) || '--', name.toUpperCase()]}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" />
          <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="3 3" />
          <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="3 3" />
          <ReferenceLine y={20} stroke="#22c55e" strokeDasharray="3 3" />
          <Line type="monotone" dataKey="rsi6" stroke="#ef4444" dot={false} strokeWidth={1} name="RSI" />
          <Line type="monotone" dataKey="k" stroke="#f59e0b" dot={false} strokeWidth={1} name="K" />
          <Line type="monotone" dataKey="d" stroke="#2563eb" dot={false} strokeWidth={1} name="D" />
          <Line type="monotone" dataKey="j" stroke="#8b5cf6" dot={false} strokeWidth={1} name="J" />
          <Line
            type="monotone"
            dataKey="rsi6"
            stroke="transparent"
            dot={(props: any) => {
              const { payload, cx, cy } = props
              const signal = signalMap.get(payload.trade_date)
              if (!signal) return <g />
              return (
                <g>
                  {signal === 'buy' ? (
                    <path d={`M${cx},${cy + 8} L${cx - 4},${cy + 14} L${cx + 4},${cy + 14} Z`} fill="#ef4444" />
                  ) : (
                    <path d={`M${cx},${cy - 8} L${cx - 4},${cy - 14} L${cx + 4},${cy - 14} Z`} fill="#22c55e" />
                  )}
                </g>
              )
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

const EtfDetail: React.FC = () => {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const { data, loading } = useEtfDetail(code || '')

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
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="h-5 w-5" />
        返回
      </button>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{data.etf.name || data.etf.symbol}</h1>
            <div className="text-gray-500 mt-1">{data.etf.symbol}</div>
            {data.etf.category && (
              <div className="text-sm text-gray-600 mt-2">{data.etf.category}</div>
            )}
            {data.etf.tracking_index_name && (
              <div className="text-sm text-gray-500 mt-1">跟踪: {data.etf.tracking_index_name}</div>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              {formatPrice(latestDaily?.close)}
            </div>
            {latestDaily?.change_pct != null && (
              <div className={`text-xl font-semibold mt-1 ${getChangeColor(latestDaily.change_pct)}`}>
                {formatPercent(latestDaily.change_pct)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          K线走势与技术指标
        </h2>
        <MainChart 
          dailyData={data.dailyData} 
          indicators={data.indicators} 
          signals={data.signals} 
        />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">MACD</h2>
        <MACDIndicator data={data.indicators} signals={data.signals} />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">RSI / KDJ</h2>
        <RSIKDJIndicator data={data.indicators} signals={data.signals} />
      </div>
    </div>
  )
}

export default EtfDetail
