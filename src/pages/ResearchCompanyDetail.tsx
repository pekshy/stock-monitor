import React, { useMemo, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, StickyNote, FileText, ExternalLink, Layers, ChevronRight, Users, Scale, TrendingUp } from 'lucide-react'
import { useCloudCompanies, useCompanyAnnouncements, useIntel, parseList, type CompanyRecord } from '../research/api'
import { fmtDate, fmtCap, fmtRev, fmtPct, bareCode, currencyOf } from '../research/format'
import { fmtCapLive, fmtMultiple, fmtPctLive, pctClass, currencyOfCode, amountUnit } from '../research/quotes'
import { findCompanyLocations, chainLocationUrl, segName } from '../research/chain'
import { splitInvestors, ROLE_LABEL, ROLE_CLASS } from '../research/investors'
import NotesPanel from '../components/NotesPanel'

const ResearchCompanyDetail: React.FC = () => {
  const { name } = useParams<{ name: string }>()
  const decoded = decodeURIComponent(name ?? '')
  const navigate = useNavigate()
  const { companies, loading, cloudOk } = useCloudCompanies()
  const { notes, refresh } = useIntel()
  const company = useMemo(
    () => companies.find(c => c.name === decoded) ?? null,
    [companies, decoded])
  const { anns, loading: annLoading } = useCompanyAnnouncements(company?.code)

  /** 企业在产业链中的位置（可能多处，如拓尔思同时属 AI 办公 / AI 教育 / AI 法律·政务） */
  const locations = useMemo(() => findCompanyLocations(decoded), [decoded])

  useEffect(() => { document.title = `${decoded} · 行业研究` }, [decoded])

  const coNotes = useMemo(() => {
    if (!company) return []
    return notes.filter(n => parseList(n.companies).includes(company.name))
  }, [notes, company])

  if (loading && !company) {
    return <div className="py-20 text-center text-sm text-gray-400">加载中...</div>
  }
  if (!company) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-gray-500 mb-4">未找到企业「{decoded}」</p>
        <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:underline">返回</button>
      </div>
    )
  }

  const listed = !!company.listed
  /** 美股企业金额口径为美元，A 股/港股为人民币 */
  const cur = currencyOf(company)
  /** 市值/估值的币种：行情的 currency 更准（含 JPY/HKD/EUR 等），缺失时才按代码推断 */
  const capCur = company.liveCurrency ?? currencyOfCode(company.code) ?? (cur === 'USD' ? 'USD' : 'CNY')
  /** 营收来自企业档案，币种跟随上市地（财报以本币计价） */
  const revCur = currencyOfCode(company.code) ?? (cur === 'USD' ? 'USD' : 'CNY')

  /**
   * 上市企业指标卡：市值/PE/PB 只认 research_quotes 的实时值，
   * 营收/毛利率/研发占比来自企业档案。任一指标缺值就不渲染该格，不做占位。
   */
  const liveMetrics = [
    company.liveCap != null && {
      label: '市值', value: fmtCapLive(company.liveCap, capCur), hint: amountUnit(capCur),
    },
    company.livePe != null && {
      label: 'PE(TTM)', value: fmtMultiple(company.livePe), hint: '滚动市盈率',
    },
    company.livePb != null && {
      label: 'PB', value: fmtMultiple(company.livePb), hint: '市净率',
    },
    company.rev != null && {
      label: '营收', value: fmtRev(company.rev, revCur), hint: amountUnit(revCur),
    },
    company.gross != null && { label: '毛利率', value: fmtPct(company.gross) },
    company.rd != null && { label: '研发占比', value: fmtPct(company.rd) },
  ].filter((m): m is { label: string; value: string; hint?: string } => Boolean(m))

  return (
    <div>
      {/* 头部 */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/research'))}
          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
          title="返回"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="text-lg font-bold text-gray-800">{company.name}</h2>
        {listed && company.code && <span className="text-xs text-gray-400 font-mono">{company.code}</span>}
        <span className={`text-xs px-2 py-0.5 rounded-full ${listed ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
          {listed ? '已上市' : (company.round || '未上市')}
        </span>
      </div>

      {/* 产业链归属：行业 → 环节 → 细分（点击可跳回图谱对应范围） */}
      {locations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-3.5 mb-4">
          <div className="flex items-center gap-2 mb-2.5">
            <Layers className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-xs font-bold text-gray-700">产业链归属</span>
            {locations.length > 1 && (
              <span className="text-[11px] text-gray-400">共 {locations.length} 处</span>
            )}
          </div>
          <div className="space-y-2">
            {locations.map(loc => (
              <Link
                key={`${loc.industry}|${loc.seg}|${loc.stage ?? ''}|${loc.sub}`}
                to={chainLocationUrl(loc)}
                className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] rounded-lg -mx-2 px-2 py-1 hover:bg-blue-50/60 group"
                title="在产业链图谱中查看该细分"
              >
                <span className="text-gray-500">{loc.industryName}</span>
                <ChevronRight className="h-3 w-3 text-gray-300 shrink-0" />
                <span className="text-gray-500">{loc.segName}</span>
                <ChevronRight className="h-3 w-3 text-gray-300 shrink-0" />
                {loc.stageName && (
                  <>
                    <span className="text-gray-500">{loc.stageName}</span>
                    <ChevronRight className="h-3 w-3 text-gray-300 shrink-0" />
                  </>
                )}
                <span className="font-medium text-blue-700 group-hover:underline">{loc.sub}</span>
                <ExternalLink className="h-3 w-3 text-gray-300 shrink-0 opacity-0 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 核心指标卡 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 mb-4">
        {company.desc && <p className="text-[13px] text-gray-600 leading-relaxed mb-3">{company.desc}</p>}
        {listed ? (
          <>
            {liveMetrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {liveMetrics.map(m => <Metric key={m.label} label={m.label} value={m.value} hint={m.hint} />)}
              </div>
            )}
            <div className={`${liveMetrics.length > 0 ? 'mt-3 pt-2.5 border-t border-gray-50' : ''} flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-400`}>
              {company.quoteDate ? (
                <>
                  <span>行情 {fmtDate(company.quoteDate)}</span>
                  {company.liveClose != null && (
                    <span>收盘 {company.liveClose.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}</span>
                  )}
                  <span className={pctClass(company.livePct)}>当日 {fmtPctLive(company.livePct)}</span>
                </>
              ) : (
                <span>暂无行情数据</span>
              )}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Metric label="估值" value={fmtCap(company.valuation, "CNY")} hint="人民币亿元" />
            <Metric label="最近融资" value={fmtDate(company.lastFunding)} />
            <Metric label="轮次" value={company.round || '—'} />
            <Metric label="赛道" value={segName(company.seg)} />
          </div>
        )}
      </div>

      {/* 国际巨头：国产替代对标关系 */}
      {company.note && (
        <div className="bg-indigo-50/60 rounded-xl border border-indigo-100 px-5 py-3.5 mb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <Scale className="h-3.5 w-3.5 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-900">国产替代对标</span>
          </div>
          <p className="text-[13px] text-indigo-800/90 leading-relaxed">{company.note}</p>
        </div>
      )}

      {/* 未上市：融资历史 + 技术/产品动态 */}
      {!listed && !!(company.funding?.length) && (
        <Card title="融资历史" icon={<TrendingUp className="h-4 w-4" />} count={company.funding!.length}>
          <div className="divide-y divide-gray-50">
            {company.funding!.map((f, i) => {
              // 优先用结构化的 investorsStructured（按轮次匹配），否则从原始文本解析
              const structured = (company.investorsStructured ?? [])
                .filter(s => s.round === f.round || (s.date && s.date === f.date))
                .map(s => ({ name: s.name, role: s.role, note: s.note }))
              const insts = structured.length
                ? structured
                : splitInvestors(f.investors || f.inv).map(s => ({ ...s, note: undefined as string | undefined }))
              return (
                <div key={i} className="py-2.5">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[13px]">
                    <span className="text-gray-400 shrink-0">{fmtDate(f.date)}</span>
                    <span className="font-medium text-gray-800">{f.round}</span>
                    {f.amount && <span className="text-gray-600">{f.amount}</span>}
                  </div>
                  {insts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {insts.map((it, j) => (
                        <span
                          key={j}
                          className={`text-[11px] px-1.5 py-0.5 rounded whitespace-nowrap ${ROLE_CLASS[it.role]}`}
                          title={it.note || (it.role !== 'other' ? ROLE_LABEL[it.role] : undefined)}
                        >
                          {it.name}
                          {it.role !== 'other' && (
                            <span className="opacity-70 ml-1">{ROLE_LABEL[it.role]}</span>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      )}
      {!listed && !!(company.tech?.length) && (
        <Card title="技术突破 / 产品动态">
          <div className="space-y-2">
            {company.tech!.map((t, i) => (
              <div key={i} className="flex items-baseline gap-3 text-[13px]">
                <span className="text-gray-400 shrink-0">{fmtDate(t.date)}</span>
                <span className="text-gray-800">{t.title}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 管理层：任职名单（上市=董监高，未上市=核心团队）+ 人事变动历史 */}
      <ExecutivesCard company={company} listed={listed} />

      {/* 研究笔记（页面可增改删，自动关联当前企业） */}
      <Card title="研究笔记" icon={<StickyNote className="h-4 w-4" />} count={coNotes.length}>
        <NotesPanel
          notes={coNotes}
          scope={{
            industry: company.industry ?? null,
            seg: company.seg ?? null,
            sub: null,
            companies: [company.name],
          }}
          onChanged={refresh}
          readOnly={!cloudOk}
        />
      </Card>

      {/* 公司公告（上市企业） */}
      {listed && (
        <Card title="公司公告" icon={<FileText className="h-4 w-4" />} count={anns.length}>
          {annLoading && <div className="text-sm text-gray-400 py-4 text-center">加载中...</div>}
          {!annLoading && anns.length === 0 && (
            <div className="text-sm text-gray-400 py-4 text-center">暂无公告（代码 {bareCode(company.code)}）</div>
          )}
          <div className="divide-y divide-gray-50">
            {anns.map(a => (
              <div key={a.id} className="py-2.5 flex items-baseline gap-3">
                <span className="text-[13px] text-gray-400 shrink-0">{fmtDate(a.date)}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded shrink-0 ${annTagClass(a.tag)}`}>{a.tag}</span>
                <a
                  href={a.attach_url || a.detail_url || '#'}
                  target="_blank" rel="noreferrer"
                  className="text-sm text-gray-800 hover:text-blue-700 leading-snug flex items-center gap-1"
                >
                  {a.title}
                  <ExternalLink className="h-3 w-3 text-gray-300 shrink-0" />
                </a>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

/**
 * 投资机构角色标签体系（未上市企业重点关注：谁领投、谁跟投、谁战略投资）
 * 解析与聚合逻辑统一放在 research/investors.ts，供详情页与机构统计视图复用。
 */
/** 管理层：任职名单按「董事会 / 高级管理层」分组，履历直接展示；另附人事变动历史 */
function ExecutivesCard({ company, listed }: { company: CompanyRecord; listed: boolean }) {
  const execs = company.executives ?? []
  const changes = company.execChanges ?? []
  if (!execs.length && !changes.length) return null

  // 未上市企业无「董监高」概念，统一按核心团队呈现
  const groups: { key: string; label: string; rows: typeof execs }[] = listed
    ? [
        { key: 'board', label: '董事会', rows: execs.filter(e => e.role === 'board') },
        { key: 'management', label: '高级管理层', rows: execs.filter(e => e.role !== 'board') },
      ].filter(g => g.rows.length > 0)
    : [{ key: 'team', label: '核心团队', rows: execs }]

  return (
    <Card title="管理层" icon={<Users className="h-4 w-4" />} count={execs.length || undefined}>
      {groups.map(g => (
        <div key={g.key} className="mb-4 last:mb-0">
          <div className="text-[11px] font-semibold text-gray-400 mb-1.5">{g.label}</div>
          <div className="divide-y divide-gray-50">
            {g.rows.map(e => {
              const id = `${g.key}|${e.name}|${e.title}`
              return (
                <div key={id} className="py-2">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-[13px] font-semibold text-gray-800">{e.name}</span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">{e.title}</span>
                    {e.tenure && <span className="text-[11px] text-gray-400">任期 {e.tenure}</span>}
                    {e.shares && <span className="text-[11px] text-gray-400">持股 {e.shares}</span>}
                  </div>
                  {e.bio && (
                    <p className="text-[12px] text-gray-500 leading-relaxed mt-1.5">{e.bio}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {changes.length > 0 && (
        <div className="pt-3 mt-1 border-t border-gray-100">
          <div className="text-[11px] font-semibold text-gray-400 mb-1.5">人事变动</div>
          <div className="space-y-1.5">
            {changes.map((c, i) => (
              <div key={i} className="flex items-baseline gap-3 text-[13px]">
                <span className="text-gray-400 shrink-0">{fmtDate(c.date)}</span>
                <span className="text-gray-800">{c.event}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-base font-semibold text-gray-800 mt-0.5 tabular-nums" title={hint}>{value}</div>
    </div>
  )
}

function Card({ title, icon, count, children }: {
  title: string; icon?: React.ReactNode; count?: number; children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100">
        {icon && <span className="text-blue-600">{icon}</span>}
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
        {count != null && <span className="text-xs text-gray-400">{count}</span>}
      </div>
      <div className="px-5 py-2">{children}</div>
    </div>
  )
}

function annTagClass(tag: string): string {
  switch (tag) {
    case '财报': return 'bg-blue-50 text-blue-700'
    case '业绩': return 'bg-cyan-50 text-cyan-700'
    case '融资': return 'bg-purple-50 text-purple-700'
    case '高管变动': return 'bg-amber-50 text-amber-700'
    case '风险': return 'bg-red-50 text-red-700'
    default: return 'bg-gray-100 text-gray-600'
  }
}

export default ResearchCompanyDetail
