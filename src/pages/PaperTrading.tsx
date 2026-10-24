import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, AlertCircle, ArrowDownRight, ArrowUpRight, Briefcase, Database } from 'lucide-react'
import { supabase } from '../utils/supabase'

/* ---------- 类型：与 supabase/paper_trading_schema_2026_10_24.sql 保持一致 ---------- */
interface PaperAccount {
  id: string
  name: string
  strategy: string | null
  init_cash: number
  start_date: string
  benchmark_code: string | null
  benchmark_name: string | null
  status: string | null
}

interface PaperNav {
  account_id: string
  date: string
  nav: number
  total_asset: number | null
  cash: number | null
  market_value: number | null
  benchmark_nav: number | null
  drawdown: number | null
}

interface PaperPosition {
  account_id: string
  symbol: string
  name: string | null
  qty: number
  avg_cost: number
  last_price: number | null
}

interface PaperOrder {
  id: number
  account_id: string
  ts: string
  trade_date: string
  symbol: string
  name: string | null
  side: 'buy' | 'sell'
  price: number
  qty: number
  amount: number | null
  fee: number | null
  reason: string | null
}

const pct = (v: number | null | undefined, digits = 2) =>
  v === null || v === undefined || !isFinite(v) ? '--' : `${(v * 100).toFixed(digits)}%`

const money = (v: number | null | undefined) => {
  if (v === null || v === undefined || !isFinite(v)) return '--'
  if (Math.abs(v) >= 1e8) return `${(v / 1e8).toFixed(2)} 亿`
  if (Math.abs(v) >= 1e4) return `${(v / 1e4).toFixed(1)} 万`
  return v.toFixed(0)
}

const signedPct = (v: number | null | undefined) =>
  v === null || v === undefined || !isFinite(v) ? '--' : `${v >= 0 ? '+' : ''}${(v * 100).toFixed(2)}%`

/** 从净值序列算最大回撤（若后端已给 drawdown 则优先用后端值） */
const maxDrawdown = (rows: PaperNav[]) => {
  if (!rows.length) return 0
  let peak = rows[0].nav
  let mdd = 0
  for (const r of rows) {
    if (r.nav > peak) peak = r.nav
    if (peak > 0) mdd = Math.min(mdd, r.nav / peak - 1)
  }
  return mdd
}

