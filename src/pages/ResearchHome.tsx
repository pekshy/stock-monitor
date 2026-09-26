import React, { useMemo, useState, useEffect } from 'react'
import { FileText, Zap, StickyNote, RefreshCw, CloudOff, ChevronRight } from 'lucide-react'
import { INDUSTRY_DATA, TREE } from '../research/data'
import { useIntel, useCloudCompanies, parseList } from '../research/api'
import { fmtDate } from '../research/format'
import { CompanyTable } from './ResearchCompanies'
import NotesPanel from '../components/NotesPanel'

type TabType = 'reports' | 'events' | 'notes'
type MainTab = 'intel' | 'companies'

const REPORT_TAB: Record<TabType, string> = {
  reports: '研究报告', events: '重大事件', notes: '研究笔记',
}

/** 软筛选：环节/细分层级下，未标注 seg/sub 的条目仍可见 */
function softMatch(itemIndustry: string | null, itemSeg: string | null, itemSub: string | null,
                   industry: string | null, seg: string | null, sub: string | null): boolean {
  if (industry && itemIndustry !== industry) return false
  if (seg) {
    if (itemSeg && itemSeg !== seg) return false
    if (sub && itemSub && itemSub !== sub) return false
  }
  return true
}

const ResearchHome: React.FC = () => {
  const { reports, events, notes, cloudOk, loading, refresh } = useIntel()
  const { companies: cloudCompanies, loading: coLoading } = useCloudCompanies()
  const [mainTab, setMainTab] = useState<MainTab>('intel')
  const [tab, setTab] = useState<TabType>('reports')
  const [industry, setIndustry] = useState<string | null>(null)
  const [seg, setSeg] = useState<string | null>(null)
  const [sub, setSub] = useState<string | null>(null)

  // 切换层级时清下级选择
  const pickIndustry = (id: string | null) => { setIndustry(id); setSeg(null); setSub(null) }
  const pickSeg = (id: string | null) => { setSeg(id); setSub(null) }
  const pickSub = (name: string) => { setSub(name); setMainTab('companies') }

  useEffect(() => { document.title = '行业研究 · 投资监测系统' }, [])

  const counts = useMemo(() => {
    const f = (list: { industry?: string | null; seg?: string | null; sub?: string | null }[]) =>
      list.filter(x => softMatch(x.industry ?? null, x.seg ?? null, x.sub ?? null, industry, seg, sub)).length
    return { reports: f(reports), events: f(events), notes: f(notes) }
  }, [reports, events, notes, industry, seg, sub])

  const segInfo = useMemo(() => {
    if (!industry) return null
    const ind = INDUSTRY_DATA[industry]
    if (!ind) return null
    if (!seg) return { industryName: ind.name, seg: null }
    return { industryName: ind.name, seg: ind.segs.find(s => s.id === seg) ?? null }
  }, [industry, seg])

  // 当前选中细分（TREE[segId] 下挂的 {name, desc, companies}）
  const subInfo = useMemo(() => {
    if (!seg || !sub) return null
    return (TREE[seg] ?? []).find(s => s.name === sub) ?? null
  }, [seg, sub])

  /** 范围企业池（口径同原工作台 currentCompanies）：
      行业过滤 → 环节按 c.seg → 细分按 SUBS 名单精确匹配公司名 */
  const scopePool = useMemo(() => {
    let list = cloudCompanies
    if (industry) list = list.filter(c => c.industry === industry)
    if (seg) list = list.filter(c => c.seg === seg)
    if (seg && sub) {
      const names = subInfo?.companies ?? []
      list = list.filter(c => names.includes(c.name))
    }
    return list
  }, [cloudCompanies, industry, seg, sub, subInfo])

  const filteredReports = useMemo(() =>
    reports.filter(r => softMatch(r.industry, r.seg, r.sub, industry, seg, sub)),
    [reports, industry, seg, sub])

  const filteredEvents = useMemo(() =>
    events.filter(e => softMatch(e.industry, e.seg, e.sub, industry, seg, sub)),
    [events, industry, seg, sub])

  const filteredNotes = useMemo(() =>
    notes.filter(n => softMatch(n.industry, n.seg, n.sub, industry, seg, sub)),
    [notes, industry, seg, sub])

  const listData = [
    { key: 'reports' as const, count: counts.reports, list: filteredReports },
    { key: 'events' as const, count: counts.events, list: filteredEvents },
    { key: 'notes' as const, count: counts.notes, list: filteredNotes },
  ]
  const current = listData.find(d => d.key === tab)!

  const scopeLabel = !industry ? '全部'
    : !seg ? (INDUSTRY_DATA[industry]?.name ?? industry)
    : !sub ? (segInfo?.seg?.name ?? seg)
    : sub

  return (
    <div className="flex gap-4">
      {/* 左侧产业链目录树：行业 → 环节 → 细分 */}
      <aside className="w-60 shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="text-sm font-bold text-gray-800">产业链图谱</div>
            <div className="text-xs text-gray-400 mt-0.5">行业 → 环节 → 细分</div>
          </div>
          <nav className="py-1 max-h-[70vh] overflow-y-auto text-sm">
            <button
              onClick={() => pickIndustry(null)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${!industry ? 'text-blue-700 font-semibold bg-blue-50' : 'text-gray-700'}`}
            >全部行业</button>
            {Object.entries(INDUSTRY_DATA).map(([id, ind]) => (
              <div key={id}>
                <button
                  onClick={() => pickIndustry(id)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between ${industry === id ? 'text-blue-700 font-semibold bg-blue-50' : 'text-gray-700'}`}
                >
                  <span>{ind.name}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                </button>
                {industry === id && (
                  <div className="bg-gray-50/60">
                    <button
                      onClick={() => pickSeg(null)}
                      className={`w-full text-left pl-8 pr-4 py-1.5 text-[13px] hover:bg-gray-100 ${!seg ? 'text-blue-700 font-medium' : 'text-gray-600'}`}
                    >全部环节</button>
                    {ind.segs.map(s => {
                      const subs = TREE[s.id] ?? []
                      return (
                        <div key={s.id}>
                          <button
                            onClick={() => pickSeg(seg === s.id ? null : s.id)}
                            className={`w-full text-left pl-8 pr-4 py-1.5 text-[13px] hover:bg-gray-100 flex items-center justify-between ${seg === s.id ? 'text-blue-700 font-medium' : 'text-gray-600'}`}
                          >
                            <span className="truncate">{s.name}</span>
                            <span className="shrink-0 flex items-center gap-1.5">
                              {s.heat && <span className="text-[11px] text-gray-400">{s.heat}</span>}
                              {subs.length > 0 && <span className="text-[10px] text-gray-300">{subs.length} 细分</span>}
                            </span>
                          </button>
                          {/* 细分（第三级）：环节展开时展示，点击直达该细分的企业名单 */}
                          {seg === s.id && subs.length > 0 && (
                            <div className="bg-gray-50">
                              {subs.map(sb => (
                                <button
                                  key={sb.name}
                                  onClick={() => pickSub(sb.name)}
                                  className={`w-full text-left pl-12 pr-4 py-1 text-xs hover:bg-gray-100 truncate ${sub === sb.name ? 'text-blue-700 font-medium' : 'text-gray-500'}`}
                                  title={sb.desc || sb.name}
                                >
                                  {sb.name}
                                  {sb.companies?.length ? <span className="text-gray-300 ml-1.5">{sb.companies.length}</span> : null}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* 右侧：顶层两分页（行业情报 / 企业名单）——口径与原工作台一致 */}
      <div className="flex-1 min-w-0">
        {/* 当前范围卡 */}
        {segInfo && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">{segInfo.industryName}</span>
              {segInfo.seg && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                  <span className="font-semibold text-gray-800">{segInfo.seg.name}</span>
                  {segInfo.seg.heat && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">{segInfo.seg.heat}</span>}
                  {segInfo.seg.trend && <span className="text-xs text-gray-400">{segInfo.seg.trend}</span>}
                </>
              )}
              {subInfo && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                  <span className="font-semibold text-gray-800">{subInfo.name}</span>
                </>
              )}
            </div>
            <p className="text-[13px] text-gray-600 mt-2 leading-relaxed">
              {subInfo?.desc || segInfo.seg?.summary}
            </p>
            {!subInfo && !!segInfo.seg?.breakthroughs?.length && (
              <div className="mt-2 space-y-1">
                {segInfo.seg.breakthroughs.map((b, i) => (
                  <div key={i} className="text-[13px] text-gray-600">
                    <span className="text-gray-400 mr-2">{fmtDate(b.date)}</span>
                    <span className="font-medium text-gray-800">{b.title}</span>
                    {b.desc && <span className="text-gray-500"> — {b.desc}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 顶层 tab：行业情报 / 企业名单 */}
        <div className="flex items-center gap-1 mb-3">
          <button
            onClick={() => setMainTab('intel')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              mainTab === 'intel' ? 'bg-blue-600 text-white font-medium shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 shadow-sm'}`}
          >行业情报</button>
          <button
            onClick={() => setMainTab('companies')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              mainTab === 'companies' ? 'bg-blue-600 text-white font-medium shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 shadow-sm'}`}
          >企业名单<span className="text-xs opacity-70"> · {scopeLabel} {scopePool.length} 家</span></button>
        </div>

        {mainTab === 'companies' ? (
          <CompanyTable pool={scopePool} loading={coLoading} />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* 子 tab */}
            <div className="flex items-center border-b border-gray-100 px-2">
              {(Object.keys(REPORT_TAB) as TabType[]).map(k => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-1.5 ${
                    tab === k ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  {k === 'reports' && <FileText className="h-4 w-4" />}
                  {k === 'events' && <Zap className="h-4 w-4" />}
                  {k === 'notes' && <StickyNote className="h-4 w-4" />}
                  {REPORT_TAB[k]}
                  <span className="text-xs text-gray-400">{counts[k]}</span>
                </button>
              ))}
              <div className="ml-auto flex items-center gap-2 pr-2">
                {!cloudOk && !loading && (
                  <span className="flex items-center gap-1 text-xs text-amber-600" title="Supabase 未连通，展示内置兜底数据">
                    <CloudOff className="h-3.5 w-3.5" /> 离线兜底
                  </span>
                )}
                <button
                  onClick={refresh}
                  className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                  title="刷新"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {loading && <div className="px-5 py-10 text-center text-sm text-gray-400">加载中...</div>}
              {!loading && tab !== 'notes' && current.list.length === 0 && (
                <div className="px-5 py-10 text-center text-sm text-gray-400">该范围暂无内容</div>
              )}
              {!loading && tab === 'reports' && filteredReports.map(r => (
                <a key={r.url} href={r.url} target="_blank" rel="noreferrer"
                   className="block px-5 py-3 hover:bg-gray-50">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[13px] text-gray-400 shrink-0">{fmtDate(r.date)}</span>
                    <span className="text-sm text-gray-800 font-medium leading-snug">{r.title}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-400 pl-[76px]">
                    <span>{r.org}</span>
                    {r.rating && <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-600">{r.rating}</span>}
                    {r.rtype && <span>{r.rtype}</span>}
                    {r.researcher && <span>{r.researcher}</span>}
                  </div>
                </a>
              ))}
              {!loading && tab === 'events' && filteredEvents.map(e => (
                <a key={e.url} href={e.url} target="_blank" rel="noreferrer"
                   className="block px-5 py-3 hover:bg-gray-50">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[13px] text-gray-400 shrink-0">{fmtDate(e.date)}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 shrink-0">{e.type}</span>
                    <span className="text-sm text-gray-800 font-medium leading-snug">{e.title}</span>
                  </div>
                  {e.summary && <p className="mt-1 text-[13px] text-gray-500 leading-relaxed pl-[76px] line-clamp-2">{e.summary}</p>}
                  {parseList(e.companies).length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1 pl-[76px]">
                      {parseList(e.companies).map(c => (
                        <span key={c} className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{c}</span>
                      ))}
                    </div>
                  )}
                </a>
              ))}
              {!loading && tab === 'notes' && (
                <NotesPanel
                  notes={filteredNotes}
                  scope={{
                    industry, seg, sub,
                    companies: [],
                    chainLabel: [INDUSTRY_DATA[industry ?? '']?.name, segInfo?.seg?.name, sub].filter(Boolean).join(' · '),
                  }}
                  onChanged={refresh}
                  readOnly={!cloudOk}
                  loading={loading}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResearchHome
