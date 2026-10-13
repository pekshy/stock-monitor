-- 芯爱科技（南京）有限公司 / AaltoSemi · 先进 IC 封装基板（FC-BGA / Coreless ETS）
-- 未上市 · 产业链环节 semiconductor / material（IC 载板）
-- 重放安全：data 为整包覆盖（excluded.data），重放时必须带上全部字段
-- 2026-10 更新：补入 50 亿元 AI 与芯粒架构先进封装基板项目、B 轮工商变更（瑞芯微/海南禾希）、
--              AVL 认证名单（长电/华天/甬矽/芯德/日月光/矽品）、2024 银团贷款 15 亿元、
--              2026-09 股权转让估值 36 亿元、2nm 配套基板投产
insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data)
values (
  '芯爱科技',
  '—',
  'semiconductor',
  'material',
  false,
  'B 轮',
  null,
  45,
  null,
  '2026-09',
  '{"name":"芯爱科技","code":"—","industry":"semiconductor","seg":"material","listed":false,"desc":"芯爱科技（南京）有限公司（2021-05 成立，品牌 AaltoSemi，董事长张垂弘为手机 Coreless ETS 内埋线路基板发明人）专注先进 IC 封装基板的研发与制造，产品覆盖 Coreless ETS 无核内埋线路基板、AiP 天线封装基板、FCCSP 与 FC-BGA（BT / ABF 基材）。核心制程平台 AaltoFlash 线宽已达 6μm 并通过国际大厂认证、制程能力可下探 5μm 以下，是国内少数具备高阶 FC-BGA 能力的基板厂。2023-07 开始打样，不到十个月陆续完成海内外主要封装厂合格供应商认证，2024-04 正式进入规模量产并启动 FC-BGA（ABF）送样。已取得长电科技、华天科技、甬矽电子、芯德半导体 AVL 资格，以及中国台湾地区日月光、矽品 AVL 资格，产品获全球十大封装厂中七家订单，Coreless ETS 基板年出货量超千万颗。南京浦口基地一二期占地 415 亩、总投资超 100 亿元，达产后年产 145 万片高端基板；累计申请专利超 300 项、获证超 100 项，已通过 IATF16949 与 VDA6.3 车规认证；与东南大学共建「AI 先进封装基板技术研发中心」、与南京工业大学共建「集成电路基板创新中心」。2026 年国庆假期产线不停工，全力推进配套 2nm 芯片的先进封装基板产品生产。","valuation":45,"round":"B 轮","lastFunding":"2026-09","latestFunding":"2026-09 · B 轮（投资方：玖兆投资 / 领汇创投 / 联和资本 / 睿势基金 / 瑞芯微 / 海南禾希投资）","execChanges":[],"latestTech":"AaltoFlash 制程线宽达 6μm 并通过国际大厂认证、能力可至 5μm 以下；FC-BGA（ABF）进入送样并持续放量；配套 2nm 芯片的先进封装基板产品已投产推进中","tech":[{"date":"2026-09","title":"AI 与芯粒架构先进封装基板项目签约落地南京江北新区，计划投资 50 亿元，规划年产超 70 万片高端基板、达产年产值 60 亿元；新建 P3/P4/P5 三厂，2027 年上半年优先启动 P3、新建 7 万平方米 AI 先进芯片高阶载板洁净室（建成后为国内单体最大 AI 载板洁净室）"},{"date":"2026-09","title":"注册资本由 9.22 亿元增至 9.82 亿元；完成 B 轮融资工商变更，瑞芯微、海南禾希投资等入局"},{"date":"2024-04","title":"正式进入规模量产，同步启动 FC-BGA（ABF）产品送样，国产高端基板突破海外垄断"}],"funding":[{"date":"2026-09","round":"B 轮","amount":"未披露","inv":"玖兆投资 / 领汇创投 / 联和资本 / 睿势基金 / 瑞芯微 / 海南禾希投资"},{"date":"2026-09","round":"股权转让","amount":"估值约 36 亿元","inv":"广州越芯科技投资合伙企业（股份上升）；KAiA Capital Fund I L.P.（股东退出）"},{"date":"2024","round":"银团贷款","amount":"15 亿元","inv":"6 家银行长期合作，用于 ABF 基板扩产"},{"date":"2024-01","round":"A++ 轮（累计超 25 亿元）","inv":"比亚迪 / 越秀产业基金等战略投资者"},{"date":"2023-10","round":"战略投资","inv":"比亚迪（战略入股）"},{"date":"2023","round":"A++ 轮","inv":"OPPO 等"},{"date":"2022","round":"A1 轮","amount":"超 5 亿元","inv":"和利资本 / 联发科等"}]}'::jsonb
)
on conflict (name) do update set
  code = excluded.code,
  industry = excluded.industry,
  seg = excluded.seg,
  listed = excluded.listed,
  round = excluded.round,
  valuation = excluded.valuation,
  last_funding = excluded.last_funding,
  data = excluded.data;
