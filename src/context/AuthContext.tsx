import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'

const AUTH_STORAGE_KEY = 'stock-monitor-auth'

// 只注入暗号的 SHA-256 摘要，绝不注入明文。
// 原因：Vite 会把 import.meta.env.VITE_* 在构建时替换成字符串字面量，
// 若注入明文密码，它就直接躺在公开的 assets/*.js 里。
const ENV_PASSWORD_HASH = (
  (import.meta.env.VITE_SITE_PASSWORD_HASH as string | undefined) || ''
).trim().toLowerCase()

// 合法摘要为 64 位十六进制；未配置时视为「本地开发态」，登录直接放行
const AUTH_ENABLED = /^[0-9a-f]{64}$/.test(ENV_PASSWORD_HASH)

// 使用 Web Crypto API 计算 SHA-256 哈希(浏览器原生,无需依赖)
async function sha256(text: string): Promise<string> {
  const buf = new TextEncoder().encode(text)
  const hashBuf = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hashBuf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

interface AuthContextValue {
  isAuthenticated: boolean
  ready: boolean
  login: (password: string) => Promise<boolean>
  logout: () => void
  /** 登录弹窗开关：任意页面需要登录才能做的操作（关注、写笔记等）可直接唤起 */
  loginOpen: boolean
  openLogin: () => void
  closeLogin: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [ready, setReady] = useState<boolean>(false)
  const [loginOpen, setLoginOpen] = useState<boolean>(false)

  // 初始化: 读取 localStorage 中的会话标记
  useEffect(() => {
    if (localStorage.getItem(AUTH_STORAGE_KEY) === '1') {
      setIsAuthenticated(true)
    }
    setReady(true)
  }, [])

  const login = useCallback(async (password: string): Promise<boolean> => {
    if (!AUTH_ENABLED) {
      // 未配置暗号摘要: 直接放行(本地开发态)
      localStorage.setItem(AUTH_STORAGE_KEY, '1')
      setIsAuthenticated(true)
      return true
    }
    const inputHash = await sha256(password)
    if (inputHash === ENV_PASSWORD_HASH) {
      localStorage.setItem(AUTH_STORAGE_KEY, '1')
      setIsAuthenticated(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setIsAuthenticated(false)
  }, [])

  const openLogin = useCallback(() => setLoginOpen(true), [])
  const closeLogin = useCallback(() => setLoginOpen(false), [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, ready, login, logout, loginOpen, openLogin, closeLogin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
