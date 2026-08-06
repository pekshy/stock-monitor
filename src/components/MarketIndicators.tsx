import React, { useMemo, useState } from 'react'
import { Activity } from 'lucide-react'
import { LineChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  GLOBAL_CATEGORIES,
  buildIndicatorCategories
} from '../hooks/useEtfData'
import { IndicatorSeries, IndicatorCategory, FearGreedSeries } from '../types'

const formatShortDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const year = date.getFullYear().toString().slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}

const formatValue = (value: number | null, indicatorId: string): string => {
  if (value === null || value === undefined) return '--'
  const u = indicatorId.toUpperCase()
  if (u.startsWith('DGS') || u.includes('TREASURY')) {
    return value.toFixed(2) + '%'
  }
  if (u === 'DXY' || u.startsWith('DTWEX') || u === 'DOLLAR_INDEX') {
    return value.toFixed(2)
  }
  if (u === 'GOLD' || u === 'XAU') {
    return '$' + value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }
  if (u === 'SILVER' || u === 'XAG') {
    return '$' + value.toFixed(2)
  }
  if (u.includes('BTC') || u.includes('BITCOIN')) {
    return '$' + value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }
  if (u.includes('CRUDE') || u.includes('BRENT') || u.includes('WTI') || u.includes('OIL')) {
    return '$' + value.toFixed(2)
  }
  if (u.includes('CNY') || u.includes('EXCHANGE') || u.includes('RMB')) {
    return value.toFixed(4)
  }
  if (u.includes('STOCK_MARKET_VOLUME') || u.includes('VOLUME') || u.includes('A股')) {
    if (value >= 1000000000000) return (value / 1000000000000).toFixed(2) + '万亿'
    if (value >= 100000000) return (value / 100000000).toFixed(2) + '亿'
    if (value >= 10000) return (value / 10000).toFixed(2) + '万'
    return value.toLocaleString()
  }
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

const getIndicatorLabel = (id: string): string => {
  const map: Record<string, string> = {
    'DXY': '美元指数',
    'DTWEXBGS': '美元指数',
    'DTWEXM': '美元指数',
    'DTWEXO': '美元指数',
    'dollar_index': '美元指数',
    'DGS1MO': '1个月',
    'DGS3MO': '3个月',
    'DGS6MO': '6个月',
    'DGS1': '1年',
    'DGS2': '2年',
    'DGS5': '5年',
    'DGS7': '7年',
    'DGS10': '10年',
    'DGS20': '20年',
    'DGS30': '30年',
    'treasury_1m': '1个月',
    'treasury_3m': '3个月',
    'treasury_6m': '6个月',
    'treasury_1y': '1年',
    'treasury_2y': '2年',
    'treasury_5y': '5年',
    'treasury_7y': '7年',
    'treasury_10y': '10年',
    'treasury_20y': '20年',
    'treasury_30y': '30年',
    'GOLD': '黄金',
    'XAU': '黄金',
    'SILVER': '白银',
    'XAG': '白银',
    'BITCOIN': 'BTC',
    'BTC': 'BTC',
    'BTCUSD': 'BTC',
    'BRENT.CRUDE': '布油',
    'BRENT_CRUDE': '布油',
    'brent_crude': '布油',
    'CRUDE.OIL': 'WTI',
    'CRUDE_OIL': 'WTI',
    'crude_oil': 'WTI',
    'cny_exchange_rate': '人民币',
    'CNY_USD': '人民币',
    'stock_market_volume': '成交量',
    'SHIBOR': 'SHIBOR',
    'LPR': 'LPR',
    'MONEY.SUPPLY': '货币',
    'MONEY_SUPPLY': '货币',
    'CPI': 'CPI',
    'CORE.CPI': '核心CPI',
    'PPI': 'PPI',
    'GDP': 'GDP',
    'DURABLE.ORDERS': '耐用品',
    'CAPACITY.UTILIZATION': '产能',
    'TRADE.BALANCE': '贸易',
    'SOCIAL.FINANCING': '社融'
  }
  return map[id] || id
}

function calculateGoldSilverRatio(seriesList: IndicatorSeries[]): number | null {
  var gold = null
  var silver = null
  
  for (var i = 0; i < seriesList.length; i++) {
    var s = seriesList[i]
    var upperId = s.indicator_id.toUpperCase()
    if (upperId.indexOf('GOLD') >= 0 || upperId === 'XAU') {
      gold = s
    }
    if (upperId.indexOf('SILVER') >= 0 || upperId === 'XAG') {
      silver = s
    }
  }
  
  if (!gold || !gold.latest_value || !silver || !silver.latest_value || silver.latest_value === 0) {
    return null
  }
  
  return gold.latest_value / silver.latest_value
}

const SERIES_COLORS = ['#2563eb', '#dc2626', '#16a34a', '#f59e0b', '#7c3aed', '#ec4899']

interface MultiChartProps {
  seriesList: IndicatorSeries[]
  baseColor: string
  days?: number
}

const MultiChart: React.FC<MultiChartProps> = ({ seriesList, baseColor, days = 90 }) => {
  const mergedData = useMemo(() => {
    const allDates = new Set<string>()
    seriesList.forEach(s => s.history.forEach(h => allDates.add(h.date)))
    const sortedDates = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    
    return sortedDates.slice(-days).map(date => {
      const result: Record<string, number | null | string> = { date: formatShortDate(date) }
      seriesList.forEach((s, idx) => {
        const point = s.history.find(h => h.date === date)
        result[`value_${idx}`] = point?.value ?? null
      })
      return result
    })
  }, [seriesList, days])

  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mergedData} margin={{ top: 2, right: 4, left: 0, bottom: 2 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="date"
            tick={false}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={false}
            axisLine={false}
            tickLine={false}
            domain={['auto', 'auto']}
            width={0}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
              padding: '6px 10px'
            }}
            formatter={(value: number, name: string) => {
              const idx = parseInt(name.split('_')[1])
              const series = seriesList[idx]
              return [formatValue(value, series?.indicator_id || ''), getIndicatorLabel(series?.indicator_id || '')]
            }}
          />
          {seriesList.map((series, idx) => (
            <Line
              key={series.indicator_id}
              type="monotone"
              dataKey={`value_${idx}`}
              stroke={SERIES_COLORS[idx] || baseColor}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3, stroke: SERIES_COLORS[idx] || baseColor, strokeWidth: 1, fill: '#fff' }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

const FearGreedCard: React.FC<{ series: FearGreedSeries }> = ({ series }) => {
  const latestValue = series.latest_value ?? 0
  const classification = series.latest_classification || ''
  const upperClassification = classification.toUpperCase()

  let color = '#6b7280'
  if (upperClassification.includes('EXTREME') && upperClassification.includes('GREED')) {
    color = '#dc2626'
  } else if (upperClassification.includes('GREED') && !upperClassification.includes('FEAR')) {
    color = '#ea580c'
  } else if (upperClassification.includes('NEUTRAL') || classification === '中性') {
    color = '#059669'
  } else if (upperClassification.includes('EXTREME') && upperClassification.includes('FEAR')) {
    color = '#2563eb'
  } else if (upperClassification.includes('FEAR')) {
    color = '#7c3aed'
  } else if (latestValue >= 75) {
    color = '#dc2626'
  } else if (latestValue >= 55) {
    color = '#ea580c'
  } else if (latestValue >= 45) {
    color = '#059669'
  } else if (latestValue >= 25) {
    color = '#7c3aed'
  } else {
    color = '#2563eb'
  }

  const chartData = series.history.slice(-60).map(h => ({
    date: formatShortDate(h.date),
    value: h.value,
    classification: h.classification || ''
  }))

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
      style={{ borderTop: `3px solid ${color}` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="font-bold" style={{ color }}>
          恐贪指数
        </div>
        <div className="text-xs text-gray-400">{series.latest_date}</div>
      </div>

      <div className="flex items-start justify-between mb-2">
        <div
          className="text-4xl font-bold"
          style={{ color }}
        >
          {latestValue.toFixed(0)}
        </div>
        <div
          className="text-sm font-semibold px-2 py-1 rounded-md"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {classification || (latestValue >= 75 ? '极度贪婪' : latestValue >= 55 ? '贪婪' : latestValue >= 45 ? '中性' : latestValue >= 25 ? '恐惧' : '极度恐惧')}
        </div>
      </div>

      <div className="relative mb-3 mt-1">
        <div className="h-2 rounded-full overflow-hidden" style={{
          background: 'linear-gradient(to right, #2563eb, #7c3aed, #059669, #ea580c, #dc2626)'
        }} />
        <div
          className="absolute top-0 h-2 w-0.5 bg-black transform -translate-x-1/2"
          style={{ left: `${latestValue}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mb-3">
        <span>极度恐惧</span>
        <span>恐惧</span>
        <span>中性</span>
        <span>贪婪</span>
        <span>极度贪婪</span>
      </div>

      <ResponsiveContainer width="100%" height={80}>
        <LineChart data={chartData} margin={{ top: 2, right: 4, left: 0, bottom: 2 }}>
          <defs>
            <linearGradient id="fearGreedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="date"
            tick={false}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={false}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            width={0}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
              padding: '6px 10px'
            }}
            formatter={(value: number) => [
              `${value.toFixed(0)}`,
              '恐贪指数'
            ]}
            labelFormatter={(label) => {
              const point = chartData.find((d: any) => d.date === label)
              return point && point.classification ? `${label} · ${point.classification}` : label
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill="url(#fearGreedGradient)"
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4, stroke: color, strokeWidth: 1, fill: '#fff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

interface CategoryCardProps {
  category: IndicatorCategory
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const defaultId = category.default_indicator_id || category.members[0]?.indicator_id
    return defaultId ? [defaultId] : []
  })

  const selectedSeries = useMemo(
    () => category.members.filter(m => selectedIds.includes(m.indicator_id)),
    [category, selectedIds]
  )

  if (selectedSeries.length === 0) return null

  const toggleIndicator = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev
        return prev.filter(i => i !== id)
      }
      return [...prev, id]
    })
  }

  const goldSilverRatio = category.id === 'precious_metals' ? calculateGoldSilverRatio(selectedSeries) : null

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
      style={{ borderTop: `3px solid ${category.color}` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-bold text-gray-800" style={{ color: category.color }}>
          {category.label}
        </div>
        {category.members.length > 1 && (
          <div className="flex flex-wrap gap-1">
            {category.members.map((m) => (
              <button
                key={m.indicator_id}
                onClick={() => toggleIndicator(m.indicator_id)}
                className={`px-2 py-0.5 text-xs rounded-md transition-colors ${
                  selectedIds.includes(m.indicator_id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {getIndicatorLabel(m.indicator_id)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-1 mb-2">
        {selectedSeries.map((series, idx) => {
          const changeInfo = (() => {
            if (series.history.length < 2) return { change: 0, changePct: 0 }
            const latest = series.history[series.history.length - 1].value
            const prev = series.history[series.history.length - 2].value
            const change = latest - prev
            const changePct = prev !== 0 ? (change / prev) * 100 : 0
            return { change, changePct }
          })()
          const changeClass = changeInfo.changePct > 0
            ? 'text-red-600'
            : changeInfo.changePct < 0
            ? 'text-green-600'
            : 'text-gray-600'

          return (
            <div key={series.indicator_id} className="flex items-start justify-between">
              <div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  {series.indicator_id}
                </div>
                <div className="text-xs text-gray-600">
                  {getIndicatorLabel(series.indicator_id)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900" style={{ color: SERIES_COLORS[idx] || category.color }}>
                  {formatValue(series.latest_value, series.indicator_id)}
                </div>
                {changeInfo.changePct !== 0 && (
                  <div className={`text-xs font-medium ${changeClass}`}>
                    {changeInfo.changePct > 0 ? '+' : ''}{changeInfo.changePct.toFixed(2)}%
                  </div>
                )}
              </div>
            </div>
          )
        })}
        
        {goldSilverRatio !== null && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
            <div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">GOLD/SILVER RATIO</div>
              <div className="text-xs text-gray-600">金银价格比值</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-purple-600">
                {goldSilverRatio.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">
                1盎司黄金 = {goldSilverRatio.toFixed(1)}盎司白银
              </div>
            </div>
          </div>
        )}
      </div>

      <MultiChart seriesList={selectedSeries} baseColor={category.color} />

      {selectedSeries[0]?.latest_date && (
        <div className="text-xs text-gray-400 mt-1 text-right">
          更新于 {selectedSeries[0].latest_date}
        </div>
      )}
    </div>
  )
}

interface MarketIndicatorsProps {
  globalIndicatorSeries: IndicatorSeries[]
  chinaIndicatorSeries: IndicatorSeries[]
  fearGreedSeries: FearGreedSeries | null
}

export const MarketIndicators: React.FC<MarketIndicatorsProps> = ({
  globalIndicatorSeries,
  chinaIndicatorSeries,
  fearGreedSeries
}) => {
  const globalCategories = useMemo(
    () => {
      // 从 chinaIndicatorSeries 构建的分类（中国宏观指标表中的数据）
      const chinaRuleIds = ['inflation', 'margin_balance']
      const chinaRules = GLOBAL_CATEGORIES.filter(c => chinaRuleIds.includes(c.id))
      const chinaCats = buildIndicatorCategories(chinaIndicatorSeries, chinaRules)

      const globalRules = GLOBAL_CATEGORIES.filter(c => !chinaRuleIds.includes(c.id))
      const globalCats = buildIndicatorCategories(globalIndicatorSeries, globalRules)

      const catsById = new Map<string, IndicatorCategory>()
      globalCats.forEach(c => catsById.set(c.id, c))
      chinaCats.forEach(c => catsById.set(c.id, c))
      return GLOBAL_CATEGORIES
        .map(rule => catsById.get(rule.id))
        .filter((c): c is IndicatorCategory => !!c)
    },
    [globalIndicatorSeries, chinaIndicatorSeries]
  )

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          市场指标
        </h2>
      </div>
      {globalCategories.length > 0 || fearGreedSeries ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {globalCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
          {fearGreedSeries && (
            <FearGreedCard series={fearGreedSeries} />
          )}
        </div>
      ) : (
        <div className="text-gray-500 text-center py-8">暂无指标数据</div>
      )}
    </div>
  )
}

export default MarketIndicators
