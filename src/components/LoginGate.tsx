import React, { useState, FormEvent } from 'react'
import { Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const LoginGate: React.FC = () => {
  const { login } = useAuth()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      setError('请输入密码')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const ok = await login(password)
      if (!ok) {
        setError('密码错误,请重试')
        setPassword('')
      }
    } catch {
      setError('登录失败,请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Logo 区域 */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">私人监控台</h1>
            <p className="text-sm text-gray-500 mt-2">请输入访问密码以继续</p>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  if (error) setError('')
                }}
                placeholder="请输入密码"
                autoFocus
                disabled={submitting}
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !password.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span>验证中...</span>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  进入
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-6">
            本页面仅供授权用户访问
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginGate
