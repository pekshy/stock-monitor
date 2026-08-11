import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../utils/supabase'
import { EtfNote } from '../types'

type TradeAction = 'buy' | 'sell' | 'watch' | null

function sortByUpdatedTime<T extends { updated_at?: string; created_at: string }>(list: T[]): T[] {
  return [...list].sort((a, b) => {
    const aTime = (a as any).updated_at || a.created_at
    const bTime = (b as any).updated_at || b.created_at
    return bTime.localeCompare(aTime)
  })
}

export function useEtfNotes() {
  const [notes, setNotes] = useState<EtfNote[]>([])
  const [loading, setLoading] = useState(false)

  const fetchNotes = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('etf_notes')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setNotes(sortByUpdatedTime((data as EtfNote[]) || []))
    } catch (err) {
      console.error('Error fetching ETF notes:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const addNote = useCallback(async (symbol: string, noteText: string, tradeAction: TradeAction = null, executionPrice: number | null = null) => {
    if (!noteText.trim()) return
    try {
      const payload: Record<string, any> = { symbol, note: noteText.trim() }
      if (tradeAction) {
        payload.trade_action = tradeAction
        payload.execution_price = tradeAction === 'watch' ? null : executionPrice
      }
      const { data, error } = await supabase
        .from('etf_notes')
        .insert(payload)
        .select()
        .single()
      if (error) throw error
      setNotes(prev => sortByUpdatedTime([data as EtfNote, ...prev]))
    } catch (err) {
      console.error('Error adding ETF note:', err)
      throw err
    }
  }, [])

  const updateNote = useCallback(async (id: number, newText: string) => {
    const text = newText.trim()
    if (!text) return
    try {
      const now = new Date().toISOString()
      const { data, error } = await supabase
        .from('etf_notes')
        .update({ note: text, updated_at: now })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      setNotes(prev => sortByUpdatedTime(prev.map(n => n.id === id ? (data as EtfNote) : n)))
    } catch (err) {
      console.error('Error updating ETF note:', err)
      throw err
    }
  }, [])

  const deleteNote = useCallback(async (id: number) => {
    try {
      const { error } = await supabase
        .from('etf_notes')
        .delete()
        .eq('id', id)
      if (error) throw error
      setNotes(prev => prev.filter(n => n.id !== id))
    } catch (err) {
      console.error('Error deleting ETF note:', err)
      throw err
    }
  }, [])

  return { notes, loading, addNote, updateNote, deleteNote, refresh: fetchNotes }
}

// ETF详情页专用：获取单个ETF的笔记
export function useEtfNotesBySymbol(symbol: string) {
  const [notes, setNotes] = useState<EtfNote[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!symbol) return
    async function fetch() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('etf_notes')
          .select('*')
          .eq('symbol', symbol)
          .order('created_at', { ascending: false })
        if (error) throw error
        setNotes(sortByUpdatedTime((data as EtfNote[]) || []))
      } catch (err) {
        console.error('Error fetching ETF notes:', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [symbol])

  const addNote = useCallback(async (noteText: string, tradeAction: TradeAction = null, executionPrice: number | null = null) => {
    if (!noteText.trim()) return
    try {
      const payload: Record<string, any> = { symbol, note: noteText.trim() }
      if (tradeAction) {
        payload.trade_action = tradeAction
        payload.execution_price = tradeAction === 'watch' ? null : executionPrice
      }
      const { data, error } = await supabase
        .from('etf_notes')
        .insert(payload)
        .select()
        .single()
      if (error) throw error
      setNotes(prev => sortByUpdatedTime([data as EtfNote, ...prev]))
    } catch (err) {
      console.error('Error adding ETF note:', err)
      throw err
    }
  }, [symbol])

  const updateNote = useCallback(async (id: number, newText: string) => {
    const text = newText.trim()
    if (!text) return
    try {
      const now = new Date().toISOString()
      const { data, error } = await supabase
        .from('etf_notes')
        .update({ note: text, updated_at: now })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      setNotes(prev => sortByUpdatedTime(prev.map(n => n.id === id ? (data as EtfNote) : n)))
    } catch (err) {
      console.error('Error updating ETF note:', err)
      throw err
    }
  }, [])

  const deleteNote = useCallback(async (id: number) => {
    try {
      const { error } = await supabase
        .from('etf_notes')
        .delete()
        .eq('id', id)
      if (error) throw error
      setNotes(prev => prev.filter(n => n.id !== id))
    } catch (err) {
      console.error('Error deleting ETF note:', err)
      throw err
    }
  }, [])

  return { notes, loading, addNote, updateNote, deleteNote }
}
