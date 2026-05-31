import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import {
  EtfInfo,
  EtfDailyData,
  EtfIndicators,
  EtfClawSignal,
  ChinaIndicator,
  FredIndicator,
  EtfWithData
} from '../types'

export function useEtfData() {
  const [etfs, setEtfs] = useState<EtfWithData[]>([])
  const [chinaIndicators, setChinaIndicators] = useState<ChinaIndicator[]>([])
  const [fredIndicators, setFredIndicators] = useState<FredIndicator[]>([])
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

      // 3. 获取FRED指标
      const { data: fredData, error: fredErr } = await supabase
        .from('fred_indicators')
        .select('*')
        .order('date', { ascending: false })
      if (fredErr) throw fredErr
      console.log('FRED indicators:', fredData)
      setFredIndicators(fredData || [])

      // 4. 如果有ETF，获取它们的数据
      let etfsWithData: EtfWithData[] = []
      
      if (etfInfo.length > 0) {
        const symbols = etfInfo.map(e => e.symbol)
        
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

        // 为每个ETF整理最新数据
        const latestDaily = new Map<string, EtfDailyData>()
        const latestIndicators = new Map<string, EtfIndicators>()
        const latestSignal = new Map<string, EtfClawSignal>()

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

        etfsWithData = etfInfo.map(e => ({
          ...e,
          latest_daily: latestDaily.get(e.symbol),
          latest_indicator: latestIndicators.get(e.symbol),
          latest_signal: latestSignal.get(e.symbol)
        }))

        // 设置最新日期
        if (dailyData && dailyData.length > 0) {
          setLatestDate(dailyData[0].trade_date)
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
    latestDate,
    loading,
    error,
    refresh: fetchAllData
  }
}
