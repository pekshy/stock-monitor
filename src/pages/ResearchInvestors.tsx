import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Building2, TrendingUp, Target, ChevronRight, ArrowUpDown } from 'lucide-react'
import { useCloudCompanies } from '../research/api'
import {
  aggregateInvestors, ROLE_LABEL, ROLE_CLASS, KIND_LABEL,
  type InvestorAggregate, type InvestorKind,
} from '../research/investors'

/** 细分环节的中文名，用于把 seg slug 展示成人能读的字样 */
const SEG_LABEL: Record<string, string> = {
  eda: 'EDA / IP',
  equipment: '半导体设备',
  material: '半导体材料',
  design: '芯片设计',
  fab: '晶圆制造',
  osat: '封装测试',
  pcb: 'PCB',
  terminal: '终端 / 算力',
  maas: '模型 / 服务',
}

type SortKey = 'companyCount' | 'leadCount' | 'dealCount'
type KindFilter = 'all' | InvestorKind

/**
 * 投资机构统计：回答「哪些机构在半导体投得最多 / 押注了哪些环节」。
 *
 * 数据来自两家来源的合并：企业条目里显式的 investorsStructured（人工校正），
 * 以及 funding 自由文本的自动解析（funding/investors.ts splitInvestors）。
 * 因此未结构化的存量企业也能被统计进来。
 */
