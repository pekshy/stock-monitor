import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RefreshCw, Target, Globe, Activity, TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useEtfData, PRIORITY_INDICATORS } from '../hooks/useEtfData'
import { IndicatorSeries } from '../types'
import { formatPercent, getChangeColor } from '../utils/formatters'

// 指标显示名称映射
const INDICATOR_LABELS: Record<string, string> = {
  'DXY': '美元指数 (DXY)',
  'DTWEXBGS': '美元指数 (广义)',
  'DTWEXM': '美元指数 (主要货币)',
  'DTWEXO': '美元指数 (其他重要贸易伙伴)',
  'DGS1MO': '1个月美国国债收益率',
  'DGS3MO': '3个月美国国债收益率',
  'DGS6MO': '6个月美国国债收益率',
  'DGS1': '1年期美国国债收益率',
  'DGS2': '2年期美国国债收益率',
  'DGS5': '5年期美国国债收益率',
  'DGS7': '7年期美国国债收益率',
  'DGS10': '10年期美国国债收益率',
  'DGS20': '20年期美国国债收益率',
  'DGS30': '30年期美国国债收益率',
  'GOLD': '黄金价格',
  'XAU': '黄金 (XAU)',
  'SILVER': '白银价格',
  'XAG': '白银 (XAG)',
  'BTC': '比特币 (BTC)',
  'BITCOIN': '比特币',
  'BTCUSD': '比特币/美元'
}

const getIndicatorLabel = (id: string) => INDICATOR_LABELS[id] || id

