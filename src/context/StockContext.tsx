import React, { createContext, useContext } from 'react'
import { useStocks } from '../hooks/useStockData'

interface StockContextType {
  stocks: any[]
  latestDate: string | null
  loading: boolean
  refresh: () => void
}

const StockContext = createContext<StockContextType | null>(null)

export function StockProvider({ children }: { children: React.ReactNode }) {
  const { stocks, latestDate, loading, refresh } = useStocks()
  
  return (
    <StockContext.Provider value={{ stocks, latestDate, loading, refresh }}>
      {children}
    </StockContext.Provider>
  )
}

export function useStockContext() {
  const context = useContext(StockContext)
  if (!context) {
    throw new Error('useStockContext must be used within StockProvider')
  }
  return context
}