const ResearchInvestors: React.FC = () => {
  const { companies, loading } = useCloudCompanies()
  const [q, setQ] = useState('')
  const [kind, setKind] = useState<KindFilter>('all')
  const [seg, setSeg] = useState<string>('all')
  const [sort, setSort] = useState<SortKey>('companyCount')
  const [openName, setOpenName] = useState<string | null>(null)

  /** 全池聚合（useMemo 依赖 companies，机构数近 300，计算量可接受） */
  const all = useMemo(() => aggregateInvestors(companies), [companies])

  const segOptions = useMemo(() => {
    const set = new Set<string>()
    for (const c of companies) if (c.seg) set.add(c.seg)
    return [...set]
  }, [companies])

  const rows = useMemo(() => {
    let list = all
    if (kind !== 'all') list = list.filter(a => a.kind === kind)
    if (seg !== 'all') list = list.filter(a => a.segs.includes(seg))
    const kw = q.trim()
    if (kw) list = list.filter(a =>
      a.name.includes(kw) || a.hits.some(h => h.company.includes(kw)))
    const sorted = [...list]
    sorted.sort((a, b) =>
      b[sort] - a[sort] || b.companyCount - a.companyCount || a.name.localeCompare(b.name, 'zh'))
    return sorted
  }, [all, kind, seg, q, sort])

  const kindCounts = useMemo(() => {
    const m = new Map<InvestorKind, number>()
    for (const a of all) m.set(a.kind, (m.get(a.kind) ?? 0) + 1)
    return m
  }, [all])

  const totalDeals = useMemo(() => all.reduce((s, a) => s + a.dealCount, 0), [all])

  if (loading && all.length === 0) {
    return <div className="py-20 text-center text-sm text-gray-400">加载中...</div>
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-bold text-gray-800">投资机构</h1>
        <p className="text-[13px] text-gray-500 mt-1">
          从 {companies.length} 家企业的融资披露中聚合出 <b>{all.length}</b> 家机构、
          <b>{totalDeals}</b> 笔投资。判断口径：<span className="text-gray-600">企业数</span>指该机构出现在多少家企业的融资名单里，
          <span className="text-gray-600">领投</span>统计其明确标注领投的轮次。数据来自公开披露，遇「多家机构参与」等模糊表述会漏计。
        </p>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4">
        <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 border-b border-gray-100">
          <span className="text-xs text-gray-400">机构类型</span>
          {([['all', '全部'], ['vc', '风险投资'], ['pe', '私募股权'], ['gov', '国资基金'], ['cvc', '产业资本'], ['other', '其他']] as [KindFilter, string][]).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                kind === k ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              {label}{k !== 'all' && <span className="text-[10px] text-gray-400 ml-1">{kindCounts.get(k as InvestorKind) ?? 0}</span>}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 px-4 py-2.5">
          <span className="text-xs text-gray-400">环节</span>
          <button
            onClick={() => setSeg('all')}
            className={`px-2.5 py-1 text-xs rounded-lg ${seg === 'all' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            全部
          </button>
          {segOptions.map(s => (
            <button
              key={s}
              onClick={() => setSeg(s)}
              className={`px-2.5 py-1 text-xs rounded-lg ${seg === s ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              {SEG_LABEL[s] ?? s}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setSort(sort === 'companyCount' ? 'leadCount' : sort === 'leadCount' ? 'dealCount' : 'companyCount')}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              title="切换排序维度"
            >
              <ArrowUpDown className="h-3 w-3" />
              {sort === 'companyCount' ? '按企业数' : sort === 'leadCount' ? '按领投数' : '按投资笔数'}
            </button>
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="搜索机构 / 企业"
                className="pl-8 pr-3 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 w-40"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 机构列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100">
          <Building2 className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-bold text-gray-800">机构榜</h3>
          <span className="text-xs text-gray-400">{rows.length} 家</span>
        </div>

        {rows.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-400">没有匹配的机构</div>
        )}

        <div className="divide-y divide-gray-50">
          {rows.map(a => (
            <InvestorRow
              key={a.name}
              agg={a}
              expanded={openName === a.name}
              onToggle={() => setOpenName(openName === a.name ? null : a.name)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const InvestorRow: React.FC<{ agg: InvestorAggregate; expanded: boolean; onToggle: () => void }> = ({ agg, expanded, onToggle }) => (
  <div>
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 px-5 py-2.5 text-left hover:bg-gray-50/70 transition-colors"
    >
      <ChevronRight className={`h-3.5 w-3.5 text-gray-300 shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      <span className="text-[13px] font-semibold text-gray-800 w-52 shrink-0 truncate">{agg.name}</span>
      <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 shrink-0">
        {KIND_LABEL[agg.kind]}
      </span>

      <span className="flex items-center gap-4 text-[12px] text-gray-600 shrink-0">
        <span className="flex items-center gap-1">
          <Building2 className="h-3 w-3 text-gray-400" />
          <b className="tabular-nums">{agg.companyCount}</b> 家
        </span>
        <span className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3 text-gray-400" />
          <b className="tabular-nums">{agg.dealCount}</b> 笔
        </span>
        {agg.leadCount > 0 && (
          <span className="flex items-center gap-1 text-indigo-700">
            <Target className="h-3 w-3" />
            领投 <b className="tabular-nums">{agg.leadCount}</b>
          </span>
        )}
      </span>

      <span className="flex flex-wrap gap-1 ml-auto">
        {agg.segs.slice(0, 4).map(s => (
          <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-sky-50 text-sky-700">
            {SEG_LABEL[s] ?? s}
          </span>
        ))}
        {agg.segs.length > 4 && <span className="text-[10px] text-gray-400">+{agg.segs.length - 4}</span>}
      </span>
    </button>

    {expanded && (
      <div className="px-5 pb-3 pl-11">
        <div className="text-[11px] font-semibold text-gray-400 mb-1.5">投资明细</div>
        <div className="space-y-1">
          {agg.hits.map(h => (
            <div key={h.company} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[12px]">
              <Link
                to={`/research/company/${encodeURIComponent(h.company)}`}
                className="text-gray-800 hover:text-blue-700 hover:underline font-medium"
              >
                {h.company}
              </Link>
              {h.seg && <span className="text-[10px] text-gray-400">{SEG_LABEL[h.seg] ?? h.seg}</span>}
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${ROLE_CLASS[h.topRole]}`}>
                {ROLE_LABEL[h.topRole]}
              </span>
              <span className="text-gray-400">
                {h.rounds.map(r => `${r.round ?? '—'}${r.date ? `（${r.date}）` : ''}`).join(' · ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)

export default ResearchInvestors
