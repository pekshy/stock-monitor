import React, { useState, useEffect, useMemo, Component } from 'react'
import { X } from 'lucide-react'
import { TradeRecord, EtfDailyData } from '../types'

interface SellConfirmModalProps {
  isOpen: boolean
  record: TradeRecord | null
  currentPrice?: number
  dailyData?: EtfDailyData[]
  priceMap?: Map<string, number>  // date string → close price
  onConfirm: (sellPrice: number, sellDate: string) => void
  onClose: () => void
}

// ErrorBoundary 防止组件崩溃导致白板
class SellModalErrorBoundary extends Component<
  { children: React.ReactNode; onClose: () => void },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('SellConfirmModal 渲染错误:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <p className="text-red-600 mb-2">弹窗加载出错</p>
            <p className="text-sm text-gray-500 mb-4">{this.state.error?.message || '未知错误'}</p>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); this.props.onClose() }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              关闭
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export const SellConfirmModal: React.FC<SellConfirmModalProps> = ({
  isOpen,
  record,
  currentPrice,
  dailyData = [],
  priceMap,
  onConfirm,
  onClose
}) => {
  if (!isOpen || !record) return null

  return (
    <SellModalErrorBoundary onClose={onClose}>
      <SellConfirmModalContent
        record={record}
        currentPrice={currentPrice}
        dailyData={dailyData}
        priceMap={priceMap}
        onConfirm={onConfirm}
        onClose={onClose}
      />
    </SellModalErrorBoundary>
  )
}

const SellConfirmModalContent: React.FC<{
  record: TradeRecord
  currentPrice?: number
  dailyData: EtfDailyData[]
  priceMap?: Map<string, number>
  onConfirm: (sellPrice: number, sellDate: string) => void
  onClose: () => void
}> = ({ record, currentPrice, dailyData, priceMap, onConfirm, onClose }) => {
  const today = new Date().toISOString().split('T')[0]
  const [sellDate, setSellDate] = useState(today)
  const [sellPrice, setSellPrice] = useState('')

  // 当弹窗打开时，重置日期和价格
  useEffect(() => {
    setSellDate(today)
    setSellPrice('')
  }, [today])

  // 当选择日期变化时，自动填充该日期的收盘价（优先从 dailyData，其次从 priceMap）
  useEffect(() => {
    if (!sellDate) return
    try {
      const dayData = dailyData?.find(d => d?.trade_date === sellDate)
      if (dayData?.close) {
        setSellPrice(dayData.close.toFixed(3))
      } else if (priceMap && typeof priceMap.get === 'function') {
        const close = priceMap.get(sellDate)
        if (close != null) {
          setSellPrice(close.toFixed(3))
        }
      }
    } catch (err) {
      console.error('自动填充收盘价失败:', err)
    }
  }, [sellDate, dailyData, priceMap])

  const buyPrice = record.buy_price || 0
  const amount = record.amount || 0
  const priceToUse = sellPrice ? parseFloat(sellPrice) : (currentPrice || buyPrice || 0)
  const profitLossPct = buyPrice > 0 ? ((priceToUse - buyPrice) / buyPrice) * 100 : 0
  const isProfit = profitLossPct >= 0

  const handleConfirm = () => {
    if (!sellPrice.trim() || !sellDate.trim()) return
    onConfirm(parseFloat(sellPrice), sellDate)
  }

  const safeDailyData = Array.isArray(dailyData) ? dailyData : []

  // 获取可用的交易日期（从历史数据中，或从 priceMap）
  const availableDates = useMemo(() => {
    try {
      const dates = new Set<string>()
      safeDailyData.filter(d => d && d.close != null && d.trade_date).forEach(d => dates.add(d.trade_date))
      if (priceMap && typeof priceMap.forEach === 'function') {
        priceMap.forEach((_v, k) => {
          if (k) dates.add(k)
        })
      }
      return Array.from(dates).sort((a, b) => b.localeCompare(a))
    } catch (err) {
      console.error('计算可用日期失败:', err)
      return []
    }
  }, [safeDailyData, priceMap])

  // 判断是否有该日期的收盘价
  const hasCloseForDate = () => {
    try {
      const fromDaily = safeDailyData.find(d => d.trade_date === sellDate)?.close
      if (fromDaily != null) return true
      if (priceMap && typeof priceMap.get === 'function' && priceMap.get(sellDate) != null) return true
      return false
    } catch {
      return false
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">确认卖出</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* 标的信息 */}
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">{record.name || record.symbol}</div>
            <div className="text-sm text-gray-500">{record.symbol}</div>
          </div>

          {/* 买入信息 */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-gray-500 text-xs">买入日期</div>
              <div className="font-medium">{record.trade_date}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-gray-500 text-xs">买入总额</div>
              <div className="font-medium">¥{amount.toLocaleString()}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-gray-500 text-xs">买入单价</div>
              <div className="font-medium">¥{buyPrice.toFixed(3)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-gray-500 text-xs">当前价格</div>
              <div className="font-medium">¥{(currentPrice || 0).toFixed(3)}</div>
            </div>
          </div>

          {/* 卖出日期选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">卖出日期</label>
            <input
              type="date"
              value={sellDate}
              onChange={e => setSellDate(e.target.value)}
              max={today}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {availableDates.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {availableDates.slice(0, 5).map(date => (
                  <button
                    key={date}
                    type="button"
                    onClick={() => setSellDate(date)}
                    className={`text-xs px-2 py-1 rounded ${
                      date === sellDate
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {date.slice(5)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 卖出价格输入 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">卖出价格（元）</label>
            <input
              type="number"
              value={sellPrice}
              onChange={e => setSellPrice(e.target.value)}
              placeholder={currentPrice ? currentPrice.toFixed(3) : buyPrice.toFixed(3)}
              step="0.001"
              min="0"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {!hasCloseForDate() && (
              <p className="text-xs text-orange-500 mt-1">该日期无收盘价，请手工输入</p>
            )}
          </div>

          {/* 预估收益 */}
          {sellPrice && buyPrice > 0 && (
            <div className={`text-center py-3 rounded-lg ${isProfit ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              <div className="text-sm">预估收益</div>
              <div className="text-2xl font-bold">
                {isProfit ? '+' : ''}{profitLossPct.toFixed(2)}%
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 p-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            disabled={!sellPrice.trim() || !sellDate.trim()}
            className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 transition-colors"
          >
            确认卖出
          </button>
        </div>
      </div>
    </div>
  )
}
