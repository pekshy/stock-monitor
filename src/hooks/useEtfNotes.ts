import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../utils/supabase'
import { EtfNote } from '../types'

type TradeAction = 'buy' | 'sell' | 'watch' | null

interface UpdateNoteValues {
  note: string
  tradeAction?: 'buy' | 'sell' | 'watch' | '' | null
  executionPrice?: number | null
}

function sortByUpdatedTime<T extends { updated_at?: string | null; created_at: string }>(list: T[]): T[] {
  return [...list].sort((a, b) => {
    const aTime = new Date((a.updated_at ?? a.created_at)).getTime()
    const bTime = new Date((b.updated_at ?? b.created_at)).getTime()
    return bTime - aTime
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

  const updateNote = useCallback(async (id: number, values: UpdateNoteValues | string) => {
    const text = typeof values === 'string' ? values.trim() : values.note.trim()
    if (!text) return
    try {
      const now = new Date().toISOString()
      const payload: Record<string, any> = { note: text, updated_at: now }
      if (typeof values === 'object') {
        const action = values.tradeAction || null
        payload.trade_action = action
        payload.execution_price = (action === 'buy' || action === 'sell') ? (values.executionPrice ?? null) : null
      }
      const { data, error } = await supabase
        .from('etf_notes')
        .update(payload)
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

  const updateNote = useCallback(async (id: number, values: UpdateNoteValues | string) => {
    const text = typeof values === 'string' ? values.trim() : values.note.trim()
    if (!text) return
    try {
      const now = new Date().toISOString()
      const payload: Record<string, any> = { note: text, updated_at: now }
      if (typeof values === 'object') {
        const action = values.tradeAction || null
        payload.trade_action = action
        payload.execution_price = (action === 'buy' || action === 'sell') ? (values.executionPrice ?? null) : null
      }
      const { data, error } = await supabase
        .from('etf_notes')
        .update(payload)
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
