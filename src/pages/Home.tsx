import React, { useState, useMemo, useEffect } from 'react'
import { RefreshCw, MessageSquare, TrendingUp } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useStockContext } from '../context/StockContext'
import { useEtfContext } from '../context/EtfContext'
import { useIndustrySummaries } from '../hooks/useIndustryData'
import { useEtfNotes } from '../hooks/useEtfNotes'
import { useStockNotes } from '../hooks/useStockNotes'
import IndustryCard from '../components/IndustryCard'
import StockList from '../components/StockList'
import UnifiedTradeBoard from '../components/UnifiedTradeBoard'
import { MarketIndicators } from '../components/MarketIndicators'
import { NoteItem } from '../components/NoteItem'
import EtfListOnly from './EtfBoard'

type SortOrder = 'change_desc' | 'change_asc'
type SortPeriod = '1d' | '5d' | '10d' | '20d' | '60d'
type TabType = 'trade' | 'etf' | 'stock'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { stocks, loading: stockLoading, refresh: refreshStocks } = useStockContext()
  const { latestDate: etfLatestDate, refresh: refreshEtf } = useEtfContext()
  const industrySummaries = useIndustrySummaries(stocks)

  const getActiveTab = (): TabType => {
    if (location.pathname === '/stocks') return 'stock'
    if (location.pathname === '/etf') return 'etf'
    return 'trade'
  }

  const activeTab = getActiveTab()

  const switchTab = (tab: TabType) => {
    if (tab === 'stock') {
      navigate('/stocks')
    } else if (tab === 'etf') {
      navigate('/etf')
    } else {
      navigate('/')
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
    } else if (activeTab === 'etf') {
      refreshEtf()
    } else {
      refreshEtf()
      refreshStocks()
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

  const getTabColor = (tab: TabType) => {
    switch (tab) {
      case 'trade': return 'bg-orange-600'
      case 'etf': return 'bg-purple-600'
      case 'stock': return 'bg-blue-600'
    }
  }

  const getTabHoverColor = (tab: TabType) => {
    switch (tab) {
      case 'trade': return 'hover:bg-orange-700'
      case 'etf': return 'hover:bg-purple-700'
      case 'stock': return 'hover:bg-blue-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* 顶部 Tab 栏 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => switchTab('trade')}
            className={`px-6 py-2.5 rounded-lg font-semibold text-base transition-all ${
              activeTab === 'trade'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            交易看板
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
          {activeTab === 'etf' && etfLatestDate && (
            <span className="text-sm text-gray-500 ml-2">数据更新至：{formatDate(etfLatestDate)}</span>
          )}
        </div>
        {activeTab !== 'trade' && (
          <button
            onClick={handleRefresh}
            className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors ${getTabColor(activeTab)} ${getTabHoverColor(activeTab)}`}
          >
            <RefreshCw className="h-4 w-4" />
            刷新
          </button>
        )}
      </div>

      {activeTab === 'trade' && <TradeBoardContent />}
      {activeTab === 'etf' && <EtfListOnly />}
      {activeTab === 'stock' && (
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
        />
      )}
    </div>
  )
}

