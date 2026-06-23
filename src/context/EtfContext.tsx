import React, { createContext, useContext } from 'react'
import { useEtfData } from '../hooks/useEtfData'

interface EtfContextType {
  etfs: any[]
  priceByDateMap: Map<string, Map<string, number>>
  loading: boolean
}

const EtfContext = createContext<EtfContextType | null>(null)

export function EtfProvider({ children }: { children: React.ReactNode }) {
  const { etfs, priceByDateMap, loading } = useEtfData()
  
  return (
    <EtfContext.Provider value={{ etfs, priceByDateMap, loading }}>
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
