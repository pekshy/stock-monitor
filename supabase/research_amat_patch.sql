-- 应用材料（Applied Materials，AMAT.US）纳入研究池 · 2026-10-13
-- 依据：公司 FY2026 Q3 财报（截至 2026-07-26）+ 公开行情，幂等 upsert
--
-- 数据口径：
--   cap / spark 末位 = 约 498 美元 × 7.94 亿股 ≈ 3,957 亿美元（2026-10-12 收盘）
--   rev = TTM 营收 308.4 亿美元；gross = 50.31%（FY26Q3 毛利率）
--   pe = 43.4（TTM）；rd 留空（公司不单独披露研发费用口径，与 A 股企业不可比）
--   金额单位为亿美元，与本库 A 股条目的人民币亿元口径不同，靠 market=US 区分

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('应用材料', 'AMAT.US', 'semiconductor', 'equipment', true, null, 40238, null, 308.4, null, '{"name":"应用材料","code":"AMAT.US","industry":"semiconductor","seg":"equipment","listed":true,"market":"US","desc":"全球最大的半导体晶圆制造设备（WFE）厂商，产品线几乎覆盖 WFE 生态每个环节，在薄膜沉积领域份额第一；同时是 CMP 与离子注入的核心供应商，并延伸至量检测与先进封装。客户涵盖台积电、三星、英特尔等全球头部晶圆厂。FY2026 Q3（截至 2026-07-26）营收 91.15 亿美元（+24.83%）、净利 25.38 亿美元（+42.66%）、毛利率 50.31%；FY2026 Q4 指引营收 102.5 亿美元（+51% y/y），管理层年内三度上调 2026 年设备行业增速预期，先进封装目标增速上修至 70%+。","cap":40238,"pe":43.4,"rev":308.4,"revGrowth":7.8,"gross":50.3,"rd":null,"spark":[18545,29040,32451,40238],"latestTech":"2026 年设备行业增速预期年内三度上调；先进封装目标增速由 50%+ 上修至 70%+；管理层称 AI 相关先进逻辑 / DRAM-HBM / 先进封装约占 2026–2027 年 WFE 增长的 80%","tech":[],"funding":[],"executives":[{"name":"Gary E. Dickerson","title":"总裁、首席执行官","role":"management","bio":"2013 年 9 月起任公司总裁兼 CEO，此前曾任公司首席运营官与硅系统事业部负责人。任内在沉积、刻蚀、CMP 等主线业务之外推动公司向先进封装、工艺诊断与控制等新增长极扩张。"}]}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();
