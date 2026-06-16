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

      // 获取ETF基本信息
      const { data: etfInfo, error: etfErr } = await supabase
        .from('etf_info')
        .select('*')
        .eq('symbol', symbol)
        .single()
      if (etfErr) throw etfErr

      // 获取日线数据（用于K线图）
      const { data: dailyData, error: dailyErr } = await supabase
        .from('etf_daily_data')
        .select('*')
        .eq('symbol', symbol)
        .order('trade_date', { ascending: false })
        .limit(60)
      if (dailyErr) throw dailyErr

      // 获取技术指标
      const { data: indicators, error: indErr } = await supabase
        .from('etf_indicators')
        .select('*')
        .eq('symbol', symbol)
        .order('trade_date', { ascending: false })
        .limit(60)
      if (indErr) throw indErr

      // 获取交易信号
      const { data: signals, error: sigErr } = await supabase
        .from('etf_claw_signals')
        .select('*')
        .eq('symbol', symbol)
        .order('trade_date', { ascending: false })
        .limit(20)
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

// K线图组件
const CandlestickChart: React.FC<{ data: EtfDailyData[]; signals: EtfClawSignal[] }> = ({ data, signals }) => {
  const chartData = useMemo(() => {
    return [...data].reverse().map(d => ({
      date: formatDate(d.trade_date),
      trade_date: d.trade_date,
      open: d.open ?? 0,
      high: d.high ?? 0,
      low: d.low ?? 0,
      close: d.close ?? 0,
      isUp: (d.close ?? 0) >= (d.open ?? 0),
      bodyTop: Math.max(d.open ?? 0, d.close ?? 0),
      bodyBottom: Math.min(d.open ?? 0, d.close ?? 0),
      value: d.high ?? 0
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
    return <div className="h-80 flex items-center justify-center text-gray-500">暂无数据</div>
  }

  const prices = chartData.flatMap(d => [d.high, d.low])
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const padding = (maxPrice - minPrice) * 0.1

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
              d={`M${cx},${cy + 10} L${cx - 5},${cy + 18} L${cx + 5},${cy + 18} Z`}
              fill="#ef4444"
            />
            <text
              x={cx}
              y={cy + 28}
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
              d={`M${cx},${cy - 10} L${cx - 5},${cy - 18} L${cx + 5},${cy - 18} Z`}
              fill="#22c55e"
            />
            <text
              x={cx}
              y={cy - 22}
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
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
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
                close: '收盘'
              }
              return [value?.toFixed(2) || '--', labels[name] || name]
            }}
          />
          <Bar dataKey="value" barSize={6} shape={<CustomBar />} />
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

// 技术指标图（MA）
const MAChart: React.FC<{ data: EtfIndicators[] }> = ({ data }) => {
  const chartData = useMemo(() => {
    return [...data].reverse().map(d => ({
      date: formatDate(d.trade_date),
      ma5: d.ma5,
      ma10: d.ma10,
      ma20: d.ma20,
      ma60: d.ma60,
      close: d.macd // 复用macd字段存收盘价用于对比
    }))
  }, [data])

  if (chartData.length === 0) {
    return <div className="h-48 flex items-center justify-center text-gray-500">暂无数据</div>
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => v.toFixed(2)} />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: 12 }}
            formatter={(value: number, name: string) => [value?.toFixed(2) || '--', name.toUpperCase()]}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="ma5" stroke="#f59e0b" dot={false} strokeWidth={1} name="MA5" />
          <Line type="monotone" dataKey="ma10" stroke="#8b5cf6" dot={false} strokeWidth={1} name="MA10" />
          <Line type="monotone" dataKey="ma20" stroke="#06b6d4" dot={false} strokeWidth={1} name="MA20" />
          <Line type="monotone" dataKey="ma60" stroke="#ec4899" dot={false} strokeWidth={1} name="MA60" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// MACD图
const MACDChart: React.FC<{ data: EtfIndicators[] }> = ({ data }) => {
  const chartData = useMemo(() => {
    return [...data].reverse().map(d => ({
      date: formatDate(d.trade_date),
      macd: d.macd,
      signal: d.macd_signal,
      hist: d.macd_hist
    }))
  }, [data])

  if (chartData.length === 0) {
    return <div className="h-48 flex items-center justify-center text-gray-500">暂无数据</div>
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: 12 }}
            formatter={(value: number, name: string) => [value?.toFixed(3) || '--', name.toUpperCase()]}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="hist" fill="#6b7280" name="HIST" barSize={4} />
          <Line type="monotone" dataKey="macd" stroke="#2563eb" dot={false} strokeWidth={1.5} name="MACD" />
          <Line type="monotone" dataKey="signal" stroke="#f59e0b" dot={false} strokeWidth={1.5} name="SIGNAL" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

// RSI图
const RSIChart: React.FC<{ data: EtfIndicators[] }> = ({ data }) => {
  const chartData = useMemo(() => {
    return [...data].reverse().map(d => ({
      date: formatDate(d.trade_date),
      rsi6: d.rsi6,
      rsi12: d.rsi12,
      rsi24: d.rsi24
    }))
  }, [data])

  if (chartData.length === 0) {
    return <div className="h-48 flex items-center justify-center text-gray-500">暂无数据</div>
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: 12 }}
            formatter={(value: number, name: string) => [value?.toFixed(2) || '--', name.toUpperCase()]}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" />
          <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="3 3" />
          <Line type="monotone" dataKey="rsi6" stroke="#ef4444" dot={false} strokeWidth={1} name="RSI6" />
          <Line type="monotone" dataKey="rsi12" stroke="#2563eb" dot={false} strokeWidth={1} name="RSI12" />
          <Line type="monotone" dataKey="rsi24" stroke="#8b5cf6" dot={false} strokeWidth={1} name="RSI24" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// KDJ图
const KDJChart: React.FC<{ data: EtfIndicators[] }> = ({ data }) => {
  const chartData = useMemo(() => {
    return [...data].reverse().map(d => ({
      date: formatDate(d.trade_date),
      k: d.k,
      d: d.d,
      j: d.j
    }))
  }, [data])

  if (chartData.length === 0) {
    return <div className="h-48 flex items-center justify-center text-gray-500">暂无数据</div>
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: 12 }}
            formatter={(value: number, name: string) => [value?.toFixed(2) || '--', name.toUpperCase()]}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="3 3" />
          <ReferenceLine y={20} stroke="#22c55e" strokeDasharray="3 3" />
          <Line type="monotone" dataKey="k" stroke="#ef4444" dot={false} strokeWidth={1} name="K" />
          <Line type="monotone" dataKey="d" stroke="#2563eb" dot={false} strokeWidth={1} name="D" />
          <Line type="monotone" dataKey="j" stroke="#8b5cf6" dot={false} strokeWidth={1} name="J" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// 布林带图
const BollingerChart: React.FC<{ data: EtfIndicators[]; dailyData: EtfDailyData[] }> = ({ data, dailyData }) => {
  const chartData = useMemo(() => {
    const dailyMap = new Map(dailyData.map(d => [d.trade_date, d]))
    return [...data].reverse().map(d => {
      const daily = dailyMap.get(d.trade_date)
      return {
        date: formatDate(d.trade_date),
        upper: d.boll_upper,
        middle: d.boll_middle,
        lower: d.boll_lower,
        close: daily?.close
      }
    })
  }, [data, dailyData])

  if (chartData.length === 0) {
    return <div className="h-48 flex items-center justify-center text-gray-500">暂无数据</div>
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => v.toFixed(2)} />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: 12 }}
            formatter={(value: number, name: string) => [value?.toFixed(2) || '--', name.toUpperCase()]}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="upper" stroke="#ef4444" dot={false} strokeWidth={1} name="UPPER" strokeDasharray="3 3" />
          <Line type="monotone" dataKey="middle" stroke="#6b7280" dot={false} strokeWidth={1} name="MIDDLE" />
          <Line type="monotone" dataKey="lower" stroke="#22c55e" dot={false} strokeWidth={1} name="LOWER" strokeDasharray="3 3" />
          <Line type="monotone" dataKey="close" stroke="#2563eb" dot={false} strokeWidth={1.5} name="CLOSE" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// 交易信号列表
