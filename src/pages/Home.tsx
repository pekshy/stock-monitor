import React, { useState, useMemo, useEffect, useCallback, memo } from 'react'
import { RefreshCw, MessageSquare, TrendingUp, ExternalLink, Pencil, Trash2, Check, X, Bell, ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useStockContext } from '../context/StockContext'
import { useEtfContext } from '../context/EtfContext'
import { useIndustrySummaries } from '../hooks/useIndustryData'
import { useEtfNotes } from '../hooks/useEtfNotes'
import { useStockNotes } from '../hooks/useStockNotes'
import { useMarketViews } from '../hooks/useMarketViews'
import IndustryCard from '../components/IndustryCard'
import StockList from '../components/StockList'
import UnifiedTradeBoard from '../components/UnifiedTradeBoard'
import { MarketIndicators } from '../components/MarketIndicators'
import { NoteItem } from '../components/NoteItem'
import { NoteModal, type TradeAction, type NoteModalInitialValues } from '../components/NoteModal'
import EtfListOnly from './EtfBoard'
import { MarketView, EtfNote, StockNote } from '../types'

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

  // 记录当前Tab，用于详情页"返回"时回到用户之前所在的Tab
  useEffect(() => {
    try {
      localStorage.setItem('home_last_tab', activeTab)
    } catch {}
  }, [activeTab])

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
            交易
          </button>
          <button
            onClick={() => switchTab('etf')}
            className={`px-6 py-2.5 rounded-lg font-semibold text-base transition-all ${
              activeTab === 'etf'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ETF
          </button>
          <button
            onClick={() => switchTab('stock')}
            className={`px-6 py-2.5 rounded-lg font-semibold text-base transition-all ${
              activeTab === 'stock'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            股票
          </button>
          {activeTab === 'etf' && etfLatestDate && (
            <span className="text-sm text-gray-500 ml-2">数据更新至：{formatDate(etfLatestDate)}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://moonimprint.com/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            Moon Imprint
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
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

// ========== 市场观点条目组件 ==========
const MarketViewItem: React.FC<{
  view: MarketView
  onUpdate: (id: number, updates: Partial<MarketView>) => Promise<void>
  onDelete: (id: number) => Promise<void>
}> = ({ view, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(view.content)
  const [saving, setSaving] = useState(false)

  const handleStartEdit = () => {
    setEditContent(view.content)
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!editContent.trim()) return
    setSaving(true)
    try {
      await onUpdate(view.id, { content: editContent.trim() })
      setIsEditing(false)
    } catch {
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditContent(view.content)
  }

  return (
    <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-xs text-gray-400">
            {view.created_at.slice(0, 16).replace('T', ' ')}
          </span>
        </div>
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              className="w-full border border-orange-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving || !editContent.trim()}
                className="px-2 py-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded text-xs flex items-center gap-1"
              >
                <Check className="h-3 w-3" />
                保存
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                取消
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-800 break-words leading-relaxed whitespace-pre-wrap">
            {view.content}
          </div>
        )}
      </div>
      {!isEditing && (
        <div className="flex flex-col gap-1 flex-shrink-0">
          <button
            onClick={handleStartEdit}
            className="p-1.5 text-gray-500 hover:text-orange-600 bg-white hover:bg-orange-50 border border-gray-200 rounded transition-colors"
            title="编辑"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => {
              if (confirm('确定要删除这条市场观点吗？')) onDelete(view.id)
            }}
            className="p-1.5 text-gray-500 hover:text-red-600 bg-white hover:bg-red-50 border border-gray-200 rounded transition-colors"
            title="删除"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}

// ========== 交易内容 ==========
const TradeBoardContent: React.FC = memo(() => {
  const navigate = useNavigate()
  const { globalIndicatorSeries, chinaIndicatorSeries, fearGreedSeries, etfs, priceByDateMap } = useEtfContext()
  const { stocks } = useStockContext()
  const { notes: etfNotes, loading: etfNotesLoading, addNote: addEtfNote, updateNote: updateEtfNote, deleteNote: deleteEtfNote } = useEtfNotes()
  const { notes: stockNotes, loading: stockNotesLoading, addNote: addStockNote, updateNote: updateStockNote, deleteNote: deleteStockNote } = useStockNotes()
  const { views: marketViews, loading: marketViewsLoading, addView, updateView, deleteView } = useMarketViews()
  
  const [noteType, setNoteType] = useState<'etf' | 'stock' | 'market'>('etf')

  // 弹窗状态
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [modalCodeInput, setModalCodeInput] = useState('')
  const [noteModalSubmitting, setNoteModalSubmitting] = useState(false)
  // 编辑模式：存储正在编辑的笔记信息
  const [editingNoteInfo, setEditingNoteInfo] = useState<{
    id: number
    type: 'etf' | 'stock'
    initial: NoteModalInitialValues
  } | null>(null)

  // 获取ETF/股票近30天收盘价数组（最新在前）
  const getRecentCloses = useCallback((symbol: string, type: 'etf' | 'stock'): number[] => {
    if (!symbol || symbol === 'GENERAL') return []
    if (type === 'etf') {
      const history = priceByDateMap.get(symbol)
      if (!history || history.size === 0) return []
      const dates = Array.from(history.keys()).sort()
      return dates.slice(-30).map(d => history.get(d) ?? 0).reverse()
    } else {
      const stock = stocks.find(s => s.stock_code === symbol)
      const price = stock?.latest_quote?.close_price
      return (price != null && !isNaN(price)) ? [price] : []
    }
  }, [priceByDateMap, stocks])

  const modalRecentCloses = useMemo(() => {
    const t = editingNoteInfo?.type ?? (noteType === 'stock' ? 'stock' : 'etf')
    const code = editingNoteInfo ? (t === 'etf'
      ? (etfNotes.find(n => n.id === editingNoteInfo.id)?.symbol ?? '')
      : (stockNotes.find(n => n.id === editingNoteInfo.id)?.stock_code ?? ''))
      : modalCodeInput
    return getRecentCloses(code.trim().toUpperCase(), t as 'etf' | 'stock')
  }, [modalCodeInput, editingNoteInfo, getRecentCloses, noteType, etfNotes, stockNotes])

  const [marketContentInput, setMarketContentInput] = useState('')
  const [marketSubmitting, setMarketSubmitting] = useState(false)

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

  // 弹窗保存：新增或编辑
  const handleNoteModalSave = async (values: { note: string; tradeAction: TradeAction; executionPrice: number | null }) => {
    setNoteModalSubmitting(true)
    try {
      if (editingNoteInfo) {
        // 编辑模式
        const action = values.tradeAction || null
        if (editingNoteInfo.type === 'etf') {
          await updateEtfNote(editingNoteInfo.id, {
            note: values.note,
            tradeAction: action,
            executionPrice: values.executionPrice,
          })
        } else {
          await updateStockNote(editingNoteInfo.id, {
            note: values.note,
            tradeAction: action,
            executionPrice: values.executionPrice,
          })
        }
      } else {
        // 新增模式
        const symbol = modalCodeInput.trim().toUpperCase() || 'GENERAL'
        const action = values.tradeAction || null
        const execPrice = (action === 'buy' || action === 'sell') ? values.executionPrice : null
        if (noteType === 'etf') {
          await addEtfNote(symbol, values.note, action, execPrice)
        } else if (noteType === 'stock') {
          await addStockNote(symbol, values.note, action, execPrice)
        }
      }
      setIsNoteModalOpen(false)
      setEditingNoteInfo(null)
      setModalCodeInput('')
    } finally {
      setNoteModalSubmitting(false)
    }
  }

  const handleCloseNoteModal = () => {
    setIsNoteModalOpen(false)
    setEditingNoteInfo(null)
    setModalCodeInput('')
  }

  const handleOpenAddNoteModal = () => {
    setEditingNoteInfo(null)
    setModalCodeInput('')
    setIsNoteModalOpen(true)
  }

  const handleEditNote = (type: 'etf' | 'stock', note: EtfNote | StockNote) => {
    setEditingNoteInfo({
      id: note.id,
      type,
      initial: {
        note: note.note,
        tradeAction: (note.trade_action as TradeAction) || '',
        executionPrice: note.execution_price != null ? note.execution_price.toString() : '',
      },
    })
    setIsNoteModalOpen(true)
  }

  const handleAddMarketView = async (e: React.FormEvent) => {
    e.preventDefault()
    const content = marketContentInput.trim()
    if (!content) return
    setMarketSubmitting(true)
    try {
      await addView(content)
      setMarketContentInput('')
    } catch {
    } finally {
      setMarketSubmitting(false)
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
    return [...etfList, ...stockList].sort((a, b) => {
      const aTime = new Date((a.note.updated_at ?? a.note.created_at)).getTime()
      const bTime = new Date((b.note.updated_at ?? b.note.created_at)).getTime()
      return bTime - aTime
    })
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

  const [expandedTrigger, setExpandedTrigger] = useState<string | null>(null)

  // 已处理的提醒ID（已交易/忽略），持久化到 localStorage
  const [dismissedTriggerIds, setDismissedTriggerIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem('triggered_note_dismissed')
      return new Set(raw ? JSON.parse(raw) : [])
    } catch {
      return new Set()
    }
  })

  const dismissTrigger = (id: string) => {
    setDismissedTriggerIds(prev => {
      const next = new Set(prev)
      next.add(id)
      try {
        localStorage.setItem('triggered_note_dismissed', JSON.stringify(Array.from(next)))
      } catch {}
      return next
    })
  }

  // 计算笔记中触发交易价格的提醒（过滤掉已处理的）
  const triggeredNotes = useMemo(() => {
    const results: { id: string; type: 'etf' | 'stock'; symbol: string; name: string; action: 'buy' | 'sell'; execPrice: number; currentPrice: number; note: string; navigatePath: string }[] = []

    const getLatestEtfPrice = (symbol: string): number | null => {
      const history = priceByDateMap.get(symbol)
      if (!history || history.size === 0) return null
      const dates = Array.from(history.keys()).sort()
      return history.get(dates[dates.length - 1]) ?? null
    }

    const getLatestStockPrice = (code: string): number | null => {
      const stock = stocks.find(s => s.stock_code === code)
      const price = stock?.latest_quote?.close_price
      return (price != null && !isNaN(price)) ? price : null
    }

    etfNotes.forEach(n => {
      if (!n.trade_action || n.trade_action === 'watch' || n.execution_price == null) return
      if (n.symbol === 'GENERAL') return
      const currentPrice = getLatestEtfPrice(n.symbol)
      if (currentPrice == null) return
      const triggered = n.trade_action === 'buy'
        ? currentPrice <= n.execution_price
        : currentPrice >= n.execution_price
      if (triggered) {
        const id = `etf_${n.id}`
        if (dismissedTriggerIds.has(id)) return
        results.push({
          id,
          type: 'etf',
          symbol: n.symbol,
          name: getEtfDisplayName(n.symbol),
          action: n.trade_action,
          execPrice: n.execution_price,
          currentPrice,
          note: n.note,
          navigatePath: `/etf/${n.symbol}`
        })
      }
    })

    stockNotes.forEach(n => {
      if (!n.trade_action || n.trade_action === 'watch' || n.execution_price == null) return
      if (n.stock_code === 'GENERAL') return
      const currentPrice = getLatestStockPrice(n.stock_code)
      if (currentPrice == null) return
      const triggered = n.trade_action === 'buy'
        ? currentPrice <= n.execution_price
        : currentPrice >= n.execution_price
      if (triggered) {
        const id = `stock_${n.id}`
        if (dismissedTriggerIds.has(id)) return
        results.push({
          id,
          type: 'stock',
          symbol: n.stock_code,
          name: getStockDisplayName(n.stock_code),
          action: n.trade_action,
          execPrice: n.execution_price,
          currentPrice,
          note: n.note,
          navigatePath: `/stock/${n.stock_code}`
        })
      }
    })

    return results
  }, [etfNotes, stockNotes, priceByDateMap, stocks, etfNameMap, stockNameMap, dismissedTriggerIds])

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
              （ETF {etfNotes.length} 条 · 股票 {stockNotes.length} 条 · 市场观点 {marketViews.length} 条）
            </span>
          </h2>
          <div className="flex items-center gap-2">
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
              <button
                onClick={() => setNoteType('market')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  noteType === 'market'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                市场观点
              </button>
            </div>
            {noteType !== 'market' && (
              <button
                type="button"
                onClick={handleOpenAddNoteModal}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                  noteType === 'etf'
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                <Plus className="h-3.5 w-3.5" />
                添加{noteType === 'etf' ? 'ETF' : '股票'}笔记
              </button>
            )}
          </div>
        </div>

        {/* 价格触发提醒 */}
        {triggeredNotes.length > 0 && (
          <div className="mb-4 bg-orange-50 rounded-lg p-3 border-l-4 border-orange-400">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-4 w-4 text-orange-500 animate-pulse" />
              <span className="text-sm font-bold text-gray-900">
                价格触发提醒
              </span>
              <span className="text-xs text-gray-500">
                ({triggeredNotes.length} 条笔记已触发交易价格)
              </span>
            </div>
            <div className="space-y-2">
              {triggeredNotes.map(t => (
                <div key={t.id} className="bg-white rounded-lg p-3">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedTrigger(expandedTrigger === t.id ? null : t.id)}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        t.action === 'buy' ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'
                      }`}>
                        {t.action === 'buy' ? '买入' : '卖出'} @ {t.execPrice}
                      </span>
                      <span className="text-sm font-medium text-gray-700">{t.name}</span>
                      <span className="text-xs text-gray-500">{t.symbol}</span>
                      <span className="text-xs text-gray-600">
                        现价 <span className={t.action === 'buy' ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>{t.currentPrice.toFixed(3)}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(t.navigatePath) }}
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        查看详情
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); dismissTrigger(t.id) }}
                        className="text-xs px-2 py-0.5 rounded bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                        title="标记为已交易，不再提醒"
                      >
                        已交易
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); dismissTrigger(t.id) }}
                        className="text-xs px-2 py-0.5 rounded bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                        title="忽略此提醒"
                      >
                        忽略
                      </button>
                      {expandedTrigger === t.id
                        ? <ChevronUp className="h-3.5 w-3.5 text-gray-400" />
                        : <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                      }
                    </div>
                  </div>
                  {expandedTrigger === t.id && (
                    <div className="mt-2 pt-2 border-t border-gray-200 text-sm text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
                      {t.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 市场观点内联表单 */}
        {noteType === 'market' && (
          <form onSubmit={handleAddMarketView} className="flex gap-2 mb-4">
            <textarea
              value={marketContentInput}
              onChange={e => setMarketContentInput(e.target.value)}
              placeholder="写下对市场的看法..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              rows={2}
            />
            <button
              type="submit"
              disabled={marketSubmitting || !marketContentInput.trim()}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-lg text-sm transition-colors self-end"
            >
              添加
            </button>
          </form>
        )}

        {/* 笔记列表（根据 noteType 过滤） */}
        {noteType === 'market' ? (
          marketViewsLoading ? (
            <div className="text-sm text-gray-400 py-4 text-center">加载中...</div>
          ) : marketViews.length === 0 ? (
            <div className="text-sm text-gray-400 py-4 text-center">暂无市场观点</div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {marketViews.map(view => (
                <MarketViewItem
                  key={view.id}
                  view={view}
                  onUpdate={updateView}
                  onDelete={deleteView}
                />
              ))}
            </div>
          )
        ) : (
          etfNotesLoading || stockNotesLoading ? (
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
                  onUpdate={(id, values) => handleNoteUpdate(item.type, id, typeof values === 'string' ? values : values.note)}
                  onDelete={(id) => handleNoteDelete(item.type, id)}
                  onEdit={(note) => handleEditNote(item.type, note as EtfNote | StockNote)}
                  codeColor={item.type === 'etf' ? 'blue' : 'green'}
                />
              ))}
            </div>
          )
        )}
      </div>

      {/* 笔记弹窗 */}
      {noteType !== 'market' && (
        <NoteModal
          isOpen={isNoteModalOpen}
          onClose={handleCloseNoteModal}
          onSave={handleNoteModalSave}
          title={editingNoteInfo ? '编辑笔记' : `添加${noteType === 'etf' ? 'ETF' : '股票'}笔记`}
          submitText={editingNoteInfo ? '保存修改' : '添加笔记'}
          showCodeInput={!editingNoteInfo}
          codeLabel={noteType === 'etf' ? 'ETF代码' : '股票代码'}
          initialCode={modalCodeInput}
          onCodeChange={setModalCodeInput}
          recentCloses={modalRecentCloses}
          initial={editingNoteInfo?.initial}
          theme={editingNoteInfo ? (editingNoteInfo.type === 'etf' ? 'blue' : 'green') : (noteType === 'etf' ? 'blue' : 'green')}
          submitting={noteModalSubmitting}
        />
      )}

      {/* 市场指标 */}
      <MarketIndicators
        globalIndicatorSeries={globalIndicatorSeries}
        chinaIndicatorSeries={chinaIndicatorSeries}
        fearGreedSeries={fearGreedSeries}
      />
    </div>
  )
})

// ========== 股票内容 ==========
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

const StockBoardContent: React.FC<StockBoardContentProps> = memo(({
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
})

export default Home
