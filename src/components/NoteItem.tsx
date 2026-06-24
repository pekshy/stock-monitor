import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EtfNote, StockNote } from '../types'
import { Pencil, Trash2, Check, X } from 'lucide-react'

type NoteType = EtfNote | StockNote

interface NoteItemProps {
  note: NoteType
  name?: string | null
  code: string
  navigatePath: string
  onUpdate: (id: number, newText: string) => Promise<void>
  onDelete: (id: number) => Promise<void>
  compact?: boolean
  showCode?: boolean
  codeColor?: 'blue' | 'green'
}

export const NoteItem: React.FC<NoteItemProps> = ({
  note,
  name,
  code,
  navigatePath,
  onUpdate,
  onDelete,
  compact = false,
  showCode = true,
  codeColor = 'blue'
}) => {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(note.note)
  const [saving, setSaving] = useState(false)

  const showName = name && name !== code
  const isGeneral = code === 'GENERAL'

  const handleCodeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isGeneral) return
    navigate(navigatePath)
  }

  const handleSave = async () => {
    if (!editText.trim() || editText === note.note) {
      setIsEditing(false)
      setEditText(note.note)
      return
    }
    setSaving(true)
    try {
      await onUpdate(note.id, editText)
      setIsEditing(false)
    } catch {
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditText(note.note)
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
            {note.updated_at
              ? `${note.updated_at.slice(0, 16).replace('T', ' ')}（编辑）`
              : note.created_at.slice(0, 16).replace('T', ' ')}
          </span>
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              disabled={saving}
              className="w-full border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              rows={2}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving || !editText.trim()}
                className="px-2 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded text-xs flex items-center gap-1"
              >
                <Check className="h-3 w-3" />
                保存
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                取消
              </button>
            </div>
          </div>
        ) : (
          <div className={`${compact ? 'text-sm' : 'text-sm'} text-gray-800 break-words leading-relaxed whitespace-pre-wrap`}>
            {note.note}
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="flex flex-col gap-1 flex-shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-gray-500 hover:text-blue-600 bg-white hover:bg-blue-50 border border-gray-200 rounded transition-colors"
            title="编辑"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1.5 text-gray-500 hover:text-red-600 bg-white hover:bg-red-50 border border-gray-200 rounded transition-colors"
            title="删除"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
