import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../utils/supabase'
import { EtfNote } from '../types'

export function useEtfNotes() {
  const [notes, setNotes] = useState<EtfNote[]>([])
  const [loading, setLoading] = useState(false)

  // 获取所有笔记（倒序，最新在前）
  const fetchNotes = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('etf_notes')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setNotes((data as EtfNote[]) || [])
    } catch (err) {
      console.error('Error fetching ETF notes:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  // 添加笔记
  const addNote = useCallback(async (symbol: string, noteText: string) => {
    if (!noteText.trim()) return
    try {
      const { data, error } = await supabase
        .from('etf_notes')
        .insert({ symbol, note: noteText.trim() })
        .select()
        .single()
      if (error) throw error
      setNotes(prev => [data as EtfNote, ...prev])
    } catch (err) {
      console.error('Error adding ETF note:', err)
      throw err
    }
  }, [])

  // 修改笔记
  const updateNote = useCallback(async (id: number, newText: string) => {
    const text = newText.trim()
    if (!text) return
    try {
      const { data, error } = await supabase
        .from('etf_notes')
        .update({ note: text })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      setNotes(prev => prev.map(n => n.id === id ? (data as EtfNote) : n))
    } catch (err) {
      console.error('Error updating ETF note:', err)
      throw err
    }
  }, [])

  // 删除笔记
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
        setNotes((data as EtfNote[]) || [])
      } catch (err) {
        console.error('Error fetching ETF notes:', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [symbol])

  const addNote = useCallback(async (noteText: string) => {
    if (!noteText.trim()) return
    try {
      const { data, error } = await supabase
        .from('etf_notes')
        .insert({ symbol, note: noteText.trim() })
        .select()
        .single()
      if (error) throw error
      setNotes(prev => [data as EtfNote, ...prev])
    } catch (err) {
      console.error('Error adding ETF note:', err)
      throw err
    }
  }, [symbol])

  const updateNote = useCallback(async (id: number, newText: string) => {
    const text = newText.trim()
    if (!text) return
    try {
      const { data, error } = await supabase
        .from('etf_notes')
        .update({ note: text })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      setNotes(prev => prev.map(n => n.id === id ? (data as EtfNote) : n))
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
