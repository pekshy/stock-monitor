import React, { createContext, useContext } from 'react'
import { useEtfData } from '../hooks/useEtfData'
import { IndicatorSeries, FearGreedSeries, EtfWithData, EtfMomentumSignal } from '../types'

interface EtfContextType {
  etfs: EtfWithData[]
  priceByDateMap: Map<string, Map<string, number>>
  chinaIndicatorSeries: IndicatorSeries[]
  globalIndicatorSeries: IndicatorSeries[]
  fearGreedSeries: FearGreedSeries | null
  momentumSignals: EtfMomentumSignal[]
  latestDate: string | null
  loading: boolean
  error: string | null
  refresh: () => void
}

const EtfContext = createContext<EtfContextType | null>(null)

export function EtfProvider({ children }: { children: React.ReactNode }) {
  const {
    etfs,
    priceByDateMap,
    chinaIndicatorSeries,
    globalIndicatorSeries,
    fearGreedSeries,
    momentumSignals,
    latestDate,
    loading,
    error,
    refresh
  } = useEtfData()
  
  return (
    <EtfContext.Provider value={{
      etfs,
      priceByDateMap,
      chinaIndicatorSeries,
      globalIndicatorSeries,
      fearGreedSeries,
      momentumSignals,
      latestDate,
      loading,
      error,
      refresh
    }}>
      {children}
    </EtfContext.Provider>
  )
}

export function useEtfContext() {
  const context = useContext(EtfContext)
  if (!context) {
    throw new Error('useEtfContext must be used within EtfProvider')
  }
  return context
}
