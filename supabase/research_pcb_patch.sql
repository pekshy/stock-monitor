-- ============================================================
-- PCB 环节迁移补丁（半导体 ← AI/算力硬件，9 家企业）
-- 生成时间：2026-09-26 08:33
-- 用法：Supabase Dashboard → SQL Editor 整体粘贴执行
-- 幂等：先删后插，可重复执行
-- ============================================================

delete from research_companies where name in (
  '沪电股份','胜宏科技','生益科技','生益电子','景旺电子',
  '崇达技术','鹏鼎控股','东山精密','深南电路'
);

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values
('沪电股份', '002463.SZ', 'semiconductor', 'pcb', true, '已上市', 2376.6, NULL, 136.9, NULL, '{"name": "沪电股份", "code": "002463.SZ", "industry": "semiconductor", "seg": "pcb", "listed": true, "desc": "AI 服务器/交换机高多层 PCB 龙头，海外算力大客户核心供应商", "cap": 2376.6, "pe": 40.7, "rev": 136.9, "revGrowth": 61.2, "gross": null, "rd": null, "spark": [1853.7, 2043.9, 2210.2, 2376.6], "latestTech": "青淞/黄石基地 AI 板扩产", "tech": [], "funding": []}'::jsonb),
('胜宏科技', '300476.SZ', 'semiconductor', 'pcb', true, '已上市', 2231.4, NULL, 116.3, NULL, '{"name": "胜宏科技", "code": "300476.SZ", "industry": "semiconductor", "seg": "pcb", "listed": true, "desc": "AI 算力 PCB 头部（GPU 加速卡高阶 HDI），英伟达链核心标的", "cap": 2231.4, "pe": 39.1, "rev": 116.3, "revGrowth": 28.8, "gross": null, "rd": null, "spark": [1740.5, 1919, 2077.2, 2231.4], "latestTech": "越南基地投产承接海外算力订单", "tech": [], "funding": []}'::jsonb),
('生益科技', '600183.SH', 'semiconductor', 'pcb', true, '已上市', 3496.1, NULL, 190.3, NULL, '{"name": "生益科技", "code": "600183.SH", "industry": "semiconductor", "seg": "pcb", "listed": true, "desc": "覆铜板全球第二，高速材料（M6/M8 级）国产替代主力", "cap": 3496.1, "pe": 53.2, "rev": 190.3, "revGrowth": 50, "gross": null, "rd": null, "spark": [2726.9, 3008.6, 3251.4, 3496.1], "latestTech": "超低损耗覆铜板进入 AI 服务器供应链", "tech": [], "funding": []}'::jsonb),
('生益电子', '688183.SH', 'semiconductor', 'pcb', true, '已上市', 1042.6, NULL, 57.8, NULL, '{"name": "生益电子", "code": "688183.SH", "industry": "semiconductor", "seg": "pcb", "listed": true, "desc": "生益科技旗下，AI 服务器高多层 PCB", "cap": 1042.6, "pe": 46.9, "rev": 57.8, "revGrowth": 53.5, "gross": null, "rd": null, "spark": [813.2, 896.6, 969.6, 1042.6], "latestTech": "东城四期 AI 服务器板产能爬坡", "tech": [], "funding": []}'::jsonb),
('景旺电子', '603228.SH', 'semiconductor', 'pcb', true, '已上市', 1045.9, NULL, 86.1, NULL, '{"name": "景旺电子", "code": "603228.SH", "industry": "semiconductor", "seg": "pcb", "listed": true, "desc": "PCB 多元布局（刚性/FPC/金属基），工控与汽车电子为主", "cap": 1045.9, "pe": 86.9, "rev": 86.1, "revGrowth": 21.4, "gross": null, "rd": null, "spark": [815.8, 899.5, 973.7, 1045.9], "latestTech": "", "tech": [], "funding": []}'::jsonb),
('崇达技术', '002815.SZ', 'semiconductor', 'pcb', true, '已上市', 288.8, NULL, 43.3, NULL, '{"name": "崇达技术", "code": "002815.SZ", "industry": "semiconductor", "seg": "pcb", "listed": true, "desc": "中大批量 PCB，通信/工控/汽车，算力订单占比提升", "cap": 288.8, "pe": 94.9, "rev": 43.3, "revGrowth": 22.6, "gross": null, "rd": null, "spark": [225.3, 248.4, 268.6, 288.8], "latestTech": "", "tech": [], "funding": []}'::jsonb),
('鹏鼎控股', '002938.SZ', 'semiconductor', 'pcb', true, '已上市', 2083, NULL, 172.2, NULL, '{"name": "鹏鼎控股", "code": "002938.SZ", "industry": "semiconductor", "seg": "pcb", "listed": true, "desc": "全球 PCB 产值第一（FPC 为主），苹果链核心，切入 AI 服务器板", "cap": 2083, "pe": 81.1, "rev": 172.2, "revGrowth": 5.1, "gross": null, "rd": null, "spark": [1624.7, 1791.4, 1937.2, 2083], "latestTech": "淮安三园区 AI 服务器板扩产", "tech": [], "funding": []}'::jsonb),
('东山精密', '002384.SZ', 'semiconductor', 'pcb', true, '已上市', 3592.7, NULL, 278, NULL, '{"name": "东山精密", "code": "002384.SZ", "industry": "semiconductor", "seg": "pcb", "listed": true, "desc": "FPC+PCB 双主业（收购索尔思切入光模块），新能源车与 AI 算力双驱动", "cap": 3592.7, "pe": 60.8, "rev": 278, "revGrowth": 63.9, "gross": null, "rd": null, "spark": [2802.3, 3089.7, 3341.2, 3592.7], "latestTech": "AI 服务器 PCB 与 800G 光模块放量", "tech": [], "funding": []}'::jsonb),
('深南电路', '002916.SZ', 'semiconductor', 'pcb', true, '已上市', 2619.1, NULL, 153, NULL, '{"name": "深南电路", "code": "002916.SZ", "industry": "semiconductor", "seg": "pcb", "listed": true, "desc": "IC 载板+PCB+封装基板平台", "cap": 2619.1, "pe": 58.2, "rev": 153, "revGrowth": 46.3, "gross": null, "rd": null, "spark": [2147.7, 2357.2, 2514.3, 2619.1], "latestTech": "", "tech": [], "funding": []}'::jsonb);
