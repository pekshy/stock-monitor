import React from 'react'
import { useNavigate } from 'react-router-dom'
import { EtfNote, StockNote } from '../types'
import { Pencil, Trash2 } from 'lucide-react'
import type { TradeAction } from './NoteModal'

type NoteType = EtfNote | StockNote

export interface NoteEditPayload {
  id: number
  note: string
  tradeAction: TradeAction
  executionPrice: number | null
}

interface NoteItemProps {
  note: NoteType
  name?: string | null
  code: string
  navigatePath: string
  onUpdate: (id: number, values: { note: string; tradeAction: TradeAction; executionPrice: number | null }) => Promise<void>
  onDelete: (id: number) => Promise<void>
  onEdit?: (note: NoteType) => void
  compact?: boolean
  showCode?: boolean
  codeColor?: 'blue' | 'green'
}

export const NoteItem: React.FC<NoteItemProps> = ({
  note,
  name,
  code,
  navigatePath,
  onUpdate: _onUpdate,
  onDelete,
  onEdit,
  compact = false,
  showCode = true,
  codeColor = 'blue'
}) => {
  const navigate = useNavigate()

  const showName = name && name !== code
  const isGeneral = code === 'GENERAL'

  const handleCodeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isGeneral) return
    navigate(navigatePath)
  }

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(note)
  }

  const codeBgClass = codeColor === 'green'
    ? 'text-green-600 bg-green-50 cursor-pointer hover:bg-green-100 hover:text-green-700'
    : 'text-blue-600 bg-blue-50 cursor-pointer hover:bg-blue-100 hover:text-blue-700'

  const codeHoverClass = codeColor === 'green'
    ? 'hover:text-green-600 hover:underline'
    : 'hover:text-blue-600 hover:underline'

  return (
    <div className={`flex items-start gap-2 ${compact ? 'p-2' : 'p-3'} bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group`}>
      <div className="flex-1 min-w-0">
        <div className={`flex items-center gap-2 ${compact ? 'mb-0.5' : 'mb-1'} flex-wrap`}>
          {showName && (
            <span
              onClick={handleCodeClick}
              className={`${compact ? 'text-xs' : 'text-sm'} text-gray-700 font-medium ${isGeneral ? '' : 'cursor-pointer ' + codeHoverClass}`}
            >
              {name}
            </span>
          )}
          {showCode && (
            <span
              onClick={handleCodeClick}
              className={`${compact ? 'text-xs' : 'text-xs'} font-semibold px-2 py-0.5 rounded ${
                isGeneral
                  ? 'text-gray-600 bg-gray-100'
                  : codeBgClass
              }`}
            >
              {code}
            </span>
          )}
          <span className="text-xs text-gray-400">
            {((note as any).updated_at || note.created_at).slice(0, 16).replace('T', ' ')}
          </span>
          {note.trade_action && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
              note.trade_action === 'buy'
                ? 'text-red-600 bg-red-50'
                : note.trade_action === 'sell'
                ? 'text-green-600 bg-green-50'
                : 'text-gray-600 bg-gray-100'
            }`}>
              {note.trade_action === 'buy' ? '买入' : note.trade_action === 'sell' ? '卖出' : '观望'}
              {note.execution_price != null && ` @ ${note.execution_price}`}
            </span>
          )}
        </div>

        <div className={`${compact ? 'text-sm' : 'text-sm'} text-gray-800 break-words leading-relaxed whitespace-pre-wrap`}>
          {note.note}
        </div>
      </div>

      <div className="flex flex-col gap-1 flex-shrink-0">
        <button
          onClick={handleStartEdit}
          className="p-1.5 text-gray-500 hover:text-blue-600 bg-white hover:bg-blue-50 border border-gray-200 rounded transition-colors"
          title="编辑"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(note.id) }}
          className="p-1.5 text-gray-500 hover:text-red-600 bg-white hover:bg-red-50 border border-gray-200 rounded transition-colors"
          title="删除"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
