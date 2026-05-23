import React from 'react'
import { TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

const Header: React.FC = () => {
  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <TrendingUp className="h-8 w-8" />
          <h1 className="text-2xl font-bold">股票监测系统</h1>
        </Link>
      </div>
    </header>
  )
}

export default Header
