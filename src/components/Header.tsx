import React from 'react'
import { TrendingUp, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

interface HeaderProps {
  latestDate?: string | null
}

const Header: React.FC<HeaderProps> = ({ latestDate }) => {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <TrendingUp className="h-8 w-8" />
            <h1 className="text-2xl font-bold">股票监测系统</h1>
          </Link>
          {displayDate && (
            <div className="flex items-center gap-2 text-sm bg-blue-800 px-4 py-2 rounded-lg">
              <Calendar className="h-4 w-4" />
              <span>数据更新至：{displayDate}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
