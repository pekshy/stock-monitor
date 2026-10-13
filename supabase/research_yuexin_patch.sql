-- 粤芯半导体（301660.SZ）上市升级 · 2026-10-13 深交所创业板挂牌
-- 依据：上市首日行情（发行价 12.01 元）+ 招股书 / 上市保荐书披露，幂等 upsert
--
-- 数据口径说明：
--   rev=25.8 为 2025 年全年营收（17.8 是 2026H1 数据，此前误作 rev 展示）
--   gross 留空 —— 公司处于亏损扩产期，综合毛利率尚未达到有意义披露口径
--   rd=16.3 = 2025 年研发费用 4.22 亿 / 营收 25.82 亿
--   cap / spark 末位 = 2026-10-13 盘中市值（约 42 元 × 总股本 41.2 亿股）

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('粤芯半导体', '301660.SZ', 'semiconductor', 'fab', true, null, 1730.4, null, 25.8, null, '{"name":"粤芯半导体","code":"301660.SZ","industry":"semiconductor","seg":"fab","listed":true,"desc":"广东省自主培育的首家进入量产的 12 英寸晶圆制造企业（“广州第一芯”），专注模拟芯片特色工艺代工；截至 2026 年 4 月末为中国大陆唯一具备 12 英寸硅光晶圆大规模量产能力的企业。2026-10-13 登陆创业板，发行价 12.01 元/股，初始发行 5.13 亿股，募资约 61.57 亿元。","execChanges":[],"latestTech":"12 英寸硅光晶圆大规模量产（大陆唯一），硅光平台累计投片超 7000 片，覆盖 400G/800G/1.6T 光模块","tech":[],"funding":[],"cap":1730.4,"rev":25.8,"revGrowth":53.6,"pe":"亏损","gross":null,"rd":16.3,"spark":[340.4,453.7,520.6,1730.4]}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();
