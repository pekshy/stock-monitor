import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../utils/supabase'
import { MarketView } from '../types'

export function useMarketViews() {
  const [views, setViews] = useState<MarketView[]>([])
  const [loading, setLoading] = useState(false)

  const fetchViews = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('market_views')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setViews((data as MarketView[]) || [])
    } catch (err) {
      console.error('Error fetching market views:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchViews()
  }, [fetchViews])

  const addView = useCallback(async (content: string, title?: string | null, viewType?: string | null) => {
    if (!content.trim()) return
    try {
      const { data, error } = await supabase
        .from('market_views')
        .insert({ content: content.trim(), title: title || null, view_type: viewType || null })
        .select()
        .single()
      if (error) throw error
      setViews(prev => [data as MarketView, ...prev])
    } catch (err) {
      console.error('Error adding market view:', err)
      throw err
    }
  }, [])

  const updateView = useCallback(async (id: number, updates: Partial<MarketView>) => {
    try {
      const { data, error } = await supabase
        .from('market_views')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      setViews(prev => prev.map(v => v.id === id ? (data as MarketView) : v))
    } catch (err) {
      console.error('Error updating market view:', err)
      throw err
    }
  }, [])

  const deleteView = useCallback(async (id: number) => {
    try {
      const { error } = await supabase
        .from('market_views')
        .delete()
        .eq('id', id)
      if (error) throw error
      setViews(prev => prev.filter(v => v.id !== id))
    } catch (err) {
      console.error('Error deleting market view:', err)
      throw err
    }
  }, [])

  return { views, loading, addView, updateView, deleteView, refresh: fetchViews }
}
