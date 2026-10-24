import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowDownRight, ArrowUpRight, BrainCircuit, Briefcase, Database, Wallet } from 'lucide-react'
import { supabase } from '../utils/supabase'

/* ---------- 类型：与线上 paper_* 表结构一致 ---------- */
interface PaperAccount {
  id: string
  label: string | null
  inception: string | null
  initial_capital: number | null
  currency: string | null
  mandate: string | null
}

interface PaperNav {
  account_id: string
  date: string
  nav: number | null
  total_assets: number | null
  cash: number | null
  equity_value: number | null
  benchmark: number | null
  note: string | null
}

interface PaperPosition {
  account_id: string
  date: string
  code: string
  name: string | null
  shares: number | null
  close: number | null
  market_value: number | null
  avg_cost: number | null
  pnl: number | null
  weight: number | null
  pe: number | null
  pe_percent: number | null
  derivative: number | null
  action: string | null
  decision: string | null
}

interface PaperTrade {
  id: number
  account_id: string
  signal_date: string | null
  trade_date: string
  code: string
  name: string | null
  side: string
  shares: number | null
  price: number | null
  amount: number | null
  fee: number | null
  cash_after: number | null
  reason: string | null
}

const pct = (v: number | null | undefined, digits = 2) =>
  v === null || v === undefined || !isFinite(v) ? '--' : `${(v * 100).toFixed(digits)}%`

const signedPct = (v: number | null | undefined) =>
  v === null || v === undefined || !isFinite(v) ? '--' : `${v >= 0 ? '+' : ''}${(v * 100).toFixed(2)}%`

const money = (v: number | null | undefined) => {
  if (v === null || v === undefined || !isFinite(v)) return '--'
  if (Math.abs(v) >= 1e8) return `${(v / 1e8).toFixed(2)} 亿`
  if (Math.abs(v) >= 1e4) return `${(v / 1e4).toFixed(1)} 万`
  return v.toFixed(0)
}

/**
 * 标的类型：ETF 还是股票。
 *
 * 现在是纯 ETF 组合，未来会加股票，所以这里不能写死链接到 /company：
 * ETF 走 /etf/:symbol，股票走 /company/:code。
 * 优先用 etf_info 的真实 symbol 表匹配（能兼容 159796.SZ 这种带后缀的历史数据），
 * 取不到时退回代码段前缀判断。
 */
type InstrumentKind = 'etf' | 'stock'

const ETF_PREFIX = /^(51|56|58|15|16|18)/

const bareCode = (code: string) => (code || '').split('.')[0].toUpperCase()

/**
 * 策略说明（mandate）里最后一段是仓位约束——权益区间、单腿上限、持仓只数。
 * 那属于执行参数，不是策略描述，页面上不展示。
 * 按「；」切段后过滤掉含约束关键词的片段；若全被过滤则回退原文，避免整条空白。
 */
const MANDATE_CONSTRAINT = /(权益|单腿|仓位|最多|上限|硬顶)/

const displayMandate = (m: string | null | undefined) => {
  if (!m) return '策略说明待补充'
  const parts = m.split('；').map(x => x.trim()).filter(Boolean)
  const kept = parts.filter(p => !MANDATE_CONSTRAINT.test(p))
  return (kept.length ? kept : parts).join('；')
}

const ACTION_STYLE: Record<string, string> = {
  buy: 'bg-red-50 text-red-600',
  sell: 'bg-green-50 text-green-600',
  hold: 'bg-gray-100 text-gray-600',
  watch: 'bg-blue-50 text-blue-600',
  买入: 'bg-red-50 text-red-600',
  卖出: 'bg-green-50 text-green-600',
  持有: 'bg-gray-100 text-gray-600',
  观察: 'bg-blue-50 text-blue-600',
}

