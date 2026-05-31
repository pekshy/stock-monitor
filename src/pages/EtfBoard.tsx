import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RefreshCw, Target, Globe, BarChart2, Activity } from 'lucide-react'
import { useEtfData } from '../hooks/useEtfData'
import { formatPercent, formatValuation, getChangeColor } from '../utils/formatters'

const EtfBoard: React.FC = () => {
  const { etfs, chinaIndicators, fredIndicators, latestDate, loading, error, refresh } = useEtfData()

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const getSignalColor = (signalType: string | null | undefined) => {
    if (!signalType) return 'bg-gray-100 text-gray-600'
    const type = signalType.toLowerCase()
    if (type.includes('买入') || type.includes('买') || type.includes('bull') || type.includes('buy')) {
      return 'bg-red-100 text-red-600'
    }
    if (type.includes('卖出') || type.includes('卖') || type.includes('bear') || type.includes('sell')) {
      return 'bg-green-100 text-green-600'
    }
    return 'bg-blue-100 text-blue-600'
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500" />
            中国宏观指标
          </h2>
          {chinaIndicators.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {chinaIndicators.slice(0, 6).map((ind, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500">{ind.indicator_name}</div>
                  <div className="text-xl font-bold text-gray-900 mt-1">
                    {ind.value !== null ? ind.value : '--'}
                    <span className="text-sm font-normal text-gray-500 ml-1">{ind.unit || ''}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{formatDate(ind.value_date)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">暂无中国宏观指标数据</div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-500" />
            FRED美国指标
          </h2>
          {fredIndicators.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {fredIndicators.slice(0, 6).map((ind, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500">{ind.indicator_name}</div>
                  <div className="text-xl font-bold text-gray-900 mt-1">
                    {ind.value !== null ? ind.value : '--'}
                    <span className="text-sm font-normal text-gray-500 ml-1">{ind.unit || ''}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{formatDate(ind.value_date)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">暂无FRED指标数据</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-green-500" />
          关注ETF列表
        </h2>
        {etfs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">ETF名称</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">最新价</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">1日</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">5日</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">PE</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">PB</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">股息率</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">交易信号</th>
                </tr>
              </thead>
              <tbody>
                {etfs.map((etf) => (
                  <tr
                    key={etf.etf_code}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-900">{etf.etf_name}</div>
                      <div className="text-sm text-gray-500">
                        {etf.etf_code}
                        {etf.index_name && ` · ${etf.index_name}`}
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 text-gray-900">
                      {etf.latest_daily?.close !== null && etf.latest_daily?.close !== undefined
                        ? etf.latest_daily.close.toFixed(3)
                        : '--'}
                    </td>
                    <td className={`text-right py-4 px-4 font-semibold ${getChangeColor(etf.latest_daily?.pct_change)}`}>
                      {formatPercent(etf.latest_daily?.pct_change)}
                    </td>
                    <td className={`text-right py-4 px-4 ${getChangeColor(etf.latest_daily?.pct_change_5d)}`}>
                      {formatPercent(etf.latest_daily?.pct_change_5d)}
                    </td>
                    <td className="text-right py-4 px-4 text-gray-700">
                      {formatValuation(etf.latest_indicator?.pe)}
                    </td>
                    <td className="text-right py-4 px-4 text-gray-700">
                      {formatValuation(etf.latest_indicator?.pb)}
                    </td>
                    <td className="text-right py-4 px-4 text-gray-700">
                      {etf.latest_indicator?.dividend_yield !== null && etf.latest_indicator?.dividend_yield !== undefined
                        ? `${etf.latest_indicator.dividend_yield.toFixed(2)}%`
                        : '--'}
                    </td>
                    <td className="text-center py-4 px-4">
                      {etf.latest_signal ? (
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${getSignalColor(etf.latest_signal.signal_type)}`}>
                          <Target className="h-3 w-3" />
                          {etf.latest_signal.signal_type || '--'}
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
        ) : (
          <div className="text-gray-500 text-center py-8">暂无ETF数据，请先在Supabase的etf_info表中添加关注的ETF</div>
        )}
      </div>
    </div>
  )
}

export default EtfBoard
