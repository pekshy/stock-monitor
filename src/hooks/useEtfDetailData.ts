import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { EtfDailyData, EtfIndicators, EtfClawSignal, ButterworthFit } from '../types'

interface EtfDetailData {
  dailyData: EtfDailyData[]
  indicators: EtfIndicators[]
  signals: EtfClawSignal[]
  butterworthFit: ButterworthFit[]
  loading: boolean
  error: string | null
}

/**
 * 按需加载单个ETF的完整历史数据（用于详情页）
 */
export function useEtfDetailData(symbol: string | undefined): EtfDetailData {
  const [dailyData, setDailyData] = useState<EtfDailyData[]>([])
  const [indicators, setIndicators] = useState<EtfIndicators[]>([])
  const [signals, setSignals] = useState<EtfClawSignal[]>([])
  const [butterworthFit, setButterworthFit] = useState<ButterworthFit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!symbol) {
      setLoading(false)
      return
    }

    async function fetchDetailData() {
      try {
        setLoading(true)
        setError(null)

        // 并行获取该ETF的所有历史数据
        const [dailyRes, indicatorsRes, signalsRes, fitRes] = await Promise.all([
          supabase.from('etf_daily_data').select('*').eq('symbol', symbol).order('trade_date', { ascending: false }).limit(1000),
          supabase.from('etf_indicators').select('*').eq('symbol', symbol).order('trade_date', { ascending: false }).limit(1000),
          supabase.from('etf_claw_signals').select('*').eq('symbol', symbol).order('trade_date', { ascending: false }).limit(1000),
          supabase.from('etf_butterworth_fit').select('*').eq('symbol', symbol).order('trade_date', { ascending: false }).limit(1000)
        ])

        if (dailyRes.error) throw dailyRes.error
        if (indicatorsRes.error) throw indicatorsRes.error
        if (signalsRes.error) throw signalsRes.error
        if (fitRes.error) throw fitRes.error

        setDailyData(dailyRes.data || [])
        setIndicators(indicatorsRes.data || [])
        setSignals(signalsRes.data || [])
        setButterworthFit((fitRes.data || []) as ButterworthFit[])
      } catch (err: any) {
        console.error('加载ETF详情数据失败:', err)
        setError(err?.message || '加载失败')
      } finally {
        setLoading(false)
      }
    }

    fetchDetailData()
  }, [symbol])

  return { dailyData, indicators, signals, butterworthFit, loading, error }
}