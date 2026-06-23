import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw, Target, Activity, MessageSquare, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { LineChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  useEtfData,
  GLOBAL_CATEGORIES,
  buildIndicatorCategories
} from '../hooks/useEtfData'
import { IndicatorSeries, IndicatorCategory } from '../types'
import { formatPercent, getChangeColor } from '../utils/formatters'
import { FearGreedSeries } from '../types'
import { useEtfNotes } from '../hooks/useEtfNotes'
import { NoteItem } from '../components/NoteItem'

// --- 通用辅助函数 ---

const formatShortDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const year = date.getFullYear().toString().slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}

// 根据 indicator_id 判断格式化规则
const formatValue = (value: number | null, indicatorId: string): string => {
  if (value === null || value === undefined) return '--'
  const u = indicatorId.toUpperCase()
  // 国债收益率
  if (u.startsWith('DGS') || u.includes('TREASURY')) {
    return value.toFixed(2) + '%'
  }
  // 美元指数
  if (u === 'DXY' || u.startsWith('DTWEX') || u === 'DOLLAR_INDEX') {
    return value.toFixed(2)
  }
  // 黄金
  if (u === 'GOLD' || u === 'XAU') {
    return '$' + value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }
  // 白银
  if (u === 'SILVER' || u === 'XAG') {
    return '$' + value.toFixed(2)
  }
  // 比特币
  if (u.includes('BTC') || u.includes('BITCOIN')) {
    return '$' + value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }
  // 油价
  if (u.includes('CRUDE') || u.includes('BRENT') || u.includes('WTI') || u.includes('OIL')) {
    return '$' + value.toFixed(2)
  }
  // 人民币汇率
  if (u.includes('CNY') || u.includes('EXCHANGE') || u.includes('RMB')) {
    return value.toFixed(4)
  }
  // A股成交量
  if (u.includes('STOCK_MARKET_VOLUME') || u.includes('VOLUME') || u.includes('A股')) {
    // 按万亿/亿/万 分级显示
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

// 计算金银比值辅助函数
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

// --- 多指标曲线图（支持叠加展示） ---

// 系列颜色配置
const SERIES_COLORS = ['#2563eb', '#dc2626', '#16a34a', '#f59e0b', '#7c3aed', '#ec4899']

interface MultiChartProps {
  seriesList: IndicatorSeries[]
  baseColor: string
  days?: number
}

const MultiChart: React.FC<MultiChartProps> = ({ seriesList, baseColor, days = 90 }) => {
  // 合并所有时间序列数据，对齐日期
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

// --- 恐贪指数卡片 ---
const FearGreedCard: React.FC<{ series: FearGreedSeries }> = ({ series }) => {
  const latestValue = series.latest_value ?? 0
  const classification = series.latest_classification || ''
  const upperClassification = classification.toUpperCase()

  // 根据 classification 确定颜色（贪婪=红/橙，中性=黄/绿，恐惧=蓝/紫）
  let color = '#6b7280'
  if (upperClassification.includes('EXTREME') && upperClassification.includes('GREED')) {
    color = '#dc2626' // 深红
  } else if (upperClassification.includes('GREED') && !upperClassification.includes('FEAR')) {
    color = '#ea580c' // 橙红
  } else if (upperClassification.includes('NEUTRAL') || classification === '中性') {
    color = '#059669' // 绿
  } else if (upperClassification.includes('EXTREME') && upperClassification.includes('FEAR')) {
    color = '#2563eb' // 深蓝
  } else if (upperClassification.includes('FEAR')) {
    color = '#7c3aed' // 紫
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
      {/* 顶部：标题 */}
      <div className="flex items-center justify-between mb-3">
        <div className="font-bold" style={{ color }}>
          恐贪指数
        </div>
        <div className="text-xs text-gray-400">{series.latest_date}</div>
      </div>

      {/* 数值与分类 */}
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

      {/* 0-100 分级条 */}
      <div className="relative mb-3 mt-1">
        <div className="h-2 rounded-full overflow-hidden" style={{
          background: 'linear-gradient(to right, #2563eb, #7c3aed, #059669, #ea580c, #dc2626)'
        }} />
        {/* 指针 */}
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

      {/* 走势图 */}
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

// --- 单个类别卡片（支持多选叠加展示） ---

interface CategoryCardProps {
  category: IndicatorCategory
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  // 初始化选中的 indicators：默认只选中一个（默认指标），点击标签可切换
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const defaultId = category.default_indicator_id || category.members[0]?.indicator_id
    return defaultId ? [defaultId] : []
  })

  const selectedSeries = useMemo(
    () => category.members.filter(m => selectedIds.includes(m.indicator_id)),
    [category, selectedIds]
  )

  if (selectedSeries.length === 0) return null

  // 处理指标切换
  const toggleIndicator = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        // 至少保留一个选中
        if (prev.length === 1) return prev
        return prev.filter(i => i !== id)
      }
      return [...prev, id]
    })
  }

  // 计算金银比值（仅在贵金属类别且同时有黄金和白银时显示）
  const goldSilverRatio = category.id === 'precious_metals' ? calculateGoldSilverRatio(selectedSeries) : null

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
      style={{ borderTop: `3px solid ${category.color}` }}
    >
      {/* 顶部：类别名 + 多选标签 */}
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

      {/* 多个指标的最新值 */}
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
        
        {/* 金银比值 */}
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

      {/* 多指标叠加曲线图 */}
      <MultiChart seriesList={selectedSeries} baseColor={category.color} />

      {/* 更新时间 */}
      {selectedSeries[0]?.latest_date && (
        <div className="text-xs text-gray-400 mt-1 text-right">
          更新于 {selectedSeries[0].latest_date}
        </div>
      )}
    </div>
  )
}

