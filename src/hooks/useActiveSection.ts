import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export type NavKey = 'trade' | 'etf' | 'stock' | 'research' | 'macro' | 'paper'

/**
 * 当前所处板块，与 Home 的 getActiveTab 保持同一口径：
 * `/` 默认落交易板块，所以「股票」入口必须指向 /stocks，
 * 否则点「股票」会落到交易页。
 *
 * 桌面端顶部导航（Header）与移动端底部导航（MobileTabBar）共用此钩子，
 * 保证两套导航的高亮口径永远一致。
 */
export function useActiveSection(): NavKey {
  const { pathname, search } = useLocation()
  return useMemo(() => {
    if (pathname.startsWith('/research')) return 'research'
    if (pathname.startsWith('/macro')) return 'macro'
    if (pathname.startsWith('/paper')) return 'paper'
    if (pathname.startsWith('/etf')) return 'etf'
    // 个股/行业详情页归属「股票」
    if (pathname.startsWith('/company/') || pathname.startsWith('/stock/') || pathname.startsWith('/industry/')) return 'stock'
    if (pathname === '/stocks') return 'stock'
    if (new URLSearchParams(search).get('tab') === 'trade') return 'trade'
    return 'trade'
  }, [pathname, search])
}
