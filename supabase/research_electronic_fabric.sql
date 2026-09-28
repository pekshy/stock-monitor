-- ============================================================
-- 电子布 / 电子纱 + 覆铜板企业入库补丁
-- 生成时间：2026-09-28
-- 用法：Supabase Dashboard → SQL Editor 整体粘贴执行（幂等，可重复跑）
--
-- 归属口径：
--   电子布/电子纱 → semiconductor · material（新细分「电子布 / 电子纱」，与「玻璃基板」并列）
--   覆铜板（直接下游）→ semiconductor · pcb（已有细分「覆铜板」）
-- 注意：research_companies 只有 seg 字段、没有 sub 字段，
--       细分层级的公司名单由前端 TREE 控制，需同步改 src/research/data.ts
-- ============================================================

-- ---------- 电子布 / 电子纱 · 8 家（seg = material） ----------
insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values
('中国巨石', '600176.SH', 'semiconductor', 'material', true, '已上市', 1723.75, NULL, NULL, NULL, '{"name": "中国巨石", "code": "600176.SH", "industry": "semiconductor", "seg": "material", "listed": true, "desc": "全球玻纤龙头，电子纱/电子布一体化，电子布产能约 13.5 亿米；拟投 44.31 亿元再建 5 万吨电子纱 / 3.2 亿米电子布。", "cap": 1723.75, "pe": 38.04, "gross": null, "latestTech": "2026-09 电子布提价：厚布 +15%、薄布 +20%；低介电玻纤研发与客户认证推进中", "tech": [{"date": "2026-09", "kind": "涨价", "title": "上调 9 月电子布价格，厚布 15%、薄布 20%"}, {"date": "2026-06", "kind": "产能", "title": "淮安年产 10 万吨电子级玻纤 / 3.9 亿米电子布产线分期点火，已达满产"}, {"date": "2026-06", "kind": "经营", "title": "2026H1 电子布销量 5.44 亿米，同比增长超 12%"}], "funding": []}'::jsonb),
('宏和科技', '603256.SH', 'semiconductor', 'material', true, '已上市', 1374.97, NULL, NULL, NULL, '{"name": "宏和科技", "code": "603256.SH", "industry": "semiconductor", "seg": "material", "listed": true, "desc": "电子级玻纤布专精厂商，极薄布/超薄布 + 低介电、低热膨胀特种布，电子纱与电子布一体化经营。", "cap": 1374.97, "pe": 278.32, "gross": null, "latestTech": "特种电子布产能饱和，2026H1 收入占比继续提升，特种布毛利率 61.31%", "tech": [{"date": "2026-08", "kind": "战略调整", "title": "终止四川苍溪 7200 万米厚布项目，资金转向黄石高端电子布"}, {"date": "2025-12", "kind": "产品动态", "title": "特种电子布（低介电/低膨胀）批量生产并交付"}, {"date": "2025-12", "kind": "业绩", "title": "2025 年营收同比 +40.31%，净利同比 +785.55%"}], "funding": []}'::jsonb),
('国际复材', '301526.SZ', 'semiconductor', 'material', true, '已上市', 1101.47, NULL, NULL, NULL, '{"name": "国际复材", "code": "301526.SZ", "industry": "semiconductor", "seg": "material", "listed": true, "desc": "重庆国际复合材料，玻纤纱/布平台型企业，电子级玻纤与高端电子布项目推进。", "cap": 1101.47, "pe": 161.78, "gross": null, "latestTech": "高端电子布与低介电产品项目推进中", "tech": [], "funding": []}'::jsonb),
('中材科技', '002080.SZ', 'semiconductor', 'material', true, '已上市', 959.89, NULL, NULL, NULL, '{"name": "中材科技", "code": "002080.SZ", "industry": "semiconductor", "seg": "material", "listed": true, "desc": "泰山玻纤为核心的玻纤及复合材料平台，电子纱/电子布业务稳步增长。", "cap": 959.89, "pe": 47.36, "gross": null, "latestTech": "规划年产 3500 万米特种玻纤布 + 年产 3500 万米低介电纤维布", "tech": [], "funding": []}'::jsonb),
('光远新材', '—', 'semiconductor', 'material', false, 'IPO 已问询', NULL, NULL, 22.68, NULL, '{"name": "光远新材", "code": "—", "industry": "semiconductor", "seg": "material", "listed": false, "desc": "电子级玻纤专精企业（河南林州），电子纱/电子布 + 低介电纱/低介电布，低介电纱产能国内第一、低介电布产销量居世界前列。", "valuation": null, "round": "IPO 已问询", "lastFunding": "2025", "latestFunding": "2025 · 上汽尚颀资本 / 上汽金控联合投资；2026-06 创业板 IPO 受理，拟募 36 亿元", "execChanges": [], "latestTech": "2026Q1 低介电布毛利率 65.58%，E 玻纤电子纱产量国内第三", "tech": [{"date": "2026-07", "kind": "IPO", "title": "IPO 状态变更为已问询，被抽中现场检查"}, {"date": "2026-06", "kind": "IPO", "title": "创业板 IPO 获受理，拟募 36 亿元投向低介电纱/布产线"}, {"date": "2025-12", "kind": "业绩", "title": "2025 年营收 22.68 亿元，扣非净利 5.10 亿元"}], "funding": [{"date": "2025", "round": "战略投资", "amount": "未披露", "inv": "上汽尚颀资本 / 上汽金控"}, {"date": "2019", "round": "A 轮", "amount": "未披露", "inv": "深创投等（2020 年启动上市辅导）"}]}'::jsonb),
('日东纺', '3110.T', 'semiconductor', 'material', true, '已上市', NULL, NULL, NULL, NULL, '{"name": "日东纺", "code": "3110.T", "industry": "semiconductor", "seg": "material", "listed": true, "market": "外资（日本）", "desc": "全球电子布龙头，T-glass（低热膨胀）与低介电玻纤布用于先进封装载板与 AI 服务器高频高速板。", "cap": null, "pe": null, "gross": null, "latestTech": "T-glass 低膨胀布配套先进封装，高端产能持续紧张", "tech": [], "funding": []}'::jsonb),
('台玻', '1802.TW', 'semiconductor', 'material', true, '已上市', NULL, NULL, NULL, NULL, '{"name": "台玻", "code": "1802.TW", "industry": "semiconductor", "seg": "material", "listed": true, "market": "中国台湾", "desc": "台湾玻璃工业，电子纱与电子布主力供应之一，配套台系覆铜板与 PCB 产业链。", "cap": null, "pe": null, "gross": null, "latestTech": "电子布产能随 AI 板材需求同步扩张", "tech": [], "funding": []}'::jsonb),
('富乔工业', '—', 'semiconductor', 'material', true, '已上市', NULL, NULL, NULL, NULL, '{"name": "富乔工业", "code": "—", "industry": "semiconductor", "seg": "material", "listed": true, "market": "中国台湾", "desc": "中国台湾电子纱/电子布厂商，低介电（Low-Dk）电子布供应 AI 服务器板材。", "cap": null, "pe": null, "gross": null, "latestTech": "2026-07-01 对 AI 服务器用低介电电子布提价 15%", "tech": [{"date": "2026-07", "kind": "涨价", "title": "面向 AI 服务器的低介电常数电子布提价 15%"}], "funding": []}'::jsonb)
on conflict (name) do update set
  code = excluded.code, industry = excluded.industry, seg = excluded.seg,
  listed = excluded.listed, round = excluded.round, cap = excluded.cap,
  valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
  data = excluded.data, updated_at = now();

