import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../utils/supabase'
import { TradeRecord } from '../types'

export function useTradeRecords() {
  const [records, setRecords] = useState<TradeRecord[]>([])
  const [loading, setLoading] = useState(false)

  const fetchRecords = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('trade_records')
        .select('*')
        .order('trade_date', { ascending: false })
      if (error) throw error
      setRecords((data as TradeRecord[]) || [])
    } catch (err) {
      console.error('Error fetching trade records:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  const addRecord = useCallback(async (record: Omit<TradeRecord, 'id' | 'created_at' | 'status' | 'linked_id'>) => {
    try {
      const { data, error } = await supabase
        .from('trade_records')
        .insert({ ...record, status: 'open' })
        .select()
        .single()
      if (error) throw error
      setRecords(prev => [data as TradeRecord, ...prev])
    } catch (err) {
      console.error('Error adding trade record:', err)
      throw err
    }
  }, [])

  const updateRecord = useCallback(async (id: number, updates: Partial<TradeRecord>) => {
    try {
      const { data, error } = await supabase
        .from('trade_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      setRecords(prev => prev.map(r => r.id === id ? (data as TradeRecord) : r))
    } catch (err) {
      console.error('Error updating trade record:', err)
      throw err
    }
  }, [])

  const deleteRecord = useCallback(async (id: number) => {
    try {
      const { error } = await supabase
        .from('trade_records')
        .delete()
        .eq('id', id)
      if (error) throw error
      setRecords(prev => prev.filter(r => r.id !== id))
    } catch (err) {
      console.error('Error deleting trade record:', err)
      throw err
    }
  }, [])

  return { records, loading, addRecord, updateRecord, deleteRecord, refresh: fetchRecords }
}
