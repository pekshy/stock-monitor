import React, { useMemo, useRef, useState } from 'react'
import { Plus, Pencil, Trash2, Paperclip, Search, X, CloudOff } from 'lucide-react'
import { fmtDate } from '../research/format'
import { NOTE_KINDS, autoTitle, todayISO, validateNote, type NoteFormValues } from '../research/notes'
import {
  insertNote, updateNote, removeNote, uploadNoteFile, isTextFile, parseList, type CloudNote,
} from '../research/api'

/** 笔记归属范围：产业链节点（可空）+ 关联企业 */
export interface NotesScope {
  industry: string | null
  seg: string | null
  sub: string | null
  companies: string[]
  /** 「自动记录」提示条里展示的产业链节点文字 */
  chainLabel?: string
}

const emptyVals = (): NoteFormValues => ({
  title: '', kind: '观点', date: todayISO(), body: '', companies: [], tags: [],
})

const kindBadge = (kind: string): string => {
  switch (kind) {
    case '观点': return 'bg-purple-50 text-purple-700'
    case '纪要': return 'bg-blue-50 text-blue-700'
    case '研报': return 'bg-green-50 text-green-700'
    default: return 'bg-orange-50 text-orange-700'
  }
}

/**
 * 研究笔记面板：搜索 + 新增（极简表单：正文 + 可选原件，其余自动带值）
 * + 卡片编辑（完整表单，含删除）——口径与原工作台页录入一致，写 Supabase。
 */
