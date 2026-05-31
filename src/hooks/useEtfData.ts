import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import {
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
      
      const [
        { data: etfInfo, error: etfError },
        { data: chinaInd, error: chinaError },
        { data: fredInd, error: fredError }
      ] = await Promise.all([
        supabase.from('etf_info').select('*'),
        supabase.from('china_indicators').select('*').order('value_date', { ascending: false }),
        supabase.from('fred_indicators').select('*').order('value_date', { ascending: false })
      ])

      if (etfError) {
        console.error('ETF info error:', etfError)
        throw etfError
      }
      if (chinaError) {
        console.error('China indicators error:', chinaError)
        throw chinaError
      }
      if (fredError) {
        console.error('FRED indicators error:', fredError)
        throw fredError
      }

      console.log('ETF info:', etfInfo)
      console.log('China indicators:', chinaInd)
      console.log('FRED indicators:', fredInd)

      const etfCodes = etfInfo?.map(e => e.etf_code) || []
      console.log('ETF codes:', etfCodes)
      
      let dailyData: EtfDailyData[] | null = null
      let indicators: EtfIndicators[] | null = null
      let signals: EtfClawSignal[] | null = null

      if (etfCodes.length > 0) {
        const [
          { data: dData, error: dailyError },
          { data: iData, error: indicatorsError },
          { data: sData, error: signalsError }
        ] = await Promise.all([
          supabase.from('etf_daily_data')
            .select('*')
            .in('etf_code', etfCodes)
            .order('trade_date', { ascending: false }),
          supabase.from('etf_indicators')
            .select('*')
            .in('etf_code', etfCodes)
            .order('trade_date', { ascending: false }),
          supabase.from('etf_claw_signals')
            .select('*')
            .in('etf_code', etfCodes)
            .order('signal_date', { ascending: false })
        ])

        if (dailyError) {
          console.error('Daily data error:', dailyError)
          throw dailyError
        }
        if (indicatorsError) {
          console.error('Indicators error:', indicatorsError)
          throw indicatorsError
        }
        if (signalsError) {
          console.error('Signals error:', signalsError)
          throw signalsError
        }

        dailyData = dData
        indicators = iData
        signals = sData

        console.log('Daily data:', dailyData)
        console.log('Indicators:', indicators)
        console.log('Signals:', signals)
      } else {
        console.log('etf_info表中没有数据，只获取宏观指标数据')
      }

      const latestDaily = new Map<string, EtfDailyData>()
      const latestIndicators = new Map<string, EtfIndicators>()
      const latestSignal = new Map<string, EtfClawSignal>()

      dailyData?.forEach(d => {
        if (!latestDaily.has(d.etf_code)) {
          latestDaily.set(d.etf_code, d)
        }
      })

      indicators?.forEach(i => {
        if (!latestIndicators.has(i.etf_code)) {
          latestIndicators.set(i.etf_code, i)
        }
      })

      signals?.forEach(s => {
        if (!latestSignal.has(s.etf_code)) {
          latestSignal.set(s.etf_code, s)
        }
      })

      const etfsWithData = etfInfo?.map(e => ({
        ...e,
        latest_daily: latestDaily.get(e.etf_code),
        latest_indicator: latestIndicators.get(e.etf_code),
        latest_signal: latestSignal.get(e.etf_code)
      })) || []

      console.log('Final ETFs with data:', etfsWithData)

      setEtfs(etfsWithData)
      setChinaIndicators(chinaInd || [])
      setFredIndicators(fredInd || [])
      
      // 找出所有数据中最新的交易日
      let foundLatestDate: string | null = null
      
      // 检查ETF日数据
      if (dailyData && dailyData.length > 0) {
        foundLatestDate = dailyData[0].trade_date
      }
      
      // 如果没有，检查ETF指标数据
      if (!foundLatestDate && indicators && indicators.length > 0) {
        foundLatestDate = indicators[0].trade_date
      }
      
      // 如果没有，检查ETF信号数据
      if (!foundLatestDate && signals && signals.length > 0) {
        foundLatestDate = signals[0].signal_date
      }
      
      // 如果还是没有，检查中国宏观指标数据
      if (!foundLatestDate && chinaInd && chinaInd.length > 0) {
        foundLatestDate = chinaInd[0].value_date
      }
      
      // 如果还是没有，检查FRED指标数据
      if (!foundLatestDate && fredInd && fredInd.length > 0) {
        foundLatestDate = fredInd[0].value_date
      }
      
      if (foundLatestDate) {
        console.log('找到最近交易日:', foundLatestDate)
        setLatestDate(foundLatestDate)
      }
    } catch (error) {
      console.error('Error fetching ETF data:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
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
