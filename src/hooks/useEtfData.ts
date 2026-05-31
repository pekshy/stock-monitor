import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import {
  ChinaIndicator,
  FredIndicator
} from '../types'

export function useEtfData() {
  const [etfs, setEtfs] = useState<any[]>([])
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
      
      // 先获取中国宏观指标
      try {
        const { data, error: e } = await supabase.from('china_indicators').select('*')
        if (e) throw e
        console.log('China indicators 原始数据:', data)
        setChinaIndicators(data || [])
      } catch (e) {
        console.error('china_indicators 查询失败:', e)
      }
      
      // 获取FRED指标
      try {
        const { data, error: e } = await supabase.from('fred_indicators').select('*')
        if (e) throw e
        console.log('FRED indicators 原始数据:', data)
        setFredIndicators(data || [])
      } catch (e) {
        console.error('fred_indicators 查询失败:', e)
      }
      
      console.log('数据获取完成')
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