// --- 主组件 ---

const EtfBoard: React.FC = () => {
  const navigate = useNavigate()
  const {
    etfs,
    globalIndicatorSeries,
    chinaIndicatorSeries,
    fearGreedSeries,
    latestDate,
    loading,
    error,
    refresh
  } = useEtfData()

  // 按操作信号排序：减仓/卖出 > 加仓/买入 > 观望
  const getActionPriority = (action: string | null | undefined): number => {
    if (!action) return 3
    const act = action.toLowerCase()
    if (act.includes('卖出') || act.includes('减仓') || act.includes('sell') || act.includes('bear')) return 1
    if (act.includes('买入') || act.includes('加仓') || act.includes('buy') || act.includes('bull')) return 2
    return 3
  }

  // 是否展开观望的ETF
  const [showAll, setShowAll] = useState(false)

  // 搜索关键词
  const [searchText, setSearchText] = useState('')

  const { sellEtfs, buyEtfs, watchEtfs } = useMemo(() => {
    const sorted = [...etfs].sort((a, b) => {
      const priorityA = getActionPriority(a.latest_signal?.action)
      const priorityB = getActionPriority(b.latest_signal?.action)
      return priorityA - priorityB
    })
    return {
      sellEtfs: sorted.filter(e => getActionPriority(e.latest_signal?.action) === 1),
      buyEtfs: sorted.filter(e => getActionPriority(e.latest_signal?.action) === 2),
      watchEtfs: sorted.filter(e => getActionPriority(e.latest_signal?.action) === 3)
    }
  }, [etfs])

  // 根据搜索关键词过滤 ETF（模糊匹配名称或代码）
  const filteredSellEtfs = useMemo(() => {
    if (!searchText.trim()) return sellEtfs
    const kw = searchText.toLowerCase()
    return sellEtfs.filter(e =>
      (e.name && e.name.toLowerCase().includes(kw)) ||
      (e.symbol && e.symbol.toLowerCase().includes(kw))
    )
  }, [sellEtfs, searchText])

  const filteredBuyEtfs = useMemo(() => {
    if (!searchText.trim()) return buyEtfs
    const kw = searchText.toLowerCase()
    return buyEtfs.filter(e =>
      (e.name && e.name.toLowerCase().includes(kw)) ||
      (e.symbol && e.symbol.toLowerCase().includes(kw))
    )
  }, [buyEtfs, searchText])

  const filteredWatchEtfs = useMemo(() => {
    if (!searchText.trim()) return watchEtfs
    const kw = searchText.toLowerCase()
    return watchEtfs.filter(e =>
      (e.name && e.name.toLowerCase().includes(kw)) ||
      (e.symbol && e.symbol.toLowerCase().includes(kw))
    )
  }, [watchEtfs, searchText])
  // 通胀类别单独从中国数据构建，避免与 FRED 基准指数（CPIAUCSL/PPIACO）混合
  const globalCategories = useMemo(
    () => {
      const nonInflationRules = GLOBAL_CATEGORIES.filter(c => c.id !== 'inflation')
      const nonInflationCats = buildIndicatorCategories(globalIndicatorSeries, nonInflationRules)

      // 通胀类别从 chinaIndicatorSeries 构建，只取中国 CPI/PPI/CORE_CPI 数据
      const inflationRules = GLOBAL_CATEGORIES.filter(c => c.id === 'inflation')
      const inflationCats = buildIndicatorCategories(chinaIndicatorSeries, inflationRules)

      // 按原始顺序合并
      const catsById = new Map<string, IndicatorCategory>()
      nonInflationCats.forEach(c => catsById.set(c.id, c))
      inflationCats.forEach(c => catsById.set(c.id, c))
      return GLOBAL_CATEGORIES
        .map(rule => catsById.get(rule.id))
        .filter((c): c is IndicatorCategory => !!c)
    },
    [globalIndicatorSeries, chinaIndicatorSeries]
  )

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const getActionColor = (action: string | null | undefined) => {
    if (!action) return 'bg-gray-100 text-gray-600'
    const act = action.toLowerCase()
    if (act.includes('买入') || act.includes('买') || act.includes('buy') || act.includes('bull')) {
      return 'bg-red-100 text-red-600'
    }
    if (act.includes('卖出') || act.includes('卖') || act.includes('sell') || act.includes('bear')) {
      return 'bg-green-100 text-green-600'
    }
    return 'bg-blue-100 text-blue-600'
  }

  const getValuationColor = (valuation: string | null | undefined) => {
    if (!valuation) return 'bg-gray-100 text-gray-600'
    const v = valuation.toLowerCase()
    if (v.includes('极度低估') || v.includes('低估') || v.includes('低')) {
      return 'bg-green-100 text-green-600'
    }
    if (v.includes('极度高估') || v.includes('高估') || v.includes('高')) {
      return 'bg-red-100 text-red-600'
    }
    if (v.includes('正常') || v.includes('适中')) {
      return 'bg-yellow-100 text-yellow-600'
    }
    return 'bg-gray-100 text-gray-600'
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-gray-500 text-lg">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 text-lg">错误: {error}</div>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          重试
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 顶部导航 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ETF监测看板</h1>
            {latestDate && (
              <p className="text-sm text-gray-500 mt-1">数据更新至：{formatDate(latestDate)}</p>
            )}
          </div>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          刷新
        </button>
      </div>

      {/* 市场指标 —— 全球市场指标、恐贪指数与中国宏观指标合并展示 */}
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

      {/* ETF列表 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            关注ETF列表
            <span className="text-sm font-normal text-gray-500">
              （{filteredSellEtfs.length > 0 ? `${filteredSellEtfs.length}卖出` : ''}{filteredBuyEtfs.length > 0 ? `、${filteredBuyEtfs.length}买入` : ''}{filteredWatchEtfs.length > 0 ? `、观望${filteredWatchEtfs.length}` : ''}{searchText.trim() && ` · 共${filteredSellEtfs.length + filteredBuyEtfs.length + filteredWatchEtfs.length}条`}）
            </span>
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              placeholder="搜索名称或代码"
              className="pl-9 pr-3 py-1.5 w-48 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>
        {etfs.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">ETF名称</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 whitespace-nowrap min-w-[80px]">最新价</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">涨跌</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">MA5</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">MA20</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">RSI</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">PE</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">PB</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">估值</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 whitespace-nowrap min-w-[85px]">操作信号</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">触发信号</th>
                </tr>
              </thead>
              <tbody>
                {(showAll ? [...filteredSellEtfs, ...filteredBuyEtfs, ...filteredWatchEtfs] : [...filteredSellEtfs, ...filteredBuyEtfs]).map((etf) => (
                  <tr
                    key={etf.symbol}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/etf/${etf.symbol}`)}
                  >
                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-900">{etf.name || etf.symbol}</div>
                      <div className="text-sm text-gray-500">
                        {etf.symbol}
                        {etf.tracking_index_name && ` · ${etf.tracking_index_name}`}
                        {etf.category && ` [${etf.category}]`}
                        {etf.latest_daily?.trade_date && ` · ${formatDate(etf.latest_daily.trade_date)}`}
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 text-gray-900">
                      {etf.latest_daily?.close !== null && etf.latest_daily?.close !== undefined
                        ? etf.latest_daily.close.toFixed(3)
                        : '--'}
                    </td>
                    <td className={`text-right py-4 px-4 font-semibold ${getChangeColor(etf.latest_daily?.change_pct)}`}>
                      {formatPercent(etf.latest_daily?.change_pct)}
                    </td>
                    <td className="text-right py-4 px-4 text-gray-700">
                      {etf.latest_indicator?.ma5 !== null && etf.latest_indicator?.ma5 !== undefined
                        ? etf.latest_indicator.ma5.toFixed(3)
                        : '--'}
                    </td>
                    <td className="text-right py-4 px-4 text-gray-700">
                      {etf.latest_indicator?.ma20 !== null && etf.latest_indicator?.ma20 !== undefined
                        ? etf.latest_indicator.ma20.toFixed(3)
                        : '--'}
                    </td>
                    <td className="text-right py-4 px-4 text-gray-700">
                      {etf.latest_signal?.rsi !== null && etf.latest_signal?.rsi !== undefined
                        ? etf.latest_signal.rsi.toFixed(1)
                        : (etf.latest_indicator?.rsi6 !== null && etf.latest_indicator?.rsi6 !== undefined
                          ? etf.latest_indicator.rsi6.toFixed(1)
                          : '--')}
                    </td>
                    <td className="text-right py-4 px-4 text-gray-700">
                      {etf.latest_index_valuation?.pe !== null && etf.latest_index_valuation?.pe !== undefined
                        ? etf.latest_index_valuation.pe.toFixed(2)
                        : '--'}
                    </td>
                    <td className="text-right py-4 px-4 text-gray-700">
                      {etf.latest_index_valuation?.pb !== null && etf.latest_index_valuation?.pb !== undefined
                        ? etf.latest_index_valuation.pb.toFixed(2)
                        : '--'}
                    </td>
                    <td className="text-center py-4 px-4">
                      {etf.latest_index_valuation?.valuation ? (
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${getValuationColor(etf.latest_index_valuation.valuation)}`}>
                          {etf.latest_index_valuation.valuation}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">--</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {etf.latest_signal?.action ? (
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${getActionColor(etf.latest_signal.action)}`}>
                          <Target className="h-3 w-3" />
                          {etf.latest_signal.action}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">--</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        {etf.latest_signal?.buy_signals && etf.latest_signal.buy_signals.length > 0 && (
                          <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                            买入信号({etf.latest_signal.buy_count || 0}): {etf.latest_signal.buy_signals}
                          </div>
                        )}
                        {etf.latest_signal?.sell_signals && etf.latest_signal.sell_signals.length > 0 && (
                          <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                            卖出信号({etf.latest_signal.sell_count || 0}): {etf.latest_signal.sell_signals}
                          </div>
                        )}
                        {(!etf.latest_signal?.buy_signals || etf.latest_signal.buy_signals.length === 0) &&
                         (!etf.latest_signal?.sell_signals || etf.latest_signal.sell_signals.length === 0) && (
                          <span className="text-gray-400 text-sm">--</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
            {filteredWatchEtfs.length > 0 && (
              <div className="flex justify-center mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowAll(prev => !prev)}
                  className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                  title={showAll ? '收起观望' : `展开观望(${filteredWatchEtfs.length})`}
                >
                  {showAll ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-500 text-center py-8">暂无ETF数据，请先在Supabase的etf_info表中添加关注的ETF</div>
        )}
      </div>

      {/* 笔记模块 */}
      <NotesBoard />

    </div>
  )
}

