import React from 'react'
import { TrendingUp, Calendar, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface HeaderProps {
  latestDate?: string | null
}

const Header: React.FC<HeaderProps> = ({ latestDate }) => {
  const { logout } = useAuth()

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

  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <TrendingUp className="h-6 w-6" />
            <h1 className="text-lg font-bold">投资监测系统</h1>
          </Link>
          <div className="flex items-center gap-3">
            {displayDate && (
              <div className="flex items-center gap-1.5 text-xs bg-blue-800 px-3 py-1.5 rounded-lg">
                <Calendar className="h-3.5 w-3.5" />
                <span>数据更新至：{displayDate}</span>
              </div>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs bg-blue-800 hover:bg-blue-900 px-3 py-1.5 rounded-lg transition-colors"
              title="退出登录"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>退出</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
