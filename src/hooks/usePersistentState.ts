import { useState, useEffect } from 'react'

/**
 * 持久化 state：与 useState 行为一致，但会同步到 sessionStorage。
 * 用于在路由切换导致组件卸载后，重新挂载时恢复状态（如筛选条件）。
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const saved = sessionStorage.getItem(key)
      if (saved !== null) {
        return JSON.parse(saved) as T
      }
    } catch (err) {
      console.error('Error reading sessionStorage:', err)
    }
    return initialValue
  })

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(state))
    } catch (err) {
      console.error('Error writing sessionStorage:', err)
    }
  }, [key, state])

  return [state, setState]
}
