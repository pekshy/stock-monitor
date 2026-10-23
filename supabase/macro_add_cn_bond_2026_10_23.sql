-- 宏观指标：新增中债国债收益率（2Y/5Y/10Y/30Y + 10Y-2Y 期限利差）
-- 生成日期：2026-10-23
-- 数据源：东方财富「中美国债收益率」（原始数据来自中国债券信息网）
-- 抓取脚本：scripts/macro-sync/fetch_cn_bond.py
-- 前端分类：src/hooks/useEtfData.ts 的 cn_bond_yield；展示：MarketIndicators.tsx
--
-- 字段映射（已与数据页逐日核对，2026-10-23 数值）：
--   EMM00588704 -> cn_bond_2y        1.2452
--   EMM00166462 -> cn_bond_5y        1.3532
--   EMM00166466 -> cn_bond_10y       1.6400
--   EMM00166469 -> cn_bond_30y       2.0675
--   EMM01276014 -> cn_term_spread_10y2y  0.3948
--
-- 已回补近 3 年（2023-10-23 ~ 2026-10-23，3740 条），下列语句可重放（按 indicator_id + date 去重）。

INSERT INTO china_indicators (indicator_id, date, value)
SELECT v.indicator_id, v.date, v.value
FROM (VALUES
  ('cn_bond_2y',           DATE '2026-10-23', 1.2452),
  ('cn_bond_5y',           DATE '2026-10-23', 1.3532),
  ('cn_bond_10y',          DATE '2026-10-23', 1.6400),
  ('cn_bond_30y',          DATE '2026-10-23', 2.0675),
  ('cn_term_spread_10y2y', DATE '2026-10-23', 0.3948)
) AS v(indicator_id, date, value)
WHERE NOT EXISTS (
  SELECT 1 FROM china_indicators c
  WHERE c.indicator_id = v.indicator_id AND c.date = v.date
);

-- 校验
-- SELECT indicator_id, date, value FROM china_indicators
-- WHERE indicator_id LIKE 'cn_bond%' OR indicator_id = 'cn_term_spread_10y2y'
-- ORDER BY indicator_id, date DESC LIMIT 10;
