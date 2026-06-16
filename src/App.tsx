import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { StockProvider, useStockContext } from './context/StockContext'
import { EtfProvider } from './context/EtfContext'
import Header from './components/Header'
import Home from './pages/Home'
import IndustryDetail from './pages/IndustryDetail'
import StockDetail from './pages/StockDetail'
import EtfBoard from './pages/EtfBoard'
import EtfDetail from './pages/EtfDetail'

function AppContent() {
  const { latestDate } = useStockContext()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header latestDate={latestDate} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/industry/:industry1" element={<IndustryDetail />} />
          <Route path="/stock/:stockCode" element={<StockDetail />} />
          <Route path="/etf" element={<EtfBoard />} />
          <Route path="/etf/:code" element={<EtfDetail />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <StockProvider>
      <EtfProvider>
        <Router>
          <AppContent />
        </Router>
      </EtfProvider>
    </StockProvider>
  )
}

export default App
