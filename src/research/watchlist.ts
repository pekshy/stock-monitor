// 行业研究 · 与股票板块（watchlist）的关注关系
//
// 研究池是全集，watchlist 是「重点跟踪」子集。本模块负责：
//   1) 把研究池的 industry / seg 翻译成 watchlist 的 industry1 / industry2
//   2) 用代码判断某企业是否已被关注（同一公司多视图共用代码，天然对齐）
//   3) 关注 / 取消关注（watchlist 对 anon 开放写）

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'
import { industryLabel, segNameOf } from './chain'
import type { CompanyRecord } from './api'

/** 研究池 industry → watchlist.industry1 */
const INDUSTRY_LABEL: Record<string, string> = {
  semiconductor: '半导体',
  ai: 'AI',
  robotics: '机器人',
  aerospace: '航空航天',
  quantum: '量子科技',
}

/**
 * 研究池 seg → watchlist.industry2
 * 尽量复用 watchlist 里已有的二级分类词汇，个别研究池特有环节用更贴近的叫法。
 */
const SEG_LABEL: Record<string, string> = {
  // 半导体
  eda: 'EDA与IP',
  equipment: '半导体设备',
  material: '半导体材料',
  design: '芯片设计',
  fab: '晶圆代工',
  osat: '先进封装',
  pcb: 'PCB',
  terminal: '应用终端',
  // AI
  hw: '算力硬件',
  llm: 'LLM',
  maas: 'MaaS',
  'ai-app': 'AI 应用',
  // 机器人
  reducer: '减速器',
  servo: '伺服系统',
  sensor: '传感器',
  industrial: '整机本体',
  humanoid: '整机本体',
  integrator: '柔性生产线',
}

function segLabel(seg?: string | null): string {
  if (!seg) return '其他'
  // ai-coding / ai-agent / ai-office … 在股票板块统一归到「AI 应用」，避免二级分类碎成十几项。
  // 文案与产业链 TREE 里 ai-app 环节名保持一致（带空格），否则下拉里会出现两个几乎一样的选项。
  if (seg.startsWith('ai-')) return 'AI 应用'
  return SEG_LABEL[seg] ?? '其他'
}

function marketLabel(code?: string | null): string {
  if (!code || !code.includes('.')) return '美股'
  const s = code.split('.').pop()!.toUpperCase()
  if (s === 'SH' || s === 'SZ' || s === 'BJ') return 'A股'
  if (s === 'HK') return '港股'
  if (s === 'US') return '美股'
  if (s === 'T') return '日股'
  if (s === 'TW' || s === 'TWO') return '台股'
  return '其他'
}

/**
 * 研究池分类 → 股票板块的两级分类。
 *
 * 股票板块不再自己维护行业归属，统一以研究池为准：
 * 一级行业取产业链的行业名（半导体 / AI / 机器人），
 * 二级环节优先取产业链 TREE 里的环节名（"EDA / IP"、"半导体材料"…），
 * 只有环节 id 未登记（如 AI 行业按细分写的 ai-agent）时才落到本地的归并规则。
 */
export function classifyOf(
  industry?: string | null,
  seg?: string | null,
): { industry1: string; industry2: string } {
  const fromChain = segNameOf(seg)
  const industryLabelText = industryLabel(industry)
  return {
    industry1:
      industryLabelText !== '其他'
        ? industryLabelText
        : INDUSTRY_LABEL[industry ?? ''] ?? '其他',
    industry2: fromChain ?? segLabel(seg),
  }
}

/**
 * 去掉多视图后缀：`科大讯飞-AI教育视图` → `科大讯飞`。
 * 研究池允许同一公司存在多条视图记录（共用代码），关注时用主名称更干净。
 */
export function displayName(name: string): string {
  return name.replace(/-[^-]{0,12}视图$/, '').trim() || name
}

export interface WatchState {
  /** 已关注股票的代码集合 */
  codes: Set<string>
  loading: boolean
  busy: boolean
  /** 关注 / 取消关注，失败返回 error */
  toggle: (c: CompanyRecord) => Promise<{ error?: string }>
  reload: () => Promise<void>
}

export function useWatchlist(): WatchState {
  const [codes, setCodes] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  const reload = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('watchlist').select('stock_code')
      if (error) throw error
      setCodes(new Set((data ?? []).map((r: { stock_code: string }) => r.stock_code)))
    } catch {
      // 云端不可达：保持空集合，按钮降级为不可用但页面不崩
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { reload() }, [reload])

  const toggle = useCallback(async (c: CompanyRecord) => {
    const code = (c.code ?? '').trim()
    if (!code || code === '—' || code === '-') {
      return { error: '该企业没有股票代码，无法加入股票板块' }
    }
    setBusy(true)
    try {
      if (codes.has(code)) {
        const { error } = await supabase.from('watchlist').delete().eq('stock_code', code)
        if (error) throw error
        setCodes(prev => {
          const next = new Set(prev)
          next.delete(code)
          return next
        })
      } else {
        const labels = classifyOf(c.industry, c.seg)
        const { error } = await supabase.from('watchlist').insert({
          stock_code: code,
          stock_name: displayName(c.name),
          industry1: labels.industry1,
          industry2: labels.industry2,
          market: marketLabel(code),
        })
        if (error) {
          // 23505 = 唯一约束冲突：列表还没加载完时重复点，按已关注处理
          if (error.code === '23505') {
            setCodes(prev => new Set(prev).add(code))
            return {}
          }
          throw error
        }
        setCodes(prev => new Set(prev).add(code))
      }
      return {}
    } catch (e) {
      return { error: String((e as Error)?.message || e) }
    } finally {
      setBusy(false)
    }
  }, [codes])

  return { codes, loading, busy, toggle, reload }
}
