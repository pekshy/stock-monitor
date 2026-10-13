-- 芯爱科技（南京）有限公司 纳入研究池
-- 未上市 · 产业链环节 material / IC 载板
-- 重放安全：data 为整包覆盖（excluded.data），重放时必须带上全部字段
insert into research_companies (name, code, industry, seg, listed, data)
values (
  '芯爱科技',
  '—',
  'semiconductor',
  'material',
  false,
  '{"name":"芯爱科技","code":"—","industry":"semiconductor","seg":"material","listed":false,"desc":"芯爱科技（南京）有限公司（2021-05 成立，品牌 AaltoSemi）专注先进 IC 封装基板的研发与制造，产品覆盖 Coreless ETS 无核内埋线路基板、FCCSP 与 FC-BGA（BT / ABF 基材）。核心制程平台 AaltoFlash 线宽已达 6μm 并通过国际大厂认证、制程能力可下探 5μm 以下，是国内少数具备高阶 FC-BGA 能力的基板厂。南京浦口基地一二期占地 415 亩，达产后年产 145 万片高端基板；累计申请专利超 300 项、获证超 100 项，已通过 IATF16949 与 VDA6.3 车规认证。","valuation":45,"round":"B 轮","lastFunding":"2026-09","latestFunding":"2026-09 · B 轮（投资方：玖兆投资 / 领汇创投 / 联和资本 / 睿势基金 / 瑞芯微）","execChanges":[],"latestTech":"AaltoFlash 制程线宽达 6μm 并获国际大厂认证、能力可至 5μm 以下；FC-BGA（ABF）进入送样阶段","tech":[],"funding":[{"date":"2026-09","round":"B 轮","amount":"未披露","inv":"玖兆投资 / 领汇创投 / 联和资本 / 睿势基金 / 瑞芯微"},{"date":"2023-10","round":"战略投资","inv":"比亚迪（战略入股）"},{"date":"2023","round":"A++ 轮","inv":"OPPO 等"},{"date":"2022","round":"A1 轮","amount":"超 5 亿元","inv":"和利资本 / 联发科等"}]}'::jsonb
)
on conflict (name) do update set
  code = excluded.code,
  industry = excluded.industry,
  seg = excluded.seg,
  listed = excluded.listed,
  data = excluded.data;