// 格式化日期，仅显示 月-日
const formatShortDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}-${day}`
}

// 格式化数值显示
const formatValue = (value: number | null, indicatorId: string): string => {
  if (value === null || value === undefined) return '--'
  // 国债收益率使用百分比显示
  if (indicatorId.startsWith('DGS')) {
    return value.toFixed(2) + '%'
  }
  // 美元指数
  if (indicatorId.startsWith('DXY') || indicatorId.startsWith('DTWEX')) {
    return value.toFixed(2)
  }
  // 黄金
  if (indicatorId === 'GOLD' || indicatorId === 'XAU') {
    return '$' + value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }
  // 白银
  if (indicatorId === 'SILVER' || indicatorId === 'XAG') {
    return '$' + value.toFixed(2)
  }
  // 比特币
  if (indicatorId === 'BTC' || indicatorId === 'BITCOIN' || indicatorId === 'BTCUSD') {
    return '$' + value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

// 为图表颜色分组：利率一组、美元指数一组、黄金/白银一组、比特币一组
const getSeriesColor = (indicatorId: string): string => {
  if (indicatorId.startsWith('DGS')) return '#f59e0b'
  if (indicatorId.startsWith('DXY') || indicatorId.startsWith('DTWEX')) return '#3b82f6'
  if (indicatorId === 'GOLD' || indicatorId === 'XAU') return '#eab308'
  if (indicatorId === 'SILVER' || indicatorId === 'XAG') return '#94a3b8'
  if (indicatorId === 'BTC' || indicatorId === 'BITCOIN' || indicatorId === 'BTCUSD') return '#f97316'
  return '#10b981'
}

// 单个指标曲线图组件
interface IndicatorChartProps {
  series: IndicatorSeries
  color: string
}

const IndicatorChart: React.FC<IndicatorChartProps> = ({ series, color }) => {
  // 最多展示近365个数据点，避免图表过于密集
  const data = series.history.slice(-365).map(h => ({
    date: formatShortDate(h.date),
    value: h.value
  }))

  // 计算最新值变化
  const changeInfo = (() => {
    if (series.history.length < 2) return { change: 0, changePct: 0 }
    const latest = series.history[series.history.length - 1].value
    const prev = series.history[series.history.length - 2].value
    const change = latest - prev
    const changePct = prev !== 0 ? (change / prev) * 100 : 0
    return { change, changePct, latest }
  })()

  const changeClass = changeInfo.changePct > 0 ? 'text-red-600' : changeInfo.changePct < 0 ? 'text-green-600' : 'text-gray-600'
  const arrowClass = changeInfo.changePct > 0 ? 'text-red-600' : changeInfo.changePct < 0 ? 'text-green-600' : 'text-gray-600'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            {series.indicator_id}
          </div>
          <div className="text-sm font-semibold text-gray-800 mt-0.5">
            {getIndicatorLabel(series.indicator_id)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">
            {formatValue(series.latest_value, series.indicator_id)}
          </div>
          {changeInfo.changePct !== 0 && (
            <div className={`text-xs font-medium ${changeClass} flex items-center justify-end gap-0.5 mt-0.5`}>
              <TrendingUp className={`h-3 w-3 ${arrowClass}`} style={{ transform: changeInfo.changePct < 0 ? 'rotate(180deg)' : 'none' }} />
              {changeInfo.changePct > 0 ? '+' : ''}{changeInfo.changePct.toFixed(2)}%
            </div>
          )}
        </div>
      </div>

      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 2, right: 4, left: 0, bottom: 2 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="date"
              tick={false}
              axisLine={false}
              tickLine={false}
              minTickGap={10}
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
                padding: '8px 12px'
              }}
              formatter={(value: number) => [formatValue(value, series.indicator_id), '']}
              labelFormatter={(label) => label}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3, stroke: color, strokeWidth: 1, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {series.latest_date && (
        <div className="text-xs text-gray-400 mt-2 text-right">
          更新于 {series.latest_date}
        </div>
      )}
    </div>
  )
}

const EtfBoard: React.FC = () => {
  const { etfs, chinaIndicatorSeries, globalIndicatorSeries, latestDate, loading, error, refresh } = useEtfData()

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

  // 从全球指标中筛选优先级高的指标（美元指数、美债利率、黄金、白银、比特币）
  const priorityIndicatorIds = PRIORITY_INDICATORS.map(id => id.toUpperCase())

  // 优先展示优先级高的指标；若优先级指标未找到，则按字母排序展示其他
  const sortedGlobalSeries = [...globalIndicatorSeries].sort((a, b) => {
    const aPriority = priorityIndicatorIds.indexOf(a.indicator_id.toUpperCase())
    const bPriority = priorityIndicatorIds.indexOf(b.indicator_id.toUpperCase())
    if (aPriority === -1 && bPriority === -1) return a.indicator_id.localeCompare(b.indicator_id)
    if (aPriority === -1) return 1
    if (bPriority === -1) return -1
    return aPriority - bPriority
  })

  const displayGlobalSeries = sortedGlobalSeries.slice(0, 12)
  const displayChinaSeries = chinaIndicatorSeries.slice(0, 6)

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

      {/* 全球市场指标曲线模块 */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          全球市场指标（美元指数、美债利率、黄金、白银、比特币）
        </h2>
        {displayGlobalSeries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayGlobalSeries.map((series) => (
              <IndicatorChart
                key={series.indicator_id}
                series={series}
                color={getSeriesColor(series.indicator_id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">暂无全球市场指标数据</div>
        )}
      </div>

      {/* 中国宏观指标曲线模块 */}
      <div className="bg-gradient-to-br from-slate-50 to-red-50 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-red-600" />
          中国宏观指标
        </h2>
        {displayChinaSeries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayChinaSeries.map((series) => (
              <IndicatorChart
                key={series.indicator_id}
                series={series}
                color="#10b981"
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">暂无中国宏观指标数据</div>
        )}
      </div>

      {/* ETF列表 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-green-500" />
          关注ETF列表
        </h2>
        {etfs.length > 0 ? (
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
                {etfs.map((etf) => (
                  <tr
                    key={etf.symbol}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
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
        ) : (
          <div className="text-gray-500 text-center py-8">暂无ETF数据，请先在Supabase的etf_info表中添加关注的ETF</div>
        )}
      </div>
    </div>
  )
}

export default EtfBoard
