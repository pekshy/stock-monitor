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
 * 计算N个月前的日期（格式：YYYY-MM-DD）
 */
function getDateMonthsAgo(months: number): string {
  const date = new Date()
  date.setMonth(date.getMonth() - months)
  return date.toISOString().slice(0, 10)
}

/**
 * 按需加载单个ETF的历史数据（用于详情页，最近6个月）
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

        // 只获取最近6个月的数据
        const sixMonthsAgo = getDateMonthsAgo(6)

        const [dailyRes, indicatorsRes, signalsRes, fitRes] = await Promise.all([
          supabase.from('etf_daily_data').select('*').eq('symbol', symbol).gte('trade_date', sixMonthsAgo).order('trade_date', { ascending: false }),
          supabase.from('etf_indicators').select('*').eq('symbol', symbol).gte('trade_date', sixMonthsAgo).order('trade_date', { ascending: false }),
          supabase.from('etf_claw_signals').select('*').eq('symbol', symbol).gte('trade_date', sixMonthsAgo).order('trade_date', { ascending: false }),
          supabase.from('etf_butterworth_fit').select('*').eq('symbol', symbol).gte('trade_date', sixMonthsAgo).order('trade_date', { ascending: false })
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