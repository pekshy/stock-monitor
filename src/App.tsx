import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { StockProvider, useStockContext } from './context/StockContext'
import { EtfProvider } from './context/EtfContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/Header'
import LoginGate from './components/LoginGate'
import Home from './pages/Home'
import IndustryDetail from './pages/IndustryDetail'
import StockDetail from './pages/StockDetail'
import EtfDetail from './pages/EtfDetail'
import ResearchHome from './pages/ResearchHome'
import ResearchCompanies from './pages/ResearchCompanies'
import ResearchCompanyDetail from './pages/ResearchCompanyDetail'

function AppContent() {
  const { latestDate } = useStockContext()
  const { isAuthenticated, ready } = useAuth()
  const location = useLocation()
  // 访问策略：全部页面公开只读，唯一受限内容是「交易记录」（首页交易 tab）。
  //   /stocks /etf /industry/:id /stock/:code  —— 行情与行业数据
  //   /research 全模块                          —— 行业研究（图谱/情报/企业）
  // 交易 tab 的门禁下沉到 Home 内部（TradeLocked），因此这里不再整页拦截。
  // 这些路径保留拦截能力，仅用于将来需要重新收紧时切换：
  const PRIVATE_ROUTES: string[] = []
  const needsAuth = PRIVATE_ROUTES.includes(location.pathname)

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-lg">加载中...</div>
      </div>
    )
  }

  if (needsAuth && !isAuthenticated) {
    return <LoginGate />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header latestDate={latestDate} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stocks" element={<Home />} />
          <Route path="/industry/:industry1" element={<IndustryDetail />} />
          <Route path="/stock/:stockCode" element={<StockDetail />} />
          <Route path="/etf" element={<Home />} />
          <Route path="/etf/:code" element={<EtfDetail />} />
          {/* 行业研究模块（独立新增，不影响既有路由） */}
          <Route path="/research" element={<ResearchHome />} />
          <Route path="/research/companies" element={<ResearchCompanies />} />
          <Route path="/research/company/:name" element={<ResearchCompanyDetail />} />
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
