import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../utils/supabase'
import { StockNote } from '../types'

export function useStockNotes() {
  const [notes, setNotes] = useState<StockNote[]>([])
  const [loading, setLoading] = useState(false)

  const fetchNotes = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('stock_notes')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setNotes((data as StockNote[]) || [])
    } catch (err) {
      console.error('Error fetching stock notes:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const addNote = useCallback(async (stockCode: string, noteText: string) => {
    if (!noteText.trim()) return
    try {
      const { data, error } = await supabase
        .from('stock_notes')
        .insert({ stock_code: stockCode, note: noteText.trim() })
        .select()
        .single()
      if (error) throw error
      setNotes(prev => [data as StockNote, ...prev])
    } catch (err) {
      console.error('Error adding stock note:', err)
      throw err
    }
  }, [])

  const updateNote = useCallback(async (id: number, newText: string) => {
    const text = newText.trim()
    if (!text) return
    try {
      const { data, error } = await supabase
        .from('stock_notes')
        .update({ note: text, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      setNotes(prev => prev.map(n => n.id === id ? (data as StockNote) : n))
    } catch (err) {
      console.error('Error updating stock note:', err)
      throw err
    }
  }, [])

  const deleteNote = useCallback(async (id: number) => {
    try {
      const { error } = await supabase
        .from('stock_notes')
        .delete()
        .eq('id', id)
      if (error) throw error
      setNotes(prev => prev.filter(n => n.id !== id))
    } catch (err) {
      console.error('Error deleting stock note:', err)
      throw err
    }
  }, [])

  return { notes, loading, addNote, updateNote, deleteNote, refresh: fetchNotes }
}

export function useStockNotesByCode(stockCode: string) {
  const [notes, setNotes] = useState<StockNote[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!stockCode) return
    async function fetch() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('stock_notes')
          .select('*')
          .eq('stock_code', stockCode)
          .order('created_at', { ascending: false })
        if (error) throw error
        setNotes((data as StockNote[]) || [])
      } catch (err) {
        console.error('Error fetching stock notes:', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [stockCode])

  const addNote = useCallback(async (noteText: string) => {
    if (!noteText.trim()) return
    try {
      const { data, error } = await supabase
        .from('stock_notes')
        .insert({ stock_code: stockCode, note: noteText.trim() })
        .select()
        .single()
      if (error) throw error
      setNotes(prev => [data as StockNote, ...prev])
    } catch (err) {
      console.error('Error adding stock note:', err)
      throw err
    }
  }, [stockCode])

  const updateNote = useCallback(async (id: number, newText: string) => {
    const text = newText.trim()
    if (!text) return
    try {
      const { data, error } = await supabase
        .from('stock_notes')
        .update({ note: text, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      setNotes(prev => prev.map(n => n.id === id ? (data as StockNote) : n))
    } catch (err) {
      console.error('Error updating stock note:', err)
      throw err
    }
  }, [])

  const deleteNote = useCallback(async (id: number) => {
    try {
      const { error } = await supabase
        .from('stock_notes')
        .delete()
        .eq('id', id)
      if (error) throw error
      setNotes(prev => prev.filter(n => n.id !== id))
    } catch (err) {
      console.error('Error deleting stock note:', err)
      throw err
    }
  }, [])

  return { notes, loading, addNote, updateNote, deleteNote }
}
