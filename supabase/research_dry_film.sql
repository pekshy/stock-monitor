-- ============================================================
-- 感光干膜企业入库补丁（2026-09-28）
-- 归属：semiconductor · pcb（新细分「感光干膜」，与 PCB 制造 / 覆铜板并列）
-- 国产 4 家：福斯特（干膜龙头）、容大感光（PCB 光刻胶龙头）、广信材料（阻焊/LDI 油墨）、强力新材（上游光引发剂/树脂）
-- 外资 4 家：力森诺科（原日立化成）、旭化成、杜邦、长兴材料
-- 用法：Supabase Dashboard → SQL Editor 执行（幂等，可重复跑）
-- ============================================================

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values
('福斯特', '603806.SH', 'semiconductor', 'pcb', True, '已上市', 375.14, NULL, NULL, NULL, '{"name": "福斯特", "code": "603806.SH", "industry": "semiconductor", "seg": "pcb", "listed": true, "desc": "光伏胶膜全球龙头，以精密涂布平台切入感光干膜，公告认定的国产干膜龙头，江门基地建成后规划年产能 5 亿平米。", "cap": 375.14, "pe": 33.61, "gross": null, "latestTech": "AI 服务器 HDI / 高多层板专用干膜已供应鹏鼎控股、沪电股份、深南电路、胜宏科技等头部 PCB 厂", "tech": [{"date": "2026-08", "kind": "产能", "title": "江门基地建成后感光干膜年总产能达 5 亿平米"}, {"date": "2025-12", "kind": "业绩", "title": "2025 年感光干膜收入占比 4.4%、利润贡献 9.6%，列为第二成长曲线"}], "funding": []}'::jsonb),
('容大感光', '300576.SZ', 'semiconductor', 'pcb', True, '已上市', 118.2, NULL, NULL, NULL, '{"name": "容大感光", "code": "300576.SZ", "industry": "semiconductor", "seg": "pcb", "listed": true, "desc": "国内 PCB 光刻胶龙头（PCB 光刻胶占营收 99.8%），感光干膜已建 1.2 亿平米产线，珠海基地新增 2.4 亿平米产能 2025H2 试产。", "cap": 118.2, "pe": null, "gross": null, "latestTech": "高阶 HDI 感光线路干膜在胜宏科技、鹏鼎控股样品测试通过，待转入小批量/批量测试；IC 载板阻焊干膜国产替代推进", "tech": [{"date": "2026-08", "kind": "业绩", "title": "2026H1 营收 5.72 亿元 +13.02%，感光干膜销量同比 +32%"}, {"date": "2026-06", "kind": "产能", "title": "珠海基地 2.4 亿平米感光干膜产能进入试生产"}], "funding": []}'::jsonb),
('广信材料', '300537.SZ', 'semiconductor', 'pcb', True, '已上市', 45.01, NULL, NULL, NULL, '{"name": "广信材料", "code": "300537.SZ", "industry": "semiconductor", "seg": "pcb", "listed": true, "desc": "PCB 光刻胶及配套材料占营收约 63%，覆盖阻焊油墨、湿膜/LDI 专用线路油墨与干膜光刻胶，华南基地规划 1.6 万吨 PCB 光刻胶产能。", "cap": 45.01, "pe": 300.24, "gross": null, "latestTech": "LDI 专用线路油墨放量，干膜光刻胶与高精度液态感光材料双路线布局", "tech": [{"date": "2026-08", "kind": "业绩", "title": "2026H1 营收 2.63 亿元 +12.79%，归母净利 1484.76 万元 +9.65%"}], "funding": []}'::jsonb),
('强力新材', '300429.SZ', 'semiconductor', 'pcb', True, '已上市', 60.71, NULL, NULL, NULL, '{"name": "强力新材", "code": "300429.SZ", "industry": "semiconductor", "seg": "pcb", "listed": true, "desc": "光刻胶专用化学品龙头，感光干膜上游核心供应商：PCB 光刻胶光引发剂占营收 16.15%、PCB 光刻胶树脂占 11.44%。", "cap": 60.71, "pe": null, "gross": null, "latestTech": "光引发剂 + 树脂合计近三成营收，直接受益干膜国产放量", "tech": [{"date": "2026-08", "kind": "业绩", "title": "2026H1 营收 5.36 亿元 +17.11%，归母净亏损 6231 万元"}], "funding": []}'::jsonb),
('力森诺科', '4004.T', 'semiconductor', 'pcb', True, '已上市', NULL, NULL, NULL, NULL, '{"name": "力森诺科", "code": "4004.T", "industry": "semiconductor", "seg": "pcb", "listed": true, "market": "外资（日本）", "desc": "全球感光干膜重要供应商（原日立化成），高端 HDI 用感光干膜优势显著。", "cap": null, "pe": null, "gross": null, "latestTech": "高端 HDI 干膜与 IC 载板材料持续迭代", "tech": [], "funding": []}'::jsonb),
('旭化成', '3407.T', 'semiconductor', 'pcb', True, '已上市', NULL, NULL, NULL, NULL, '{"name": "旭化成", "code": "3407.T", "industry": "semiconductor", "seg": "pcb", "listed": true, "market": "外资（日本）", "desc": "感光干膜 ADV 系列，在中国市场占有较高份额，全球干膜三巨头之一。", "cap": null, "pe": null, "gross": null, "latestTech": "ADV 系列覆盖主流 HDI 产线", "tech": [], "funding": []}'::jsonb),
('杜邦', 'DD', 'semiconductor', 'pcb', True, '已上市', NULL, NULL, NULL, NULL, '{"name": "杜邦", "code": "DD", "industry": "semiconductor", "seg": "pcb", "listed": true, "market": "外资（美国）", "desc": "Riston 系列干膜光刻胶发明者，全球感光干膜三巨头之一。", "cap": null, "pe": null, "gross": null, "latestTech": "Riston 高端干膜配套 IC 载板与先进封装", "tech": [], "funding": []}'::jsonb),
('长兴材料', '1717.TW', 'semiconductor', 'pcb', True, '已上市', NULL, NULL, NULL, NULL, '{"name": "长兴材料", "code": "1717.TW", "industry": "semiconductor", "seg": "pcb", "listed": true, "market": "中国台湾", "desc": "中国台湾合成高分子与电子化学材料大厂，HDI 板用感光干膜 HT / UDF 系列。", "cap": null, "pe": null, "gross": null, "latestTech": "HT / UDF 系列配套高多层板与 HDI", "tech": [], "funding": []}'::jsonb)
on conflict (name) do update set
  code = excluded.code, industry = excluded.industry, seg = excluded.seg,
  listed = excluded.listed, round = excluded.round, cap = excluded.cap,
  valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
  data = excluded.data, updated_at = now();
