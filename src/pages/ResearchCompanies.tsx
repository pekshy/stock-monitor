import React, { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowLeft, CloudOff, Pencil, Check, X, Loader2 } from 'lucide-react'
import { useCloudCompanies, updateCompanyDesc, type CompanyRecord } from '../research/api'
import { useAuth } from '../context/AuthContext'
import { fundDateNum, toNum } from '../research/format'

/** 市值 / 估值：纯数字（亿元），表头已标单位 */
const fmtCapNum = (v?: number | string | null): string => {
  if (v == null || v === '') return '—'
  return Number(v).toLocaleString('zh-CN', { maximumFractionDigits: 1 })
}

type CoFilter = 'all' | 'listed' | 'unlisted'

/** 排序：上市在前（市值降序），未上市在后（最近融资倒序；披露越细越靠前，无日期最后） */
export function coSort(list: CompanyRecord[]): CompanyRecord[] {
  const listed = list.filter(c => c.listed).sort((a, b) => (toNum(b.cap) ?? 0) - (toNum(a.cap) ?? 0))
  const unlisted = list.filter(c => !c.listed).sort((a, b) => {
    const ka = Math.max(fundDateNum(a.lastFunding), ...(a.funding ?? []).map(f => fundDateNum(f.date)))
    const kb = Math.max(fundDateNum(b.lastFunding), ...(b.funding ?? []).map(f => fundDateNum(f.date)))
    return kb - ka
  })
  return [...listed, ...unlisted]
}

/** 可复用的企业名单表：搜索 + 全部/上市/未上市 + 分页（口径与原工作台一致） */
export const CompanyTable: React.FC<{
  pool: CompanyRecord[]; loading?: boolean; pageSize?: number
  canEdit?: boolean; onDescSaved?: () => void
}> = ({ pool, loading, pageSize = 20, canEdit, onDescSaved }) => {
  const [filter, setFilter] = useState<CoFilter>('all')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => { setPage(1) }, [filter, q, pool])

  const filtered = useMemo(() => {
    let list = pool
    if (filter === 'listed') list = list.filter(c => c.listed)
    if (filter === 'unlisted') list = list.filter(c => !c.listed)
    const kw = q.trim()
    if (kw) list = list.filter(c => c.name.includes(kw) || (c.code ?? '').includes(kw) || (c.desc ?? '').includes(kw))
    return coSort(list)
  }, [pool, filter, q])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize)

  const tabs: { key: CoFilter; label: string; n: number }[] = [
    { key: 'all', label: '全部', n: pool.length },
    { key: 'listed', label: '上市', n: pool.filter(c => c.listed).length },
    { key: 'unlisted', label: '未上市', n: pool.filter(c => !c.listed).length },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === t.key ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            {t.label} <span className="text-xs text-gray-400">{t.n}</span>
          </button>
        ))}
        <div className="ml-auto relative">
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="搜索公司 / 代码 / 业务"
            className="pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 w-52"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
              <th className="px-5 py-2.5 font-medium">公司</th>
              <th className="px-3 py-2.5 font-medium">轮次</th>
              <th className="px-3 py-2.5 font-medium text-right">市值 / 估值（亿元）</th>
              <th className="px-5 py-2.5 font-medium">核心竞争力</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-gray-400">加载中...</td></tr>
            )}
            {!loading && pageRows.map(c => (
              <CompanyRow key={c.name} c={c} canEdit={canEdit} onDescSaved={onDescSaved} />
            ))}
            {!loading && pageRows.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-gray-400">无匹配企业</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm">
          <span className="text-xs text-gray-400">共 {filtered.length} 家 · 第 {page}/{totalPages} 页</span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50"
            >上一页</button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50"
            >下一页</button>
          </div>
        </div>
      )}
    </div>
  )
}

const ResearchCompanies: React.FC = () => {
  const { companies, cloudOk, loading, refresh } = useCloudCompanies()
  const { isAuthenticated } = useAuth()

  useEffect(() => { document.title = '企业名单 · 行业研究' }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link to="/research" className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50" title="返回行业研究">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h2 className="text-lg font-bold text-gray-800">企业名单</h2>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated && cloudOk && (
            <span className="text-xs text-gray-400">悬停核心竞争力可编辑</span>
          )}
          {!cloudOk && !loading && (
            <span className="flex items-center gap-1 text-xs text-amber-600" title="Supabase 未连通，展示内置兜底数据">
              <CloudOff className="h-3.5 w-3.5" /> 离线兜底
            </span>
          )}
        </div>
      </div>

      <CompanyTable pool={companies} loading={loading} canEdit={isAuthenticated && cloudOk} onDescSaved={refresh} />
    </div>
  )
}

const CompanyRow: React.FC<{
  c: CompanyRecord; canEdit?: boolean; onDescSaved?: () => void
}> = ({ c, canEdit, onDescSaved }) => {
  const listed = !!c.listed
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const startEdit = () => { setVal(c.desc || ''); setErr(''); setEditing(true) }

  const save = async () => {
    setBusy(true); setErr('')
    // cloudRound 是云端行派生字段，不属于 data JSON，剥离后整包回写
    const { cloudRound: _drop, ...pure } = c as CompanyRecord & { cloudRound?: string | null }
    const r = await updateCompanyDesc(c.name, val, pure)
    setBusy(false)
    if (r.error) { setErr('保存失败：' + r.error); return }
    setEditing(false)
    onDescSaved?.()
  }

  return (
    <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
      <td className="px-5 py-3">
        <Link to={`/research/company/${encodeURIComponent(c.name)}`}
              className="font-medium text-gray-800 hover:text-blue-700">
          {c.name}
        </Link>
        {listed && c.code && (
          <span className="ml-2 text-[11px] text-gray-400 font-mono">{c.code}</span>
        )}
      </td>
      <td className="px-3 py-3">
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          listed ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
          {listed ? '已上市' : (c.round || '未上市')}
        </span>
      </td>
      <td className="px-3 py-3 text-right text-gray-700 tabular-nums">
        {fmtCapNum(listed ? c.cap : c.valuation)}
      </td>
      <td className="px-5 py-3 text-[13px] text-gray-600 max-w-md group/desc">
        {editing ? (
          <div>
            <textarea
              value={val}
              onChange={e => setVal(e.target.value)}
              rows={3}
              autoFocus
              className="w-full px-2 py-1.5 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 resize-y"
            />
            {err && <div className="mt-1 text-xs text-red-600">{err}</div>}
            <div className="mt-1 flex items-center gap-2">
              <button onClick={save} disabled={busy}
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
                {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                {busy ? '保存中…' : '保存'}
              </button>
              <button onClick={() => setEditing(false)}
                      className="flex items-center gap-1 text-xs px-2 py-1 text-gray-500 hover:text-gray-700">
                <X className="h-3 w-3" /> 取消
              </button>
            </div>
          </div>
        ) : (
          <span className="flex items-start gap-1">
            <span className="truncate flex-1" title={c.desc || ''}>
              {c.desc || <span className="text-gray-300">—</span>}
            </span>
            {canEdit && (
              <button onClick={startEdit}
                      className="p-0.5 text-gray-300 hover:text-blue-600 opacity-0 group-hover/desc:opacity-100 transition-opacity shrink-0"
                      title="编辑核心竞争力">
                <Pencil className="h-3 w-3" />
              </button>
            )}
          </span>
        )}
      </td>
    </tr>
  )
}

export default ResearchCompanies
