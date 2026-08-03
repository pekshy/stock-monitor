import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import {
  EtfInfo,
  EtfDailyData,
  EtfIndicators,
  EtfClawSignal,
  EtfTrackedIndexHistory,
  ChinaIndicator,
  FredIndicator,
  MarketIndicator,
  EtfWithData,
  IndicatorSeries,
  IndicatorCategory,
  StockMarketVolume,
  FearGreedSeries,
  EtfMomentumSignal
} from '../types'

type AnyIndicator = ChinaIndicator | FredIndicator | MarketIndicator | StockMarketVolume

function groupIndicatorsBySeries(indicators: AnyIndicator[]): IndicatorSeries[] {
  const grouped = new Map<string, { date: string; value: number; classification?: string | null }[]>()
  const latestMap = new Map<string, { value: number; date: string; classification?: string | null }>()

  indicators.forEach(ind => {
    if (!grouped.has(ind.indicator_id)) {
      grouped.set(ind.indicator_id, [])
    }
    const classification = (ind as MarketIndicator).classification
    grouped.get(ind.indicator_id)!.push({
      date: ind.date,
      value: ind.value,
      classification
    })

    const existing = latestMap.get(ind.indicator_id)
    if (!existing || new Date(ind.date) > new Date(existing.date)) {
      latestMap.set(ind.indicator_id, {
        value: ind.value,
        date: ind.date,
        classification
      })
    }
  })

  const result: IndicatorSeries[] = []
  grouped.forEach((history, indicator_id) => {
    const sorted = history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const latest = latestMap.get(indicator_id)
    result.push({
      indicator_id,
      latest_value: latest ? latest.value : null,
      latest_date: latest ? latest.date : null,
      history: sorted
    })
  })

  return result
}