// --- 笔记看板组件 ---
function NotesBoard() {
  const { etfs } = useEtfData()
  const { notes, loading, addNote, updateNote, deleteNote } = useEtfNotes()
  const [input, setInput] = useState('')
  const [symbolInput, setSymbolInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 构建 ETF code -> 中文名 的映射
  const etfNameMap = useMemo(() => {
    const m = new Map<string, string>()
    etfs.forEach(e => {
      if (e.symbol && e.name) m.set(e.symbol, e.name)
    })
    return m
  }, [etfs])

  const getEtfDisplayName = (symbol: string) => {
    if (symbol === 'GENERAL') return '通用'
    return etfNameMap.get(symbol) || symbol
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    const symbol = symbolInput.trim().toUpperCase()
    setSubmitting(true)
    try {
      await addNote(symbol || 'GENERAL', text)
      setInput('')
      setSymbolInput('')
    } catch {
      // error already logged
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-blue-500" />
        笔记
      </h2>

      {/* 快速添加 */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={symbolInput}
          onChange={e => setSymbolInput(e.target.value)}
          placeholder="ETF代码（可选）"
          className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="写下笔记..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={submitting || !input.trim()}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg text-sm transition-colors"
        >
          添加
        </button>
      </form>

      {/* 历史笔记（倒序） */}
      {loading ? (
        <div className="text-sm text-gray-400 py-4 text-center">加载中...</div>
      ) : notes.length === 0 ? (
        <div className="text-sm text-gray-400 py-4 text-center">暂无笔记</div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {notes.map(note => (
            <NoteItem
              key={note.id}
              note={note}
              etfName={getEtfDisplayName(note.symbol)}
              onUpdate={updateNote}
              onDelete={deleteNote}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default EtfBoard