const SignalList: React.FC<{ signals: EtfClawSignal[] }> = ({ signals }) => {
  const getSignalBadge = (action: string | null) => {
    if (!action) return null
    const isBuy = action.includes('买') || action.includes('买入') || action.includes('加仓')
    const isSell = action.includes('卖') || action.includes('卖出') || action.includes('减仓')
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
        isBuy ? 'bg-red-100 text-red-700' : isSell ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
      }`}>
        {action}
      </span>
    )
  }

  if (signals.length === 0) {
    return <div className="text-center text-gray-500 py-4">暂无信号数据</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-2 font-medium text-gray-600">日期</th>
            <th className="text-right py-2 px-2 font-medium text-gray-600">收盘价</th>
            <th className="text-right py-2 px-2 font-medium text-gray-600">涨跌幅</th>
            <th className="text-right py-2 px-2 font-medium text-gray-600">K</th>
            <th className="text-right py-2 px-2 font-medium text-gray-600">D</th>
            <th className="text-right py-2 px-2 font-medium text-gray-600">J</th>
            <th className="text-right py-2 px-2 font-medium text-gray-600">RSI</th>
            <th className="text-right py-2 px-2 font-medium text-gray-600">MACD</th>
            <th className="text-center py-2 px-2 font-medium text-gray-600">信号</th>
          </tr>
        </thead>
        <tbody>
          {signals.map((signal, idx) => (
            <tr key={signal.id || idx} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-2 px-2 text-gray-700">{signal.trade_date}</td>
              <td className="py-2 px-2 text-right text-gray-900">{formatPrice(signal.close)}</td>
              <td className={`py-2 px-2 text-right font-medium ${getChangeColor(null)}`}>--</td>
              <td className="py-2 px-2 text-right text-gray-700">{signal.k?.toFixed(1) || '--'}</td>
              <td className="py-2 px-2 text-right text-gray-700">{signal.d?.toFixed(1) || '--'}</td>
              <td className="py-2 px-2 text-right text-gray-700">{signal.j?.toFixed(1) || '--'}</td>
              <td className="py-2 px-2 text-right text-gray-700">{signal.rsi?.toFixed(1) || '--'}</td>
              <td className="py-2 px-2 text-right text-gray-700">{signal.macd_hist?.toFixed(3) || '--'}</td>
              <td className="py-2 px-2 text-center">{getSignalBadge(signal.action)}</td>
            </tr>
          ))}
        </tbody>
      </table>
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

      {/* 基本信息 */}
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

      {/* K线图 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          K线走势
        </h2>
        <CandlestickChart data={data.dailyData} signals={data.signals} />
      </div>

      {/* MA均线 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">MA均线</h2>
        <MAChart data={data.indicators} />
      </div>

      {/* MACD */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">MACD</h2>
        <MACDChart data={data.indicators} />
      </div>

      {/* RSI */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">RSI</h2>
        <RSIChart data={data.indicators} />
      </div>

      {/* KDJ */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">KDJ</h2>
        <KDJChart data={data.indicators} />
      </div>

      {/* 布林带 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">布林带</h2>
        <BollingerChart data={data.indicators} dailyData={data.dailyData} />
      </div>

      {/* 交易信号 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">近20日交易信号</h2>
        <SignalList signals={data.signals} />
      </div>
    </div>
  )
}

export default EtfDetail
