-- 中特微（苏州中特微电子科技有限公司 / Zonte）纳入研究池
-- 未上市 · 产业链环节 equipment / 光刻设备（接触·接近式 Mask Aligner）
-- 重放安全：data 为整包覆盖（excluded.data），重放时必须带上全部字段
insert into research_companies (name, code, industry, seg, listed, data)
values (
  '中特微',
  '—',
  'semiconductor',
  'equipment',
  false,
  '{"name":"中特微","code":"—","industry":"semiconductor","seg":"equipment","listed":false,"desc":"苏州中特微电子科技有限公司（品牌 Zonte，2021-09 成立），核心技术团队源自中国科学院重庆绿色智能技术研究院。专注智能高速光刻设备，主营 UVLED 平行光源模组、全自动接近式光刻机、半自动双面套刻光刻机与移动掩模曝光机，面向接触/接近式（Mask Aligner）细分赛道推进近紫外光刻机国产替代。全自动接近式光刻机已批量应用于三安光电、兆驰股份、华灿光电、睿创微纳等上市公司并持续复购，光显示（LED/MiniLED）领域出货量位居国内第一。产品曝光尺寸覆盖 1/2/4/6/8/12 英寸晶圆及方片，产能 200 片/小时，套刻精度 ±0.5μm，支持智能工厂接口对接。研发中心设于重庆两江新区，生产基地设于成都双流经济开发区。","round":"A 轮","lastFunding":"2024-11","latestFunding":"2024-11 · 天使轮 / A 轮（投资方：时代伯乐；2026-06 股权转让 6.79%）","execChanges":[],"latestTech":"全自动接近式光刻机套刻精度 ±0.5μm、产能 200 片/小时，覆盖 1-12 英寸晶圆与方片，支持智能工厂接口；2026 年接近式光刻机批量出货过百台，光显示领域出货量国内第一","tech":[],"funding":[{"date":"2026-06","round":"股权转让","amount":"6.79% 股权","inv":"林世超（受让方）"},{"date":"2026-02","round":"出资设立","inv":"时代伯乐（中特微（成都）电子科技有限公司）"},{"date":"2024-11","round":"天使轮 / A 轮","inv":"深圳市时代伯乐领航天使创业投资合伙企业（有限合伙）；注册资本由 500 万元增至 542.1052 万元"}]}'::jsonb
)
on conflict (name) do update set
  code = excluded.code,
  industry = excluded.industry,
  seg = excluded.seg,
  listed = excluded.listed,
  data = excluded.data;
