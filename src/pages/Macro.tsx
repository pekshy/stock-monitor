import React, { useEffect } from 'react'
import { MarketIndicators } from '../components/MarketIndicators'
import { useEtfContext } from '../context/EtfContext'

/**
 * 宏观板块：承接原「交易」页里的市场指标（全球宏观 / 中国指标 / 恐贪指数）。
 * 这些数据全部来自公开指标表，与个人交易信息无关，所以不设登录门禁。
 */
const Macro: React.FC = () => {
  const { globalIndicatorSeries, chinaIndicatorSeries, fearGreedSeries } = useEtfContext()

  useEffect(() => {
    document.title = '宏观 · 投研工作台'
  }, [])

  return (
    <div className="space-y-6">
      <MarketIndicators
        globalIndicatorSeries={globalIndicatorSeries}
        chinaIndicatorSeries={chinaIndicatorSeries}
        fearGreedSeries={fearGreedSeries}
      />
    </div>
  )
}

export default Macro
