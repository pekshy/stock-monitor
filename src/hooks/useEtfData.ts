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
  IndicatorCategory
} from '../types'

type AnyIndicator = ChinaIndicator | FredIndicator | MarketIndicator

function groupIndicatorsBySeries(indicators: AnyIndicator[]): IndicatorSeries[] {
  const grouped = new Map<string, { date: string; value: number }[]>()
  const latestMap = new Map<string, { value: number; date: string }>()

  indicators.forEach(ind => {
    if (!grouped.has(ind.indicator_id)) {
      grouped.set(ind.indicator_id, [])
    }
    grouped.get(ind.indicator_id)!.push({ date: ind.date, value: ind.value })

    const existing = latestMap.get(ind.indicator_id)
    if (!existing || new Date(ind.date) > new Date(existing.date)) {
      latestMap.set(ind.indicator_id, { value: ind.value, date: ind.date })
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
}

// 全球指标分类
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
    id: 'treasury_short',
    label: '美债短期利率',
    color: '#f59e0b',
    matches: (id) => {
      const u = id.toUpperCase()
      return u === 'DGS1MO' || u === 'DGS3MO' || u === 'DGS6MO' || u === 'DGS1' || u === 'DGS1Y' ||
             u.includes('TREASURY_1M') || u.includes('TREASURY_3M') || u.includes('TREASURY_6M') || u.includes('TREASURY_1Y')
    },
    defaultIndicator: 'treasury_3m'
  },
  {
    id: 'treasury_mid',
    label: '美债中期利率',
    color: '#ea580c',
    matches: (id) => {
      const u = id.toUpperCase()
      return u === 'DGS2' || u === 'DGS5' || u === 'DGS7' || u === 'DGS2Y' || u === 'DGS5Y' || u === 'DGS7Y' ||
             u.includes('TREASURY_2Y') || u.includes('TREASURY_5Y') || u.includes('TREASURY_7Y')
    },
    defaultIndicator: 'treasury_2y'
  },
  {
    id: 'treasury_long',
    label: '美债长期利率',
    color: '#dc2626',
    matches: (id) => {
      const u = id.toUpperCase()
      return u === 'DGS10' || u === 'DGS20' || u === 'DGS30' || u === 'DGS10Y' || u === 'DGS20Y' || u === 'DGS30Y' ||
             u.includes('TREASURY_10Y') || u.includes('TREASURY_20Y') || u.includes('TREASURY_30Y')
    },
    defaultIndicator: 'treasury_10y'
  },
  {
    id: 'fed_funds',
    label: '美联储政策利率',
    color: '#7c3aed',
    matches: (id) => {
      const u = id.toUpperCase()
      return u.includes('FED') || u.includes('FUNDS') || u.includes('FF')
    },
    defaultIndicator: 'FED.FUNDS.RATE'
  },
  {
    id: 'precious_metals',
    label: '贵金属（黄金/白银）',
    color: '#ca8a04',
    matches: (id) => {
      const u = id.toUpperCase()
      return u === 'GOLD' || u === 'XAU' || u === 'SILVER' || u === 'XAG' || u.includes('GOLD') || u.includes('SILVER')
    },
    defaultIndicator: 'GOLD'
  },
  {
    id: 'commodities',
    label: '大宗商品（能源等）',
    color: '#16a34a',
    matches: (id) => {
      const u = id.toUpperCase()
      return u.includes('CRUDE') || u.includes('BRENT') || u.includes('OIL') || u.includes('WTI')
    },
    defaultIndicator: 'brent_crude'
  },
  {
    id: 'crypto',
    label: '加密货币',
    color: '#f97316',
    matches: (id) => {
      const u = id.toUpperCase()
      return u.includes('BTC') || u.includes('BITCOIN') || u.includes('ETH') || u.includes('ETHEREUM')
    },
    defaultIndicator: 'BITCOIN'
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
  }
]

// 中国宏观指标分类
const CHINA_CATEGORIES: CategoryRule[] = [
  {
    id: 'interest_rate',
    label: '货币/利率',
    color: '#0891b2',
    matches: (id) => {
      const u = id.toUpperCase()
      return u.includes('SHIBOR') || u.includes('LPR') || u.includes('MONEY') || u.includes('SUPPLY') || u.includes('M1') || u.includes('M2')
    },
    defaultIndicator: 'SHIBOR'
  },
  {
    id: 'inflation',
    label: '物价/通胀',
    color: '#dc2626',
    matches: (id) => {
      const u = id.toUpperCase()
      return u.includes('CPI') || u.includes('PPI') || u.includes('CORE')
    },
    defaultIndicator: 'CPI'
  },
  {
    id: 'growth',
    label: '经济增长/总需求',
    color: '#7c3aed',
    matches: (id) => {
      const u = id.toUpperCase()
      return u.includes('GDP') || u.includes('DURABLE') || u.includes('CAPACITY') || u.includes('UTILIZATION')
    },
    defaultIndicator: 'GDP'
  },
  {
    id: 'trade_finance',
    label: '外贸/金融',
    color: '#16a34a',
    matches: (id) => {
      const u = id.toUpperCase()
      return u.includes('TRADE') || u.includes('SOCIAL') || u.includes('FINANC') || u.includes('EXPORT') || u.includes('IMPORT')
    },
    defaultIndicator: 'SOCIAL.FINANCING'
  }
]

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

    // 按历史数据量（新鲜度）排序，优先选有数据的
    memberSeries.sort((a, b) => b.history.length - a.history.length)

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
  const [chinaIndicators, setChinaIndicators] = useState<ChinaIndicator[]>([])
  const [fredIndicators, setFredIndicators] = useState<FredIndicator[]>([])
  const [marketIndicators, setMarketIndicators] = useState<MarketIndicator[]>([])
  const [chinaIndicatorSeries, setChinaIndicatorSeries] = useState<IndicatorSeries[]>([])
  const [globalIndicatorSeries, setGlobalIndicatorSeries] = useState<IndicatorSeries[]>([])
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
      
      // 1. 获取ETF信息
      const { data: etfInfoData, error: etfInfoErr } = await supabase
        .from('etf_info')
        .select('*')
      if (etfInfoErr) throw etfInfoErr
      const etfInfo: EtfInfo[] = etfInfoData || []
      console.log('ETF info:', etfInfo)

      // 2. 获取中国宏观指标
      const { data: chinaData, error: chinaErr } = await supabase
        .from('china_indicators')
        .select('*')
        .order('date', { ascending: false })
      if (chinaErr) throw chinaErr
      console.log('China indicators:', chinaData)
      setChinaIndicators(chinaData || [])

      // 3. 获取FRED指标（美元指数、美债利率等）
      const { data: fredData, error: fredErr } = await supabase
        .from('fred_indicators')
        .select('*')
        .order('date', { ascending: false })
      if (fredErr) throw fredErr
      console.log('FRED indicators:', fredData)
      setFredIndicators(fredData || [])

      // 3.5 获取市场指标（黄金、白银、比特币等大宗商品和数字货币）
      const { data: marketData, error: marketErr } = await supabase
        .from('market_indicators')
        .select('*')
        .order('date', { ascending: false })
      if (marketErr) throw marketErr
      console.log('Market indicators:', marketData)
      setMarketIndicators(marketData || [])

      // 4. 分组为时序数据
      setChinaIndicatorSeries(groupIndicatorsBySeries(chinaData || []))
      setGlobalIndicatorSeries(mergeIndicatorSeries(
        groupIndicatorsBySeries(fredData || []),
        groupIndicatorsBySeries(marketData || [])
      ))

      // 4. 如果有ETF，获取它们的数据
      let etfsWithData: EtfWithData[] = []
      
      if (etfInfo.length > 0) {
        const symbols = etfInfo.map(e => e.symbol)
        const indexCodes = etfInfo.map(e => e.tracking_index_code).filter((c): c is string => !!c)
        
        // 获取ETF日数据
        const { data: dailyData, error: dailyErr } = await supabase
          .from('etf_daily_data')
          .select('*')
          .in('symbol', symbols)
          .order('trade_date', { ascending: false })
        if (dailyErr) throw dailyErr
        console.log('ETF daily data:', dailyData)

        // 获取ETF指标
        const { data: indicatorsData, error: indicatorsErr } = await supabase
          .from('etf_indicators')
          .select('*')
          .in('symbol', symbols)
          .order('trade_date', { ascending: false })
        if (indicatorsErr) throw indicatorsErr
        console.log('ETF indicators:', indicatorsData)

        // 获取ETF信号
        const { data: signalsData, error: signalsErr } = await supabase
          .from('etf_claw_signals')
          .select('*')
          .in('symbol', symbols)
          .order('trade_date', { ascending: false })
        if (signalsErr) throw signalsErr
        console.log('ETF signals:', signalsData)

        // 获取指数估值
        let indexValuations: EtfTrackedIndexHistory[] = []
        if (indexCodes.length > 0) {
          const { data: indexData, error: indexErr } = await supabase
            .from('etf_tracked_index_history')
            .select('*')
            .in('index_code', indexCodes)
            .order('trade_date', { ascending: false })
          if (indexErr) throw indexErr
          indexValuations = indexData || []
          console.log('Index valuations:', indexValuations)
        }

        // 为每个ETF整理最新数据
        const latestDaily = new Map<string, EtfDailyData>()
        const latestIndicators = new Map<string, EtfIndicators>()
        const latestSignal = new Map<string, EtfClawSignal>()
        const latestIndexValuation = new Map<string, EtfTrackedIndexHistory>()

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

        etfsWithData = etfInfo.map(e => ({
          ...e,
          latest_daily: latestDaily.get(e.symbol),
          latest_indicator: latestIndicators.get(e.symbol),
          latest_signal: latestSignal.get(e.symbol),
          latest_index_valuation: e.tracking_index_code ? latestIndexValuation.get(e.tracking_index_code) : undefined
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

  return {
    etfs,
    chinaIndicators,
    fredIndicators,
    marketIndicators,
    chinaIndicatorSeries,
    globalIndicatorSeries,
    latestDate,
    loading,
    error,
    refresh: fetchAllData
  }
}
