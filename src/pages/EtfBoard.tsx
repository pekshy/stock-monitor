import React, { useMemo, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Target, ChevronDown, ChevronUp, Search, TrendingUp, Star } from 'lucide-react'
import { useEtfContext } from '../context/EtfContext'
import { usePersistentState } from '../hooks/usePersistentState'
import { formatPercent, getChangeColor } from '../utils/formatters'

const EtfListOnly: React.FC = memo(() => {
  const navigate = useNavigate()
  const {
    etfs,
    momentumSignals,
    loading,
    error,
    refresh,
    toggleFocus
  } = useEtfContext()

  const getActionPriority = (action: string | null | undefined): number => {
    if (!action) return 3
    const act = action.toLowerCase()
    if (act.includes('卖出') || act.includes('减仓') || act.includes('sell') || act.includes('bear')) return 1
    if (act.includes('买入') || act.includes('加仓') || act.includes('buy') || act.includes('bull')) return 2
    return 3
  }

  const [showAll, setShowAll] = usePersistentState('etf_filter_showAll', false)
  const [searchText, setSearchText] = usePersistentState('etf_filter_searchText', '')
  const [focusFilter, setFocusFilter] = usePersistentState<'all' | 'focused'>('etf_filter_focusFilter', 'all')
  const [signalFilter, setSignalFilter] = usePersistentState<'all' | 'sell' | 'buy' | 'watch'>('etf_filter_signalFilter', 'all')
  const [categoryFilter, setCategoryFilter] = usePersistentState<string>('etf_filter_categoryFilter', 'all')

  const categories = useMemo(() => {
    const cats = [...new Set(etfs.map(e => e.strategy_type).filter((c): c is string => c !== null && c !== undefined))].sort()
    return ['all', ...cats]
  }, [etfs])

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

  const filteredSellEtfs = useMemo(() => {
    if (signalFilter !== 'all' && signalFilter !== 'sell') return []
    let list = sellEtfs
    if (focusFilter === 'focused') {
      list = list.filter(e => e.is_focused)
    }
    if (categoryFilter !== 'all') {
      list = list.filter(e => e.strategy_type === categoryFilter)
    }
    if (!searchText.trim()) return list
    const kw = searchText.toLowerCase()
    return list.filter(e =>
      (e.name && e.name.toLowerCase().includes(kw)) ||
      (e.symbol && e.symbol.toLowerCase().includes(kw))
    )
  }, [sellEtfs, searchText, focusFilter, signalFilter, categoryFilter])

  const filteredBuyEtfs = useMemo(() => {
    if (signalFilter !== 'all' && signalFilter !== 'buy') return []
    let list = buyEtfs
    if (focusFilter === 'focused') {
      list = list.filter(e => e.is_focused)
    }
    if (categoryFilter !== 'all') {
      list = list.filter(e => e.strategy_type === categoryFilter)
    }
    if (!searchText.trim()) return list
    const kw = searchText.toLowerCase()
    return list.filter(e =>
      (e.name && e.name.toLowerCase().includes(kw)) ||
      (e.symbol && e.symbol.toLowerCase().includes(kw))
    )
  }, [buyEtfs, searchText, focusFilter, signalFilter, categoryFilter])

  const filteredWatchEtfs = useMemo(() => {
    if (signalFilter !== 'all' && signalFilter !== 'watch') return []
    let list = watchEtfs
    if (focusFilter === 'focused') {
      list = list.filter(e => e.is_focused)
    }
    if (categoryFilter !== 'all') {
      list = list.filter(e => e.strategy_type === categoryFilter)
    }
    if (!searchText.trim()) return list
    const kw = searchText.toLowerCase()
    return list.filter(e =>
      (e.name && e.name.toLowerCase().includes(kw)) ||
      (e.symbol && e.symbol.toLowerCase().includes(kw))
    )
  }, [watchEtfs, searchText, focusFilter, signalFilter, categoryFilter])

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

  const momentumData = useMemo(() => {
    if (!momentumSignals || momentumSignals.length === 0) return null
    const latestDate = momentumSignals[0]?.trade_date
    const latestSignals = momentumSignals.filter(s => s.trade_date === latestDate)
    const selectedSignals = latestSignals.filter(s => s.selected === true)
    const sorted = [...selectedSignals].sort((a, b) => (a.rank || 999) - (b.rank || 999))
    return {
      date: latestDate,
      signals: sorted,
      totalSelected: selectedSignals.length
    }
  }, [momentumSignals])

  const momentumBySymbol = useMemo(() => {
    const map = new Map<string, { final_score: number | null; rank: number | null; prev_score: number | null }>()
    if (!momentumSignals || momentumSignals.length === 0) return map
    // 取最近 5 个唯一交易日（倒序），作为 prev 对比基期
    const uniqueDates = Array.from(new Set(momentumSignals.map(s => s.trade_date))).sort((a, b) => (a < b ? 1 : -1))
    const latestDate = uniqueDates[0]
    const compareDate = uniqueDates[Math.min(4, uniqueDates.length - 1)] || null
    momentumSignals
      .filter(s => s.trade_date === latestDate)
      .forEach(s => {
        const prev = compareDate ? momentumSignals.find(p => p.symbol === s.symbol && p.trade_date === compareDate) : undefined
        map.set(s.symbol, { final_score: s.final_score, rank: s.rank, prev_score: prev?.final_score ?? null })
      })
    return map
  }, [momentumSignals])

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
    <div className="space-y-6">
      {/* 动量评分策略选出的ETF */}
      {momentumData && momentumData.signals.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              动量评分策略
              <span className="text-sm font-normal text-gray-500">
                （{momentumData.date} · 共{momentumData.totalSelected}只入选）
              </span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">排名</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">ETF名称</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">类别</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">最终评分</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">回归评分</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">多周期评分</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">风险调整评分</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">技术评分</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">目标权重</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">风险提示</th>
                </tr>
              </thead>
              <tbody>
                {momentumData.signals.map((signal) => {
                  const etf = etfs.find(e => e.symbol === signal.symbol)
                  return (
                    <tr
                      key={signal.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/etf/${signal.symbol}`)}
                    >
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                          signal.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                          signal.rank === 2 ? 'bg-gray-100 text-gray-600' :
                          signal.rank === 3 ? 'bg-orange-100 text-orange-600' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {signal.rank}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900">{etf?.name || signal.symbol}</div>
                        <div className="text-sm text-gray-500">{signal.symbol}</div>
                      </td>
                      <td className="text-right py-4 px-4 text-gray-600">
                        {signal.category || '--'}
                      </td>
                      <td className={`text-right py-4 px-4 font-semibold ${
                        signal.final_score != null && signal.final_score >= 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {signal.final_score != null ? signal.final_score.toFixed(3) : '--'}
                      </td>
                      <td className="text-right py-4 px-4 text-gray-600">
                        {signal.regression_score != null ? signal.regression_score.toFixed(3) : '--'}
                      </td>
                      <td className="text-right py-4 px-4 text-gray-600">
                        {signal.multi_period_score != null ? signal.multi_period_score.toFixed(3) : '--'}
                      </td>
                      <td className="text-right py-4 px-4 text-gray-600">
                        {signal.risk_adjusted_score != null ? signal.risk_adjusted_score.toFixed(3) : '--'}
                      </td>
                      <td className="text-right py-4 px-4 text-gray-600">
                        {signal.technical_score != null ? signal.technical_score.toFixed(3) : '--'}
                      </td>
                      <td className="text-right py-4 px-4 font-medium text-gray-700">
                        {signal.target_weight != null ? `${(signal.target_weight * 100).toFixed(1)}%` : '--'}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {signal.risk_level && signal.risk_level !== '' && (
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              signal.risk_level === 'HIGH' ? 'bg-red-100 text-red-700' :
                              signal.risk_level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                              signal.risk_level === 'LOW' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {signal.risk_level}
                            </span>
                          )}
                          {signal.risk_description && signal.risk_description !== '' && (
                            <span className="text-xs text-gray-500">{signal.risk_description}</span>
                          )}
                        </div>
                        {signal.risk_r_squared != null && signal.risk_r_squared && (
                          <div className="text-xs text-gray-400 mt-1">
                            R²={signal.r_squared?.toFixed(4)}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setSignalFilter('all')}
                className={`px-3 py-1.5 text-sm transition-colors ${
                  signalFilter === 'all'
                    ? 'bg-gray-700 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setSignalFilter('sell')}
                className={`px-3 py-1.5 text-sm transition-colors border-l border-gray-200 ${
                  signalFilter === 'sell'
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                减仓
              </button>
              <button
                onClick={() => setSignalFilter('buy')}
                className={`px-3 py-1.5 text-sm transition-colors border-l border-gray-200 ${
                  signalFilter === 'buy'
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                加仓
              </button>
              <button
                onClick={() => setSignalFilter('watch')}
                className={`px-3 py-1.5 text-sm transition-colors border-l border-gray-200 ${
                  signalFilter === 'watch'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                观望
              </button>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent cursor-pointer"
            >
              <option value="all">全部大类</option>
              {categories.filter(c => c !== 'all').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              onClick={() => setFocusFilter(focusFilter === 'all' ? 'focused' : 'all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-sm transition-colors ${
                focusFilter === 'focused'
                  ? 'bg-yellow-50 border-yellow-300 text-yellow-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <Star className={`h-3.5 w-3.5 ${focusFilter === 'focused' ? 'fill-current' : ''}`} />
              重点跟踪
            </button>
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
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">5日涨跌</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">价格分位</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">量能分位</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">PE</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">PB</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">趋势信号</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 whitespace-nowrap min-w-[95px]">技术指标建议</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">动量模型评分</th>
                </tr>
              </thead>
              <tbody>
                {(signalFilter !== 'all' || showAll
                  ? [...filteredSellEtfs, ...filteredBuyEtfs, ...filteredWatchEtfs]
                  : [...filteredSellEtfs, ...filteredBuyEtfs]).map((etf) => (
                  <tr
                    key={etf.symbol}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/etf/${etf.symbol}`)}
                  >
                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-900 flex items-center gap-1">
                        {etf.name || etf.symbol}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFocus(etf.symbol)
                          }}
                          className={`p-0.5 rounded transition-colors ${
                            etf.is_focused
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : 'text-gray-300 hover:text-yellow-400'
                          }`}
                          title={etf.is_focused ? '取消重点跟踪' : '设为重点跟踪'}
                        >
                          <Star className={`h-3.5 w-3.5 ${etf.is_focused ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      <div className="text-sm text-gray-500">
                        {etf.symbol}
                        {etf.tracking_index_name && ` · ${etf.tracking_index_name}`}
                        {etf.strategy_type && ` [${etf.strategy_type}]`}
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
                    <td className={`text-right py-4 px-4 font-semibold ${getChangeColor(etf.latest_daily?.change_5d)}`}>
                      {formatPercent(etf.latest_daily?.change_5d)}
                    </td>
                    <td className="text-right py-4 px-4 text-gray-700">
                      {etf.latest_daily?.close_percentile_6m !== null && etf.latest_daily?.close_percentile_6m !== undefined
                        ? (etf.latest_daily.close_percentile_6m * 100).toFixed(1) + '%'
                        : '--'}
                    </td>
                    <td className="text-right py-4 px-4 text-gray-700">
                      {etf.latest_daily?.volume_percentile_6m !== null && etf.latest_daily?.volume_percentile_6m !== undefined
                        ? (etf.latest_daily.volume_percentile_6m * 100).toFixed(1) + '%'
                        : '--'}
                    </td>
                    <td className="text-right py-4 px-4">
                      <div className="text-gray-700">
                        {etf.latest_index_valuation?.pe !== null && etf.latest_index_valuation?.pe !== undefined
                          ? etf.latest_index_valuation.pe.toFixed(2)
                          : '--'}
                      </div>
                      {(etf.latest_index_valuation?.pe_percent !== null && etf.latest_index_valuation?.pe_percent !== undefined) && (
                        <div className={`text-xs mt-0.5 ${
                          etf.latest_index_valuation.pe_percent <= 30 ? 'text-green-600' :
                          etf.latest_index_valuation.pe_percent >= 70 ? 'text-red-600' :
                          'text-gray-500'
                        }`}>
                          {etf.latest_index_valuation.pe_percent.toFixed(1)}%
                        </div>
                      )}
                    </td>
                    <td className="text-right py-4 px-4">
                      <div className="text-gray-700">
                        {etf.latest_index_valuation?.pb !== null && etf.latest_index_valuation?.pb !== undefined
                          ? etf.latest_index_valuation.pb.toFixed(2)
                          : '--'}
                      </div>
                      {(etf.latest_index_valuation?.pb_percent !== null && etf.latest_index_valuation?.pb_percent !== undefined) && (
                        <div className={`text-xs mt-0.5 ${
                          etf.latest_index_valuation.pb_percent <= 30 ? 'text-green-600' :
                          etf.latest_index_valuation.pb_percent >= 70 ? 'text-red-600' :
                          'text-gray-500'
                        }`}>
                          {etf.latest_index_valuation.pb_percent.toFixed(1)}%
                        </div>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {etf.latest_trend_signal ? (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${
                          etf.latest_trend_signal.toUpperCase() === 'BUY' ? 'bg-red-100 text-red-600' :
                          etf.latest_trend_signal.toUpperCase() === 'SELL' ? 'bg-green-100 text-green-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {etf.latest_trend_signal.toUpperCase() === 'BUY' ? '买入' :
                           etf.latest_trend_signal.toUpperCase() === 'SELL' ? '卖出' :
                           '观望'}
                        </span>
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
                    <td className="text-right py-4 px-4">
                      {momentumBySymbol.has(etf.symbol) ? (
                        <div className="flex flex-col items-end">
                          <span className="font-semibold text-gray-900">
                            {momentumBySymbol.get(etf.symbol)!.final_score != null
                              ? momentumBySymbol.get(etf.symbol)!.final_score!.toFixed(2)
                              : '--'}
                          </span>
                          {(() => {
                            const data = momentumBySymbol.get(etf.symbol)!
                            if (data.final_score != null && data.prev_score != null) {
                              const change = data.final_score - data.prev_score
                              if (Math.abs(change) < 0.001) return null
                              return (
                                <span className={`text-xs ${change > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                  {change > 0 ? '+' : ''}{change.toFixed(2)}
                                </span>
                              )
                            }
                            return null
                          })()}
                          {momentumBySymbol.get(etf.symbol)!.rank != null && (
                            <span className="text-xs text-gray-500">
                              #{momentumBySymbol.get(etf.symbol)!.rank}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">--</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
            {filteredWatchEtfs.length > 0 && signalFilter === 'all' && (
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
    </div>
  )
})

export default EtfListOnly
