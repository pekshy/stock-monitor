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

  useEffect(() => {
    fetchAllData()
  }, [])

  async function fetchAllData() {
    try {
      setLoading(true)
      
      const [
        { data: etfInfo, error: etfError },
        { data: chinaInd, error: chinaError },
        { data: fredInd, error: fredError }
      ] = await Promise.all([
        supabase.from('etf_info').select('*'),
        supabase.from('china_indicators').select('*').order('value_date', { ascending: false }),
        supabase.from('fred_indicators').select('*').order('value_date', { ascending: false })
      ])

      if (etfError) throw etfError
      if (chinaError) throw chinaError
      if (fredError) throw fredError

      const etfCodes = etfInfo?.map(e => e.etf_code) || []
      
      const [
        { data: dailyData, error: dailyError },
        { data: indicators, error: indicatorsError },
        { data: signals, error: signalsError }
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

      if (dailyError) throw dailyError
      if (indicatorsError) throw indicatorsError
      if (signalsError) throw signalsError

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

      setEtfs(etfsWithData)
      setChinaIndicators(chinaInd || [])
      setFredIndicators(fredInd || [])
      
      if (dailyData && dailyData.length > 0) {
        setLatestDate(dailyData[0].trade_date)
      }
    } catch (error) {
      console.error('Error fetching ETF data:', error)
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
    refresh: fetchAllData
  }
}