function mergeIndicatorSeries(...seriesList: IndicatorSeries[][]): IndicatorSeries[] {
  const merged = new Map<string, IndicatorSeries>()
  seriesList.forEach(list => {
    list.forEach(series => {
      const existing = merged.get(series.indicator_id)
      if (existing) {
        const combined = [...existing.history, ...series.history]
        const dedup = new Map<string, number>()
        combined.forEach(item => {
          const current = dedup.get(item.date)
          if (current === undefined || item.value !== current) {
            dedup.set(item.date, item.value)
          }
        })
        const history = Array.from(dedup.entries())
          .map(([date, value]) => ({ date, value }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        const latest = history[history.length - 1]
        merged.set(series.indicator_id, {
          indicator_id: series.indicator_id,
          latest_value: latest ? latest.value : null,
          latest_date: latest ? latest.date : null,
          history
        })
      } else {
        merged.set(series.indicator_id, series)
      }
    })
  })
  return Array.from(merged.values())
}

// --- 指标分类系统 ---
// 规则：匹配 indicator_id（大小写不敏感）进行归类。
// 每类包含若干规则，任一命中即归属该类；命中多个时以第一个匹配类别为准。

type CategoryRule = {
  id: string            // 类别内部标识
  label: string         // 界面显示名
  color: string         // 图表颜色
  matches: (id: string) => boolean
  defaultIndicator?: string // 该类别默认展示的 indicator_id（优先级最高）
  memberOrder?: string[] // 可选：indicator_id 优先级/展示顺序（从左到右）
}

// 通胀类别的精确匹配 ID（中国数据用短 ID，如 CPI/PPI/CORE_CPI）
// 用于在分类时区分中国 CPI/PPI（同比指数，值约100-105）与美国 CPIAUCSL/PPIACO（基准指数，值约250-350）
const INFLATION_CN_IDS = ['CPI', 'PPI', 'CORE_CPI', 'CORECPI']

// 全球指标分类（按看板展示顺序：美元指数、美债收益率、人民币汇率、货币、贵金属、能源、数字货币、通胀、A股成交量）
const GLOBAL_CATEGORIES: CategoryRule[] = [
  {
    id: 'dollar_index',
    label: '美元指数',
    color: '#2563eb',
    matches: (id) => {
      const u = id.toUpperCase()
      return u === 'DXY' || u.startsWith('DTWEX') || u.includes('DOLLAR') || u.includes('USD') || u === 'DOLLAR_INDEX'
    },
    defaultIndicator: 'DXY'
  },
  {
    id: 'treasury_yield_curve',
    label: '美债收益率',
    color: '#f59e0b',
    matches: (id) => {
      const u = id.toUpperCase()
      return u.startsWith('DGS') || u.includes('TREASURY_')
    },
    defaultIndicator: 'treasury_10y',
    memberOrder: ['DGS3MO', 'treasury_3m', 'DGS2', 'treasury_2y', 'DGS10', 'treasury_10y', 'DGS30', 'treasury_30y', 'DGS1MO', 'treasury_1m', 'DGS6MO', 'treasury_6m', 'DGS1', 'treasury_1y', 'DGS5', 'treasury_5y', 'DGS7', 'treasury_7y', 'DGS20', 'treasury_20y']
  },
  {
    id: 'cny_exchange',
    label: '人民币汇率',
    color: '#059669',
    matches: (id) => {
      const u = id.toUpperCase()
      return u.includes('CNY') || u.includes('EXCHANGE') || u.includes('RMB')
    },
    defaultIndicator: 'cny_exchange_rate'
  },
  {
    id: 'interest_rate',
    label: '货币',
    color: '#0891b2',
    matches: (id) => {
      const u = id.toUpperCase()
      return u.includes('SHIBOR') || u.includes('LPR') || u.includes('MONEY') || u.includes('SUPPLY') || u.includes('M1') || u.includes('M2')
    },
    defaultIndicator: 'SHIBOR'
  },
  {
    id: 'precious_metals',
    label: '贵金属',
    color: '#ca8a04',
    matches: (id) => {
      const u = id.toUpperCase()
      return u === 'GOLD' || u === 'XAU' || u === 'SILVER' || u === 'XAG' || u.includes('GOLD') || u.includes('SILVER')
    },
    defaultIndicator: 'GOLD'
  },
  {
    id: 'commodities',
    label: '能源',
    color: '#16a34a',
    matches: (id) => {
      const u = id.toUpperCase()
      return u.includes('CRUDE') || u.includes('BRENT') || u.includes('OIL') || u.includes('WTI')
    },
    defaultIndicator: 'brent_crude'
  },
  {
    id: 'crypto',
    label: '数字货币',
    color: '#f97316',
    matches: (id) => {
      const u = id.toUpperCase()
      return u.includes('BTC') || u.includes('BITCOIN') || u.includes('ETH') || u.includes('ETHEREUM')
    },
    defaultIndicator: 'BITCOIN'
  },
  {
    id: 'inflation',
    label: '通胀',
    color: '#dc2626',
    // 精确匹配中国 CPI/PPI，排除 FRED 的 CPIAUCSL/PPIACO 等长 ID
    // 避免不同基准的数据（同比指数100+ vs 基准指数300+）被混合到同一条序列
    matches: (id) => {
      const u = id.toUpperCase()
      return INFLATION_CN_IDS.includes(u)
    },
    defaultIndicator: 'CPI'
  },
  {
    id: 'a_stock_volume',
    label: 'A股成交量',
    color: '#9333ea',
    matches: (id) => {
      const u = id.toUpperCase()
      return u.includes('STOCK_MARKET_VOLUME') || u.includes('A_STOCK') || u.includes('A股') || u === 'VOLUME'
    },
    defaultIndicator: 'stock_market_volume'
  }
]

// 中国宏观指标分类（已合并到 GLOBAL_CATEGORIES，此处保留用于兼容）
const CHINA_CATEGORIES: CategoryRule[] = []

// 根据 indicator_id 找分类
function categorizeIndicator(id: string, categories: CategoryRule[]): CategoryRule | null {
  for (const rule of categories) {
    if (rule.matches(id)) return rule
  }
  return null
}

// 将 series 按类别分组，返回结构化的 IndicatorCategory[]
function buildIndicatorCategories(
  series: IndicatorSeries[],
  categories: CategoryRule[]
): IndicatorCategory[] {
  return categories.map(rule => {
    // 先找精确匹配 defaultIndicator
    let memberSeries: IndicatorSeries[] = []
    series.forEach(s => {
      if (categorizeIndicator(s.indicator_id, [rule]) === rule) {
        memberSeries.push(s)
      }
    })

    // 排序：优先按 memberOrder 自定义顺序，其次按历史数据量
    if (rule.memberOrder && rule.memberOrder.length > 0) {
      const orderMap = new Map(rule.memberOrder.map((id, idx) => [id.toUpperCase(), idx]))
      memberSeries.sort((a, b) => {
        const aIdx = orderMap.get(a.indicator_id.toUpperCase())
        const bIdx = orderMap.get(b.indicator_id.toUpperCase())
        if (aIdx !== undefined && bIdx !== undefined) return aIdx - bIdx
        if (aIdx !== undefined) return -1
        if (bIdx !== undefined) return 1
        return b.history.length - a.history.length
      })
    } else {
      memberSeries.sort((a, b) => b.history.length - a.history.length)
    }

    // 选中默认展示的 series：优先 defaultIndicator，否则选数据最多的
    let defaultSelected: IndicatorSeries | undefined = memberSeries.find(
      s => s.indicator_id.toUpperCase() === rule.defaultIndicator?.toUpperCase()
    )
    if (!defaultSelected) {
      // 尝试模糊匹配
      defaultSelected = memberSeries.find(s =>
        rule.defaultIndicator && s.indicator_id.toUpperCase().includes(rule.defaultIndicator.toUpperCase())
      ) || memberSeries[0]
    }

    return {
      id: rule.id,
      label: rule.label,
      color: rule.color,
      members: memberSeries,
      default_indicator_id: defaultSelected?.indicator_id || memberSeries[0]?.indicator_id || null
    }
  }).filter(cat => cat.members.length > 0)
}

export { buildIndicatorCategories, GLOBAL_CATEGORIES, CHINA_CATEGORIES }

export function useEtfData() {
  const [etfs, setEtfs] = useState<EtfWithData[]>([])
  const [priceByDateMap, setPriceByDateMap] = useState<Map<string, Map<string, number>>>(new Map())
  const [chinaIndicators, setChinaIndicators] = useState<ChinaIndicator[]>([])
  const [fredIndicators, setFredIndicators] = useState<FredIndicator[]>([])
  const [marketIndicators, setMarketIndicators] = useState<MarketIndicator[]>([])
  const [chinaIndicatorSeries, setChinaIndicatorSeries] = useState<IndicatorSeries[]>([])
  const [globalIndicatorSeries, setGlobalIndicatorSeries] = useState<IndicatorSeries[]>([])
  const [fearGreedSeries, setFearGreedSeries] = useState<FearGreedSeries | null>(null)
  const [momentumSignals, setMomentumSignals] = useState<EtfMomentumSignal[]>([])
  const [latestDate, setLatestDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAllData()
  }, [])

  async function fetchAllData() {
    try {
      setLoading(true)
      setError(null)
      console.log('开始获取ETF数据...')
      
      // 第一波：并行获取所有独立数据（ETF信息 + 各类指标）
      const [
        etfInfoResult,
        chinaResult,
        fredResult,
        marketResult,
        volumeResult,
        fedForecastResult,
        momentumResult
      ] = await Promise.all([
        supabase.from('etf_info').select('*'),
        supabase.from('china_indicators').select('*').order('date', { ascending: false }),
        supabase.from('fred_indicators').select('*').order('date', { ascending: false }),
        supabase.from('market_indicators').select('*').order('date', { ascending: false }),
        supabase.from('stock_market_volume').select('*').order('date', { ascending: false }),
        supabase.from('fed_forecast').select('*').order('date', { ascending: false }),
        supabase.from('etf_momentum_signals').select('*').order('trade_date', { ascending: false })
      ])
      
      const { data: etfInfoData, error: etfInfoErr } = etfInfoResult
      if (etfInfoErr) throw etfInfoErr
      const etfInfo: EtfInfo[] = etfInfoData || []
      console.log('ETF info:', etfInfo)

      const { data: chinaData, error: chinaErr } = chinaResult
      if (chinaErr) throw chinaErr
      console.log('China indicators:', chinaData)
      setChinaIndicators(chinaData || [])

      const { data: fredData, error: fredErr } = fredResult
      if (fredErr) throw fredErr
      console.log('FRED indicators:', fredData)
      console.log('FRED indicator_ids:', Array.from(new Set((fredData || []).map(d => d.indicator_id))))
      setFredIndicators(fredData || [])

      const { data: marketData, error: marketErr } = marketResult
      if (marketErr) throw marketErr
      console.log('Market indicators:', marketData)
      setMarketIndicators(marketData || [])

      const { data: volumeData, error: volumeErr } = volumeResult
      if (volumeErr) throw volumeErr
      console.log('Stock market volume:', volumeData)

      const { data: fedForecastData, error: fedForecastErr } = fedForecastResult
      if (fedForecastErr) throw fedForecastErr
      console.log('Fed forecasts:', fedForecastData)

      const { data: momentumData, error: momentumErr } = momentumResult
      if (momentumErr) throw momentumErr
      console.log('Momentum signals:', momentumData)
      setMomentumSignals(momentumData || [])

      // 4. 分组为时序数据
      // china_indicators 为长表结构（indicator_id + date + value）
      // 例如 indicator_id='cny_exchange_rate' 表示人民币汇率
      const chinaSeries = groupIndicatorsBySeries(chinaData || [])
      console.log('China indicator series (IDs):', chinaSeries.map(s => s.indicator_id))
      setChinaIndicatorSeries(chinaSeries)
      setGlobalIndicatorSeries(mergeIndicatorSeries(
        groupIndicatorsBySeries(fredData || []),
        groupIndicatorsBySeries(marketData || []),
        chinaSeries,
        groupIndicatorsBySeries((volumeData || []) as AnyIndicator[])
      ))

      // 4.1 单独提取恐贪指数（indicator_id 包含 fear_greed）
      const fearGreedRaw = (marketData || [])
        .filter(m => m.indicator_id.toLowerCase().includes('fear_greed') || m.indicator_id.toLowerCase() === 'fear_greed')
      if (fearGreedRaw.length > 0) {
        const fgHistory = fearGreedRaw
          .map(m => ({ date: m.date, value: m.value, classification: m.classification || null }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        const fgLatest = fgHistory[fgHistory.length - 1]
        setFearGreedSeries({
          indicator_id: fearGreedRaw[0].indicator_id,
          latest_value: fgLatest ? fgLatest.value : null,
          latest_date: fgLatest ? fgLatest.date : null,
          latest_classification: fgLatest ? fgLatest.classification : null,
          history: fgHistory
        })
      } else {
        setFearGreedSeries(null)
      }

      // 4. 如果有ETF，获取它们的数据（并行请求）
      let etfsWithData: EtfWithData[] = []
      
      if (etfInfo.length > 0) {
        const symbols = etfInfo.map(e => e.symbol)
        const indexCodes = etfInfo.map(e => e.tracking_index_code).filter((c): c is string => !!c)

        // 列表页只需要最新数据，详情页按需加载历史数据
        // etf_butterworth_fit 单独处理：先取最新日期，再查最近 7 天数据
        // 确保每个 symbol 都能拿到最新 trend_signal，避免 limit 截断导致部分 ETF 数据丢失
        const requests = [
          supabase.from('etf_daily_data').select('*').in('symbol', symbols).order('trade_date', { ascending: false }).limit(10000),
          supabase.from('etf_indicators').select('*').in('symbol', symbols).order('trade_date', { ascending: false }).limit(10000),
          supabase.from('etf_claw_signals').select('*').in('symbol', symbols).order('trade_date', { ascending: false }).limit(10000)
        ]

        if (indexCodes.length > 0) {
          requests.push(
            supabase.from('etf_tracked_index_history').select('*').in('index_code', indexCodes).order('trade_date', { ascending: false }).limit(10000)
          )
        }

        // 并行：requests 数组 + butterworth_fit 最新日期查询（limit 1，很快）
        const fitLatestPromise = supabase
          .from('etf_butterworth_fit')
          .select('trade_date')
          .order('trade_date', { ascending: false })
          .limit(1)
          .single()

        const [results, fitLatestRes] = await Promise.all([Promise.all(requests), fitLatestPromise])

        const { data: dailyData, error: dailyErr } = results[0]
        if (dailyErr) throw dailyErr
        console.log('ETF daily data:', dailyData)

        const symbolDatePriceMap = new Map<string, Map<string, number>>()
        dailyData?.forEach(d => {
          if (d.close == null) return
          let inner = symbolDatePriceMap.get(d.symbol)
          if (!inner) {
            inner = new Map()
            symbolDatePriceMap.set(d.symbol, inner)
          }
          inner.set(d.trade_date, d.close)
        })
        setPriceByDateMap(symbolDatePriceMap)

        const { data: indicatorsData, error: indicatorsErr } = results[1]
        if (indicatorsErr) throw indicatorsErr
        console.log('ETF indicators:', indicatorsData)

        const { data: signalsData, error: signalsErr } = results[2]
        if (signalsErr) throw signalsErr
        console.log('ETF signals:', signalsData)

        // butterworth_fit：基于最新日期查最近 7 天数据，确保覆盖所有 symbol 的最新值
        let fitData: { symbol: string; trade_date: string; trend_signal: string | null }[] = []
        if (!fitLatestRes.error && fitLatestRes.data?.trade_date) {
          const latestFitDate = new Date(fitLatestRes.data.trade_date)
          latestFitDate.setDate(latestFitDate.getDate() - 7)
          const sevenDaysAgo = latestFitDate.toISOString().split('T')[0]
          const { data: fitRecent, error: fitErr } = await supabase
            .from('etf_butterworth_fit')
            .select('symbol,trade_date,trend_signal')
            .in('symbol', symbols)
            .gte('trade_date', sevenDaysAgo)
            .order('trade_date', { ascending: false })
          if (fitErr) throw fitErr
          fitData = fitRecent || []
        }
        console.log('Butterworth fit data:', fitData)

        let indexValuations: EtfTrackedIndexHistory[] = []
        if (indexCodes.length > 0 && results[3]) {
          const { data: indexData, error: indexErr } = results[3]
          if (indexErr) throw indexErr
          indexValuations = (indexData as EtfTrackedIndexHistory[]) || []
          console.log('Index valuations:', indexData)
        }

        // 为每个ETF整理最新数据（列表页只需要最新数据，历史数据在详情页按需加载）
        const latestDaily = new Map<string, EtfDailyData>()
        const latestIndicators = new Map<string, EtfIndicators>()
        const latestSignal = new Map<string, EtfClawSignal>()
        const latestIndexValuation = new Map<string, EtfTrackedIndexHistory>()
        const latestTrendSignal = new Map<string, string | null>()

        dailyData?.forEach(d => {
          if (!latestDaily.has(d.symbol)) {
            latestDaily.set(d.symbol, d)
          }
        })

        indicatorsData?.forEach(i => {
          if (!latestIndicators.has(i.symbol)) {
            latestIndicators.set(i.symbol, i)
          }
        })

        signalsData?.forEach(s => {
          if (!latestSignal.has(s.symbol)) {
            latestSignal.set(s.symbol, s)
          }
        })

        indexValuations?.forEach(v => {
          if (!latestIndexValuation.has(v.index_code)) {
            latestIndexValuation.set(v.index_code, v)
          }
        })

        fitData?.forEach(f => {
          if (!latestTrendSignal.has(f.symbol)) {
            latestTrendSignal.set(f.symbol, f.trend_signal ?? null)
          }
        })

        etfsWithData = etfInfo.map(e => ({
          ...e,
          latest_daily: latestDaily.get(e.symbol),
          latest_indicator: latestIndicators.get(e.symbol),
          latest_signal: latestSignal.get(e.symbol),
          latest_index_valuation: e.tracking_index_code ? latestIndexValuation.get(e.tracking_index_code) : undefined,
          latest_trend_signal: latestTrendSignal.get(e.symbol) ?? null,
          // 历史数据在详情页按需加载，列表页不存储
          daily_data: undefined,
          indicators: undefined,
          signals: undefined,
          butterworth_fit: undefined
        }))

        // 设置最新日期
        if (dailyData && dailyData.length > 0) {
          setLatestDate(dailyData[0].trade_date)
        }
      }

      // 如果还没有日期，从宏观指标中获取
      if (!latestDate) {
        if (chinaData && chinaData.length > 0) {
          setLatestDate(chinaData[0].date)
        } else if (fredData && fredData.length > 0) {
          setLatestDate(fredData[0].date)
        }
      }

      setEtfs(etfsWithData)
      console.log('完成！ETF列表:', etfsWithData)

    } catch (err: any) {
      console.error('Error fetching ETF data:', err)
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  const toggleFocus = async (symbol: string) => {
    try {
      const etf = etfs.find(e => e.symbol === symbol)
      if (!etf) return
      const newFocused = !etf.is_focused
      const { error } = await supabase
        .from('etf_info')
        .update({ is_focused: newFocused, updated_at: new Date().toISOString() })
        .eq('symbol', symbol)
      if (error) throw error
      // 本地更新
      setEtfs(prev => prev.map(e =>
        e.symbol === symbol ? { ...e, is_focused: newFocused } : e
      ))
    } catch (err) {
      console.error('切换重点跟踪失败:', err)
      alert('操作失败，请重试')
    }
  }

  return {
    etfs,
    priceByDateMap,
    chinaIndicators,
    fredIndicators,
    marketIndicators,
    chinaIndicatorSeries,
    globalIndicatorSeries,
    fearGreedSeries,
    momentumSignals,
    latestDate,
    loading,
    error,
    refresh: fetchAllData,
    toggleFocus
  }
}
