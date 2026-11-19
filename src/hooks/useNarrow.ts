import { useEffect, useState } from 'react'

/**
 * 是否为窄屏（默认 < 768px，与 Tailwind 的 md 断点一致）。
 *
 * 用于只能由 JS 决定、CSS 断点做不到的地方：
 * 图表内部布局（recharts 的 YAxis 宽度、图例条目、取样根数）等。
 */
export function useNarrow(maxWidth = 767): boolean {
  const query = `(max-width: ${maxWidth}px)`
  const [narrow, setNarrow] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setNarrow(mq.matches)
    setNarrow(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return narrow
}