const NotesPanel: React.FC<{
  notes: CloudNote[]
  scope: NotesScope
  onChanged: () => void
  readOnly?: boolean
  loading?: boolean
}> = ({ notes, scope, onChanged, readOnly, loading }) => {
  const [mode, setMode] = useState<'none' | 'new' | 'edit'>('none')
  const [editId, setEditId] = useState<number | null>(null)
  const [v, setV] = useState<NoteFormValues>(emptyVals)
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const [q, setQ] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const shown = useMemo(() => {
    const kw = q.trim()
    if (!kw) return notes
    return notes.filter(n =>
      (n.title || '').includes(kw) || (n.body || '').includes(kw) ||
      parseList(n.companies).some(c => c.includes(kw)) || parseList(n.tags).some(t => t.includes(kw)))
  }, [notes, q])

  const openNew = () => {
    setV({ ...emptyVals(), companies: [...scope.companies] })
    setFile(null); setErr(''); setMsg('')
    setEditId(null); setMode('new')
  }

  const openEdit = (n: CloudNote) => {
    setV({
      title: n.title || '', kind: n.kind || '观点',
      date: /^\d{4}-\d{2}-\d{2}/.test(n.occurred_at || '') ? n.occurred_at.slice(0, 10) : '',
      body: n.body || '',
      companies: parseList(n.companies), tags: parseList(n.tags),
    })
    setFile(null); setErr(''); setMsg('')
    setEditId(n.id); setMode('edit')
  }

  const cancel = () => { setMode('none'); setEditId(null); setFile(null); setErr('') }

  const doRemove = (n: CloudNote) => {
    if (!window.confirm(`确认删除这条研究笔记？\n\n【${n.kind}】${n.title || '(无标题)'}\n\n只删数据库记录，已上传的原件不动。`)) return
    setBusy(true); setErr('')
    removeNote(n.id).then(r => {
      setBusy(false)
      if (r.error) { setErr('删除失败：' + r.error); return }
      if (editId === n.id) cancel()
      setMsg('已删除')
      onChanged()
    })
  }

  const save = async () => {
    const isNew = mode === 'new'
    const bad = validateNote(v, isNew, !!file)
    if (bad.length) { setErr(bad.join('；')); return }
    setBusy(true); setErr('')

    let body = v.body
    let filePath: string | null = null
    try {
      if (file) {
        // md/txt 等文本文件且正文留空 → 直接把文件内容当正文（口径同原工作台）
        if (!body.trim() && isTextFile(file.name)) {
          body = await file.text()
        } else {
          const up = await uploadNoteFile(file)
          if (up.error || !up.path) throw new Error(up.error || '原件上传失败')
          filePath = up.path
        }
      }
      const title = v.title.trim() || autoTitle(body, file?.name)
      const payload = {
        kind: v.kind, title, body,
        industry: scope.industry, seg: scope.seg, sub: scope.sub,
        companies: v.companies.filter(Boolean), tags: v.tags.filter(Boolean),
        occurred_at: v.date.trim() || todayISO(),
        file_path: filePath,
      }
      const r: { created?: boolean; note?: CloudNote; error?: string } =
        isNew ? await insertNote(payload) : await updateNote(editId!, payload)
      if (r.error) throw new Error(r.error)
      setBusy(false)
      if (isNew && !r.created && r.note) {
        setMsg('内容与已有资料相同，未重复录入')
      } else {
        setMsg(isNew ? '已保存，写入云端' : '已保存修改')
      }
      cancel()
      onChanged()
    } catch (e) {
      setBusy(false)
      setErr((isNew ? '录入失败：' : '保存失败：') + String((e as Error)?.message || e))
    }
  }

  const chain = scope.chainLabel ||
    [scope.industry, scope.seg, scope.sub].filter(Boolean).join(' · ')

  return (
    <div>
      {/* 工具栏：搜索 + 新增 */}
      <div className="flex items-center gap-2 px-5 py-2.5 border-b border-gray-50">
        <div className="relative">
          <Search className="h-3.5 w-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="搜索笔记"
            className="pl-8 pr-2 py-1.5 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 w-44"
          />
        </div>
        <span className="text-xs text-gray-400">{shown.length} 条</span>
        <div className="ml-auto flex items-center gap-2">
          {readOnly && (
            <span className="flex items-center gap-1 text-xs text-amber-600" title="未连上云端，不能写">
              <CloudOff className="h-3.5 w-3.5" /> 只读（未连云端）
            </span>
          )}
          <button
            onClick={openNew}
            disabled={readOnly || mode === 'new'}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
            title={readOnly ? '需要连上 Supabase 才能新增' : '写一条研究笔记，可顺带上传原件'}
          >
            <Plus className="h-3.5 w-3.5" /> 新增笔记
          </button>
        </div>
      </div>

      {/* 消息 / 错误提示条 */}
      {(msg || err) && (
        <div className={`mx-5 mt-2 px-3 py-2 rounded-lg text-[13px] ${err ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {err || msg}
        </div>
      )}

      {/* 表单：新增=极简（正文+原件），编辑=完整 */}
      {mode !== 'none' && (
        <div className="mx-5 my-3 border border-blue-100 rounded-xl bg-blue-50/40 p-4">
          <div className="flex items-center gap-2 mb-2">
            <b className="text-sm text-gray-800">{mode === 'new' ? '新增研究笔记' : '编辑研究笔记'}</b>
            <span className="text-xs text-gray-400">
              {mode === 'new' ? '写正文或传原件都行，标题与归属自动记，不用手填' : '可调整标题、日期、类型与归属'}
            </span>
            <button onClick={cancel} className="ml-auto p-1 text-gray-400 hover:text-gray-600" title="取消">
              <X className="h-4 w-4" />
            </button>
          </div>

          {mode === 'edit' && (
            <>
              <label className="block text-xs text-gray-500 mb-1">标题</label>
              <input
                value={v.title}
                onChange={e => setV({ ...v, title: e.target.value })}
                className="w-full mb-2 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </>
          )}

          <label className="block text-xs text-gray-500 mb-1">
            正文{mode === 'new' ? '（写正文或传原件，二者至少一项）' : ''}
          </label>
          <textarea
            value={v.body}
            onChange={e => setV({ ...v, body: e.target.value })}
            placeholder={mode === 'new'
              ? '把要点 / 判断 / 调研记录写在这里…\n（也可以只上传原件归档，正文留空）'
              : '笔记正文…'}
            rows={5}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 resize-y"
          />

          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <input
              ref={fileRef}
              type="file"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
              className="text-xs text-gray-500 file:mr-2 file:px-2 file:py-1 file:text-xs file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {file && (
              <button onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = '' }}
                      className="text-xs text-gray-400 hover:text-gray-600">
                清除
              </button>
            )}
            <span className="text-[11px] text-gray-400 leading-snug">
              可选，单文件 ≤ 8MB。md / txt 等文本且正文留空时直接当正文；PDF、Word 等只归档原件。
            </span>
          </div>

          {mode === 'edit' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">内容日期（YYYY-MM-DD）</label>
                <input
                  value={v.date}
                  onChange={e => setV({ ...v, date: e.target.value })}
                  placeholder={todayISO()}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">类型</label>
                <select
                  value={v.kind}
                  onChange={e => setV({ ...v, kind: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  {NOTE_KINDS.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">关联企业（逗号分隔）</label>
                <input
                  value={v.companies.join(',')}
                  onChange={e => setV({ ...v, companies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-xs text-gray-500 mb-1">标签（逗号分隔）</label>
                <input
                  value={v.tags.join(',')}
                  onChange={e => setV({ ...v, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          )}

          {mode === 'new' && (
            <div className="mt-2 text-[11.5px] text-gray-500 flex flex-wrap gap-1.5">
              <span>自动记录：<b>{todayISO()}</b></span>
              <span>·</span>
              <span>产业链节点 <b>{chain || '未限定'}</b></span>
              {scope.companies.length > 0 && (
                <><span>·</span><span>归属 <b>关联「{scope.companies.join('、')}」</b></span></>
              )}
              <span>· 标题按正文首行（或原件文件名）自动生成，保存后可「编辑」改掉</span>
            </div>
          )}

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={save}
              disabled={busy}
              className="px-4 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {busy ? '保存中…' : (mode === 'new' ? '保存并录入' : '保存修改')}
            </button>
            <button onClick={cancel} className="px-3 py-1.5 text-sm rounded-lg text-gray-600 hover:bg-gray-100">
              取消
            </button>
          </div>
        </div>
      )}

      {/* 列表 */}
      <div className="divide-y divide-gray-50">
        {loading && <div className="px-5 py-8 text-center text-sm text-gray-400">加载中...</div>}
        {!loading && shown.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-gray-400">
            {notes.length === 0
              ? '还没有研究笔记。点上方「+ 新增笔记」写一段正文、或直接传个原件上去。'
              : '没有匹配的笔记'}
          </div>
        )}
        {!loading && shown.map(n => (
          <div key={n.id} className="px-5 py-3 group">
            <div className="flex items-baseline gap-3">
              <span className="text-[13px] text-gray-400 shrink-0">{fmtDate(n.occurred_at)}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded shrink-0 ${kindBadge(n.kind)}`}>{n.kind}</span>
              <span className="text-sm text-gray-800 font-medium">{n.title || '(无标题)'}</span>
              {n.file_path && (
                <a href={n.file_path} target="_blank" rel="noreferrer"
                   className="flex items-center gap-1 text-xs text-blue-600 hover:underline shrink-0" title="查看原件">
                  <Paperclip className="h-3 w-3" /> 原件
                </a>
              )}
              <span className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => openEdit(n)} disabled={readOnly || busy}
                        className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30" title="编辑">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => doRemove(n)} disabled={readOnly || busy}
                        className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-30" title="删除">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </span>
            </div>
            {n.body && <p className="mt-1 text-[13px] text-gray-600 leading-relaxed pl-[76px] whitespace-pre-wrap">{n.body}</p>}
            {(parseList(n.companies).length > 0 || parseList(n.tags).length > 0) && (
              <div className="mt-1 flex flex-wrap gap-1 pl-[76px]">
                {parseList(n.companies).map(c => (
                  <span key={c} className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{c}</span>
                ))}
                {parseList(n.tags).map(t => (
                  <span key={t} className="text-[11px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">#{t}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotesPanel
