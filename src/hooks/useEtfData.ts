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
      
      let etfInfo: any[] = []
      let chinaInd: any[] = []
      let fredInd: any[] = []
      
      // 获取ETF信息
      try {
        const { data, error: e } = await supabase.from('etf_info').select('*')
        if (e) throw e
        etfInfo = data || []
        console.log('ETF info:', etfInfo)
      } catch (e) {
        console.error('etf_info 查询失败:', e)
      }
      
      // 获取中国宏观指标
      try {
        const { data, error: e } = await supabase.from('china_indicators').select('*')
        if (e) throw e
        chinaInd = data || []
        console.log('China indicators:', chinaInd)
      } catch (e) {
        console.error('china_indicators 查询失败:', e)
      }
      
      // 获取FRED指标
      try {
        const { data, error: e } = await supabase.from('fred_indicators').select('*')
        if (e) throw e
        fredInd = data || []
        console.log('FRED indicators:', fredInd)
      } catch (e) {
        console.error('fred_indicators 查询失败:', e)
      }

      const etfCodes = etfInfo.map(e => e.etf_code)
      console.log('ETF codes:', etfCodes)
      
      let dailyData: EtfDailyData[] = []
      let indicators: EtfIndicators[] = []
      let signals: EtfClawSignal[] = []

      if (etfCodes.length > 0) {
        // 获取ETF日数据
        try {
          const { data, error: e } = await supabase.from('etf_daily_data').select('*').in('etf_code', etfCodes)
          if (e) throw e
          dailyData = data || []
          console.log('Daily data:', dailyData)
        } catch (e) {
          console.error('etf_daily_data 查询失败:', e)
        }
        
        // 获取ETF指标
        try {
          const { data, error: e } = await supabase.from('etf_indicators').select('*').in('etf_code', etfCodes)
          if (e) throw e
          indicators = data || []
          console.log('Indicators:', indicators)
        } catch (e) {
          console.error('etf_indicators 查询失败:', e)
        }
        
        // 获取ETF信号
        try {
          const { data, error: e } = await supabase.from('etf_claw_signals').select('*').in('etf_code', etfCodes)
          if (e) throw e
          signals = data || []
          console.log('Signals:', signals)
        } catch (e) {
          console.error('etf_claw_signals 查询失败:', e)
        }
      }

      const latestDaily = new Map<string, EtfDailyData>()
      const latestIndicators = new Map<string, EtfIndicators>()
      const latestSignal = new Map<string, EtfClawSignal>()

      dailyData.forEach(d => {
        if (!latestDaily.has(d.etf_code)) {
          latestDaily.set(d.etf_code, d)
        }
      })

      indicators.forEach(i => {
        if (!latestIndicators.has(i.etf_code)) {
          latestIndicators.set(i.etf_code, i)
        }
      })

      signals.forEach(s => {
        if (!latestSignal.has(s.etf_code)) {
          latestSignal.set(s.etf_code, s)
        }
      })

      const etfsWithData = etfInfo.map(e => ({
        ...e,
        latest_daily: latestDaily.get(e.etf_code),
        latest_indicator: latestIndicators.get(e.etf_code),
        latest_signal: latestSignal.get(e.etf_code)
      }))

      console.log('Final ETFs with data:', etfsWithData)

      setEtfs(etfsWithData)
      setChinaIndicators(chinaInd)
      setFredIndicators(fredInd)
      
      // 找出所有数据中最新的交易日
      let foundLatestDate: string | null = null
      
      if (dailyData.length > 0) {
        foundLatestDate = dailyData[0].trade_date
      } else if (indicators.length > 0) {
        foundLatestDate = indicators[0].trade_date
      } else if (signals.length > 0) {
        foundLatestDate = signals[0].signal_date
      } else if (chinaInd.length > 0) {
        foundLatestDate = chinaInd[0].value_date
      } else if (fredInd.length > 0) {
        foundLatestDate = fredInd[0].value_date
      }
      
      if (foundLatestDate) {
        console.log('找到最近交易日:', foundLatestDate)
        setLatestDate(foundLatestDate)
      }
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
