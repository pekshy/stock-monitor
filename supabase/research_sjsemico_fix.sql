-- 盛合晶微修正：Pre-IPO -> 科创板上市（688820.SH，2026-04-21）
-- 发行后总股本 18.6277 亿股 × 121.07 元（2026-09-28 收盘）≈ 2255 亿元；2025 营收 65.21 亿、归母净利 9.23 亿、毛利率 30.97%
insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data)
values ('盛合晶微', '688820.SH', 'semiconductor', 'osat', true, null, 2255.2, null, 65.21, null,
 '{"name":"盛合晶微","code":"688820.SH","industry":"semiconductor","seg":"osat","listed":true,"desc":"全球领先晶圆级先进封测企业，大陆唯一 2.5D 硅基封装大规模量产，2025 年营收 65.2 亿元居全球 OSAT 前十，2026 年 4 月科创板上市。","cap":2255.2,"pe":212,"rev":65.21,"gross":30.97,"execChanges":[],"latestTech":"江阴多层细线宽集成封测一期（98 亿）与临港东盛合芯 3DIC 一期（100 亿）相继开工","tech":[{"date":"2026-04","kind":"资本动态","title":"科创板上市（688820），发行价 19.68 元募资 50.28 亿元，首日市值 1428 亿元"},{"date":"最新","kind":"产品动态","title":"2.5D 桥接封装产能扩建"}],"funding":[{"date":"2025-12","round":"Pre-IPO（D 轮）","amount":"7 亿美元","inv":"新芯基金 / 上海国际集团等"},{"date":"2026-04","round":"IPO","amount":"募资 50.28 亿元","inv":"科创板发行（19.68 元/股）"}]}'::jsonb)
on conflict (name) do update set code = excluded.code, industry = excluded.industry,
  seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
  valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
  data = excluded.data, updated_at = now();
