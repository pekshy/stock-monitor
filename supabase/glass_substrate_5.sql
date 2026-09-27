-- 玻璃基板（TGV）5 家企业入库 · 生成 2026-09-27
-- Supabase Dashboard → SQL Editor 执行（幂等，可重复跑）

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values
('沃格光电', '603773.SH', 'semiconductor', 'material', true, '已上市', 219.5, NULL, NULL, NULL, '{"name": "沃格光电", "code": "603773.SH", "industry": "semiconductor", "seg": "material", "listed": true, "desc": "TGV 玻璃基板全制程龙头：玻璃薄化—激光通孔—电镀填铜—RDL 布线全打通。", "cap": 219.5, "pe": -96.4, "gross": null, "latestTech": "通格微一期 10 万㎡ 产线小批量供货，良率 90%+", "tech": [{"date": "2026-06", "title": "武汉通格微一期产能释放，进入规模化批量供货"}, {"date": "2026-05", "title": "1.6T 光模块玻璃基载板小批量供货中际旭创"}], "funding": []}'::jsonb),
('蓝思科技', '300433.SZ', 'semiconductor', 'material', true, '已上市', 1735.1, NULL, NULL, NULL, '{"name": "蓝思科技", "code": "300433.SZ", "industry": "semiconductor", "seg": "material", "listed": true, "desc": "消费电子玻璃精加工龙头跨界 TGV，与英特尔联合研发玻璃基板。", "cap": 1735.1, "pe": 50.3, "gross": null, "latestTech": "3 万㎡ TGV 专用厂房年底投用，规划月产 3000 片中试线", "tech": [{"date": "2026-07", "title": "与英特尔签署 TGV 联合研发合作备忘录"}], "funding": []}'::jsonb),
('凯盛科技', '600552.SH', 'semiconductor', 'material', true, '已上市', 171.9, NULL, NULL, NULL, '{"name": "凯盛科技", "code": "600552.SH", "industry": "semiconductor", "seg": "material", "listed": true, "desc": "中建材系玻璃新材料平台，UTG 全链条国产化，切入 TGV 封装玻璃。", "cap": 171.9, "pe": 122.5, "gross": null, "latestTech": "蚌埠 1.5 亿元 TGV 先进封装玻璃中试线在建", "tech": [{"date": "2026-07", "title": "高硼硅低介电玻璃配方突破，玻璃基板小批量送样"}], "funding": []}'::jsonb),
('莱宝高科', '002106.SZ', 'semiconductor', 'material', true, '已上市', 88.3, NULL, NULL, NULL, '{"name": "莱宝高科", "code": "002106.SZ", "industry": "semiconductor", "seg": "material", "listed": true, "desc": "依托 TFT-LCD 面板产线改造切入玻璃基面板级封装载板。", "cap": 88.3, "pe": 55.7, "gross": null, "latestTech": "玻璃基载板送样验证中，暂无量产订单", "tech": [], "funding": []}'::jsonb),
('五方光电', '002962.SZ', 'semiconductor', 'material', true, '已上市', 39.1, NULL, NULL, NULL, '{"name": "五方光电", "code": "002962.SZ", "industry": "semiconductor", "seg": "material", "listed": true, "desc": "TGV 玻璃通孔载板小批量量产，用于 1.6T/3.2T 高速光器件封装。", "cap": 39.1, "pe": 160.9, "gross": null, "latestTech": "荆州 8 英寸 TGV 产线 2026 下半年全面投产", "tech": [{"date": "2026-07", "title": "TGV 载板小批量供货中际旭创、新易盛"}], "funding": []}'::jsonb)
on conflict (name) do update set
  code = excluded.code, industry = excluded.industry, seg = excluded.seg,
  listed = excluded.listed, round = excluded.round, cap = excluded.cap,
  valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
  data = excluded.data;
