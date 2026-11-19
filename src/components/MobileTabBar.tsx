import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wallet, Layers, BarChart3, FlaskConical, MoreHorizontal, Globe2, Target, X } from 'lucide-react'
import { useActiveSection, type NavKey } from '../hooks/useActiveSection'

/**
 * 移动端底部导航（< md 显示）。
 *
 * 桌面端六个板块在窄屏放不下，且第五、六项会被裁掉而没有任何提示，
 * 因此移动端改成 5 个 tab：常用四项 + 「更多」弹层（股票 / 模拟盘）。
 *
 * 高度 56px，配合 App.tsx 的 `pb-[76px] md:pb-4` 与安全区内边距使用。
 */

type TabItem = {
  key: NavKey | 'more'
  label: string
  to?: string
  Icon: React.ComponentType<{ className?: string }>
}

const TABS: TabItem[] = [
  { key: 'trade', label: '交易', to: '/', Icon: Wallet },
  { key: 'etf', label: 'ETF', to: '/etf', Icon: Layers },
  { key: 'macro', label: '宏观', to: '/macro', Icon: Globe2 },
  { key: 'research', label: '研究', to: '/research', Icon: FlaskConical },
]

const MORE_ITEMS: { key: NavKey; label: string; to: string; desc: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'stock', label: '股票', to: '/stocks', desc: '行情、估值与自选', Icon: BarChart3 },
  { key: 'paper', label: '模拟盘', to: '/paper', desc: '模拟持仓与收益', Icon: Target },
]

const MobileTabBar: React.FC = () => {
  const active = useActiveSection()
  const navigate = useNavigate()
  const [moreOpen, setMoreOpen] = useState(false)

  // 「更多」里的板块被选中时，tab bar 上的「更多」需要高亮
  const moreActive = active === 'stock' || active === 'paper'

  // 弹层打开时禁止背景滚动
  useEffect(() => {
    if (!moreOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [moreOpen])

  return (
    <>
      {/* 「更多」底部弹层 */}
      {moreOpen && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMoreOpen(false)} />
          <div
            className="absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-2xl pb-[calc(56px+env(safe-area-inset-bottom))]"
            style={{ animation: 'sheetUp .18s ease-out' }}
          >
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
              <span className="text-sm font-semibold text-gray-900">更多</span>
              <button
                onClick={() => setMoreOpen(false)}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-600"
                aria-label="关闭"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-2 py-1">
              {MORE_ITEMS.map(({ key, label, to, desc, Icon }) => (
                <button
                  key={key}
                  onClick={() => { setMoreOpen(false); navigate(to) }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left active:bg-gray-100 ${
                    active === key ? 'text-primary' : 'text-gray-800'
                  }`}
                >
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    active === key ? 'bg-primary/10' : 'bg-gray-100'
                  }`}>
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{label}</span>
                    <span className="block text-xs text-gray-500">{desc}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 底部 Tab Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-stretch h-14">
          {TABS.map(({ key, label, to, Icon }) => {
            const on = active === key
            return (
              <Link
                key={key}
                to={to!}
                aria-current={on ? 'page' : undefined}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 min-w-0 ${
                  on ? 'text-primary' : 'text-gray-500'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className={`text-[11px] leading-none ${on ? 'font-semibold' : ''}`}>{label}</span>
              </Link>
            )
          })}
          <button
            onClick={() => setMoreOpen(true)}
            aria-current={moreActive ? 'page' : undefined}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 min-w-0 ${
              moreActive ? 'text-primary' : 'text-gray-500'
            }`}
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className={`text-[11px] leading-none ${moreActive ? 'font-semibold' : ''}`}>更多</span>
          </button>
        </div>
      </nav>
    </>
  )
}

export default MobileTabBar
