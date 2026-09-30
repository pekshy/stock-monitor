import React, { useMemo, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, StickyNote, FileText, ExternalLink, Layers, ChevronRight } from 'lucide-react'
import { useCloudCompanies, useCompanyAnnouncements, useIntel, parseList } from '../research/api'
import { fmtDate, fmtCap, fmtRev, fmtPct, toNum, bareCode } from '../research/format'
import { findCompanyLocations, chainLocationUrl } from '../research/chain'
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
                key={`${loc.industry}|${loc.seg}|${loc.sub}`}
                to={chainLocationUrl(loc)}
                className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] rounded-lg -mx-2 px-2 py-1 hover:bg-blue-50/60 group"
                title="在产业链图谱中查看该细分"
              >
                <span className="text-gray-500">{loc.industryName}</span>
                <ChevronRight className="h-3 w-3 text-gray-300 shrink-0" />
                <span className="text-gray-500">{loc.segName}</span>
                <ChevronRight className="h-3 w-3 text-gray-300 shrink-0" />
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
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <Metric label="市值" value={fmtCap(company.cap)} />
            <Metric label="PE(TTM)" value={toNum(company.pe)?.toFixed(1) ?? '—'} />
            <Metric label="营收" value={fmtRev(company.rev)} />
            <Metric label="毛利率" value={fmtPct(company.gross)} />
            <Metric label="研发占比" value={fmtPct(company.rd)} />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Metric label="估值" value={fmtCap(company.valuation)} />
            <Metric label="最近融资" value={fmtDate(company.lastFunding)} />
            <Metric label="轮次" value={company.round || '—'} />
            <Metric label="赛道" value={company.seg || '—'} />
          </div>
        )}
      </div>

      {/* 未上市：融资历史 + 技术/产品动态 */}
      {!listed && !!(company.funding?.length) && (
        <Card title="融资历史">
          <div className="space-y-2">
            {company.funding!.map((f, i) => (
              <div key={i} className="flex items-baseline gap-3 text-[13px]">
                <span className="text-gray-400 shrink-0">{fmtDate(f.date)}</span>
                <span className="font-medium text-gray-800">{f.round}</span>
                {f.amount && <span className="text-gray-600">{f.amount}</span>}
                {(f.investors || f.inv) && <span className="text-gray-400">{f.investors || f.inv}</span>}
              </div>
            ))}
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-base font-semibold text-gray-800 mt-0.5 tabular-nums">{value}</div>
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