-- ---------- 覆铜板 · 4 家（seg = pcb） ----------
insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values
('南亚新材', '688519.SH', 'semiconductor', 'pcb', true, '已上市', 646.53, NULL, NULL, NULL, '{"name": "南亚新材", "code": "688519.SH", "industry": "semiconductor", "seg": "pcb", "listed": true, "desc": "覆铜板头部厂商，高频高速板材切入 AI 服务器与交换机供应链，近三年营收复合增速 32.39%。", "cap": 646.53, "pe": 70.11, "gross": null, "latestTech": "高速板材在 AI 服务器客户验证与导入", "tech": [], "funding": []}'::jsonb),
('金安国纪', '002636.SZ', 'semiconductor', 'pcb', true, '已上市', 587.42, NULL, 44.8, 10.67, '{"name": "金安国纪", "code": "002636.SZ", "industry": "semiconductor", "seg": "pcb", "listed": true, "desc": "覆铜板与铝基覆铜板、半固化片，电子布涨价周期下价格弹性最大的 CCL 标的之一。", "cap": 587.42, "pe": 58.97, "rev": 44.8, "revGrowth": 10.67, "gross": 13.07, "latestTech": "2026H1 营收 33.99 亿元（+65.74%），归母净利 7.66 亿元（+986.66%）", "tech": [{"date": "2026-08", "kind": "业绩", "title": "2026H1 归母净利 7.66 亿元，同比 +986.66%"}], "funding": []}'::jsonb),
('华正新材', '603186.SH', 'semiconductor', 'pcb', true, '已上市', 398.23, NULL, 43.69, 13.05, '{"name": "华正新材", "code": "603186.SH", "industry": "semiconductor", "seg": "pcb", "listed": true, "desc": "高频覆铜板已在终端广泛应用，高速产品处于大客户验证阶段，同时布局铝塑膜与复合材料。", "cap": 398.23, "pe": null, "rev": 43.69, "revGrowth": 13.05, "gross": 13.07, "latestTech": "高速覆铜板大客户验证推进", "tech": [{"date": "2025-12", "kind": "业绩", "title": "2025 年营收 43.69 亿元（+13.05%），净利 2.77 亿元（+384.01%）"}], "funding": []}'::jsonb),
('建滔积层板', '01888.HK', 'semiconductor', 'pcb', true, '已上市', 1646.63, NULL, NULL, NULL, '{"name": "建滔积层板", "code": "01888.HK", "industry": "semiconductor", "seg": "pcb", "listed": true, "market": "中国香港", "desc": "全球覆铜板龙头，垂直一体化布局（玻纤纱—电子布—铜箔—CCL），电子布产能同步扩张，是本轮涨价周期主要新增供给之一。", "cap": 1646.63, "pe": 37.46, "gross": null, "latestTech": "电子布与覆铜板同步提价，新增产能 1.5-2 年释放", "tech": [], "funding": []}'::jsonb)
on conflict (name) do update set
  code = excluded.code, industry = excluded.industry, seg = excluded.seg,
  listed = excluded.listed, round = excluded.round, cap = excluded.cap,
  valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
  data = excluded.data, updated_at = now();

-- 已在库、仅需挂入细分名单（无需 insert）：生益科技（pcb）、菲利华（material）