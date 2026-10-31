import React, { useEffect, useMemo, useState } from 'react'
import { Landmark, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts'
import { supabase } from '../utils/supabase'

/**
 * 国家队资金动向：宽基 ETF 的每日净申购。
 *
 * 数据来源两张表（由 scripts/macro-sync/fetch_etf_flow.py 每日写入）：
 *   etf_flow            单只 ETF 明细（date + code）
 *   market_indicators   指数加总（indicator_id + date），口径 etf_{net_amount|net_shares|total_amount|total_shares}_{idx}
 *
 * 只读 market_indicators 的加总，不从明细现算——加总口径已在脚本侧固化，避免两处算法漂移。
 */

const INDEXES: { id: string; label: string; mixed: boolean }[] = [
  { id: 'csi300', label: '沪深300', mixed: true },
  { id: 'csi500', label: '中证500', mixed: true },
  { id: 'csi1000', label: '中证1000', mixed: true },
  { id: 'csi_a500', label: '中证A500', mixed: true },
  { id: 'sse50', label: '上证50', mixed: false },
  { id: 'star50', label: '科创50', mixed: false },
  { id: 'chinext', label: '创业板指', mixed: false },
  { id: 'chinext50', label: '创业板50', mixed: false },
]

type Row = { indicator_id: string; date: string; value: number }
type Series = Map<string, number>

interface IndexStat {
  id: string
  label: string
  mixed: boolean
  netAmount: Series
  totalAmount: Series
  netSh?: Series
  netSz?: Series
}

const fmt = (v: number | undefined, digits = 1) => {
  if (v === undefined || v === null || Number.isNaN(v)) return '—'
  const s = Math.abs(v).toFixed(digits)
  return `${v >= 0 ? '+' : '−'}${s}`
}

const fmtScale = (v: number | undefined) => {
  if (!v) return '—'
  return v >= 10000 ? `${(v / 10000).toFixed(2)} 万亿` : `${v.toFixed(0)} 亿`
}

/** 净流入红、净流出绿（A 股习惯） */
const tone = (v: number | undefined) =>
  v === undefined ? 'text-gray-400' : v > 0 ? 'text-rose-600' : v < 0 ? 'text-emerald-600' : 'text-gray-500'

const sumLast = (s: Series, n: number) => {
  const dates = [...s.keys()].sort()
  return dates.slice(-n).reduce((acc, d) => acc + (s.get(d) ?? 0), 0)
}

export const NationalTeam: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState('csi300')
  const [days, setDays] = useState(30)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        // market_indicators 的 etf_* 已超 2000 行，直接 select 会被 PostgREST 的 1000 行上限截断
        const PAGE = 1000
        let all: Row[] = []
        for (let from = 0; from < 8000; from += PAGE) {
          const { data, error } = await supabase
            .from('market_indicators')
            .select('indicator_id,date,value')
            .like('indicator_id', 'etf_%')
            .order('date', { ascending: true })
            .range(from, from + PAGE - 1)
          if (error) throw error
          if (!data || data.length === 0) break
          all = all.concat(data as Row[])
          if (data.length < PAGE) break
        }
        if (alive) setRows(all)
      } catch {
        if (alive) setRows([])
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  const stats = useMemo<IndexStat[]>(() => {
    const buckets = new Map<string, IndexStat>()
    INDEXES.forEach(i => buckets.set(i.id, {
      id: i.id, label: i.label, mixed: i.mixed,
      netAmount: new Map(), totalAmount: new Map(), netSh: new Map(), netSz: new Map(),
    }))

    for (const r of rows) {
      const m = /^etf_(net_amount|net_shares|total_amount|total_shares)_([a-z0-9_]+)$/.exec(r.indicator_id)
      if (!m) continue
      const [, metric, rest] = m
      // 拆分项形如 csi300_sh，单独归到所属指数
      const split = /^(.*)_(sh|sz)$/.exec(rest)
      const idxId = split ? split[1] : rest
      const s = buckets.get(idxId)
      if (!s) continue
      if (split) {
        if (metric === 'net_amount') (split[2] === 'sh' ? s.netSh : s.netSz)!.set(r.date, r.value)
        continue
      }
      if (metric === 'net_amount') s.netAmount.set(r.date, r.value)
      else if (metric === 'total_amount') s.totalAmount.set(r.date, r.value)
    }
    return INDEXES.map(i => buckets.get(i.id)!).filter(s => s.netAmount.size > 0)
  }, [rows])

  const latestDate = useMemo(() => {
    let d = ''
    stats.forEach(s => s.netAmount.forEach((_, k) => { if (k > d) d = k }))
    return d
  }, [stats])

  const chartData = useMemo(() => {
    const s = stats.find(x => x.id === active)
    if (!s) return []
    return [...s.netAmount.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-days)
      .map(([date, v]) => ({ date: date.slice(5).replace('-', '/'), v }))
  }, [stats, active, days])

  const todayTotal = stats.reduce((acc, s) => acc + (s.netAmount.get(latestDate) ?? 0), 0)

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl shadow-sm p-5">
        <div className="h-24 flex items-center justify-center text-sm text-gray-400">资金流数据加载中…</div>
      </section>
    )
  }

  if (!stats.length) {
    return (
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl shadow-sm p-5">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Landmark className="h-5 w-5 text-indigo-600" />
          跟踪国家队资金动向
        </h2>
        <p className="text-sm text-gray-400 mt-2">暂无数据。运行 scripts/macro-sync/fetch_etf_flow.py 后出现。</p>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl shadow-sm p-5">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Landmark className="h-5 w-5 text-indigo-600" />
          跟踪国家队资金动向
        </h2>
        <span className="text-xs text-gray-400">
          8 只宽基 · 26 只 ETF · 单位亿元 · 口径「份额变化 × 净值」 · 最新 {latestDate}
        </span>
        <span className={`ml-auto text-sm font-semibold ${tone(todayTotal)}`}>
          当日合计 {fmt(todayTotal)} 亿
        </span>
      </div>

      {/* 八只宽基：当日 / 5 日 / 20 日 / 规模 */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {stats.map(s => {
          const today = s.netAmount.get(latestDate)
          const d5 = sumLast(s.netAmount, 5)
          const d20 = sumLast(s.netAmount, 20)
          const scale = [...s.totalAmount.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-1)[0]?.[1]
          const ratio = scale && today !== undefined ? (today / scale) * 100 : undefined
          return (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`text-left rounded-lg bg-white/70 px-3 py-2.5 ring-1 transition ${
                active === s.id ? 'ring-indigo-400 shadow-sm' : 'ring-transparent hover:ring-indigo-200'
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-gray-700">{s.label}</span>
                <span className="text-[11px] text-gray-400">{fmtScale(scale)}</span>
              </div>
              <div className={`mt-1 text-xl font-bold tabular-nums flex items-center gap-1 ${tone(today)}`}>
                {today !== undefined && today >= 0
                  ? <ArrowUpRight className="h-4 w-4" />
                  : today !== undefined ? <ArrowDownRight className="h-4 w-4" /> : null}
                {fmt(today)}
                <span className="text-xs font-normal text-gray-400">亿</span>
              </div>
              <div className="mt-1 flex gap-3 text-[11px] text-gray-500 tabular-nums">
                <span>5日 <b className={tone(d5)}>{fmt(d5, 0)}</b></span>
                <span>20日 <b className={tone(d20)}>{fmt(d20, 0)}</b></span>
                {ratio !== undefined && <span>占规模 {ratio.toFixed(2)}%</span>}
              </div>
            </button>
          )
        })}
      </div>

      {/* 趋势：单日净申购，正红负绿 */}
      <div className="mt-5">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-sm font-medium text-gray-700">
            {INDEXES.find(i => i.id === active)?.label} 单日净申购
          </span>
          <div className="flex gap-1 ml-auto">
            {[20, 30, 54].map(n => (
              <button
                key={n}
                onClick={() => setDays(n)}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  days === n ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                近 {n} 日
              </button>
            ))}
          </div>
        </div>
        <div className="h-44 bg-white/60 rounded-lg p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} interval="preserveStartEnd" tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={54} />
              <Tooltip
                formatter={(v: number) => [`${v >= 0 ? '+' : ''}${v.toFixed(1)} 亿元`, '净申购']}
                labelStyle={{ fontSize: 12 }}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <ReferenceLine y={0} stroke="#d1d5db" />
              <Bar dataKey="v" radius={[2, 2, 0, 0]}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.v >= 0 ? '#e11d48' : '#059669'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 沪深拆分：混合指数当日资金来自哪个市场 */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-400 border-b border-gray-200">
              <th className="text-left font-normal py-1.5">混合指数（当日）</th>
              <th className="text-right font-normal">沪市</th>
              <th className="text-right font-normal">深市</th>
              <th className="text-right font-normal">合计</th>
              <th className="text-right font-normal">深市占比</th>
            </tr>
          </thead>
          <tbody>
            {stats.filter(s => s.mixed).map(s => {
              const sh = s.netSh?.get(latestDate) ?? 0
              const sz = s.netSz?.get(latestDate) ?? 0
              const total = sh + sz
              // 池内没有深市成分时 sz 恒为 0，占比无意义，显示 —
              const pct = total !== 0 && sz !== 0 ? (sz / Math.abs(total)) * 100 : NaN
              return (
                <tr key={s.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-1.5 text-gray-600">{s.label}</td>
                  <td className={`text-right tabular-nums ${tone(sh)}`}>{fmt(sh)}</td>
                  <td className={`text-right tabular-nums ${tone(sz)}`}>{fmt(sz)}</td>
                  <td className={`text-right tabular-nums font-medium ${tone(total)}`}>{fmt(total)}</td>
                  <td className="text-right tabular-nums text-gray-500">{Number.isNaN(pct) ? '—' : `${pct.toFixed(0)}%`}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-gray-400">
        净申购为 ETF 份额变化 × 单位净值，是「被动买盘」的代理指标，不等于国家队实际买入：份额增长也可能来自
        券商做市、套利盘或险资配置。单日读数受申赎时点影响，建议看 5 日 / 20 日累计。
      </p>
    </section>
  )
}

export default NationalTeam
