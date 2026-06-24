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
      <div className="overflow-x-auto">
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
              onClick={() => navigate(`/stock/${stock.stock_code}`)}
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
                {formatValuation(stock.latest_valuation?.pb)}
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
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
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
      )}
    </div>
  )
}

export default StockList
