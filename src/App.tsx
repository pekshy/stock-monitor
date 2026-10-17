import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { StockProvider } from './context/StockContext'
import { EtfProvider } from './context/EtfContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/Header'
import LoginGate from './components/LoginGate'
import Home from './pages/Home'
import IndustryDetail from './pages/IndustryDetail'
import CompanyDetail from './pages/CompanyDetail'
import EtfDetail from './pages/EtfDetail'
import Macro from './pages/Macro'
import ResearchHome from './pages/ResearchHome'
import ResearchCompanies from './pages/ResearchCompanies'
// 企业/股票详情已合并为统一页面 CompanyDetail；旧文件暂留作研究池版本回滚参考
import ResearchInvestors from './pages/ResearchInvestors'

function AppContent() {
  const { isAuthenticated, ready } = useAuth()
  const location = useLocation()
  // 访问策略：全部页面公开只读，唯一受限内容是「交易记录」（首页交易 tab）。
  //   /stocks /etf /industry/:id /stock/:code  —— 股票与行业数据
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
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stocks" element={<Home />} />
          <Route path="/industry/:industry1" element={<IndustryDetail />} />
          {/* 统一详情页：股票板块与行业研究共用，key 可为代码或企业名 */}
          <Route path="/company/:key" element={<CompanyDetail />} />
          <Route path="/stock/:stockCode" element={<CompanyDetail />} />
          <Route path="/etf" element={<Home />} />
          <Route path="/etf/:code" element={<EtfDetail />} />
          {/* 行业研究模块（独立新增，不影响既有路由） */}
          <Route path="/research" element={<ResearchHome />} />
          <Route path="/research/companies" element={<ResearchCompanies />} />
          <Route path="/research/investors" element={<ResearchInvestors />} />
          <Route path="/research/company/:name" element={<CompanyDetail />} />
          {/* 宏观板块：市场指标独立成页，与交易板块解耦 */}
          <Route path="/macro" element={<Macro />} />
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
