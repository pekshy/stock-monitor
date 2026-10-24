import React, { useState, useMemo, FormEvent } from 'react'
import { TrendingUp, LogOut, LogIn, Lock, Eye, EyeOff, X, AlertCircle, BarChart3, Layers, Wallet, FlaskConical, Globe2, Target } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * 全局导航：四个板块的唯一定义处。
 * 板块切换统一走这里，页面内部不再各自维护一套 tab。
 */
const NAV_ITEMS = [
  { key: 'trade', label: '交易', to: '/?tab=trade', Icon: Wallet },
  { key: 'etf', label: 'ETF', to: '/etf', Icon: Layers },
  { key: 'stock', label: '股票', to: '/stocks', Icon: BarChart3 },
  { key: 'research', label: '行业研究', to: '/research', Icon: FlaskConical },
  { key: 'macro', label: '宏观', to: '/macro', Icon: Globe2 },
  { key: 'paper', label: '模拟盘', to: '/paper', Icon: Target },
] as const

type NavKey = typeof NAV_ITEMS[number]['key']

/**
 * 当前所处板块，与 Home 的 getActiveTab 保持同一口径：
 * `/` 默认落交易板块，所以「股票」入口必须指向 /stocks，
 * 否则点「股票」会落到交易页。
 */
function useActiveSection(): NavKey {
  const { pathname, search } = useLocation()
  return useMemo(() => {
    if (pathname.startsWith('/research')) return 'research'
    if (pathname.startsWith('/macro')) return 'macro'
    if (pathname.startsWith('/paper')) return 'paper'
    if (pathname.startsWith('/etf')) return 'etf'
    // 个股/行业详情页归属「股票」
    if (pathname.startsWith('/company/') || pathname.startsWith('/stock/') || pathname.startsWith('/industry/')) return 'stock'
    if (pathname === '/stocks') return 'stock'
    if (pathname === '/etf') return 'etf'
    if (new URLSearchParams(search).get('tab') === 'trade') return 'trade'
    return 'trade'
  }, [pathname, search])
}

const Header: React.FC = () => {
  const { isAuthenticated, login, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [pwd, setPwd] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const activeSection = useActiveSection()

  const doLogin = async (e: FormEvent) => {
    e.preventDefault()
    if (!pwd.trim() || busy) return
    setBusy(true); setErr('')
    try {
      const ok = await login(pwd)
      if (ok) {
        setShowLogin(false); setPwd('')
      } else {
        setErr('暗号错误，请重试')
        setPwd('')
      }
    } catch {
      setErr('登录失败，请稍后重试')
    } finally {
      setBusy(false)
    }
  }

  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 小屏：Logo + 状态在首行，导航独占第二行；大屏：三者同行 */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-2.5">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0">
            <TrendingUp className="h-6 w-6" />
            <h1 className="text-lg font-bold whitespace-nowrap">涛哥投研工作室</h1>
          </Link>

          {/* 全局导航：小屏换行到第二行，大屏与 Logo 同行 */}
          <nav className="order-3 lg:order-2 w-full lg:w-auto flex items-center gap-0.5 overflow-x-auto rounded-xl bg-white/10 ring-1 ring-white/15 p-1">
            {NAV_ITEMS.map(({ key, label, to, Icon }) => {
              const on = activeSection === key
              return (
                <Link
                  key={key}
                  to={to}
                  aria-current={on ? 'page' : undefined}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all ${
                    on
                      ? 'bg-white text-primary font-semibold shadow-sm'
                      : 'text-white/90 font-medium hover:bg-white/15 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="order-2 lg:order-3 ml-auto flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-xs bg-blue-800 hover:bg-blue-900 px-3 py-1.5 rounded-lg transition-colors"
                title="退出登录"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>退出</span>
              </button>
            ) : (
              <button
                onClick={() => { setShowLogin(true); setErr(''); setPwd('') }}
                className="flex items-center gap-1.5 text-xs bg-blue-800 hover:bg-blue-900 px-3 py-1.5 rounded-lg transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>登录</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 行内登录弹窗（公开页面上不打断浏览） */}
      {showLogin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setShowLogin(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Lock className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">输入暗号登录</h2>
              </div>
              <button
                onClick={() => setShowLogin(false)}
                className="ml-auto p-1 text-gray-400 hover:text-gray-600"
                title="关闭"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={doLogin} className="space-y-3">
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={pwd}
                  onChange={e => { setPwd(e.target.value); if (err) setErr('') }}
                  placeholder="请输入暗号"
                  autoFocus
                  disabled={busy}
                  className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(p => !p)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {err && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{err}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={busy || !pwd.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 text-white text-sm font-semibold rounded-xl shadow-md transition-all disabled:cursor-not-allowed"
              >
                <LogIn className="h-4 w-4" />
                {busy ? '验证中...' : '登录'}
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
