import React, { useState, useMemo, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useStockContext } from '../context/StockContext'
import { useIndustrySummaries } from '../hooks/useIndustryData'
import { useEtfData } from '../hooks/useEtfData'
import IndustryCard from '../components/IndustryCard'
import StockList from '../components/StockList'
import { StockTradeBoard } from '../components/StockTradeBoard'
import EtfBoardContent from './EtfBoard'

type SortOrder = 'change_desc' | 'change_asc'
type SortPeriod = '1d' | '5d' | '10d' | '20d' | '60d'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { stocks, loading: stockLoading, refresh: refreshStocks } = useStockContext()
  const { latestDate: etfLatestDate, refresh: refreshEtf } = useEtfData()
  const industrySummaries = useIndustrySummaries(stocks)

  const activeTab = location.pathname === '/etf' ? 'etf' : 'stock'

  const switchTab = (tab: 'stock' | 'etf') => {
    if (tab === 'stock') {
      navigate('/')
    } else {
      navigate('/etf')
    }
  }
  
  const [selectedIndustry1, setSelectedIndustry1] = useState<string>(() => {
    return localStorage.getItem('stock_filter_industry1') || 'all'
  })
  const [selectedIndustry2, setSelectedIndustry2] = useState<string>(() => {
    return localStorage.getItem('stock_filter_industry2') || 'all'
  })
  const [selectedMarket, setSelectedMarket] = useState<string>(() => {
    return localStorage.getItem('stock_filter_market') || 'all'
  })
  const [sortPeriod, setSortPeriod] = useState<SortPeriod>(() => {
    return (localStorage.getItem('stock_filter_sortPeriod') as SortPeriod) || '1d'
  })
  const [sortOrder, setSortOrder] = useState<SortOrder>(() => {
    return (localStorage.getItem('stock_filter_sortOrder') as SortOrder) || 'change_desc'
  })

  const saveFilterState = () => {
    localStorage.setItem('stock_filter_industry1', selectedIndustry1)
    localStorage.setItem('stock_filter_industry2', selectedIndustry2)
    localStorage.setItem('stock_filter_market', selectedMarket)
    localStorage.setItem('stock_filter_sortPeriod', sortPeriod)
    localStorage.setItem('stock_filter_sortOrder', sortOrder)
  }

  useEffect(() => {
    saveFilterState()
  }, [selectedIndustry1, selectedIndustry2, selectedMarket, sortPeriod, sortOrder])

  const industry1Options = useMemo(() => {
    const industries = [...new Set(stocks.map(s => s.industry1).filter(Boolean))]
    return ['all', ...industries]
  }, [stocks])

  const industry2Options = useMemo(() => {
    let filtered = stocks
    if (selectedIndustry1 !== 'all') {
      filtered = stocks.filter(s => s.industry1 === selectedIndustry1)
    }
    const industries = [...new Set(filtered.map(s => s.industry2).filter(Boolean))]
    return ['all', ...industries]
  }, [stocks, selectedIndustry1])

  const marketOptions = useMemo(() => {
    let filtered = stocks
    if (selectedIndustry1 !== 'all') {
      filtered = filtered.filter(s => s.industry1 === selectedIndustry1)
    }
    if (selectedIndustry2 !== 'all') {
      filtered = filtered.filter(s => s.industry2 === selectedIndustry2)
    }
    const markets = [...new Set(filtered.map(s => s.market).filter(Boolean))]
    return ['all', ...markets]
  }, [stocks, selectedIndustry1, selectedIndustry2])

  const getChangeValue = (stock: any, period: SortPeriod) => {
    switch (period) {
      case '1d':
        return stock.latest_quote?.pct_change || 0
      case '5d':
        return stock.latest_quote?.pct_change_5d || 0
      case '10d':
        return stock.latest_quote?.pct_change_10d || 0
      case '20d':
        return stock.latest_quote?.pct_change_20d || 0
      case '60d':
        return stock.latest_quote?.pct_change_60d || 0
      default:
        return 0
    }
  }

  const filteredStocks = useMemo(() => {
    let filtered = [...stocks]
    if (selectedIndustry1 !== 'all') {
      filtered = filtered.filter(s => s.industry1 === selectedIndustry1)
    }
    if (selectedIndustry2 !== 'all') {
      filtered = filtered.filter(s => s.industry2 === selectedIndustry2)
    }
    if (selectedMarket !== 'all') {
      filtered = filtered.filter(s => s.market === selectedMarket)
    }
    
    return filtered.sort((a, b) => {
      const aChange = getChangeValue(a, sortPeriod)
      const bChange = getChangeValue(b, sortPeriod)
      
      if (sortOrder === 'change_desc') {
        return bChange - aChange
      } else {
        return aChange - bChange
      }
    })
  }, [stocks, selectedIndustry1, selectedIndustry2, selectedMarket, sortPeriod, sortOrder])

  const resetFilters = () => {
    setSelectedIndustry1('all')
    setSelectedIndustry2('all')
    setSelectedMarket('all')
  }

  const periodLabels: Record<SortPeriod, string> = {
    '1d': '1日',
    '5d': '5日',
    '10d': '10日',
    '20d': '20日',
    '60d': '60日'
  }

  if (activeTab === 'stock' && stockLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  const handleRefresh = () => {
    if (activeTab === 'stock') {
      refreshStocks()
    } else {
      refreshEtf()
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* 顶部 Tab 栏 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => switchTab('stock')}
            className={`px-6 py-2.5 rounded-lg font-semibold text-base transition-all ${
              activeTab === 'stock'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            股票看板
          </button>
          <button
            onClick={() => switchTab('etf')}
            className={`px-6 py-2.5 rounded-lg font-semibold text-base transition-all ${
              activeTab === 'etf'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ETF看板
          </button>
          {activeTab === 'etf' && etfLatestDate && (
            <span className="text-sm text-gray-500 ml-2">数据更新至：{formatDate(etfLatestDate)}</span>
          )}
        </div>
        <button
          onClick={handleRefresh}
          className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors ${
            activeTab === 'stock'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          <RefreshCw className="h-4 w-4" />
          刷新
        </button>
      </div>

      {activeTab === 'stock' ? (
        <StockBoardContent
          industrySummaries={industrySummaries}
          selectedIndustry1={selectedIndustry1}
          selectedIndustry2={selectedIndustry2}
          selectedMarket={selectedMarket}
          sortPeriod={sortPeriod}
          sortOrder={sortOrder}
          setSelectedIndustry1={setSelectedIndustry1}
          setSelectedIndustry2={setSelectedIndustry2}
          setSelectedMarket={setSelectedMarket}
          setSortPeriod={setSortPeriod}
          setSortOrder={setSortOrder}
          resetFilters={resetFilters}
          industry1Options={industry1Options}
          industry2Options={industry2Options}
          marketOptions={marketOptions}
          periodLabels={periodLabels}
          filteredStocks={filteredStocks}
          onStockAlertClick={(stockCode) => navigate(`/stock/${stockCode}`)}
        />
      ) : (
        <EtfBoardContent />
      )}
    </div>
  )
}

interface StockBoardContentProps {
  industrySummaries: any[]
  selectedIndustry1: string
  selectedIndustry2: string
  selectedMarket: string
  sortPeriod: SortPeriod
  sortOrder: SortOrder
  setSelectedIndustry1: (v: string) => void
  setSelectedIndustry2: (v: string) => void
  setSelectedMarket: (v: string) => void
  setSortPeriod: (v: SortPeriod) => void
  setSortOrder: (v: SortOrder) => void
  resetFilters: () => void
  industry1Options: string[]
  industry2Options: string[]
  marketOptions: string[]
  periodLabels: Record<SortPeriod, string>
  filteredStocks: any[]
  onStockAlertClick?: (stockCode: string) => void
}

const StockBoardContent: React.FC<StockBoardContentProps> = ({
  industrySummaries,
  selectedIndustry1,
  selectedIndustry2,
  selectedMarket,
  sortPeriod,
  sortOrder,
  setSelectedIndustry1,
  setSelectedIndustry2,
  setSelectedMarket,
  setSortPeriod,
  setSortOrder,
  resetFilters,
  industry1Options,
  industry2Options,
  marketOptions,
  periodLabels,
  filteredStocks,
  onStockAlertClick
}) => {
  return (
    <div className="space-y-8">
      {/* 交易记录模块 */}
      <StockTradeBoard onAlertClick={onStockAlertClick} />

      {/* 行业概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {industrySummaries.map((industry) => (
          <IndustryCard key={industry.industry1} industry={industry} />
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <h2 className="text-2xl font-bold text-gray-900">股票列表</h2>
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={selectedIndustry1}
              onChange={(e) => {
                setSelectedIndustry1(e.target.value)
                setSelectedIndustry2('all')
                setSelectedMarket('all')
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {industry1Options.map(industry => (
                <option key={industry} value={industry}>
                  {industry === 'all' ? '全部行业1' : industry}
                </option>
              ))}
            </select>
            <select
              value={selectedIndustry2}
              onChange={(e) => {
                setSelectedIndustry2(e.target.value)
                setSelectedMarket('all')
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {industry2Options.map(industry => (
                <option key={industry} value={industry}>
                  {industry === 'all' ? '全部行业2' : industry}
                </option>
              ))}
            </select>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {marketOptions.map(market => (
                <option key={market} value={market}>
                  {market === 'all' ? '全部市场' : market}
                </option>
              ))}
            </select>
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              重置
            </button>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {(Object.keys(periodLabels) as SortPeriod[]).map(period => (
                <button
                  key={period}
                  onClick={() => setSortPeriod(period)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    sortPeriod === period
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {periodLabels[period]}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === 'change_desc' ? 'change_asc' : 'change_desc')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                sortOrder === 'change_desc'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {sortOrder === 'change_desc' ? '涨幅优先 ↓' : '跌幅优先 ↑'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <StockList stocks={filteredStocks} />
        </div>
      </div>
    </div>
  )
}

export default Home
