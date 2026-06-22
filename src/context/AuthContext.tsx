import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'

const AUTH_STORAGE_KEY = 'stock-monitor-auth'
const ENV_PASSWORD = import.meta.env.VITE_SITE_PASSWORD as string | undefined

// 使用 Web Crypto API 计算 SHA-256 哈希(浏览器原生,无需依赖)
async function sha256(text: string): Promise<string> {
  const buf = new TextEncoder().encode(text)
  const hashBuf = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hashBuf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// 从环境变量计算期望的密码哈希(模块加载时执行一次)
const expectedHashPromise: Promise<string | null> = ENV_PASSWORD
  ? sha256(ENV_PASSWORD)
  : Promise.resolve(null)

interface AuthContextValue {
  isAuthenticated: boolean
  ready: boolean
  login: (password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [ready, setReady] = useState<boolean>(false)

  // 初始化: 读取 localStorage 中的会话标记
  useEffect(() => {
    if (localStorage.getItem(AUTH_STORAGE_KEY) === '1') {
      setIsAuthenticated(true)
    }
    setReady(true)
  }, [])

  const login = useCallback(async (password: string): Promise<boolean> => {
    if (!ENV_PASSWORD) {
      // 未配置密码: 直接放行(开发态友好)
      localStorage.setItem(AUTH_STORAGE_KEY, '1')
      setIsAuthenticated(true)
      return true
    }
    const expected = await expectedHashPromise
    if (!expected) return false
    const inputHash = await sha256(password)
    if (inputHash === expected) {
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

  return (
    <AuthContext.Provider value={{ isAuthenticated, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
