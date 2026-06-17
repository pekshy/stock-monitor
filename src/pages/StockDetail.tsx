import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Building2, TrendingUp, Star } from 'lucide-react'
import { useStockDetail } from '../hooks/useStockData'
import { useStockContext } from '../context/StockContext'
import PriceChart from '../components/PriceChart'
import {
  formatPercent,
  formatPrice,
  getChangeColor,
} from '../utils/formatters'

function getMarketType(stockCode: string): 'us' | 'hk' | 'cn' {
  const code = stockCode.toUpperCase()
  if (code.endsWith('.US') || code.endsWith('.US_A') || code.endsWith('.NASDAQ') || code.endsWith('.NYSE')) return 'us'
  if (code.endsWith('.HK')) return 'hk'
  return 'cn'
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
          价格走势
        </h3>
        <PriceChart quotes={quotes} />
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