// ========== 交易看板内容 ==========
const TradeBoardContent: React.FC = () => {
  const { globalIndicatorSeries, chinaIndicatorSeries, fearGreedSeries, etfs } = useEtfContext()
  const { stocks } = useStockContext()
  const { notes: etfNotes, loading: etfNotesLoading, addNote: addEtfNote, updateNote: updateEtfNote, deleteNote: deleteEtfNote } = useEtfNotes()
  const { notes: stockNotes, loading: stockNotesLoading, addNote: addStockNote, updateNote: updateStockNote, deleteNote: deleteStockNote } = useStockNotes()
  
  const [noteType, setNoteType] = useState<'etf' | 'stock'>('etf')
  const [noteSymbolInput, setNoteSymbolInput] = useState('')
  const [noteInput, setNoteInput] = useState('')
  const [noteSubmitting, setNoteSubmitting] = useState(false)

  const etfNameMap = useMemo(() => {
    const m = new Map<string, string>()
    etfs.forEach(e => {
      if (e.symbol && e.name) m.set(e.symbol, e.name)
    })
    return m
  }, [etfs])

  const stockNameMap = useMemo(() => {
    const m = new Map<string, string>()
    stocks.forEach(s => {
      if (s.stock_code && s.stock_name) m.set(s.stock_code, s.stock_name)
    })
    return m
  }, [stocks])

  const getEtfDisplayName = (symbol: string) => {
    if (symbol === 'GENERAL') return '通用'
    return etfNameMap.get(symbol) || symbol
  }

  const getStockDisplayName = (code: string) => {
    return stockNameMap.get(code) || code
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = noteInput.trim()
    if (!text) return
    const symbol = noteSymbolInput.trim().toUpperCase()
    setNoteSubmitting(true)
    try {
      if (noteType === 'etf') {
        await addEtfNote(symbol || 'GENERAL', text)
      } else {
        await addStockNote(symbol || 'GENERAL', text)
      }
      setNoteInput('')
      setNoteSymbolInput('')
    } catch {
    } finally {
      setNoteSubmitting(false)
    }
  }

  const allNotes = useMemo(() => {
    type UnifiedNote = {
      id: string
      type: 'etf' | 'stock'
      note: { id: number; note: string; created_at: string; updated_at?: string }
      symbol: string
      name: string
      navigatePath: string
    }
    const etfList: UnifiedNote[] = etfNotes.map(n => ({
      id: `etf_${n.id}`,
      type: 'etf' as const,
      note: n,
      symbol: n.symbol,
      name: getEtfDisplayName(n.symbol),
      navigatePath: `/etf/${n.symbol}`
    }))
    const stockList: UnifiedNote[] = stockNotes.map(n => ({
      id: `stock_${n.id}`,
      type: 'stock' as const,
      note: n,
      symbol: n.stock_code,
      name: getStockDisplayName(n.stock_code),
      navigatePath: `/stock/${n.stock_code}`
    }))
    return [...etfList, ...stockList].sort((a, b) => 
      new Date(b.note.created_at).getTime() - new Date(a.note.created_at).getTime()
    )
  }, [etfNotes, stockNotes, etfNameMap, stockNameMap])

  const handleNoteUpdate = async (type: 'etf' | 'stock', id: number, text: string) => {
    if (type === 'etf') {
      await updateEtfNote(id, text)
    } else {
      await updateStockNote(id, text)
    }
  }

  const handleNoteDelete = async (type: 'etf' | 'stock', id: number) => {
    if (type === 'etf') {
      await deleteEtfNote(id)
    } else {
      await deleteStockNote(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* 统一交易看板 */}
      <UnifiedTradeBoard />

      {/* 笔记模块 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            笔记
            <span className="text-sm font-normal text-gray-500">
              （ETF {etfNotes.length} 条 · 股票 {stockNotes.length} 条）
            </span>
          </h2>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setNoteType('etf')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                noteType === 'etf'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ETF笔记
            </button>
            <button
              onClick={() => setNoteType('stock')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                noteType === 'stock'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              股票笔记
            </button>
          </div>
        </div>

        {/* 快速添加 */}
        <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
          <input
            type="text"
            value={noteSymbolInput}
            onChange={e => setNoteSymbolInput(e.target.value)}
            placeholder={noteType === 'etf' ? 'ETF代码（可选）' : '股票代码（可选）'}
            className="w-36 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            value={noteInput}
            onChange={e => setNoteInput(e.target.value)}
            placeholder="写下笔记..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={noteSubmitting || !noteInput.trim()}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg text-sm transition-colors"
          >
            添加
          </button>
        </form>

        {/* 笔记列表（根据 noteType 过滤） */}
        {etfNotesLoading || stockNotesLoading ? (
          <div className="text-sm text-gray-400 py-4 text-center">加载中...</div>
        ) : allNotes.length === 0 ? (
          <div className="text-sm text-gray-400 py-4 text-center">暂无笔记</div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {allNotes.filter(item => item.type === noteType).map(item => (
              <NoteItem
                key={item.id}
                note={item.note as any}
                name={item.name}
                code={item.symbol}
                navigatePath={item.navigatePath}
                onUpdate={(id, text) => handleNoteUpdate(item.type, id, text)}
                onDelete={(id) => handleNoteDelete(item.type, id)}
                codeColor={item.type === 'etf' ? 'blue' : 'green'}
              />
            ))}
          </div>
        )}
      </div>

      {/* 市场指标 */}
      <MarketIndicators
        globalIndicatorSeries={globalIndicatorSeries}
        chinaIndicatorSeries={chinaIndicatorSeries}
        fearGreedSeries={fearGreedSeries}
      />
    </div>
  )
}

// ========== 股票看板内容 ==========
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
  filteredStocks
}) => {
  return (
    <div className="space-y-8">
      {/* 行业概览 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          行业汇总
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {industrySummaries.map((industry) => (
            <IndustryCard key={industry.industry1} industry={industry} />
          ))}
        </div>
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
