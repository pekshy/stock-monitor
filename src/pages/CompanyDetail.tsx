import React, { useMemo, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, StickyNote, ExternalLink, Layers, ChevronRight, Users, Scale, TrendingUp, Star } from 'lucide-react'
import { useCloudCompanies, useIntel, parseList, type CompanyRecord } from '../research/api'
import { fmtDate, fmtCap, fmtRev, fmtPct, currencyOf } from '../research/format'
import { fmtCapLive, fmtMultiple, fmtPctLive, pctClass, currencyOfCode, amountUnit } from '../research/quotes'
import { findCompanyLocations, chainLocationUrl, segName, industryNameOf } from '../research/chain'
import { splitInvestors, ROLE_LABEL, ROLE_CLASS } from '../research/investors'
import NotesPanel from '../components/NotesPanel'
import { KLineChart, VolumeChart, TradesSection, NotesSection } from './StockDetail'
import { supabase } from '../utils/supabase'
import { useAuth } from '../context/AuthContext'
import { useWatchlist, displayName } from '../research/watchlist'
import { useStockContext } from '../context/StockContext'

const CompanyDetail: React.FC = () => {
  // 统一入口：/company/:key（key 可为代码或企业名），兼容旧路由参数名
  const params = useParams<{ key?: string; name?: string; stockCode?: string }>()
  const decoded = decodeURIComponent(params.key ?? params.name ?? params.stockCode ?? '')
  const navigate = useNavigate()
  const { companies, loading, cloudOk } = useCloudCompanies()
  const { notes, refresh } = useIntel()
  const company = useMemo(
    () => companies.find(c => c.name === decoded)
      ?? companies.find(c => c.code === decoded)
      ?? null,
    [companies, decoded])
  // 与股票板块的关注关系：研究池是全集，watchlist 是重点跟踪子集
  const { codes, busy: watchBusy, loading: watchLoading, toggle: toggleWatch } = useWatchlist()
  const { refresh: refreshStocks } = useStockContext()
  const [watchErr, setWatchErr] = useState('')
  const [tradeTab, setTradeTab] = useState<'records' | 'notes'>('records')
  /** 未上市企业用「—」「-」占位，那不是可查询的代码，行情/交易/关注都不该据此触发 */
  const rawCode = (company?.code ?? '').trim()
  const realCode = rawCode && !['—', '-', ''].includes(rawCode) ? rawCode : null
  const followed = !!realCode && codes.has(realCode)
  const { isAuthenticated } = useAuth()
  /** K 线与多周期涨跌只在「已关注的上市企业」页面加载 */
  const { quotes, latest, loading: quoteLoading } = useDailyQuotes(realCode, followed)

  const onToggleWatch = async () => {
    if (!company) return
    const r = await toggleWatch(company)
    if (r.error) { setWatchErr(r.error); return }
    setWatchErr('')
    refreshStocks()      // 让股票板块跟着更新，切过去就能看到
  }

  /**
   * 企业在产业链中的位置（可能多处，如拓尔思同时属 AI 办公 / AI 教育 / AI 法律·政务）。
   *
   * 必须用「企业名」查，不能用 URL 参数：从股票板块点进来时 key 是代码（688795.SH），
   * 而产业链图谱里挂的是企业名，用代码永远查不到，导致这块整块不渲染。
   */
  const chainLookupName = useMemo(
    () => displayName(company?.name ?? decoded),
    [company?.name, decoded])
  const locations = useMemo(() => findCompanyLocations(chainLookupName), [chainLookupName])
  /** 赛道展示：图谱里能唯一定位到细分时用细分名（更具体），多归属或未收录时回落到环节名 */
  const trackLabel = useMemo(
    () => (locations.length === 1 ? locations[0].sub : segName(company?.seg)),
    [locations, company?.seg])
  /** 图谱里查不到（企业名与图谱名单不一致）时，至少用档案里的 seg 展示「行业 / 环节」 */
  const segFallback = useMemo(
    () => (locations.length === 0 && company?.seg
      ? { industryName: industryNameOf(company.seg), segName: segName(company.seg) }
      : null),
    [locations.length, company?.seg])

  useEffect(() => { document.title = `${company?.name ?? decoded} · 行业研究` }, [company?.name, decoded])

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

        {listed && (
          <button
            onClick={onToggleWatch}
            disabled={watchBusy || watchLoading}
            title={followed ? '从股票板块移除' : '加入股票板块重点跟踪'}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
              followed
                ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                : 'border-gray-200 text-gray-500 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            <Star className="h-3.5 w-3.5" fill={followed ? 'currentColor' : 'none'} />
            {followed ? '已重点关注' : '重点关注'}
          </button>
        )}
        {listed && company.liveClose != null && (
          <div className="ml-auto flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900 tabular-nums">
              {company.liveClose.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}
            </span>
            <span className={`text-sm font-semibold tabular-nums ${pctClass(company.livePct)}`}>
              {fmtPctLive(company.livePct)}
            </span>
          </div>
        )}

      </div>
      {watchErr && <div className="mb-3 text-xs text-red-600">{watchErr}</div>}

      {/* 产业链归属：行业 → 环节 → 细分（点击可跳回图谱对应范围） */}
      {(locations.length > 0 || segFallback) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-3.5 mb-4">
          <div className="flex items-center gap-2 mb-2.5">
            <Layers className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-xs font-bold text-gray-700">产业链归属</span>
            {locations.length > 1 && (
              <span className="text-[11px] text-gray-400">共 {locations.length} 处</span>
            )}
          </div>
          {locations.length > 0 ? (
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
          ) : (
            // 图谱名单里没有这家（名称口径不一致），退到档案里的行业 / 环节，保证不空
            <div className="flex items-center gap-1.5 text-[13px]">
              <span className="text-gray-500">{segFallback!.industryName}</span>
              <ChevronRight className="h-3 w-3 text-gray-300 shrink-0" />
              <span className="font-medium text-gray-700">{segFallback!.segName}</span>
            </div>
          )}
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
            <Metric label="赛道" value={trackLabel} />
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

      {/* 行情走势：仅「已关注的上市企业」展示，未关注不请求也不渲染 */}
      {followed && realCode && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-xs font-bold text-gray-700">行情走势</span>
            <span className="text-[11px] text-gray-400">近 120 个交易日</span>
          </div>
          {quoteLoading ? (
            <div className="text-sm text-gray-400 py-6 text-center">加载中...</div>
          ) : quotes.length === 0 ? (
            <div className="text-sm text-gray-400 py-6 text-center">
              暂无日线行情数据
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {([['5 日', latest?.pct_change_5d], ['10 日', latest?.pct_change_10d],
                   ['20 日', latest?.pct_change_20d], ['60 日', latest?.pct_change_60d]] as const).map(
                  ([label, v]) => (
                    <div key={label}>
                      <div className="text-xs text-gray-400">{label}涨跌幅</div>
                      <div className={`text-base font-semibold tabular-nums mt-0.5 ${pctClass(v)}`}>
                        {fmtPctLive(v)}
                      </div>
                    </div>
                  ))}
              </div>
              <KLineChart quotes={quotes} />
              <VolumeChart quotes={quotes} />
            </>
          )}
        </div>
      )}

      {/* 未上市：融资历史 + 技术/产品动态 */}
      {!listed && !!(company.funding?.length) && (
        <Card title="融资历史" icon={<TrendingUp className="h-4 w-4" />} count={company.funding!.length}>
          <div className="divide-y divide-gray-50">
            {company.funding!.map((f, i) => {
              // 优先用结构化的 investorsStructured：先按日期精确匹配，再按轮次匹配。
              // 但「未披露 / —」这类占位轮次不能作为匹配键——多笔融资都写「未披露」时，
              // 会把同一批投资人错配到每一笔上（幂级智能的 6 月与 9 月两轮就出现过）。
              const roundKey = (r?: string | null) => {
                const t = (r ?? '').trim()
                return t && !['未披露', '—', '-', 'N/A'].includes(t) ? t : null
              }
              const thisRound = roundKey(f.round)
              const structured = (company.investorsStructured ?? [])
                .filter(s => (f.date && s.date === f.date) || (!!thisRound && s.round === thisRound))
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

      {/* 交易：记录与交易笔记同卡切换（按股票代码取数，与是否关注无关） */}
      {realCode && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100">
            {([['records', '交易记录'], ['notes', '交易笔记']] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTradeTab(key)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  tradeTab === key
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="px-5 py-3">
            {/* 交易记录与交易笔记都属个人数据，未登录一律不给看 */}
            {!isAuthenticated ? (
              <div className="py-6 text-center text-sm text-gray-400">
                登录后可查看该股票的交易{tradeTab === 'records' ? '记录' : '笔记'}
              </div>
            ) : tradeTab === 'records' ? (
              <TradesSection
                embedded
                stockCode={realCode}
                stockName={company.name}
                currentPrice={latest?.close_price ?? company.liveClose ?? undefined}
                quotes={quotes}
              />
            ) : (
              <NotesSection
                embedded
                stockCode={realCode}
                stockName={company.name}
                closes={quotes.map((q: any) => q.close_price ?? 0)}
              />
            )}
          </div>
        </div>
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


export default CompanyDetail

/** 关注股的日线历史（daily_quotes），用于 K 线与多周期涨跌 */
function useDailyQuotes(code?: string | null, enabled?: boolean) {
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let alive = true
    if (!code || !enabled) {
      setQuotes([])
      return
    }
    setLoading(true)
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from('daily_quotes')
          .select('*')
          .eq('stock_code', code)
          .order('trade_date', { ascending: false })
          .limit(120)
        if (error) throw error
        if (alive) setQuotes((data ?? []) as any[])
      } catch {
        if (alive) setQuotes([])
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [code, enabled])

  return { quotes, latest: quotes[0] ?? null, loading }
}
