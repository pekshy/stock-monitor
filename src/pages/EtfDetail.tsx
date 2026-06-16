import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, TrendingUp } from 'lucide-react'
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
  const signalMap = new Map<string, EtfClawSignal>()
  signals.forEach(sig => {
    signalMap.set(sig.trade_date, sig)
  })
  
  const chartData = useMemo(() => {
    return [...dailyData].reverse().map(d => {
      const indicator = indicatorMap.get(d.trade_date)
      const signal = signalMap.get(d.trade_date)
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
        signalMacd: signal?.macd_hist
      }
    })
  }, [dailyData, indicators, signals])

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
    
    const action = signal.action?.toLowerCase() || ''
    const isBuy = action.includes('买') || action.includes('加仓')
    const isSell = action.includes('卖') || action.includes('减仓')
    
    if (!isBuy && !isSell) return <g />
    
    return (
      <g>
        {isBuy ? (
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
                ma60: 'MA60'
              }
              return [value?.toFixed(2) || '--', labels[name] || name]
            }}
            content={({ payload }: any) => {
              if (!payload || !payload[0]) return null
              const data = payload[0].payload
              return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[180px]">
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
          <Legend wrapperStyle={{ fontSize: 11 }} />
          
          <Bar dataKey="value" barSize={5} shape={<CustomBar />} name="K线" />
          
          <Line type="monotone" dataKey="ma5" stroke="#f59e0b" dot={false} strokeWidth={1} name="MA5" />
          <Line type="monotone" dataKey="ma10" stroke="#8b5cf6" dot={false} strokeWidth={1} name="MA10" />
          <Line type="monotone" dataKey="ma20" stroke="#06b6d4" dot={false} strokeWidth={1} name="MA20" />
          <Line type="monotone" dataKey="ma60" stroke="#ec4899" dot={false} strokeWidth={1} name="MA60" />
          
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
    return <div className="h-24 flex items-center justify-center text-gray-500">暂无数据</div>
  }

  return (
    <div className="h-24 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} syncId="etf-chart">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => (v / 10000).toFixed(0) + '万'} />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: 12 }}
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
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="h-5 w-5" />
        返回
      </button>

      <div className="flex gap-4 mb-4">
        {prevEtf && (
          <button
            onClick={() => navigate(`/etf/${prevEtf.symbol}`)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            上一只
          </button>
        )}
        {nextEtf && (
          <button
            onClick={() => navigate(`/etf/${nextEtf.symbol}`)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
          >
            下一只
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

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
          K线走势
        </h2>
        <MainChart 
          dailyData={data.dailyData} 
          indicators={data.indicators} 
          signals={data.signals} 
        />
        <VolumeChart data={data.dailyData} />
      </div>
    </div>
  )
}

export default EtfDetail
