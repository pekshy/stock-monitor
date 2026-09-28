-- ============================================================
-- 玻璃基板：京东方入库补丁（2026-09-28）
-- 依据：京东方投资者关系活动记录（巨潮 2026-09-11 / 09-21）：
--   板级玻璃基封装载板试验线 2026H1 全自动化通线（设计产能 1000 片/月），
--   TGV 全流程工艺拉通，9-2-9（20 层）样品送样并通过信赖性测试，
--   部分客户进入技术测试；2026-05 与康宁签署合作备忘录。
-- 用法：Supabase Dashboard → SQL Editor 执行（幂等，可重复跑）
-- ============================================================

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values
('京东方', '000725.SZ', 'semiconductor', 'material', true, '已上市', 2138.16, NULL, NULL, NULL, '{"name": "京东方", "code": "000725.SZ", "industry": "semiconductor", "seg": "material", "listed": true, "desc": "显示龙头跨界玻璃基封装载板：板级试验线 2026H1 全自动化通线（设计产能 1000 片/月），TGV 开孔—深孔填铜—布线全流程拉通，20 层大尺寸样品已送样，目标产品为 AI 算力芯片用 Glass Core Substrate。", "cap": 2138.16, "pe": 27.34, "gross": null, "latestTech": "玻璃基载板试验线通线并进入客户技术测试，尚未量产营收；与康宁签署合作备忘录", "tech": [{"date": "2026-09", "kind": "产品动态", "title": "玻璃基载板试验线通线，部分客户通过概念认证进入技术测试"}, {"date": "2026-05", "kind": "合作", "title": "与康宁签署玻璃载板、可折叠玻璃合作备忘录"}, {"date": "2025-12", "kind": "产品动态", "title": "完成 9-2-9（20 层）大尺寸玻璃基载板样品开发与送样，通过 TCB 1000 cycles 等信赖性测试"}], "funding": []}'::jsonb)
on conflict (name) do update set
  code = excluded.code, industry = excluded.industry, seg = excluded.seg,
  listed = excluded.listed, round = excluded.round, cap = excluded.cap,
  valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
  data = excluded.data, updated_at = now();
