import { TREE, INDUSTRY_DATA, isGrouped } from './data'

/** 企业所属的一处产业链位置（行业 → 环节 → 工艺阶段 → 细分）。 */
export interface CompanyChainLocation {
  /** 行业 id，如 semiconductor / ai / robotics */
  industry: string
  /** 行业名，如「半导体」 */
  industryName: string
  /** 环节 id，如 design / ai-app */
  seg: string
  /** 环节名，如「芯片设计」 */
  segName: string
  /** 工艺阶段 id（仅带中间层的环节有值，如半导体设备的 front-end） */
  stage?: string
  /** 工艺阶段名，如「前道设备」 */
  stageName?: string
  /** 最末级细分名，如「SoC / 视觉处理」 */
  sub: string
}

/**
 * 环节 id → 所属行业信息。一个环节 id 全局唯一，且只归属一个行业，
 * 因此可安全地由 TREE 的 key 反查行业。
 */
const SEG_INDEX = new Map<string, { industry: string; industryName: string; segName: string }>()
for (const [industry, data] of Object.entries(INDUSTRY_DATA)) {
  for (const seg of data.segs) {
    SEG_INDEX.set(seg.id, { industry, industryName: data.name, segName: seg.name })
  }
}

/**
 * 环节 id → 中文环节名，如 material → 「材料」、ai-app → 「AI 应用」。
 * 用于详情页等场景直接展示中文赛道，避免裸出 material 这类内部 id。
 * 未登记的 id 原样返回（保住老数据的可读性，不显示空白）。
 */
export function segName(segId?: string | null): string {
  if (!segId) return '—'
  return SEG_INDEX.get(segId)?.segName ?? segId
}

/** 环节 id → 所属行业中文名，如 material → 「半导体」。 */
export function industryNameOf(segId?: string | null): string {
  if (!segId) return '—'
  return SEG_INDEX.get(segId)?.industryName ?? segId
}

/**
 * 环节 id → 中文环节名，未登记返回 null（供调用方决定兜底文案）。
 * 与 segName 的区别：不会把内部 id 原样吐出来。
 */
export function segNameOf(segId?: string | null): string | null {
  if (!segId) return null
  return SEG_INDEX.get(segId)?.segName ?? null
}

/** 行业 id → 行业中文名，如 semiconductor → 「半导体」。 */
export function industryLabel(industryId?: string | null): string {
  if (!industryId) return '其他'
  return INDUSTRY_DATA[industryId]?.name ?? '其他'
}

/**
 * 反查某企业名出现在产业链的哪些位置。
 *
 * 依据是 TREE[环节id] 下每个细分项的 companies 名单（而非公司记录的 seg 字段），
 * 因为同一家公司可被多处引用——例如拓尔思同时出现在「AI 办公 / AI 教育 / AI 法律·政务」，
 * 而公司记录只有一个 seg，无法表达多归属。
 *
 * 带「工艺阶段」中间层的环节（如半导体设备）会先展平，再回填 stage/stageName，
 * 使企业详情页的面包屑能显示完整四级路径。
 */
export function findCompanyLocations(name?: string | null): CompanyChainLocation[] {
  if (!name) return []
  const out: CompanyChainLocation[] = []
  for (const [segId, value] of Object.entries(TREE)) {
    const meta = SEG_INDEX.get(segId)
    if (!meta) continue
    // 统一成 { leaf, stage } 列表：分组环节展开各阶段，扁平环节 stage 为 null
    const entries = isGrouped(value)
      ? value.flatMap(st => st.leaves.map(leaf => ({ leaf, stage: st as { id: string; name: string } | null })))
      : (value as { name: string; companies?: string[] }[]).map(leaf => ({ leaf, stage: null }))
    for (const { leaf, stage } of entries) {
      if ((leaf.companies ?? []).includes(name)) {
        out.push({
          industry: meta.industry,
          industryName: meta.industryName,
          seg: segId,
          segName: meta.segName,
          stage: stage?.id,
          stageName: stage?.name,
          sub: leaf.name,
        })
      }
    }
  }
  return out
}

/**
 * 构造跳回产业链图谱的链接（保留行业/环节/工艺阶段/细分与「企业名单」tab）。
 * 与 ResearchHome 的 URL 参数约定保持一致：ind / seg / stage / sub / mt。
 * 无中间层的环节不输出 stage 参数，保持老链接逐字节不变。
 */
export function chainLocationUrl(loc: CompanyChainLocation): string {
  const p = new URLSearchParams()
  p.set('ind', loc.industry)
  p.set('seg', loc.seg)
  if (loc.stage) p.set('stage', loc.stage)
  p.set('sub', loc.sub)
  p.set('mt', 'companies')
  return `/research?${p.toString()}`
}
