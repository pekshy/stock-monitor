import React, { useState, FormEvent } from 'react'
import { TrendingUp, Calendar, LogOut, LogIn, Lock, Eye, EyeOff, X, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface HeaderProps {
  latestDate?: string | null
}

const Header: React.FC<HeaderProps> = ({ latestDate }) => {
  const { isAuthenticated, login, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [pwd, setPwd] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return null
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const displayDate = formatDate(latestDate)

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <TrendingUp className="h-6 w-6" />
            <h1 className="text-lg font-bold">涛哥投研工作室</h1>
          </Link>
          <div className="flex items-center gap-3">
            {displayDate && (
              <div className="flex items-center gap-1.5 text-xs bg-blue-800 px-3 py-1.5 rounded-lg">
                <Calendar className="h-3.5 w-3.5" />
                <span>数据更新至：{displayDate}</span>
              </div>
            )}
            {/* 登录状态徽标：绿点=已登录，灰点=未登录（只读） */}
            <div
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg ${
                isAuthenticated ? 'bg-blue-800' : 'bg-blue-800/60'}`}
              title={isAuthenticated ? '已登录，可编辑研究内容' : '未登录，研究内容只读'}
            >
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isAuthenticated ? 'bg-green-400' : 'bg-gray-400'}`} />
              <span className={isAuthenticated ? 'text-green-300' : 'text-gray-300'}>
                {isAuthenticated ? '已登录' : '未登录 · 只读'}
              </span>
            </div>
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
                title="登录后可新增/编辑研究内容"
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
                <p className="text-xs text-gray-400">登录后可编辑研究内容</p>
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
