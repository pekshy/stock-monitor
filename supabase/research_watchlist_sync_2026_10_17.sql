-- ============================================================
-- 行情板块 → 研究池 增量同步（2026-10-16 行情/估值快照）
-- 来源：watchlist 140 只 与 research_companies 735 家按裸代码比对
-- 新增 38 家；另修正 3 家池内代码；幂等（on conflict (name) do update）
-- 生成脚本：gen_sql.py    执行：Supabase Dashboard → SQL Editor
-- ============================================================

-- ---------- 1. 新增：行情板块中存在、研究池缺失的企业 ----------
insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values
('TCL中环', '002129.SZ', 'semiconductor', 'material', true, '已上市', 378.8, NULL, NULL, NULL, '{"name": "TCL中环", "code": "002129.SZ", "industry": "semiconductor", "seg": "material", "listed": true, "cap": 378.8, "pe": null, "spark": [], "tech": [], "funding": []}'::jsonb),
('新亚制程', '002388.SZ', 'semiconductor', 'material', true, '已上市', 46.1, NULL, NULL, NULL, '{"name": "新亚制程", "code": "002388.SZ", "industry": "semiconductor", "seg": "material", "listed": true, "cap": 46.1, "pe": null, "spark": [], "tech": [], "funding": []}'::jsonb),
('回天新材', '300041.SZ', 'semiconductor', 'material', true, '已上市', 54.5, NULL, NULL, NULL, '{"name": "回天新材", "code": "300041.SZ", "industry": "semiconductor", "seg": "material", "listed": true, "cap": 54.5, "pe": 22.2, "spark": [], "tech": [], "funding": []}'::jsonb),
('国瓷材料', '300285.SZ', 'semiconductor', 'material', true, '已上市', 458.6, NULL, NULL, NULL, '{"name": "国瓷材料", "code": "300285.SZ", "industry": "semiconductor", "seg": "material", "listed": true, "cap": 458.6, "pe": 71.5, "spark": [], "tech": [], "funding": []}'::jsonb),
('晶瑞电材', '300655.SZ', 'semiconductor', 'material', true, '已上市', 117.5, NULL, NULL, NULL, '{"name": "晶瑞电材", "code": "300655.SZ", "industry": "semiconductor", "seg": "material", "listed": true, "cap": 117.5, "pe": 91.3, "spark": [], "tech": [], "funding": []}'::jsonb),
('风华高科', '000636.SZ', 'semiconductor', 'material', true, '已上市', 467.7, NULL, NULL, NULL, '{"name": "风华高科", "code": "000636.SZ", "industry": "semiconductor", "seg": "material", "listed": true, "cap": 467.7, "pe": 115.0, "spark": [], "tech": [], "funding": []}'::jsonb),
('三环集团', '300408.SZ', 'semiconductor', 'material', true, '已上市', 1940.4, NULL, NULL, NULL, '{"name": "三环集团", "code": "300408.SZ", "industry": "semiconductor", "seg": "material", "listed": true, "cap": 1940.4, "pe": 58.6, "spark": [], "tech": [], "funding": []}'::jsonb),
('达利凯普', '301566.SZ', 'semiconductor', 'material', true, '已上市', 83.4, NULL, NULL, NULL, '{"name": "达利凯普", "code": "301566.SZ", "industry": "semiconductor", "seg": "material", "listed": true, "cap": 83.4, "pe": 44.1, "spark": [], "tech": [], "funding": []}'::jsonb),
('鸿远电子', '603267.SH', 'semiconductor', 'material', true, '已上市', 93.8, NULL, NULL, NULL, '{"name": "鸿远电子", "code": "603267.SH", "industry": "semiconductor", "seg": "material", "listed": true, "cap": 93.8, "pe": 32.9, "spark": [], "tech": [], "funding": []}'::jsonb),
('劲拓股份', '300400.SZ', 'semiconductor', 'equipment', true, '已上市', 68.9, NULL, NULL, NULL, '{"name": "劲拓股份", "code": "300400.SZ", "industry": "semiconductor", "seg": "equipment", "listed": true, "cap": 68.9, "pe": 78.2, "spark": [], "tech": [], "funding": []}'::jsonb),
('大族数控', '301200.SZ', 'semiconductor', 'equipment', true, '已上市', 878.9, NULL, NULL, NULL, '{"name": "大族数控", "code": "301200.SZ", "industry": "semiconductor", "seg": "equipment", "listed": true, "cap": 878.9, "pe": 46.8, "spark": [], "tech": [], "funding": []}'::jsonb),
('建滔集团', '0148.HK', 'semiconductor', 'pcb', true, '已上市', NULL, NULL, NULL, NULL, '{"name": "建滔集团", "code": "0148.HK", "industry": "semiconductor", "seg": "pcb", "listed": true, "cap": null, "pe": 12.1, "spark": [], "tech": [], "funding": []}'::jsonb),
('鼎泰高科', '301377.SZ', 'semiconductor', 'pcb', true, '已上市', 1144.2, NULL, NULL, NULL, '{"name": "鼎泰高科", "code": "301377.SZ", "industry": "semiconductor", "seg": "pcb", "listed": true, "cap": 1144.2, "pe": 120.1, "spark": [], "tech": [], "funding": []}'::jsonb),
('世运电路', '603920.SH', 'semiconductor', 'pcb', true, '已上市', 297.6, NULL, NULL, NULL, '{"name": "世运电路", "code": "603920.SH", "industry": "semiconductor", "seg": "pcb", "listed": true, "cap": 297.6, "pe": 77.5, "spark": [], "tech": [], "funding": []}'::jsonb),
('山子高科', '000981.SZ', 'semiconductor', 'osat', true, '已上市', 243.9, NULL, NULL, NULL, '{"name": "山子高科", "code": "000981.SZ", "industry": "semiconductor", "seg": "osat", "listed": true, "cap": 243.9, "pe": 29.0, "spark": [], "tech": [], "funding": []}'::jsonb),
('希捷', 'STX.US', 'semiconductor', 'terminal', true, '已上市', NULL, NULL, NULL, NULL, '{"name": "希捷", "code": "STX.US", "industry": "semiconductor", "seg": "terminal", "listed": true, "cap": null, "pe": 62.7, "spark": [], "tech": [], "funding": []}'::jsonb),
('美图公司', '1357.HK', 'ai', 'ai-app', true, '已上市', NULL, NULL, NULL, NULL, '{"name": "美图公司", "code": "1357.HK", "industry": "ai", "seg": "ai-app", "listed": true, "cap": null, "pe": 26.8, "spark": [], "tech": [], "funding": []}'::jsonb),
('福昕软件', '688095.SH', 'ai', 'ai-app', true, '已上市', 49.1, NULL, NULL, NULL, '{"name": "福昕软件", "code": "688095.SH", "industry": "ai", "seg": "ai-app", "listed": true, "cap": 49.1, "pe": 100.0, "spark": [], "tech": [], "funding": []}'::jsonb),
('Salesforce', 'CRM.US', 'ai', 'ai-app', true, '已上市', NULL, NULL, NULL, NULL, '{"name": "Salesforce", "code": "CRM.US", "industry": "ai", "seg": "ai-app", "listed": true, "cap": null, "pe": 28.4, "spark": [], "tech": [], "funding": []}'::jsonb),
('微软', 'MSFT.US', 'ai', 'ai-app', true, '已上市', NULL, NULL, NULL, NULL, '{"name": "微软", "code": "MSFT.US", "industry": "ai", "seg": "ai-app", "listed": true, "cap": null, "pe": 32.0, "spark": [], "tech": [], "funding": []}'::jsonb),
('ServiceNow', 'NOW.US', 'ai', 'ai-app', true, '已上市', NULL, NULL, NULL, NULL, '{"name": "ServiceNow", "code": "NOW.US", "industry": "ai", "seg": "ai-app", "listed": true, "cap": null, "pe": 87.9, "spark": [], "tech": [], "funding": []}'::jsonb),
('Palantir', 'PLTR.US', 'ai', 'ai-app', true, '已上市', NULL, NULL, NULL, NULL, '{"name": "Palantir", "code": "PLTR.US", "industry": "ai", "seg": "ai-app", "listed": true, "cap": null, "pe": 208.8, "spark": [], "tech": [], "funding": []}'::jsonb),
('Meta', 'META.US', 'ai', 'llm', true, '已上市', NULL, NULL, NULL, NULL, '{"name": "Meta", "code": "META.US", "industry": "ai", "seg": "llm", "listed": true, "cap": null, "pe": 26.4, "spark": [], "tech": [], "funding": []}'::jsonb),
('Adobe', 'ADBE.US', 'ai', 'ai-content', true, '已上市', NULL, NULL, NULL, NULL, '{"name": "Adobe", "code": "ADBE.US", "industry": "ai", "seg": "ai-content", "listed": true, "cap": null, "pe": 14.4, "spark": [], "tech": [], "funding": []}'::jsonb),
('UiPath', 'PATH.US', 'ai', 'ai-agent', true, '已上市', NULL, NULL, NULL, NULL, '{"name": "UiPath", "code": "PATH.US", "industry": "ai", "seg": "ai-agent", "listed": true, "cap": null, "pe": 22.1, "spark": [], "tech": [], "funding": []}'::jsonb),
('美的集团', '000333.SZ', 'robotics', 'industrial', true, '已上市', 6455.1, NULL, NULL, NULL, '{"name": "美的集团", "code": "000333.SZ", "industry": "robotics", "seg": "industrial", "listed": true, "cap": 6455.1, "pe": 14.6, "spark": [], "tech": [], "funding": []}'::jsonb),
('科沃斯', '603486.SH', 'robotics', 'industrial', true, '已上市', 263.9, NULL, NULL, NULL, '{"name": "科沃斯", "code": "603486.SH", "industry": "robotics", "seg": "industrial", "listed": true, "cap": 263.9, "pe": 13.0, "spark": [], "tech": [], "funding": []}'::jsonb),
('巨轮智能', '002031.SZ', 'robotics', 'reducer', true, '已上市', 106.2, NULL, NULL, NULL, '{"name": "巨轮智能", "code": "002031.SZ", "industry": "robotics", "seg": "reducer", "listed": true, "cap": 106.2, "pe": null, "spark": [], "tech": [], "funding": []}'::jsonb),
('兆威机电', '003021.SZ', 'robotics', 'reducer', true, '已上市', 163.7, NULL, NULL, NULL, '{"name": "兆威机电", "code": "003021.SZ", "industry": "robotics", "seg": "reducer", "listed": true, "cap": 163.7, "pe": 75.9, "spark": [], "tech": [], "funding": []}'::jsonb),
('昊志机电', '300503.SZ', 'robotics', 'reducer', true, '已上市', 158.6, NULL, NULL, NULL, '{"name": "昊志机电", "code": "300503.SZ", "industry": "robotics", "seg": "reducer", "listed": true, "cap": 158.6, "pe": 55.0, "spark": [], "tech": [], "funding": []}'::jsonb),
('国茂股份', '688558.SH', 'robotics', 'reducer', true, '已上市', 36.3, NULL, NULL, NULL, '{"name": "国茂股份", "code": "688558.SH", "industry": "robotics", "seg": "reducer", "listed": true, "cap": 36.3, "pe": 21.5, "spark": [], "tech": [], "funding": []}'::jsonb),
('三花智控', '002050.SZ', 'robotics', 'servo', true, '已上市', 1322.2, NULL, NULL, NULL, '{"name": "三花智控", "code": "002050.SZ", "industry": "robotics", "seg": "servo", "listed": true, "cap": 1322.2, "pe": 33.1, "spark": [], "tech": [], "funding": []}'::jsonb),
('拓普集团', '601689.SH', 'robotics', 'servo', true, '已上市', 691.7, NULL, NULL, NULL, '{"name": "拓普集团", "code": "601689.SH", "industry": "robotics", "seg": "servo", "listed": true, "cap": 691.7, "pe": 27.6, "spark": [], "tech": [], "funding": []}'::jsonb),
('川仪股份', '300897.SZ', 'robotics', 'servo', true, '已上市', 29.9, NULL, NULL, NULL, '{"name": "川仪股份", "code": "300897.SZ", "industry": "robotics", "seg": "servo", "listed": true, "cap": 29.9, "pe": 711.9, "spark": [], "tech": [], "funding": []}'::jsonb),
('歌尔股份', '002241.SZ', 'robotics', 'sensor', true, '已上市', 709.1, NULL, NULL, NULL, '{"name": "歌尔股份", "code": "002241.SZ", "industry": "robotics", "seg": "sensor", "listed": true, "cap": 709.1, "pe": 17.8, "spark": [], "tech": [], "funding": []}'::jsonb),
('睿创微纳', '688002.SH', 'robotics', 'sensor', true, '已上市', 767.1, NULL, NULL, NULL, '{"name": "睿创微纳", "code": "688002.SH", "industry": "robotics", "seg": "sensor", "listed": true, "cap": 767.1, "pe": 37.7, "spark": [], "tech": [], "funding": []}'::jsonb),
('宁波华翔', '002048.SZ', 'robotics', 'integrator', true, '已上市', 133.8, NULL, NULL, NULL, '{"name": "宁波华翔", "code": "002048.SZ", "industry": "robotics", "seg": "integrator", "listed": true, "cap": 133.8, "pe": 8.8, "spark": [], "tech": [], "funding": []}'::jsonb),
('怡合达', '301029.SZ', 'robotics', 'integrator', true, '已上市', 148.5, NULL, NULL, NULL, '{"name": "怡合达", "code": "301029.SZ", "industry": "robotics", "seg": "integrator", "listed": true, "cap": 148.5, "pe": 27.1, "spark": [], "tech": [], "funding": []}'::jsonb)
on conflict (name) do update set
  code = excluded.code, industry = excluded.industry, seg = excluded.seg,
  listed = excluded.listed, round = excluded.round, cap = excluded.cap,
  data = excluded.data, updated_at = now();

-- ---------- 2. 修正：同名已在池中，但状态/代码与事实不符 ----------
-- 智谱、MiniMax：池内为未上市记录（code='—'），2026 年已登陆港股
update research_companies
   set code = '02513.HK', listed = true, round = '已上市', updated_at = now()
 where name = '智谱';
update research_companies
   set code = '0100.HK',  listed = true, round = '已上市', updated_at = now()
 where name = 'MiniMax';
-- 芯碁微装：池内代码 688730.SH 有误，正确为 688630.SH（科创板）
update research_companies
   set code = '688630.SH', updated_at = now()
 where name = '芯碁微装' and code = '688730.SH';

-- ---------- 3. 校验：同步后研究池应覆盖全部行情股 ----------
-- select count(*) from watchlist w
--   left join research_companies c on split_part(w.stock_code,'.',1) = split_part(c.code,'.',1)
--  where c.name is null;
