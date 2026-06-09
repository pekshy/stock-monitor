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
  IndicatorSeries
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

// 定义优先展示的指标（美元指数、美债短期/中期/长期利率、黄金、白银、比特币）
export const PRIORITY_INDICATORS = [
  // 美元指数相关
  'DXY', 'DTWEXBGS', 'DTWEXM', 'DTWEXO',
  // 美债短期利率
  'DGS1MO', 'DGS3MO', 'DGS6MO', 'DGS1',
  // 美债中期利率
  'DGS2', 'DGS5', 'DGS7',
  // 美债长期利率
  'DGS10', 'DGS20', 'DGS30',
  // 黄金
  'GOLD', 'XAU',
  // 白银
  'SILVER', 'XAG',
  // 比特币
  'BTC', 'BITCOIN', 'BTCUSD'
]

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
