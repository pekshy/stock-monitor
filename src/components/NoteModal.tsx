import React, { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import { suggestExecutionPrice } from '../utils/formatters'

export type TradeAction = 'buy' | 'sell' | 'watch' | ''

export interface NoteModalInitialValues {
  note: string
  tradeAction: TradeAction
  executionPrice: string
}

interface NoteModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (values: { note: string; tradeAction: TradeAction; executionPrice: number | null }) => Promise<void>
  title?: string
  submitText?: string
  // 是否显示代码输入框（Home页需要）
  showCodeInput?: boolean
  codeLabel?: string
  initialCode?: string
  onCodeChange?: (code: string) => void
  // 建议价格计算：传入近30天收盘价数组（最新在前）
  recentCloses?: number[]
  // 编辑模式传入已有值
  initial?: NoteModalInitialValues
  // 买入卖出的主题色
  theme?: 'blue' | 'green'
  submitting?: boolean
}

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title = '添加笔记',
  submitText = '保存',
  showCodeInput = false,
  codeLabel = '代码',
  initialCode = '',
  onCodeChange,
  recentCloses = [],
  initial,
  theme = 'blue',
  submitting: externalSubmitting = false,
}) => {
  const [note, setNote] = useState('')
  const [tradeAction, setTradeAction] = useState<TradeAction>('')
  const [executionPrice, setExecutionPrice] = useState('')
  const [codeInput, setCodeInput] = useState('')
  const [saving, setSaving] = useState(false)

  const themeRing = theme === 'blue' ? 'focus:ring-blue-400' : 'focus:ring-green-400'
  const themeBtnBg = theme === 'blue' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'

  // 打开/关闭或initial变化时重置表单
  useEffect(() => {
    if (!isOpen) return
    if (initial) {
      setNote(initial.note || '')
      setTradeAction(initial.tradeAction || '')
      setExecutionPrice(initial.executionPrice || '')
    } else {
      setNote('')
      setTradeAction('')
      setExecutionPrice('')
    }
    setCodeInput(initialCode || '')
  }, [isOpen, initial, initialCode])

  // 选择买入/卖出时根据近30天走势给出建议价格（仅新增模式生效）
  useEffect(() => {
    if (!isOpen || initial) return
    if (tradeAction === 'buy' || tradeAction === 'sell') {
      const suggested = suggestExecutionPrice(recentCloses, tradeAction)
      if (suggested != null && !executionPrice) {
        setExecutionPrice(suggested.toFixed(3))
      }
    } else if (tradeAction === '' || tradeAction === 'watch') {
      setExecutionPrice('')
    }
  }, [tradeAction, recentCloses, isOpen, initial])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!note.trim()) return
    const action: TradeAction = tradeAction || ''
    const execPrice = (action === 'buy' || action === 'sell') && executionPrice
      ? parseFloat(executionPrice)
      : null
    setSaving(true)
    try {
      await onSave({ note: note.trim(), tradeAction: action, executionPrice: execPrice })
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  const isBusy = saving || externalSubmitting

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {showCodeInput && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{codeLabel}</label>
              <input
                type="text"
                value={codeInput}
                onChange={e => {
                  setCodeInput(e.target.value)
                  onCodeChange?.(e.target.value)
                }}
                placeholder="如：513100"
                className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 ${themeRing} text-sm`}
              />
            </div>
          )}

          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">交易判断</label>
              <select
                value={tradeAction}
                onChange={e => setTradeAction(e.target.value as TradeAction)}
                className={`border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 ${themeRing}`}
              >
                <option value="">无</option>
                <option value="buy">📈 买入</option>
                <option value="sell">📉 卖出</option>
                <option value="watch">👁️ 观望</option>
              </select>
            </div>
            {(tradeAction === 'buy' || tradeAction === 'sell') && (
              <div className="flex-1 min-w-[160px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">执行价格</label>
                <input
                  type="number"
                  step="0.001"
                  value={executionPrice}
                  onChange={e => setExecutionPrice(e.target.value)}
                  placeholder="已填建议价，可手动修改"
                  className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 ${themeRing} text-sm`}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">笔记内容</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="写下笔记，记录交易思路..."
              rows={5}
              className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 ${themeRing} text-sm resize-none`}
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isBusy || !note.trim()}
              className={`px-5 py-2 ${themeBtnBg} disabled:bg-gray-300 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors`}
            >
              <Save className="h-3.5 w-3.5" />
              {isBusy ? '保存中...' : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
