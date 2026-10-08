import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FileText, Zap, StickyNote, RefreshCw, CloudOff, ChevronRight } from 'lucide-react'
import { INDUSTRY_DATA, TREE, isGrouped, treeLeaves, type TreeStage, type TreeLeaf } from '../research/data'
import { useIntel, useCloudCompanies, parseList, type CloudNote } from '../research/api'
import { fmtDate } from '../research/format'
import { CompanyTable } from './ResearchCompanies'
import NotesPanel from '../components/NotesPanel'
import { useAuth } from '../context/AuthContext'

type TabType = 'reports' | 'events'
type MainTab = 'intel' | 'notes' | 'companies'

const REPORT_TAB: Record<TabType, string> = {
  reports: '研究报告', events: '重大事件',
}

// 细分环节国产化率标记：高=绿 / 中=琥珀 / 低=红（低=卡脖子风险警示）
type LocalRate = '高' | '中' | '低'
const LOCAL_BADGE: Record<LocalRate, string> = {
  '高': 'bg-green-50 text-green-600',
  '中': 'bg-amber-50 text-amber-600',
  '低': 'bg-red-50 text-red-500',
}
const LOCAL_PILL: Record<LocalRate, string> = {
  '高': 'bg-green-50 text-green-700',
  '中': 'bg-amber-50 text-amber-700',
  '低': 'bg-red-50 text-red-700',
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
  const { companies: cloudCompanies, loading: coLoading, refresh: coRefresh } = useCloudCompanies()
  const { isAuthenticated } = useAuth()

  // 选中状态放 URL 参数：ind / seg / sub / mt(顶层tab: intel|notes|companies) / tab(情报子tab)
  // 从企业详情返回时由浏览器历史原样恢复（含企业名单 tab 与范围）
  const [searchParams, setSearchParams] = useSearchParams()
  const industry = searchParams.get('ind')
  const seg = searchParams.get('seg')
  const stage = searchParams.get('stage')
  const sub = searchParams.get('sub')
  const mainTab: MainTab =
    searchParams.get('mt') === 'companies' ? 'companies'
    : searchParams.get('mt') === 'notes' ? 'notes'
    : 'intel'
  const tab: TabType = (['reports', 'events'] as TabType[]).includes(searchParams.get('tab') as TabType)
    ? (searchParams.get('tab') as TabType) : 'reports'

  // 兼容旧链接：研究笔记曾是情报子 tab（tab=notes），自动迁到顶层笔记 tab
  useEffect(() => {
    if (searchParams.get('tab') === 'notes') patchParams({ mt: 'notes', tab: null })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const patchParams = useCallback((patch: Record<string, string | null>) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      for (const [k, v] of Object.entries(patch)) {
        if (v == null || v === '') next.delete(k)
        else next.set(k, v)
      }
      return next
    }, { replace: true })
  }, [setSearchParams])

  // 展开状态（纯视觉）与选中状态（驱动右侧内容）分离：
  // 再点同一行业/环节只收起子列表，选中范围保持不变
  const [expandedInd, setExpandedInd] = useState<string | null>(() => searchParams.get('ind'))
  const [expandedSeg, setExpandedSeg] = useState<string | null>(() => searchParams.get('seg'))
  const [expandedStage, setExpandedStage] = useState<string | null>(() => searchParams.get('stage'))

  // 切换层级时清下级选择
  const pickIndustry = (id: string | null) => {
    // 点击行业：右侧始终切换到该行业范围（清 seg/stage/sub）；再次点击同一行业仅切换环节列表展开/收起
    if (!id) { patchParams({ ind: null, seg: null, stage: null, sub: null }); setExpandedInd(null); setExpandedSeg(null); setExpandedStage(null); return }
    patchParams({ ind: id, seg: null, stage: null, sub: null })
    setExpandedInd(e => (industry === id ? (e === id ? null : id) : id))
    setExpandedSeg(null)
    setExpandedStage(null)
  }
  const pickSeg = (id: string | null) => {
    // 点击环节：右侧始终切换到该环节范围（清 stage/sub）；再次点击同一环节仅切换子列表展开/收起
    if (!id) { patchParams({ seg: null, stage: null, sub: null }); setExpandedSeg(null); setExpandedStage(null); return }
    patchParams({ seg: id, stage: null, sub: null })
    setExpandedSeg(e => (seg === id ? (e === id ? null : id) : id))
    setExpandedStage(null)
  }
  const pickStage = (id: string | null) => {
    // 点击工艺阶段（仅带中间层的环节，如半导体设备）：右侧切到该阶段范围（清 sub）；再次点击仅切换设备种类展开/收起
    if (!id) { patchParams({ stage: null, sub: null }); setExpandedStage(null); return }
    patchParams({ stage: id, sub: null })
    setExpandedStage(e => (stage === id ? (e === id ? null : id) : id))
  }
  const pickSub = (name: string) => patchParams({ sub: name, mt: 'companies' })

  useEffect(() => { document.title = '行业研究 · 涛哥投研工作室' }, [])

  const segInfo = useMemo(() => {
    if (!industry) return null
    const ind = INDUSTRY_DATA[industry]
    if (!ind) return null
    return { industryName: ind.name, industryDetail: ind.detail ?? null, seg: ind.segs.find(s => s.id === seg) ?? null }
  }, [industry, seg])

  // 当前选中细分（leaf）：分组环节先展平各工艺阶段
  const subInfo = useMemo(() => {
    if (!seg || !sub) return null
    return treeLeaves(seg).find(s => s.name === sub) ?? null
  }, [seg, sub])

  // 当前选中工艺阶段（仅带中间层的环节，如半导体设备）
  const stageInfo = useMemo(() => {
    if (!seg || !stage) return null
    const v = TREE[seg]
    if (!isGrouped(v)) return null
    return v.find(s => s.id === stage) ?? null
  }, [seg, stage])

  /** 当前环节允许的 seg 取值：环节自身 + 其下细分 id。
      像「AI 应用」这样的环节，公司记录直接挂在细分 key 上（ai-coding / ai-edu ...），
      所以环节层级要同时接受这些细分 key，否则筛出来是空的。 */
  const segKeys = useMemo(() => {
    if (!seg || !industry) return null
    const s = INDUSTRY_DATA[industry]?.segs.find(x => x.id === seg)
    if (!s?.subs?.length) return null
    return new Set<string>([seg, ...s.subs.map(t => t.id)])
  }, [industry, seg])

  /** 范围企业池（口径同原工作台 currentCompanies）：
      行业过滤 → 环节按 c.seg（含该环节下的细分 id）→ 阶段按并集 → 细分按 TREE 名单精确匹配公司名。
      选了细分时以 TREE 名单为准：同一家公司可能被列在多个细分下（如金山办公既在
      AI 编程又在 AI 办公），而 c.seg 只能取一个值，此时再用 seg 卡会误杀。
      分支顺序不可调换：sub > stage > 环节，保证细分精确名单不被阶段的并集覆盖。 */
  const scopePool = useMemo(() => {
    let list = cloudCompanies
    if (industry) list = list.filter(c => c.industry === industry)
    if (seg && sub) {
      const names = subInfo?.companies ?? []
      list = list.filter(c => names.includes(c.name))
    } else if (seg && stageInfo) {
      // 阶段级：该阶段下全部设备种类企业并集去重（同一家公司可出现在多个设备种类里，如新凯来）
      const names = new Set(stageInfo.leaves.flatMap(l => l.companies ?? []))
      list = list.filter(c => names.has(c.name))
    } else if (seg) {
      list = list.filter(c => (segKeys ? !!c.seg && segKeys.has(c.seg) : c.seg === seg))
    }
    return list
  }, [cloudCompanies, industry, seg, stage, sub, subInfo, stageInfo, segKeys])

  const filteredReports = useMemo(() =>
    reports.filter(r => softMatch(r.industry, r.seg, r.sub, industry, seg, sub)),
    [reports, industry, seg, sub])

  const filteredEvents = useMemo(() =>
    events.filter(e => softMatch(e.industry, e.seg, e.sub, industry, seg, sub)),
    [events, industry, seg, sub])

  // 研究笔记 = 行业归属命中（软筛选）∪ 关联企业命中范围企业池（行业 + 企业两类笔记都进列表）
  const scopeCompanyNames = useMemo(() => new Set(scopePool.map(c => c.name)), [scopePool])
  const filteredNotes = useMemo(() =>
    notes.filter(n =>
      softMatch(n.industry, n.seg, n.sub, industry, seg, sub) ||
      parseList(n.companies).some(c => scopeCompanyNames.has(c))),
    [notes, industry, seg, sub, scopeCompanyNames])

  /** 笔记卡片上展示的产业链节点标签（半导体 · 设备 · 晶圆制造） */
  const nodeLabelOf = useCallback((n: CloudNote): string | null => {
    const parts: string[] = []
    const ind = n.industry ? INDUSTRY_DATA[n.industry] : null
    if (ind?.name) parts.push(ind.name)
    if (n.seg) {
      const segName = ind?.segs.find(s => s.id === n.seg)?.name ?? n.seg
      parts.push(segName)
    }
    if (n.sub) parts.push(n.sub)
    return parts.length ? parts.join(' · ') : null
  }, [])

  const counts = useMemo(() => ({
    reports: filteredReports.length,
    events: filteredEvents.length,
    notes: filteredNotes.length,
  }), [filteredReports, filteredEvents, filteredNotes])

  const listData = [
    { key: 'reports' as const, list: filteredReports },
    { key: 'events' as const, list: filteredEvents },
  ]
  const current = listData.find(d => d.key === tab)!

  const scopeLabel = !industry ? '全部'
    : !seg ? (INDUSTRY_DATA[industry]?.name ?? industry)
    : sub ? sub
    : stageInfo ? stageInfo.name
    : (segInfo?.seg?.name ?? seg)

  const scopeChainLabel = [
    industry ? INDUSTRY_DATA[industry]?.name : null,
    segInfo?.seg?.name,
    stageInfo?.name,
    sub,
  ].filter(Boolean).join(' · ')

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
            {Object.entries(INDUSTRY_DATA).map(([id, ind]) => (
              <div key={id}>
                <button
                  onClick={() => pickIndustry(id)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between ${industry === id ? 'text-blue-700 font-semibold bg-blue-50' : 'text-gray-700'}`}
                >
                  <span>{ind.name}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                </button>
                {expandedInd === id && (
                  <div className="bg-gray-50/60">
                    {ind.segs.map(s => {
                      const segVal = TREE[s.id]
                      const grouped = isGrouped(segVal)
                      const stages = grouped ? (segVal as TreeStage[]) : []
                      const subs = grouped ? [] : ((segVal as TreeLeaf[]) ?? [])
                      return (
                        <div key={s.id}>
                          <button
                            onClick={() => pickSeg(s.id)}
                            className={`w-full text-left pl-8 pr-4 py-1.5 text-[13px] hover:bg-gray-100 flex items-center justify-between ${seg === s.id ? 'text-blue-700 font-medium' : 'text-gray-600'}`}
                          >
                            <span className="truncate">{s.name}</span>
                            <span className="shrink-0 flex items-center gap-1.5">
                              {s.heat && <span className="text-[11px] text-gray-400">{s.heat}</span>}
                              {grouped && stages.length > 0 && <span className="text-[10px] text-gray-300">{stages.length} 工艺阶段</span>}
                              {!grouped && subs.length > 0 && <span className="text-[10px] text-gray-300">{subs.length} 细分</span>}
                            </span>
                          </button>
                          {/* 第三级：带「工艺阶段」中间层的环节（如半导体设备），先列阶段再列设备种类 */}
                          {expandedSeg === s.id && grouped && (
                            <div className="bg-gray-50">
                              {stages.map(st => (
                                <div key={st.id}>
                                  <button
                                    onClick={() => pickStage(st.id)}
                                    className={`w-full text-left pl-11 pr-4 py-1 text-xs hover:bg-gray-100 flex items-center gap-1.5 ${stage === st.id ? 'text-blue-700 font-semibold' : 'text-gray-600'}`}
                                    title={st.desc || st.name}
                                  >
                                    <span className="truncate">{st.name}</span>
                                    <span className="shrink-0 text-gray-300 ml-auto">{st.leaves.length}</span>
                                  </button>
                                  {/* 第四级：设备种类（阶段展开时展示，点击直达该设备种类的企业名单） */}
                                  {expandedStage === st.id && st.leaves.length > 0 && (
                                    <div className="bg-gray-100/70">
                                      {st.leaves.map(sb => (
                                        <button
                                          key={sb.name}
                                          onClick={() => pickSub(sb.name)}
                                          className={`w-full text-left pl-16 pr-4 py-1 text-xs hover:bg-gray-200/60 flex items-center gap-1.5 ${sub === sb.name ? 'text-blue-700 font-medium' : 'text-gray-500'}`}
                                          title={sb.desc || sb.name}
                                        >
                                          <span className="truncate">{sb.name}</span>
                                          {sb.local && (
                                            <span
                                              className={`shrink-0 text-[10px] leading-none px-1 py-0.5 rounded ${LOCAL_BADGE[sb.local]}`}
                                              title={`国产化率：${sb.local}`}
                                            >{sb.local}</span>
                                          )}
                                          {sb.companies?.length ? <span className="shrink-0 text-gray-400 ml-auto">{sb.companies.length}</span> : null}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          {/* 第三级：无中间层的环节，直接列细分（原行为） */}
                          {expandedSeg === s.id && !grouped && subs.length > 0 && (
                            <div className="bg-gray-50">
                              {subs.map(sb => (
                                <button
                                  key={sb.name}
                                  onClick={() => pickSub(sb.name)}
                                  className={`w-full text-left pl-12 pr-4 py-1 text-xs hover:bg-gray-100 flex items-center gap-1.5 ${sub === sb.name ? 'text-blue-700 font-medium' : 'text-gray-500'}`}
                                  title={sb.desc || sb.name}
                                >
                                  <span className="truncate">{sb.name}</span>
                                  {sb.local && (
                                    <span
                                      className={`shrink-0 text-[10px] leading-none px-1 py-0.5 rounded ${LOCAL_BADGE[sb.local]}`}
                                      title={`国产化率：${sb.local}`}
                                    >{sb.local}</span>
                                  )}
                                  {sb.companies?.length ? <span className="shrink-0 text-gray-300 ml-auto">{sb.companies.length}</span> : null}
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
              {stageInfo && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                  <span className="font-semibold text-gray-800">{stageInfo.name}</span>
                </>
              )}
              {subInfo && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                  <span className="font-semibold text-gray-800">{subInfo.name}</span>
                  {subInfo.local && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${LOCAL_PILL[subInfo.local]}`}
                      title={`国产化率：${subInfo.local}`}
                    >国产化率 {subInfo.local}</span>
                  )}
                </>
              )}
            </div>
            <p className="text-[13px] text-gray-600 mt-2 leading-relaxed">
              {subInfo
                ? (subInfo.detail || subInfo.desc)
                : stageInfo
                  ? stageInfo.desc
                  : segInfo.seg
                    ? (segInfo.seg.detail || segInfo.seg.summary)
                    : segInfo.industryDetail}
            </p>
          </div>
        )}

        {/* 顶层 tab：行业情报 / 研究笔记 / 企业名单 */}
        <div className="flex items-center gap-1 mb-3">
          <button
            onClick={() => patchParams({ mt: 'intel' })}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              mainTab === 'intel' ? 'bg-blue-600 text-white font-medium shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 shadow-sm'}`}
          >行业情报</button>
          <button
            onClick={() => patchParams({ mt: 'companies' })}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              mainTab === 'companies' ? 'bg-blue-600 text-white font-medium shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 shadow-sm'}`}
          >企业名单<span className="text-xs opacity-70"> · {scopeLabel} {scopePool.length} 家</span></button>
          <button
            onClick={() => patchParams({ mt: 'notes' })}
            className={`px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-1.5 ${
              mainTab === 'notes' ? 'bg-blue-600 text-white font-medium shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 shadow-sm'}`}
          >
            <StickyNote className="h-3.5 w-3.5" />研究笔记
            <span className="text-xs opacity-70">· {counts.notes} 条</span>
          </button>
        </div>

        {mainTab === 'companies' && (
          <CompanyTable
            pool={scopePool}
            loading={coLoading}
            canEdit={isAuthenticated && cloudOk}
            onDescSaved={coRefresh}
          />
        )}

        {mainTab === 'notes' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <NotesPanel
              notes={filteredNotes}
              scope={{
                industry, seg, sub,
                companies: [],
                chainLabel: scopeChainLabel,
              }}
              companyOptions={scopePool.map(c => c.name)}
              nodeLabelOf={nodeLabelOf}
              onChanged={refresh}
              readOnly={!cloudOk}
              loading={loading}
            />
          </div>
        )}

        {mainTab === 'intel' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* 子 tab */}
            <div className="flex items-center border-b border-gray-100 px-2">
              {(Object.keys(REPORT_TAB) as TabType[]).map(k => (
                <button
                  key={k}
                  onClick={() => patchParams({ tab: k })}
                  className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-1.5 ${
                    tab === k ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  {k === 'reports' && <FileText className="h-4 w-4" />}
                  {k === 'events' && <Zap className="h-4 w-4" />}
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
              {!loading && current.list.length === 0 && (
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResearchHome
