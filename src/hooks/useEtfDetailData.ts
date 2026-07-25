import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { EtfDailyData, EtfIndicators, EtfClawSignal, ButterworthFit, EtfMomentumSignal } from '../types'

interface EtfDetailData {
  dailyData: EtfDailyData[]
  indicators: EtfIndicators[]
  signals: EtfClawSignal[]
  butterworthFit: ButterworthFit[]
  momentumHistory: EtfMomentumSignal[]
  loading: boolean
  error: string | null
}

// 简单的内存缓存，切换ETF时避免重复请求
const cache = new Map<string, { data: Omit<EtfDetailData, 'loading' | 'error'>; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5分钟

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
 * 只查询需要的列以减少数据传输量
 */
export function useEtfDetailData(symbol: string | undefined): EtfDetailData {
  const [dailyData, setDailyData] = useState<EtfDailyData[]>([])
  const [indicators, setIndicators] = useState<EtfIndicators[]>([])
  const [signals, setSignals] = useState<EtfClawSignal[]>([])
  const [butterworthFit, setButterworthFit] = useState<ButterworthFit[]>([])
  const [momentumHistory, setMomentumHistory] = useState<EtfMomentumSignal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!symbol) {
      setLoading(false)
      return
    }

    // 检查缓存
    const cached = cache.get(symbol)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setDailyData(cached.data.dailyData)
      setIndicators(cached.data.indicators)
      setSignals(cached.data.signals)
      setButterworthFit(cached.data.butterworthFit)
      setMomentumHistory(cached.data.momentumHistory)
      setLoading(false)
      setError(null)
      return
    }

    async function fetchDetailData() {
      try {
        setLoading(true)
        setError(null)

        const sixMonthsAgo = getDateMonthsAgo(6)
        const threeMonthsAgo = getDateMonthsAgo(3)

        // 只查询需要的列，减少数据传输量
        const [dailyRes, indicatorsRes, signalsRes, fitRes, momentumRes] = await Promise.all([
          supabase
            .from('etf_daily_data')
            .select('symbol,trade_date,open,high,low,close,volume,change_pct,change_5d,close_percentile_6m,volume_percentile_6m')
            .eq('symbol', symbol)
            .gte('trade_date', sixMonthsAgo)
            .order('trade_date', { ascending: false }),
          supabase
            .from('etf_indicators')
            .select('symbol,trade_date,ma5,ma10,ma20,ma60')
            .eq('symbol', symbol)
            .gte('trade_date', sixMonthsAgo)
            .order('trade_date', { ascending: false }),
          supabase
            .from('etf_claw_signals')
            .select('symbol,trade_date,action,buy_signals,sell_signals,buy_count,sell_count,k,d,j,rsi,macd_hist')
            .eq('symbol', symbol)
            .gte('trade_date', sixMonthsAgo)
            .order('trade_date', { ascending: false }),
          supabase
            .from('etf_butterworth_fit')
            .select('symbol,trade_date,fitted')
            .eq('symbol', symbol)
            .gte('trade_date', sixMonthsAgo)
            .order('trade_date', { ascending: false }),
          supabase
            .from('etf_momentum_signals')
            .select('symbol,trade_date,final_score,regression_score,multi_period_score,risk_adjusted_score,technical_score,rank')
            .eq('symbol', symbol)
            .gte('trade_date', threeMonthsAgo)
            .order('trade_date', { ascending: false })
        ])

        if (dailyRes.error) throw dailyRes.error
        if (indicatorsRes.error) throw indicatorsRes.error
        if (signalsRes.error) throw signalsRes.error
        if (fitRes.error) throw fitRes.error
        if (momentumRes.error) throw momentumRes.error

        const result = {
          dailyData: (dailyRes.data || []) as EtfDailyData[],
          indicators: (indicatorsRes.data || []) as EtfIndicators[],
          signals: (signalsRes.data || []) as EtfClawSignal[],
          butterworthFit: (fitRes.data || []) as ButterworthFit[],
          momentumHistory: (momentumRes.data || []) as EtfMomentumSignal[]
        }

        setDailyData(result.dailyData)
        setIndicators(result.indicators)
        setSignals(result.signals)
        setButterworthFit(result.butterworthFit)
        setMomentumHistory(result.momentumHistory)

        // 写入缓存
        cache.set(symbol!, { data: result, timestamp: Date.now() })
      } catch (err: any) {
        console.error('加载ETF详情数据失败:', err)
        setError(err?.message || '加载失败')
      } finally {
        setLoading(false)
      }
    }

    fetchDetailData()
  }, [symbol])

  return { dailyData, indicators, signals, butterworthFit, momentumHistory, loading, error }
}