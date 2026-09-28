-- ============================================================
-- 设备 · 量检测设备：补充 4 家企业（东方晶源 / 赛美特 / 科益虹源 / 奥宝科技）
-- 目标表：research_companies（主键 name，幂等可重复执行）
-- 说明：表内只有 seg（equipment），没有 sub 字段；
--       「量检测设备」这一细分的归属由前端 TREE 名单控制，
--       需同步改 src/research/data.ts 中 TREE.equipment → 量检测设备 → companies
-- ============================================================

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values
('东方晶源', '—', 'semiconductor', 'equipment', false, 'IPO 已问询', NULL, 100, NULL, '2024-04', '{"name": "东方晶源", "code": "—", "industry": "semiconductor", "seg": "equipment", "listed": false, "desc": "电子束量检测设备 + 制造类 EDA 双主业，CD-SEM / EBI / DR-SEM / HV-SEM 四大前道设备系列。", "valuation": 100, "round": "IPO 已问询", "lastFunding": "2024-04", "latestFunding": "2024-04 · 数亿元（IPO 申报前最后一轮，估值约 100 亿）", "execChanges": [], "latestTech": "EBI 电子束缺陷检测设备获国内头部存储晶圆厂订单", "tech": [{"date": "2026-06", "kind": "订单", "title": "斩获头部存储晶圆厂计算光刻与 AI 刻蚀（vPWQ）订单"}, {"date": "2026-06", "kind": "IPO", "title": "科创板 IPO 获受理并进入问询，拟募 25 亿元"}, {"date": "2026-06", "kind": "产品动态", "title": "发布用于先进制程的电子束量检测技术方案"}], "funding": [{"date": "2024-04", "round": "Pre-IPO", "amount": "数亿元", "inv": "赛领资本 / 深创投"}, {"date": "2023", "round": "D 轮", "amount": "数亿元", "inv": "深创投 / 赛领资本（投后估值约 80 亿）"}, {"date": "2022-10", "round": "C 轮", "amount": "近 10 亿元", "inv": "亦庄国投 / 深创投 / 松禾资本等"}]}'::jsonb),
('赛美特', '—', 'semiconductor', 'equipment', false, 'C+ 轮', NULL, 65, NULL, '2024-06', '{"name": "赛美特", "code": "—", "industry": "semiconductor", "seg": "equipment", "listed": false, "desc": "国产半导体 CIM 软件龙头，MES / EAP / YMS / SPC / FDC 全栈，已在 7 家 12 吋晶圆厂量产验证。", "valuation": 65, "round": "C+ 轮", "lastFunding": "2024-06", "latestFunding": "2024-06 · C+ 轮数亿元（C 轮投后估值超 60 亿，筹备港股 IPO）", "execChanges": [], "latestTech": "12 吋晶圆厂全自动 CIM（Auto3）上线，YMS 良率分析国产替代", "tech": [{"date": "2026-03", "kind": "产品动态", "title": "2025 年报：营收创新高，稳居国产半导体 CIM 第一"}, {"date": "2025-12", "kind": "产品动态", "title": "PlantU 系列覆盖经营/生产/品质/物流全链路"}], "funding": [{"date": "2024-06", "round": "C+ 轮", "amount": "数亿元", "inv": "策源资本 / 允泰资本 / 申万宏源等"}, {"date": "2023-07", "round": "C 轮", "amount": "超 5 亿元", "inv": "经纬创投 / G60 科创基金 / 立昂微等"}]}'::jsonb),
('科益虹源', '—', 'semiconductor', 'equipment', false, 'C 轮', NULL, 120, NULL, '2021-06', '{"name": "科益虹源", "code": "—", "industry": "semiconductor", "seg": "equipment", "listed": false, "desc": "国产光刻用准分子激光光源龙头，40kW 级 ArF 193nm 光源，国家 02 专项产业化载体，上海微电子光源供应商。", "valuation": 120, "round": "C 轮", "lastFunding": "2021-06", "latestFunding": "2021-06 · C 轮（哈勃投资入股；后续轮次与估值待核实）", "execChanges": [], "latestTech": "40kW ArF 光刻光源批量交付，LPP-EUV 光源预研启动", "tech": [{"date": "2020", "kind": "技术突破", "title": "交付国内首台 40kW ArF 光刻光源，覆盖 28nm 节点"}], "funding": [{"date": "2021-06", "round": "C 轮", "amount": "未披露", "inv": "哈勃投资（华为）/ 亦庄国投"}, {"date": "2016", "round": "天使轮", "amount": "未披露", "inv": "中科院微电子所 / 亦庄国投 / 国科科仪"}]}'::jsonb),
('奥宝科技', '—', 'semiconductor', 'equipment', false, 'KLA 全资子公司', NULL, NULL, NULL, NULL, '{"name": "奥宝科技", "code": "—", "industry": "semiconductor", "seg": "equipment", "listed": false, "market": "外资", "desc": "以色列 AOI 光学检测设备厂商，PCB / FPD / 半导体封装检测全球领先，量检测环节国际对标龙头。", "valuation": null, "round": "KLA 全资子公司", "lastFunding": null, "latestFunding": "2019 年被 KLA 以约 34 亿美元收购（原 Nasdaq: ORBK 退市）", "execChanges": [], "latestTech": "Ultra Fusion 系列 AOI 覆盖 IC 载板 15μm 线宽检测；FPD 业务 2024 年底关停", "tech": [{"date": "2024-12", "kind": "战略调整", "title": "KLA 关停奥宝 FPD 平板显示检测业务"}], "funding": []}'::jsonb)
on conflict (name) do update set
  code = excluded.code,
  industry = excluded.industry,
  seg = excluded.seg,
  listed = excluded.listed,
  round = excluded.round,
  valuation = excluded.valuation,
  last_funding = excluded.last_funding,
  data = excluded.data,
  updated_at = now();

-- 若不想覆盖已存在记录，把上面的 do update 改为：on conflict (name) do nothing;
