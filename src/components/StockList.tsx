import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { StockWithQuote } from '../types'
import { formatPercent, formatPrice, formatValuation, getChangeColor } from '../utils/formatters'

interface StockListProps {
  stocks: StockWithQuote[]
}

function getMarketType(stockCode: string): 'us' | 'hk' | 'cn' {
  const code = stockCode.toUpperCase()
  if (code.endsWith('.US') || code.endsWith('.US_A') || code.endsWith('.NASDAQ') || code.endsWith('.NYSE')) return 'us'
  if (code.endsWith('.HK')) return 'hk'
  return 'cn'
}

function formatMarketCapInYi(value: number, market: 'us' | 'hk' | 'cn'): string {
  let yiValue: number
  if (market === 'cn') {
    yiValue = value
  } else {
    yiValue = value / 1e8
  }
  return yiValue.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

const StockList: React.FC<StockListProps> = ({ stocks }) => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const pageSize = 20

  const totalPages = Math.max(1, Math.ceil(stocks.length / pageSize))
  const currentPage = Math.min(page, totalPages)

  const pagedStocks = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return stocks.slice(start, start + pageSize)
  }, [stocks, currentPage])

  useEffect(() => {
    setPage(1)
  }, [stocks.length])

  const goToPage = (p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)))
  }

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }, [totalPages, currentPage])

  return (
    <div>
      {/* ===== 移动端：卡片列表（< md）。10 列表格在 390px 下必然溢出，改成一卡一支 ===== */}
      <div className="md:hidden -mx-1">
        {pagedStocks.map((stock) => {
          const q = stock.latest_quote
          const v = stock.latest_valuation
          const cap = v?.total_market_cap
          return (
            <div
              key={stock.stock_code}
              onClick={() => navigate(`/company/${stock.stock_code}`)}
              className="mx-1 mb-2 px-3 py-3 bg-white rounded-xl border border-gray-200 active:bg-gray-50"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-900 text-[15px] leading-tight truncate">
                    {stock.stock_name}
                  </div>
                  <div className="mt-0.5 text-[11px] text-gray-500 tnum">
                    {stock.stock_code}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[17px] font-semibold text-gray-900 tnum leading-tight">
                    {formatPrice(q?.close_price)}
                  </div>
                  <div className={`mt-0.5 text-[12px] font-semibold tnum ${getChangeColor(q?.pct_change)}`}>
                    {formatPercent(q?.pct_change)}
                  </div>
                </div>
              </div>

              {/* 四个周期涨跌 */}
              <div className="mt-2.5 grid grid-cols-4 gap-1">
                {([
                  ['1日', q?.pct_change],
                  ['5日', q?.pct_change_5d],
                  ['20日', q?.pct_change_20d],
                  ['60日', q?.pct_change_60d],
                ] as const).map(([label, val]) => (
                  <div key={label} className="min-w-0">
                    <div className="text-[10px] text-gray-400 leading-none">{label}</div>
                    <div className={`mt-1 text-[12px] font-medium tnum leading-none ${getChangeColor(val)}`}>
                      {formatPercent(val)}
                    </div>
                  </div>
                ))}
              </div>

              {/* 估值 */}
              <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center gap-3 text-[11px] text-gray-500">
                <span>PE <b className="font-medium text-gray-700 tnum">{formatValuation(v?.pe_ttm)}</b></span>
                <span>PB <b className="font-medium text-gray-700 tnum">
                  {v?.pb != null && v.pb > 0 ? formatValuation(v.pb) : '--'}
                </b></span>
                <span className="ml-auto">市值 <b className="font-medium text-gray-700 tnum">
                  {cap == null ? '--' : formatMarketCapInYi(cap, getMarketType(stock.stock_code))}
                </b></span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ===== 桌面端：表格（≥ md，与原实现一致） ===== */}
      <div className="hidden md:block overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">股票名称</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-700">最新价</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-700">1日</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-700">5日</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-700">10日</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-700">20日</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-700">60日</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-700">PE(TTM)</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-700">PB</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-700">
              总市值
              <span className="block text-xs font-normal text-gray-400 mt-0.5">A股:亿人民币 · 美股:亿美元 · 港股:亿港元</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {pagedStocks.map((stock) => (
            <tr
              key={stock.stock_code}
              onClick={() => navigate(`/company/${stock.stock_code}`)}
              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="py-4 px-4">
                <div className="font-semibold text-gray-900">{stock.stock_name}</div>
                <div className="text-sm text-gray-500">{stock.stock_code}</div>
              </td>
              <td className="text-right py-4 px-4 text-gray-900">
                {formatPrice(stock.latest_quote?.close_price)}
              </td>
              <td className={`text-right py-4 px-4 font-semibold ${getChangeColor(stock.latest_quote?.pct_change)}`}>
                {formatPercent(stock.latest_quote?.pct_change)}
              </td>
              <td className={`text-right py-4 px-4 ${getChangeColor(stock.latest_quote?.pct_change_5d)}`}>
                {formatPercent(stock.latest_quote?.pct_change_5d)}
              </td>
              <td className={`text-right py-4 px-4 ${getChangeColor(stock.latest_quote?.pct_change_10d)}`}>
                {formatPercent(stock.latest_quote?.pct_change_10d)}
              </td>
              <td className={`text-right py-4 px-4 ${getChangeColor(stock.latest_quote?.pct_change_20d)}`}>
                {formatPercent(stock.latest_quote?.pct_change_20d)}
              </td>
              <td className={`text-right py-4 px-4 ${getChangeColor(stock.latest_quote?.pct_change_60d)}`}>
                {formatPercent(stock.latest_quote?.pct_change_60d)}
              </td>
              <td className="text-right py-4 px-4 text-gray-700">
                {formatValuation(stock.latest_valuation?.pe_ttm)}
              </td>
              <td className="text-right py-4 px-4 text-gray-700">
                {/* PB 为 0 无意义（港股新股常见），按缺失显示 */}
                {stock.latest_valuation?.pb != null && stock.latest_valuation.pb > 0
                  ? formatValuation(stock.latest_valuation.pb)
                  : '--'}
              </td>
              <td className="text-right py-4 px-4 text-gray-700">
                {(() => {
                  const cap = stock.latest_valuation?.total_market_cap
                  if (cap == null) return '--'
                  const market = getMarketType(stock.stock_code)
                  return formatMarketCapInYi(cap, market)
                })()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {stocks.length > pageSize && (
        <>
          {/* 移动端分页：只保留上一页 / 页码 / 下一页 */}
          <div className="md:hidden flex items-center justify-between gap-3 mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500 tnum">第 {currentPage} / {totalPages} 页</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-10 px-4 rounded-lg border border-gray-200 text-sm text-gray-700 active:bg-gray-100 disabled:text-gray-300 disabled:border-gray-100"
              >
                上一页
              </button>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-10 px-4 rounded-lg border border-gray-200 text-sm text-gray-700 active:bg-gray-100 disabled:text-gray-300 disabled:border-gray-100"
              >
                下一页
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            共 {stocks.length} 条，第 {currentPage} / {totalPages} 页
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-8 h-8 rounded-md text-gray-600 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {pageNumbers.map((p, idx) => (
              typeof p === 'number' ? (
                <button
                  key={idx}
                  onClick={() => goToPage(p)}
                  className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                    p === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ) : (
                <span key={idx} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">
                  {p}
                </span>
              )
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center w-8 h-8 rounded-md text-gray-600 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        </>
      )}
    </div>
  )
}

export default StockList
