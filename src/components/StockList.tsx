import React from 'react'
import { useNavigate } from 'react-router-dom'
import { StockWithQuote } from '../types'
import { formatPercent, formatPrice, formatValuation, formatMarketCap, getChangeColor } from '../utils/formatters'

interface StockListProps {
  stocks: StockWithQuote[]
}

const StockList: React.FC<StockListProps> = ({ stocks }) => {
  const navigate = useNavigate()

  return (
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
            <th className="text-right py-3 px-4 font-semibold text-gray-700">总市值</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
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
                {formatMarketCap(stock.latest_valuation?.total_market_cap)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StockList
