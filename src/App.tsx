import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { StockProvider, useStockContext } from './context/StockContext'
import { EtfProvider } from './context/EtfContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/Header'
import LoginGate from './components/LoginGate'
import Home from './pages/Home'
import IndustryDetail from './pages/IndustryDetail'
import StockDetail from './pages/StockDetail'
import EtfDetail from './pages/EtfDetail'

function AppContent() {
  const { latestDate } = useStockContext()
  const { isAuthenticated, ready } = useAuth()

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-lg">加载中...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginGate />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header latestDate={latestDate} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/industry/:industry1" element={<IndustryDetail />} />
          <Route path="/stock/:stockCode" element={<StockDetail />} />
          <Route path="/etf" element={<Home />} />
          <Route path="/etf/:code" element={<EtfDetail />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <StockProvider>
        <EtfProvider>
          <Router>
            <AppContent />
          </Router>
        </EtfProvider>
      </StockProvider>
    </AuthProvider>
  )
}

export default App