/** 净值曲线：上 2/3 策略与基准，下 1/3 回撤 */
const NavChart: React.FC<{ rows: PaperNav[]; benchmarkName: string }> = ({ rows, benchmarkName }) => {
  if (rows.length < 2) {
    return (
      <div className="h-44 flex flex-col items-center justify-center text-sm text-gray-400 gap-1">
        <span>尚无足够净值数据</span>
        <span className="text-xs">至少需要 2 个交易日，当前 {rows.length} 个</span>
      </div>
    )
  }
  const W = 1000, H = 250, L = 48, R = 12, T = 14
  const navH = 160
  const ddTop = T + navH + 22
  const ddH = H - ddTop - 12

  const navs = rows.map(r => r.nav ?? 1)
  // 基准是点位，先按首个有效值归一化到 1.0
  const baseBm = rows.find(r => r.benchmark)?.benchmark ?? null
  const bms = rows.map(r => (r.benchmark && baseBm ? r.benchmark / baseBm : 1))
  const hasBm = !!baseBm

  const lo = Math.min(...navs, ...bms)
  const hi = Math.max(...navs, ...bms)
  const pad = (hi - lo) * 0.12 || 0.01
  const yMin = lo - pad, yMax = hi + pad
  const x = (i: number) => L + (i / (rows.length - 1)) * (W - L - R)
  const y = (v: number) => T + (1 - (v - yMin) / (yMax - yMin)) * navH
  const line = (arr: number[]) => arr.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')

  // 回撤由净值推导（表中没有 drawdown 字段）
  let peak = navs[0]
  const dds = navs.map(v => { if (v > peak) peak = v; return peak > 0 ? v / peak - 1 : 0 })
  const ddMin = Math.min(...dds, -0.0001)
  const dy = (v: number) => ddTop + (v / ddMin) * ddH
  const ddArea = `M${x(0)},${ddTop} ` + dds.map((v, i) => `L${x(i).toFixed(1)},${dy(v).toFixed(1)}`).join(' ') + ` L${x(rows.length - 1)},${ddTop} Z`

  const ticks = [0, Math.floor((rows.length - 1) / 2), rows.length - 1]
  const last = navs[navs.length - 1]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block select-none">
      {[0, 0.5, 1].map(t => {
        const v = yMin + (yMax - yMin) * t
        return (
          <g key={t}>
            <line x1={L} y1={y(v)} x2={W - R} y2={y(v)} stroke="#f1f5f9" />
            <text x={L - 6} y={y(v) + 3} textAnchor="end" fontSize="10" fill="#9ca3af">{v.toFixed(3)}</text>
          </g>
        )
      })}

      {hasBm && <path d={line(bms)} fill="none" stroke="#cbd5e1" strokeWidth={1.4} strokeDasharray="4 3" />}
      <path d={line(navs)} fill="none" stroke="#2563eb" strokeWidth={1.8} />
      <circle cx={x(rows.length - 1)} cy={y(last)} r={3} fill="#2563eb" />
      <text x={x(rows.length - 1) - 6} y={y(last) - 8} textAnchor="end" fontSize="10" fill="#2563eb" fontWeight={600}>
        {last.toFixed(4)}
      </text>

      <text x={L - 6} y={ddTop + 3} textAnchor="end" fontSize="9" fill="#f87171">回撤</text>
      <path d={ddArea} fill="#fecaca" opacity={0.55} />
      <path d={dds.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${dy(v).toFixed(1)}`).join(' ')}
        fill="none" stroke="#ef4444" strokeWidth={1} opacity={0.8} />
      <line x1={L} y1={ddTop} x2={W - R} y2={ddTop} stroke="#e5e7eb" />
      <text x={W - R} y={ddTop + 11} textAnchor="end" fontSize="9" fill="#ef4444">
        最深 {(ddMin * 100).toFixed(2)}%
      </text>

      {ticks.map((i, k) => (
        <text key={i} x={x(i)} y={H - 2} textAnchor={k === 0 ? 'start' : k === 2 ? 'end' : 'middle'} fontSize="10" fill="#9ca3af">
          {rows[i].date.slice(5)}
        </text>
      ))}

      <g>
        <line x1={L} y1={T - 4} x2={L + 16} y2={T - 4} stroke="#2563eb" strokeWidth={2} />
        <text x={L + 20} y={T - 1} fontSize="10" fill="#6b7280">策略净值</text>
        {hasBm && (
          <>
            <line x1={L + 76} y1={T - 4} x2={L + 92} y2={T - 4} stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 3" />
            <text x={L + 96} y={T - 1} fontSize="10" fill="#6b7280">{benchmarkName}</text>
          </>
        )}
      </g>
    </svg>
  )
}

const StatCard: React.FC<{ label: string; value: string; tone?: 'up' | 'down' | 'neutral'; hint?: string }> = ({ label, value, tone = 'neutral', hint }) => {
  const color = tone === 'up' ? 'text-red-600' : tone === 'down' ? 'text-green-600' : 'text-gray-900'
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`text-xl font-bold mt-1 ${color}`}>{value}</div>
      {hint && <div className="text-[11px] text-gray-400 mt-0.5 truncate">{hint}</div>}
    </div>
  )
}

const PaperTrading: React.FC = () => {
  const [accounts, setAccounts] = useState<PaperAccount[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [navs, setNavs] = useState<PaperNav[]>([])
  const [positions, setPositions] = useState<PaperPosition[]>([])
  const [trades, setTrades] = useState<PaperTrade[]>([])
  const [loading, setLoading] = useState(true)
  const [setupMissing, setSetupMissing] = useState(false)
  // 6 位代码 -> etf_info 里的原始 symbol（可能是纯数字，也可能带 .SZ 后缀）
  const [etfSymbolMap, setEtfSymbolMap] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      // 同时取 ETF 清单：用于判断持仓是 ETF 还是股票，并拿到可用的详情页 symbol
      supabase.from('etf_info').select('symbol').then(({ data: etfs }) => {
        if (!alive) return
        const m = new Map<string, string>()
        ;(etfs ?? []).forEach((e: { symbol: string }) => {
          if (e?.symbol) m.set(bareCode(e.symbol), e.symbol)
        })
        setEtfSymbolMap(m)
      })

      const { data, error } = await supabase.from('paper_accounts').select('*').order('created_at')
      if (!alive) return
      if (error) {
        setSetupMissing(/does not exist|42P01|schema cache/i.test(error.message))
        setLoading(false)
        return
      }
      const list = (data ?? []) as PaperAccount[]
      setAccounts(list)
      // 默认选最新创建的账户
      setActiveId(list.length ? list[list.length - 1].id : null)
      setLoading(false)
    })()
    return () => { alive = false }
  }, [])

  useEffect(() => {
    if (!activeId) return
    let alive = true
    ;(async () => {
      const [navRes, tradeRes] = await Promise.all([
        supabase.from('paper_nav').select('*').eq('account_id', activeId).order('date'),
        supabase.from('paper_trades').select('*').eq('account_id', activeId).order('trade_date', { ascending: false }).limit(40),
      ])
      if (!alive) return
      const navRows = (navRes.data ?? []) as PaperNav[]
      setNavs(navRows)
      setTrades((tradeRes.data ?? []) as PaperTrade[])

      // 持仓按日快照：取净值最新那天的记录
      const latest = navRows.length ? navRows[navRows.length - 1].date : null
      if (latest) {
        const { data: pos } = await supabase
          .from('paper_positions').select('*')
          .eq('account_id', activeId).eq('date', latest)
        if (alive) setPositions((pos ?? []) as PaperPosition[])
      } else {
        setPositions([])
      }
    })()
    return () => { alive = false }
  }, [activeId])

  const account = accounts.find(a => a.id === activeId) ?? null

  const stats = useMemo(() => {
    if (!navs.length) return null
    const first = navs[0]
    const last = navs[navs.length - 1]
    const navNow = last.nav ?? 1
    const total = navNow - 1
    const days = Math.max(1, (new Date(last.date).getTime() - new Date(first.date).getTime()) / 864e5)
    // 不足 7 天不给年化，避免短期数据放大成几十倍
    const annual = days >= 7 ? Math.pow(navNow, 365 / days) - 1 : null

    // peak 必须从首个净值开始，否则起点若低于最新值，早期数据会被误算成回撤
    let peak = navs[0].nav ?? 1
    let mdd = 0
    for (const r of navs) {
      const v = r.nav ?? 1
      if (v > peak) peak = v
      if (peak > 0) mdd = Math.min(mdd, v / peak - 1)
    }

    const baseBm = navs.find(r => r.benchmark)?.benchmark ?? null
    const bmNow = last.benchmark && baseBm ? last.benchmark / baseBm : null
    const bmTotal = bmNow !== null ? bmNow - 1 : null

    const exposure = last.total_assets ? (last.equity_value ?? 0) / last.total_assets : null

    return {
      total, annual, mdd, exposure,
      alpha: bmTotal !== null ? total - bmTotal : null,
      bmTotal,
      totalAsset: last.total_assets,
      cash: last.cash,
      latestDate: last.date,
    }
  }, [navs])

  /** 判定标的类型：优先查 etf_info，取不到时按代码段兜底 */
  const kindOf = (code: string): InstrumentKind => {
    const bare = bareCode(code)
    if (etfSymbolMap.has(bare)) return 'etf'
    return ETF_PREFIX.test(bare) ? 'etf' : 'stock'
  }

  /** 详情页路径：ETF 走 /etf/:symbol，股票走 /company/:code */
  const detailPath = (code: string) =>
    kindOf(code) === 'etf'
      ? `/etf/${etfSymbolMap.get(bareCode(code)) ?? bareCode(code)}`
      : `/company/${code}`

  /** ETF 报价到厘（1.186），股票到分（21.35） */
  const priceDigits = (code: string) => (kindOf(code) === 'etf' ? 3 : 2)

  // CASH 不是真实持仓，单列出来
  const stockPositions = positions.filter(p => p.code !== 'CASH')
  const cashRow = positions.find(p => p.code === 'CASH')
  const decisions = positions.filter(p => p.decision && p.decision.trim())

  // 组合类型由持仓自动推断，空仓时不显示——避免写死「ETF 组合」而未来加股票后失真
  const portKind: InstrumentKind | 'mixed' | null = (() => {
    const kinds = new Set(stockPositions.map(p => kindOf(p.code)))
    if (kinds.size === 0) return null
    return kinds.size === 1 ? (Array.from(kinds)[0] as InstrumentKind) : 'mixed'
  })()
  const portKindLabel = portKind === 'etf' ? 'ETF 组合' : portKind === 'stock' ? '股票组合' : portKind === 'mixed' ? '混合组合' : null

  if (loading) {
    return <div className="flex items-center justify-center h-[400px] text-gray-500">加载中...</div>
  }

  if (setupMissing) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-2 text-amber-600 font-bold mb-3">
          <Database className="h-5 w-5" />模拟盘数据表尚未创建
        </div>
        <p className="text-sm text-gray-600">需要在 Supabase SQL Editor 中执行建表脚本。</p>
      </div>
    )
  }

  if (!accounts.length) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <Briefcase className="h-6 w-6 text-gray-300 mx-auto mb-2" />
        <div className="text-gray-700 font-medium">暂无模拟盘账户</div>
        <p className="text-sm text-gray-500 mt-1">等待模拟盘项目写入 paper_accounts。</p>
      </div>
    )
  }

  const notStarted = !!(account?.inception && account.inception > new Date().toISOString().slice(0, 10))

  return (
    <div className="space-y-4">
      {/* 账户头部 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              {account?.label || account?.id}
              {portKindLabel && (
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {portKindLabel}
                </span>
              )}
              {notStarted && (
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                  待启动 · {account?.inception}
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{displayMandate(account?.mandate)}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {accounts.length > 1 && (
              <select
                value={activeId ?? ''}
                onChange={e => setActiveId(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700"
              >
                {accounts.map(a => <option key={a.id} value={a.id}>{a.label || a.id}</option>)}
              </select>
            )}
            <span className="text-xs text-gray-400">
              起始 {account?.inception || '—'} · 初始 {money(account?.initial_capital)}
            </span>
          </div>
        </div>
      </div>

      {/* 指标卡 */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard label="总资产" value={money(stats.totalAsset)} hint={`截至 ${stats.latestDate}`} />
          <StatCard label="累计收益" value={signedPct(stats.total)} tone={stats.total >= 0 ? 'up' : 'down'} hint={`净值 ${(1 + stats.total).toFixed(4)}`} />
          <StatCard label="年化" value={stats.annual === null ? '--' : signedPct(stats.annual)} tone={(stats.annual ?? 0) >= 0 ? 'up' : 'down'} hint={stats.annual === null ? '不足 7 个交易日' : undefined} />
          <StatCard label="最大回撤" value={pct(stats.mdd)} tone={stats.mdd < 0 ? 'down' : 'neutral'} />
          <StatCard label="当前仓位" value={pct(stats.exposure, 0)} hint={`现金 ${money(stats.cash)}`} />
          <StatCard
            label="超额收益"
            value={stats.alpha === null ? '--' : signedPct(stats.alpha)}
            tone={(stats.alpha ?? 0) >= 0 ? 'up' : 'down'}
            hint={stats.bmTotal === null ? '基准缺失' : `基准 ${signedPct(stats.bmTotal)}`}
          />
        </div>
      )}

      {/* 净值曲线 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-blue-600" />净值与回撤
          </h2>
          <span className="text-xs text-gray-400">{navs.length} 个交易日</span>
        </div>
        <NavChart rows={navs} benchmarkName="基准" />
        {navs.length === 1 && (
          <p className="text-xs text-gray-400 mt-1">
            当前仅有初始记录（{navs[0]?.date}，净值 1.0000），首个交易日后开始形成曲线。
          </p>
        )}
      </div>

      {/* 当前持仓 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-800">
            持仓 <span className="text-xs font-normal text-gray-400">{stockPositions.length} 只 · {stats?.latestDate}</span>
          </h2>
          {cashRow && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Wallet className="h-3.5 w-3.5" />现金 {money(cashRow.market_value)}
            </span>
          )}
        </div>
        {stockPositions.length === 0 ? (
          <div className="text-sm text-gray-400 py-4 text-center">空仓（均为现金）</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-100">
                  <th className="text-left py-2">标的</th>
                  <th className="text-right py-2">数量</th>
                  <th className="text-right py-2">成本</th>
                  <th className="text-right py-2">收盘</th>
                  <th className="text-right py-2">市值</th>
                  <th className="text-right py-2">权重</th>
                  <th className="text-right py-2">浮盈</th>
                  <th className="text-right py-2">PE分位</th>
                  <th className="text-center py-2">动作</th>
                </tr>
              </thead>
              <tbody>
                {stockPositions.map(p => (
                  <tr key={p.code} className="border-b border-gray-50">
                    <td className="py-2">
                      <span className={`inline-block text-[10px] leading-4 px-1 rounded mr-1.5 align-middle ${
                        kindOf(p.code) === 'etf' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {kindOf(p.code) === 'etf' ? 'ETF' : '股票'}
                      </span>
                      <Link to={detailPath(p.code)} className="text-gray-800 hover:text-blue-600">
                        {p.name || p.code}
                      </Link>
                      <span className="text-xs text-gray-400 ml-1.5">{p.code}</span>
                    </td>
                    <td className="text-right text-gray-700">{(p.shares ?? 0).toLocaleString()}</td>
                    <td className="text-right text-gray-500">{p.avg_cost?.toFixed(priceDigits(p.code)) ?? '--'}</td>
                    <td className="text-right text-gray-700">{p.close?.toFixed(priceDigits(p.code)) ?? '--'}</td>
                    <td className="text-right text-gray-700">{money(p.market_value)}</td>
                    <td className="text-right text-gray-500">{pct(p.weight, 1)}</td>
                    <td className={`text-right font-medium ${(p.pnl ?? 0) >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {p.pnl === null || p.pnl === undefined ? '--' : signedPct(p.pnl)}
                    </td>
                    <td className="text-right text-gray-500 text-xs">
                      {p.pe === null || p.pe === undefined ? '--' : p.pe.toFixed(1)}
                      {p.pe_percent !== null && p.pe_percent !== undefined && (
                        <span className="text-gray-400 ml-1">({(p.pe_percent * 100).toFixed(0)}%)</span>
                      )}
                    </td>
                    <td className="text-center">
                      {p.action ? (
                        <span className={`text-[11px] px-1.5 py-0.5 rounded ${ACTION_STYLE[p.action] || 'bg-gray-100 text-gray-600'}`}>
                          {p.action}
                        </span>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 当日决策：mandate 是「日终决策 → 次日开盘成交」，所以决策本身值得单独看 */}
      {decisions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
            <BrainCircuit className="h-4 w-4 text-violet-600" />
            决策记录 <span className="text-xs font-normal text-gray-400">{stats?.latestDate}</span>
          </h2>
          <ul className="space-y-2">
            {decisions.map(p => (
              <li key={p.code} className="text-sm flex gap-2">
                <span className="text-gray-700 font-medium shrink-0 w-24 truncate">{p.name || p.code}</span>
                <span className="text-gray-600 leading-relaxed">{p.decision}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 成交记录 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-sm font-bold text-gray-800 mb-3">
          成交记录 <span className="text-xs font-normal text-gray-400">最近 {trades.length} 笔</span>
        </h2>
        {trades.length === 0 ? (
          <div className="text-sm text-gray-400 py-4 text-center">尚无成交</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-100">
                  <th className="text-left py-2">成交日</th>
                  <th className="text-left py-2">信号日</th>
                  <th className="text-left py-2">标的</th>
                  <th className="text-left py-2">方向</th>
                  <th className="text-right py-2">价格</th>
                  <th className="text-right py-2">数量</th>
                  <th className="text-right py-2">金额</th>
                  <th className="text-right py-2">费后现金</th>
                  <th className="text-left py-2 pl-3">理由</th>
                </tr>
              </thead>
              <tbody>
                {trades.map(t => {
                  const isBuy = /buy|买/i.test(t.side)
                  return (
                    <tr key={t.id} className="border-b border-gray-50 align-top">
                      <td className="py-2 text-gray-500 whitespace-nowrap">{t.trade_date}</td>
                      <td className="py-2 text-gray-400 text-xs whitespace-nowrap">{t.signal_date || '—'}</td>
                      <td className="py-2">
                        <span className={`inline-block text-[10px] leading-4 px-1 rounded mr-1.5 align-middle ${
                          kindOf(t.code) === 'etf' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {kindOf(t.code) === 'etf' ? 'ETF' : '股票'}
                        </span>
                        <span className="text-gray-800">{t.name || t.code}</span>
                        <span className="text-xs text-gray-400 ml-1.5">{t.code}</span>
                      </td>
                      <td className="py-2">
                        <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${isBuy ? 'text-red-600' : 'text-green-600'}`}>
                          {isBuy ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {isBuy ? '买入' : '卖出'}
                        </span>
                      </td>
                      <td className="text-right text-gray-700">{t.price?.toFixed(priceDigits(t.code)) ?? '--'}</td>
                      <td className="text-right text-gray-700">{(t.shares ?? 0).toLocaleString()}</td>
                      <td className="text-right text-gray-700">{money(t.amount)}</td>
                      <td className="text-right text-gray-500 text-xs">{money(t.cash_after)}</td>
                      <td className="py-2 pl-3 text-xs text-gray-500 max-w-[260px]">{t.reason || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaperTrading
