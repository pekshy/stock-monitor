-- ============================================================
-- 研究池新增：新芯航途（XHEART）· 端侧物理 AI 算力芯片
-- 依据 2026-10-16/17 公开报道：完成战略轮融资，长鑫科技、雷诺集团（首次）、
-- 奇瑞汽车（追加）参投，历史累计融资约 50 亿元
-- 归类：semiconductor / design（与地平线、黑芝麻智能、爱芯元智同环节）
-- 幂等：按 name 覆盖，可重复执行
-- ============================================================

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values
  ('新芯航途', '—', 'semiconductor', 'design', false, '战略轮',
   null, null, null, '2026-10', '{"cap": null, "seg": "design", "code": "—", "desc": "端侧物理 AI 算力芯片，车规 SoC X7 面向 L2++ 城区智驾与 L3/L4。第一大股东为苏州好望角新芯（Momenta 创始人曹旭东间接持股）。", "name": "新芯航途", "tech": [{"date": "2026-03", "desc": "专用 NPU + 软硬件协同架构，针对端到端大模型算法优化；公司未官方披露算力，业内有 200+ TOPS 说法", "kind": "产品发布", "title": "X7 车规 SoC 发布"}, {"date": "2026-10", "desc": "Momenta 提供全栈算法，X7 提供车规 SoC，QNX 提供 SDP 8.0 安全操作系统", "kind": "生态合作", "title": "与 Momenta、QNX 共建全球安全标准自动驾驶平台"}], "round": "战略轮", "spark": [], "listed": false, "funding": [{"inv": "长鑫科技、雷诺集团（首次投资）、奇瑞汽车（追加）", "date": "2026-10", "round": "战略轮", "amount": "未披露（历史累计融资约 50 亿元）"}], "industry": "semiconductor", "valuation": null, "latestTech": "X7 首搭上汽大众 ID.ERA 9X，后续进入上汽 MG/荣威、通用凯迪拉克、奇瑞部分车型", "execChanges": [], "lastFunding": "2026-10", "latestFunding": "2026 年 10 月战略轮：长鑫科技、雷诺集团、奇瑞汽车参投，历史累计融资约 50 亿元", "investorsStructured": [{"date": "2026-10", "kind": "cvc", "name": "长鑫科技", "note": "国产 DRAM 龙头入股算力芯片，指向端侧「算力+存力」协同", "role": "strategic", "round": "战略轮"}, {"date": "2026-10", "kind": "cvc", "name": "雷诺集团", "note": "首次投资，绑定出海", "role": "strategic", "round": "战略轮"}, {"date": "2026-10", "kind": "cvc", "name": "奇瑞汽车", "note": "老股东追加", "role": "strategic", "round": "战略轮"}]}'::jsonb)
on conflict (name) do update set
  code = excluded.code, industry = excluded.industry, seg = excluded.seg,
  listed = excluded.listed, round = excluded.round,
  last_funding = excluded.last_funding, data = excluded.data, updated_at = now();
