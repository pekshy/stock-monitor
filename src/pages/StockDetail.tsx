import React, { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Building2, TrendingUp, Star } from 'lucide-react'
import { useStockDetail } from '../hooks/useStockData'
import { useStockContext } from '../context/StockContext'
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
import {
  formatPercent,
  formatPrice,
  getChangeColor,
  formatDate
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
        volume: q.volume ?? 0
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
                    <span className="text-right font-medium">{formatPrice(data.close)}</span>
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
                {latestValuation.pe_ttm?.toFixed(2) || '--'}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">PE (静态)</div>
              <div className="text-lg font-bold text-gray-900">
                {latestValuation.pe_static?.toFixed(2) || '--'}
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
    </div>
  )
}

export default StockDetail