/** 净值曲线：上 2/3 画策略与基准，下 1/3 画回撤 */
const NavChart: React.FC<{ rows: PaperNav[]; benchmarkName: string }> = ({ rows, benchmarkName }) => {
  if (rows.length < 2) {
    return <div className="h-48 flex items-center justify-center text-sm text-gray-400">数据不足，至少需要 2 个交易日</div>
  }
  const W = 1000, H = 260, L = 48, R = 12, T = 12
  const navH = 170
  const ddTop = T + navH + 24
  const ddH = H - ddTop - 10

  const navs = rows.map(r => r.nav)
  const bms = rows.map(r => r.benchmark_nav ?? r.nav)
  const lo = Math.min(...navs, ...bms)
  const hi = Math.max(...navs, ...bms)
  const pad = (hi - lo) * 0.12 || 0.02
  const yMin = lo - pad, yMax = hi + pad
  const x = (i: number) => L + (i / (rows.length - 1)) * (W - L - R)
  const y = (v: number) => T + (1 - (v - yMin) / (yMax - yMin)) * navH

  const line = (arr: number[]) => arr.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')

  const dds = rows.map(r => r.drawdown ?? 0)
  const ddMin = Math.min(...dds, -0.0001)
  const dy = (v: number) => ddTop + (v / ddMin) * ddH
  const ddArea = `M${x(0)},${ddTop} ` + rows.map((_, i) => `L${x(i).toFixed(1)},${dy(dds[i]).toFixed(1)}`).join(' ') + ` L${x(rows.length - 1)},${ddTop} Z`

  const ticks = [0, Math.floor((rows.length - 1) / 2), rows.length - 1]
  const last = rows[rows.length - 1]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block select-none">
      {/* 净值区网格与基线 */}
      {[0, 0.5, 1].map(t => {
        const v = yMin + (yMax - yMin) * t
        return (
          <g key={t}>
            <line x1={L} y1={y(v)} x2={W - R} y2={y(v)} stroke="#f1f5f9" />
            <text x={L - 6} y={y(v) + 3} textAnchor="end" fontSize="10" fill="#9ca3af">{v.toFixed(2)}</text>
          </g>
        )
      })}
      {/* 基准线 */}
      <path d={line(bms)} fill="none" stroke="#cbd5e1" strokeWidth={1.4} strokeDasharray="4 3" />
      {/* 策略线 */}
      <path d={line(navs)} fill="none" stroke="#2563eb" strokeWidth={1.8} />
      {/* 最新点 */}
      <circle cx={x(rows.length - 1)} cy={y(last.nav)} r={3} fill="#2563eb" />
      <text x={x(rows.length - 1) - 6} y={y(last.nav) - 8} textAnchor="end" fontSize="10" fill="#2563eb" fontWeight={600}>
        {last.nav.toFixed(3)}
      </text>

      {/* 回撤区 */}
      <text x={L - 6} y={ddTop + 3} textAnchor="end" fontSize="9" fill="#f87171">回撤</text>
      <path d={ddArea} fill="#fecaca" opacity={0.55} />
      <path d={rows.map((_, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${dy(dds[i]).toFixed(1)}`).join(' ')}
        fill="none" stroke="#ef4444" strokeWidth={1} opacity={0.8} />
      <line x1={L} y1={ddTop} x2={W - R} y2={ddTop} stroke="#e5e7eb" />
      {/* 回撤区单独缩放，必须标出量级，否则会被误读成"回撤很深" */}
      <text x={W - R} y={ddTop + 11} textAnchor="end" fontSize="9" fill="#ef4444">
        最深 {(ddMin * 100).toFixed(1)}%
      </text>

      {/* 日期轴 */}
      {ticks.map((i, k) => (
        <text key={i} x={x(i)} y={H - 2} textAnchor={k === 0 ? 'start' : k === 2 ? 'end' : 'middle'} fontSize="10" fill="#9ca3af">
          {rows[i].date.slice(5)}
        </text>
      ))}
      {/* 图例 */}
      <g>
        <line x1={L} y1={T - 2} x2={L + 16} y2={T - 2} stroke="#2563eb" strokeWidth={2} />
        <text x={L + 20} y={T + 1} fontSize="10" fill="#6b7280">策略</text>
        <line x1={L + 52} y1={T - 2} x2={L + 68} y2={T - 2} stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 3" />
        <text x={L + 72} y={T + 1} fontSize={10} fill="#6b7280">{benchmarkName}</text>
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
      {hint && <div className="text-[11px] text-gray-400 mt-0.5">{hint}</div>}
    </div>
  )
}

const PaperTrading: React.FC = () => {
  const [accounts, setAccounts] = useState<PaperAccount[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [navs, setNavs] = useState<PaperNav[]>([])
  const [positions, setPositions] = useState<PaperPosition[]>([])
  const [orders, setOrders] = useState<PaperOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [setupMissing, setSetupMissing] = useState(false)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      const { data, error } = await supabase.from('paper_accounts').select('*').order('start_date')
      if (!alive) return
      if (error) {
        // 表不存在（42P01）说明还没执行建表 SQL，单独提示，不当成普通错误
        setSetupMissing(/does not exist|42P01|schema cache/i.test(error.message))
        setLoading(false)
        return
      }
      const list = (data ?? []) as PaperAccount[]
      setAccounts(list)
      setActiveId(list[0]?.id ?? null)
      setLoading(false)
    })()
    return () => { alive = false }
  }, [])

  useEffect(() => {
    if (!activeId) return
    let alive = true
    ;(async () => {
      const [navRes, posRes, orderRes] = await Promise.all([
        supabase.from('paper_nav_daily').select('*').eq('account_id', activeId).order('date'),
        supabase.from('paper_positions').select('*').eq('account_id', activeId),
        supabase.from('paper_orders').select('*').eq('account_id', activeId).order('trade_date', { ascending: false }).limit(30),
      ])
      if (!alive) return
      setNavs((navRes.data ?? []) as PaperNav[])
      setPositions((posRes.data ?? []) as PaperPosition[])
      setOrders((orderRes.data ?? []) as PaperOrder[])
    })()
    return () => { alive = false }
  }, [activeId])

  const account = accounts.find(a => a.id === activeId) ?? null

  const stats = useMemo(() => {
    if (!navs.length) return null
    const first = navs[0]
    const last = navs[navs.length - 1]
    const total = last.nav - 1
    const days = Math.max(1, (new Date(last.date).getTime() - new Date(first.date).getTime()) / 864e5)
    const annual = Math.pow(last.nav, 365 / days) - 1
    const bmTotal = (last.benchmark_nav ?? 1) - 1
    const pos = last.total_asset && last.market_value ? last.market_value / last.total_asset : null
    return {
      total,
      annual,
      mdd: maxDrawdown(navs),
      alpha: total - bmTotal,
      bmTotal,
      exposure: pos,
      totalAsset: last.total_asset,
      latestDate: last.date,
    }
  }, [navs])

  if (loading) {
    return <div className="flex items-center justify-center h-[400px] text-gray-500">加载中...</div>
  }

  if (setupMissing) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-2 text-amber-600 font-bold mb-3">
          <Database className="h-5 w-5" />
          模拟盘数据表尚未创建
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          需要先在 Supabase 的 SQL Editor 中执行建表脚本：
        </p>
        <pre className="mt-3 bg-gray-50 rounded-lg p-3 text-xs text-gray-700 overflow-x-auto">supabase/paper_trading_schema_2026_10_24.sql</pre>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
          执行后由模拟盘项目写入 <code className="text-xs bg-gray-100 px-1 rounded">paper_accounts</code>、
          <code className="text-xs bg-gray-100 px-1 rounded ml-1">paper_nav_daily</code> 等四张表，本页会自动展示。
        </p>
      </div>
    )
  }

  if (!accounts.length) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <AlertCircle className="h-6 w-6 text-gray-300 mx-auto mb-2" />
        <div className="text-gray-700 font-medium">暂无模拟盘账户</div>
        <p className="text-sm text-gray-500 mt-1">
          表已就绪，等待模拟盘项目写入账户与每日净值。
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 头部 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              模拟交易
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {account?.strategy || '策略描述待补充'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {accounts.length > 1 && (
              <select
                value={activeId ?? ''}
                onChange={e => setActiveId(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700"
              >
                {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            )}
            <span className="text-xs text-gray-400">
              {account?.start_date} 起 · 初始 {money(account?.init_cash)}
            </span>
          </div>
        </div>
      </div>

      {/* 指标卡 */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard label="总资产" value={money(stats.totalAsset)} hint={`截至 ${stats.latestDate}`} />
          <StatCard label="累计收益" value={signedPct(stats.total)} tone={stats.total >= 0 ? 'up' : 'down'} />
          <StatCard label="年化" value={signedPct(stats.annual)} tone={stats.annual >= 0 ? 'up' : 'down'} />
          <StatCard label="最大回撤" value={pct(stats.mdd)} tone="down" />
          <StatCard label="当前仓位" value={pct(stats.exposure, 0)} hint="市值 / 总资产" />
          <StatCard
            label={`超额（vs ${account?.benchmark_name || '基准'}）`}
            value={signedPct(stats.alpha)}
            tone={stats.alpha >= 0 ? 'up' : 'down'}
            hint={`基准 ${signedPct(stats.bmTotal)}`}
          />
        </div>
      )}

      {/* 净值曲线 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-blue-600" />
            净值与回撤
          </h2>
          <span className="text-xs text-gray-400">{navs.length} 个交易日</span>
        </div>
        <NavChart rows={navs} benchmarkName={account?.benchmark_name || '基准'} />
      </div>

      {/* 持仓 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-sm font-bold text-gray-800 mb-3">
          当前持仓 <span className="text-xs font-normal text-gray-400">{positions.length} 只</span>
        </h2>
        {positions.length === 0 ? (
          <div className="text-sm text-gray-400 py-4 text-center">空仓</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-100">
                  <th className="text-left py-2">标的</th>
                  <th className="text-right py-2">数量</th>
                  <th className="text-right py-2">成本</th>
                  <th className="text-right py-2">现价</th>
                  <th className="text-right py-2">市值</th>
                  <th className="text-right py-2">浮盈</th>
                </tr>
              </thead>
              <tbody>
                {positions.map(p => {
                  const price = p.last_price ?? p.avg_cost
                  const pnl = (price - p.avg_cost) / p.avg_cost
                  const value = price * p.qty
                  return (
                    <tr key={p.symbol} className="border-b border-gray-50">
                      <td className="py-2">
                        <Link to={`/company/${p.symbol}`} className="text-gray-800 hover:text-blue-600">
                          {p.name || p.symbol}
                        </Link>
                        <span className="text-xs text-gray-400 ml-1.5">{p.symbol}</span>
                      </td>
                      <td className="text-right text-gray-700">{p.qty.toLocaleString()}</td>
                      <td className="text-right text-gray-500">{p.avg_cost.toFixed(2)}</td>
                      <td className="text-right text-gray-700">{price.toFixed(2)}</td>
                      <td className="text-right text-gray-700">{money(value)}</td>
                      <td className={`text-right font-medium ${pnl >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {signedPct(pnl)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 成交明细 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-sm font-bold text-gray-800 mb-3">
          最近成交 <span className="text-xs font-normal text-gray-400">最近 {orders.length} 笔</span>
        </h2>
        {orders.length === 0 ? (
          <div className="text-sm text-gray-400 py-4 text-center">暂无成交</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-100">
                  <th className="text-left py-2">日期</th>
                  <th className="text-left py-2">标的</th>
                  <th className="text-left py-2">方向</th>
                  <th className="text-right py-2">价格</th>
                  <th className="text-right py-2">数量</th>
                  <th className="text-right py-2">金额</th>
                  <th className="text-left py-2 pl-3">理由</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-b border-gray-50 align-top">
                    <td className="py-2 text-gray-500 whitespace-nowrap">{o.trade_date}</td>
                    <td className="py-2">
                      <span className="text-gray-800">{o.name || o.symbol}</span>
                      <span className="text-xs text-gray-400 ml-1.5">{o.symbol}</span>
                    </td>
                    <td className="py-2">
                      <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${o.side === 'buy' ? 'text-red-600' : 'text-green-600'}`}>
                        {o.side === 'buy' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {o.side === 'buy' ? '买入' : '卖出'}
                      </span>
                    </td>
                    <td className="text-right text-gray-700">{o.price.toFixed(2)}</td>
                    <td className="text-right text-gray-700">{o.qty.toLocaleString()}</td>
                    <td className="text-right text-gray-700">{money(o.amount)}</td>
                    <td className="py-2 pl-3 text-xs text-gray-500 max-w-[280px]">{o.reason || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaperTrading
