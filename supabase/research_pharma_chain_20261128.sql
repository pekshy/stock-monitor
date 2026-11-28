-- 创新药产业链入库（2026-11-28）
-- 新增 pharma 行业 9 个环节、50 个细分；1245 家公司中的 124 家为本次新增
-- 合并语义：INSERT ... ON CONFLICT (name) DO UPDATE 只覆盖本次字段，不删除已有 data 键

-- 行业层：研究池 industry = 'pharma'，seg 对应 TREE 的 9 个环节

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('东诚药业', '002675.SZ', 'pharma', 'pharma-api', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-api", "code": "002675.SZ", "desc": "核药与肝素双主业，核药房网络是核素药物的配送基础设施。", "name": "东诚药业", "tech": [{"date": "2026-06", "title": "核药房网络扩张"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "核药房覆盖扩张，受益于核药放量与短半衰期配送壁垒"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('中国同辐', '01763.HK', 'pharma', 'pharma-api', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-api", "code": "01763.HK", "desc": "医用同位素与核药龙头，I-131、Lu-177、F-18 供应是核药产业链源头。", "name": "中国同辐", "tech": [{"date": "2026-05", "title": "多个 Lu-177 核药进入 III 期"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "Lu-177 标记的放射性配体疗法（RLT）是全球核药最热方向，同位素供应是硬卡点"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('华海药业', '600521.SH', 'pharma', 'pharma-api', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-api", "code": "600521.SH", "desc": "特色原料药与制剂一体化代表，缬沙坦是标志性产品，也是 2018 年 NDMA 杂质事件当事方。", "name": "华海药业", "tech": [{"date": "2026-02", "title": "沙坦类原料药价格触底回升"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "沙坦类原料药价格触底回升，制剂集采份额稳定"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('司太立', '603520.SH', 'pharma', 'pharma-api', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-api", "code": "603520.SH", "desc": "碘造影剂原料龙头，国内 CT 检查量增长直接拉动需求，同时向制剂延伸。", "name": "司太立", "tech": [{"date": "2026-08", "title": "造影剂原料满产"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "造影剂原料满产，碘海醇与碘克沙醇价格企稳"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('天宇股份', '300702.SZ', 'pharma', 'pharma-api', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-api", "code": "300702.SZ", "desc": "沙坦类原料药主要供应商，深度绑定下游制剂厂。", "name": "天宇股份", "tech": [{"date": "2026-03", "title": "开工率修复"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "沙坦价格周期触底，开工率与毛利率同步修复"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('奥锐特', '605116.SH', 'pharma', 'pharma-api', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-api", "code": "605116.SH", "desc": "激素类与呼吸类特色原料药，向制剂一体化延伸。", "name": "奥锐特", "tech": [{"date": "2026-06", "title": "制剂端收入占比提升"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "激素类原料药出口稳定，制剂端贡献增量"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('普洛药业', '000739.SZ', 'pharma', 'pharma-api', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-api", "code": "000739.SZ", "desc": "原料药+CDMO+制剂三线布局，兽药与抗生素中间体规模领先。", "name": "普洛药业", "tech": [{"date": "2026-05", "title": "CDMO 业务占比提升"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "CDMO 业务占比提升，API 端受益于产能出清"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('翰宇药业', '300199.SZ', 'pharma', 'pharma-api', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-api", "code": "300199.SZ", "desc": "多肽制剂与原料一体化，GLP-1 减重多肽是主要看点。", "name": "翰宇药业", "tech": [{"date": "2026-05", "title": "GLP-1 多肽制剂推进"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "多肽原料自供比例提升，制剂端受益减重需求"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('联化科技', '002250.SZ', 'pharma', 'pharma-api', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-api", "code": "002250.SZ", "desc": "医药与农药中间体定制合成，危险工艺（硝化、氟化）产能是稀缺资产。", "name": "联化科技", "tech": [{"date": "2026-05", "title": "连续流硝化装置投产"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('诺泰生物', '688076.SH', 'pharma', 'pharma-api', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-api", "code": "688076.SH", "desc": "多肽原料与 CDMO，长链脂肪酸侧链与规模化固相合成产能是核心资产，2026 年订单饱满。", "name": "诺泰生物", "tech": [{"date": "2026-09", "title": "多肽产能扩至吨级"}, {"date": "2026-04", "title": "侧链订单排至次年"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "GLP-1 需求持续超预期，多肽产能扩至吨级；壁垒在收率与溶剂回收而非分子"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('雅本化学', '300261.SZ', 'pharma', 'pharma-api', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-api", "code": "300261.SZ", "desc": "手性中间体与精细化工，为跨国药企做定制合成。", "name": "雅本化学", "tech": [{"date": "2026-02", "title": "手性中间体订单增长"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('三生制药', '01530.HK', 'pharma', 'pharma-biologic', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-biologic", "code": "01530.HK", "desc": "SSGJ-707（PD-1/VEGF 双抗）授权辉瑞，首付 12.5 亿美元、总额 60.5 亿美元，是双抗 BD 首付款最高的一笔。", "name": "三生制药", "tech": [{"date": "2026-01", "title": "SSGJ-707 授权辉瑞（首付 12.5 亿美元）"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "双抗授权带来的现金流支撑自免与肾科管线；2026 年全球双抗 BD 首付款 TOP5 全为中国资产"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('信达生物', '01801.HK', 'pharma', 'pharma-biologic', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-biologic", "code": "01801.HK", "desc": "PD-1 起家，2026 年 BD 体量最大的一家：5 月与辉瑞 105 亿美元、2 月与礼来 3.5 亿首付+85 亿里程碑。", "name": "信达生物", "tech": [{"date": "2026-05", "title": "与辉瑞 105 亿美元管线打包授权"}, {"date": "2026-02", "title": "与礼来达成 3.5 亿首付合作"}, {"date": "2025-06", "title": "玛仕度肽获批准减重"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "从卖分子转向卖管线：12 款早期肿瘤管线打包授权辉瑞，首付 6.5 亿美元"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('健康元', '600380.SH', 'pharma', 'pharma-biologic', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-biologic", "code": "600380.SH", "desc": "呼吸吸入制剂与生物药，丽珠集团为控股子公司。", "name": "健康元", "tech": [{"date": "2026-05", "title": "吸入制剂新品获批"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('兴齐眼药', '300573.SZ', 'pharma', 'pharma-biologic', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-biologic", "code": "300573.SZ", "desc": "低浓度阿托品滴眼液切入近视防控，是眼科赛道少见的放量品种。", "name": "兴齐眼药", "tech": [{"date": "2026-07", "title": "低浓度阿托品放量"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('君实生物', '688180.SH', 'pharma', 'pharma-biologic', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-biologic", "code": "688180.SH", "desc": "特瑞普利单抗是首个国产 PD-1，也是首个获 FDA 批准的国产 PD-1（鼻咽癌）。", "name": "君实生物", "tech": [{"date": "2025-11", "title": "特瑞普利单抗在美商业化推进"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "PD-1 海外商业化推进，后续管线以双抗与 ADC 为主"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('康弘药业', '002773.SZ', 'pharma', 'pharma-biologic', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-biologic", "code": "002773.SZ", "desc": "康柏西普是国产原创抗 VEGF 眼科药，是少数在国内市场打败进口竞品的生物药。", "name": "康弘药业", "tech": [{"date": "2026-06", "title": "眼科双抗进入 III 期"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "眼科双靶点与长效制剂推进，眼底病专科渠道是壁垒"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('康方生物', '09926.HK', 'pharma', 'pharma-biologic', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-biologic", "code": "09926.HK", "desc": "依沃西单抗（AK112）在非小细胞肺癌 III 期头对头击败 Keytruda，是国产药首次战胜全球药王。", "name": "康方生物", "tech": [{"date": "2026-04", "title": "依沃西头对头 III 期 PFS 优于 K 药"}, {"date": "2025-11", "title": "海外权益授权 Summit"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "PD-1/VEGF 双抗是 IO 2.0 基石，2026 年市值破千亿港元"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('康诺亚', '02162.HK', 'pharma', 'pharma-biologic', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-biologic", "code": "02162.HK", "desc": "司普奇拜单抗是首个国产 IL-4Rα 单抗，对标 Dupixent（2025 全球销售 177.7 亿美元）。", "name": "康诺亚", "tech": [{"date": "2026-07", "title": "司普奇拜单抗新适应症获批"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "特应性皮炎、鼻息肉、慢阻肺适应症逐个拓展，进医保是放量关键"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('恒瑞医药', '600276.SH', 'pharma', 'pharma-biologic', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-biologic", "code": "600276.SH", "desc": "国内创新药龙头，2026 年 BD 最活跃：5 月与 BMS 达成 152 亿美元双向授权、与默沙东 TROP2 ADC 56 亿美元。", "name": "恒瑞医药", "tech": [{"date": "2026-05", "title": "与 BMS 达成 152 亿美元双向授权"}, {"date": "2026-05", "title": "TROP2 ADC 授权默沙东（首付 8.5 亿美元）"}, {"date": "2026-03", "title": "口服 GLP-1 推进 III 期"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "从卖单一分子转向平台与管线打包授权，13 款管线与 BMS 联合开发"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('映恩生物', '09606.HK', 'pharma', 'pharma-biologic', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-biologic", "code": "09606.HK", "desc": "DITAC/DUPAC 平台型 ADC 公司，与 BioNTech、基因泰克、百济神州多笔授权，累计超 40 亿美元。", "name": "映恩生物", "tech": [{"date": "2026-08", "title": "与基因泰克达成平台级授权"}, {"date": "2026-06", "title": "科创板 IPO 受理、拟募 41 亿元"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "与基因泰克达成 DUPAC 新载荷平台合作（首付 4500 万美元、超 10 亿美元），是平台级授权样本"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('智翔金泰', '688443.SH', 'pharma', 'pharma-biologic', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-biologic", "code": "688443.SH", "desc": "IL-17A 单抗对标司库奇尤单抗，是国产自免抗体第二梯队代表。", "name": "智翔金泰", "tech": [{"date": "2026-05", "title": "IL-17A 单抗放量"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "银屑病适应症放量，2026 年推进商业化队伍扩张"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('百利天恒', '688506.SH', 'pharma', 'pharma-biologic', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-biologic", "code": "688506.SH", "desc": "BL-B01D1（伦康依隆妥单抗）是全球首个获批的双抗 ADC，与 BMS 授权总额 84 亿美元、首付 8 亿美元。", "name": "百利天恒", "tech": [{"date": "2026-06", "title": "BL-B01D1 获批鼻咽癌（全球首个双抗 ADC）"}, {"date": "2025-09", "title": "三阴乳腺癌一线纳入突破性治疗"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "2026 年 6 月在华获批鼻咽癌，三阴性乳腺癌一线纳入突破性治疗"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('百济神州', '688235.SH', 'pharma', 'pharma-biologic', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-biologic", "code": "688235.SH", "desc": "泽布替尼是美国销售额超过中国的唯一国产肿瘤药，2026 年市值居 A 股医药前列。", "name": "百济神州", "tech": [{"date": "2026-06", "title": "泽布替尼海外销售超中国"}, {"date": "2026-02", "title": "替雷利珠单抗新适应症在美获批"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "替雷利珠单抗与泽布替尼双引擎，全球多中心临床能力是国内最强"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('科伦博泰', '06990.HK', 'pharma', 'pharma-biologic', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-biologic", "code": "06990.HK", "desc": "与默沙东累计签约 9 款 ADC、总额超 118 亿美元；sac-TMT 是全球首款 III 期 OS 与 PFS 双阳性的国产 ADC。", "name": "科伦博泰", "tech": [{"date": "2026-05", "title": "sac-TMT 全球 III 期双终点阳性"}, {"date": "2026-03", "title": "SKB571 双抗 ADC 进入 III 期"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "sac-TMT（芦康沙妥珠单抗）在 TroFuse-005 拿下双终点，默沙东已布局 17 项全球 III 期"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('翰森制药', '03692.HK', 'pharma', 'pharma-biologic', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-biologic", "code": "03692.HK", "desc": "B7-H3 ADC（HS-20093）与 GSK 合作，2026 年小细胞肺癌 OS 阳性、骨肉瘤 III 期成功。", "name": "翰森制药", "tech": [{"date": "2026-09", "title": "B7-H3 ADC 骨肉瘤 III 期成功"}, {"date": "2026-07", "title": "与 Avere 达成资产+股权合作"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "GSK 把该项目全球 III 期数量翻倍至 20 项；7 月与 Avere 合作打包授权+可转债+股权"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('荣昌生物', '688331.SH', 'pharma', 'pharma-biologic', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-biologic", "code": "688331.SH", "desc": "维迪西妥单抗是首个出海的中国 ADC（Seagen，26 亿美元/首付 2 亿），RC148 又授权艾伯维。", "name": "荣昌生物", "tech": [{"date": "2026-08", "title": "中报业绩改善、接近扭亏"}, {"date": "2026-01", "title": "RC148 授权艾伯维"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "2026 年中报业绩改善、接近扭亏，ADC 与自免双线"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('东曜药业', '01875.HK', 'pharma', 'pharma-cdmo', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cdmo", "code": "01875.HK", "desc": "抗体与 ADC 一体化 CDMO，同时保留自有管线，是「产品+服务」混合模式。", "name": "东曜药业", "tech": [{"date": "2026-04", "title": "ADC 灌装线投产"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "ADC 偶联与灌装产能承接国产 ADC 出海订单"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('九洲药业', '603456.SH', 'pharma', 'pharma-cdmo', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cdmo", "code": "603456.SH", "desc": "从特色原料药转向 CDMO，承接诺华等 MNC 的心血管与抗感染品种。", "name": "九洲药业", "tech": [{"date": "2026-06", "title": "CDMO 订单结构优化"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "危险工艺产能审批趋严，存量产能价值提升"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('凯莱英', '002821.SZ', 'pharma', 'pharma-cdmo', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cdmo", "code": "002821.SZ", "desc": "小分子 CDMO 龙头，连续性反应技术是拿到 MNC 重磅品种订单的核心；2026H1 在手订单 16.73 亿美元（+53.8%）。", "name": "凯莱英", "tech": [{"date": "2026-08", "title": "在手订单 16.73 亿美元、同比 +53.8%"}, {"date": "2026-05", "title": "新兴业务收入同比 +74%"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "H1 资本开支同比 +75.97% 至 8.55 亿元，全年计划上调至 26-28 亿元"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('博腾股份', '300363.SZ', 'pharma', 'pharma-cdmo', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cdmo", "code": "300363.SZ", "desc": "小分子 CDMO，中间体与原料药规模领先，是 CXO 板块的情绪风向标（2026-11-27 单日涨 20%）。", "name": "博腾股份", "tech": [{"date": "2026-11", "title": "单日涨 20%，板块情绪指标"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "订单随客户管线推进回暖，制剂 CDMO 与 CGT CDMO 双线延伸"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('和元生物', '688238.SH', 'pharma', 'pharma-cdmo', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cdmo", "code": "688238.SH", "desc": "AAV 与溶瘤病毒 CDMO，2022-2024 年产能空转、连续亏损，是 CGT 寒冬的样本。", "name": "和元生物", "tech": [{"date": "2026-09", "title": "产能利用率回升至约 50%"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "2026 年产能利用率回升至五成左右，仍未回到 2021 年水平"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('宣泰医药', '688247.SH', 'pharma', 'pharma-cdmo', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cdmo", "code": "688247.SH", "desc": "高端制剂 CDMO 与出口，难溶药增溶技术是其差异化方向。", "name": "宣泰医药", "tech": [{"date": "2026-03", "title": "复杂注射剂产线投产"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('皓元医药', '688131.SH', 'pharma', 'pharma-cdmo', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cdmo", "code": "688131.SH", "desc": "分子砌块与 CDMO 一体化，ADC 毒素与连接子是差异化方向。", "name": "皓元医药", "tech": [{"date": "2026-05", "title": "ADC 毒素中间体放量"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "ADC 毒素中间体需求随国产 ADC 出海增长"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('药明合联', '02268.HK', 'pharma', 'pharma-cdmo', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cdmo", "code": "02268.HK", "desc": "全球 ADC CDMO 份额领先者，无锡与新加坡基地承接大部分国产 ADC 出海订单的生产。", "name": "药明合联", "tech": [{"date": "2026-07", "title": "新加坡基地投产"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "新加坡基地投产，但全球 ADC 产能扩张已导致新签订单出现价格战"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('药明生物', '02269.HK', 'pharma', 'pharma-cdmo', true,
  '已上市', NULL, NULL, 118.0, NULL,
  '{"rd": null, "rev": 118.0, "seg": "pharma-cdmo", "code": "02269.HK", "desc": "全球最大生物药 CDMO，2026H1 收益 118 亿元（+18.4%）、经调净利 33 亿元（+38.4%）。", "name": "药明生物", "tech": [{"date": "2026-08", "title": "全年指引上调至固定汇率 20-23%"}, {"date": "2026-08", "title": "H1 新增项目 69 个、同比增超 50%"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": 18.4, "valuation": null, "latestTech": "H1 新增项目 69 个、同比增超 50%，全年收入增速指引上调至固定汇率 20-23%"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('迈百瑞', '—', 'pharma', 'pharma-cdmo', false,
  '未披露', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cdmo", "code": "—", "desc": "抗体与 ADC 一体化 CDMO，是国内少数具备 ADC 偶联商业化产能的企业。", "name": "迈百瑞", "tech": [{"date": "2026-06", "title": "ADC 偶联产能扩建"}], "gross": null, "round": "未披露", "listed": false, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('金斯瑞', '01548.HK', 'pharma', 'pharma-cdmo', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cdmo", "code": "01548.HK", "desc": "全球最大基因合成供应商之一，子公司蓬勃生物做质粒与病毒载体的 CGT CDMO。", "name": "金斯瑞", "tech": [{"date": "2026-07", "title": "蓬勃生物产能利用率回升"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "基因合成基本盘稳定，CGT CDMO 产能利用率随行业融资回暖缓慢修复"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('中源协和', '600645.SH', 'pharma', 'pharma-cellgene', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cellgene", "code": "600645.SH", "desc": "干细胞全产业链布局（存储、制备、临床），是 MSC 药物获批后的概念受益方。", "name": "中源协和", "tech": [{"date": "2025-12", "title": "MSC 药物获批路径打开"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "2025 年首个国产 MSC 药物获批打开审批路径，但行业历史包袱重"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('九芝堂', '000989.SZ', 'pharma', 'pharma-cellgene', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cellgene", "code": "000989.SZ", "desc": "中药企业通过子公司布局干细胞，是 MSC 赛道的跨界玩家。", "name": "九芝堂", "tech": [{"date": "2026-03", "title": "干细胞业务整合"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('传奇生物', 'LEGN', 'pharma', 'pharma-cellgene', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cellgene", "code": "LEGN", "desc": "西达基奥仑赛（与强生合作）是全球 BCMA CAR-T 龙头，2026 年海外销售超 20 亿美元。", "name": "传奇生物", "tech": [{"date": "2026-08", "title": "西达基奥仑赛海外销售超 20 亿美元"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "唯一在海外放量的国产 CAR-T，证明出海是 CGT 唯一能撑起估值的路径"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('信念医药', '—', 'pharma', 'pharma-cellgene', false,
  '未披露', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cellgene", "code": "—", "desc": "波哌达可基是首个国产 AAV 基因治疗（血友病 B），2025 年获批。", "name": "信念医药", "tech": [{"date": "2025-11", "title": "波哌达可基获批（首个国产 AAV）"}], "gross": null, "round": "未披露", "listed": false, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "一次性治疗定价数百万元，支付模式（商保/按疗效付费）比临床数据更决定成败"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('博雅辑因', '—', 'pharma', 'pharma-cellgene', false,
  '未披露', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cellgene", "code": "—", "desc": "CRISPR 基因编辑，地贫与肿瘤的体外编辑管线，是国内基因编辑先行者。", "name": "博雅辑因", "tech": [{"date": "2026-05", "title": "地贫管线临床推进"}], "gross": null, "round": "未披露", "listed": false, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('君赛生物', '—', 'pharma', 'pharma-cellgene', false,
  '未披露', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cellgene", "code": "—", "desc": "TIL（肿瘤浸润淋巴细胞）疗法国内第一梯队，是实体瘤 CGT 最接近突破的方向。", "name": "君赛生物", "tech": [{"date": "2026-07", "title": "TIL 管线进入 II 期"}], "gross": null, "round": "未披露", "listed": false, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "TIL 管线进入 II 期，工艺瓶颈在扩增成功率"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('正序生物', '—', 'pharma', 'pharma-cellgene', false,
  '未披露', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cellgene", "code": "—", "desc": "碱基编辑降脂（PCSK9），是国内碱基编辑临床转化的第一梯队。", "name": "正序生物", "tech": [{"date": "2026-06", "title": "碱基编辑降脂进入临床"}], "gross": null, "round": "未披露", "listed": false, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('沙砾生物', '—', 'pharma', 'pharma-cellgene', false,
  '未披露', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cellgene", "code": "—", "desc": "TIL 疗法国内第一梯队，实体瘤方向，管线进入 II 期。", "name": "沙砾生物", "tech": [{"date": "2026-06", "title": "TIL 管线进入 II 期"}], "gross": null, "round": "未披露", "listed": false, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('科济药业', '02171.HK', 'pharma', 'pharma-cellgene', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cellgene", "code": "02171.HK", "desc": "BCMA 与 GPC3 CAR-T 双线，实体瘤（肝癌）是差异化方向。", "name": "科济药业", "tech": [{"date": "2026-05", "title": "GPC3 CAR-T 肝癌数据读出"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "GPC3 CAR-T 在肝癌的早期数据是实体瘤突破的关键观察点"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('纽福斯', '—', 'pharma', 'pharma-cellgene', false,
  '未披露', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cellgene", "code": "—", "desc": "眼科 AAV 基因治疗（LHON 视神经病变），是国内 AAV 路线的代表企业。", "name": "纽福斯", "tech": [{"date": "2026-04", "title": "眼科 AAV 进入 II/III 期"}], "gross": null, "round": "未披露", "listed": false, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('药明巨诺', '02126.HK', 'pharma', 'pharma-cellgene', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cellgene", "code": "02126.HK", "desc": "瑞基奥仑赛是国内第二款获批 CAR-T，商业化受百万级定价制约。", "name": "药明巨诺", "tech": [{"date": "2026-04", "title": "自免适应症探索"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "实体瘤与自免适应症拓展，进商保/惠民保是可及性突破口"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('邦耀生物', '—', 'pharma', 'pharma-cellgene', false,
  '未披露', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cellgene", "code": "—", "desc": "CRISPR 治疗输血依赖型 β 地中海贫血，中国基因编辑临床转化第一梯队。", "name": "邦耀生物", "tech": [{"date": "2026-03", "title": "地贫管线进入 II 期"}], "gross": null, "round": "未披露", "listed": false, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "碱基编辑与体内编辑是下一代方向，价值在 IP 与平台授权"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('铂生卓越', '—', 'pharma', 'pharma-cellgene', false,
  '未披露', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cellgene", "code": "—", "desc": "艾米迈托赛是国内首个获批的间充质干细胞药物（激素失败急性 GVHD）。", "name": "铂生卓越", "tech": [{"date": "2025-12", "title": "首个国产 MSC 药物获批"}], "gross": null, "round": "未披露", "listed": false, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('锦篮基因', '—', 'pharma', 'pharma-cellgene', false,
  '未披露', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cellgene", "code": "—", "desc": "神经系统 AAV 基因治疗，覆盖 SMA 与庞贝病等罕见病。", "name": "锦篮基因", "tech": [{"date": "2026-02", "title": "SMA 管线进入临床"}], "gross": null, "round": "未披露", "listed": false, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('香雪制药', '300147.SZ', 'pharma', 'pharma-cellgene', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cellgene", "code": "300147.SZ", "desc": "TAEST16001 是国产 TCR-T（NY-ESO-1 靶点，滑膜肉瘤），国内 TCR-T 进度最靠前。", "name": "香雪制药", "tech": [{"date": "2026-05", "title": "TCR-T 关键 II 期推进"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('上海医药', '601607.SH', 'pharma', 'pharma-commercial', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-commercial", "code": "601607.SH", "desc": "医药分销龙头，旗下「上药云健康」是国内最大 DTP 网络之一，承接创新药院外放量。", "name": "上海医药", "tech": [{"date": "2026-07", "title": "DTP 网络扩张"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "双通道政策扩围，DTP 网络成为创新药放量基础设施"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('中国生物制药', '01177.HK', 'pharma', 'pharma-commercial', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-commercial", "code": "01177.HK", "desc": "正大天晴母公司，自建销售网络覆盖广；TQB2102（HER2 双抗 ADC）2026 年 8 月 III 期成功。", "name": "中国生物制药", "tech": [{"date": "2026-09", "title": "GPC3 ADC 获 FDA IND 批准"}, {"date": "2026-08", "title": "TQB2102 双抗 ADC III 期成功"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "GPC3 ADC（TQB6426）中美双报，代表「自主全球化」而非授权出海的另一条路"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('九州通', '600998.SH', 'pharma', 'pharma-commercial', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-commercial", "code": "600998.SH", "desc": "民营医药分销龙头，院外与基层市场覆盖强，是处方外流的受益方。", "name": "九州通", "tech": [{"date": "2026-04", "title": "总代推广业务增长"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "总代推广与院外市场扩张，毛利率高于纯配送"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('国药控股', '01099.HK', 'pharma', 'pharma-commercial', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-commercial", "code": "01099.HK", "desc": "国内最大医药分销商，国大药房与 DTP 网络覆盖全国。", "name": "国药控股", "tech": [{"date": "2026-03", "title": "DTP 药房网络优化"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "分销主业稳、零售与器械为增量，估值受集采与回款周期压制"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('圆心科技', '—', 'pharma', 'pharma-commercial', false,
  '未披露', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-commercial", "code": "—", "desc": "院外处方流转与 DTP 药房网络，承接创新药院外放量。", "name": "圆心科技", "tech": [{"date": "2026-06", "title": "双通道药房接入"}], "gross": null, "round": "未披露", "listed": false, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('康哲药业', '00867.HK', 'pharma', 'pharma-commercial', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-commercial", "code": "00867.HK", "desc": "从药品引进转向创新药商业化，自建学术队伍覆盖数千家医院。", "name": "康哲药业", "tech": [{"date": "2026-06", "title": "创新药独家品种引进"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "引进品种+自建队伍模式，在集采环境下转向创新药独家品种"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('思派健康', '00314.HK', 'pharma', 'pharma-commercial', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-commercial", "code": "00314.HK", "desc": "特药险与特药药房网络，是创新药支付环节的第三方服务商。", "name": "思派健康", "tech": [{"date": "2026-08", "title": "CAR-T 按疗效付费试点"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "按疗效付费在 CAR-T 与基因治疗上试点，商保是高价药第二支付方"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('百洋医药', '301015.SZ', 'pharma', 'pharma-commercial', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-commercial", "code": "301015.SZ", "desc": "品牌运营与 DTP 配送，运营迪巧、泌特等品牌，是 CSO 模式的代表。", "name": "百洋医药", "tech": [{"date": "2026-05", "title": "创新药院外承接业务扩张"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "集采后 MNC 把成熟品种院内推广外包，CSO 生意反而变大"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('镁信健康', '—', 'pharma', 'pharma-commercial', false,
  '未披露', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-commercial", "code": "—", "desc": "患者援助与分期支付平台，做特药险与创新支付方案设计。", "name": "镁信健康", "tech": [{"date": "2026-07", "title": "CAR-T 分期支付方案落地"}], "gross": null, "round": "未披露", "listed": false, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('康龙化成', '300759.SZ', 'pharma', 'pharma-cro', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cro", "code": "300759.SZ", "desc": "从实验室化学延伸到安评与临床的一体化 CRO，2026H1 订单增超三成、小分子 CDMO 订单增超五成。", "name": "康龙化成", "tech": [{"date": "2026-08", "title": "H1 订单增超 30%"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "全年收入增长目标上调至 15-20%，海外收入占比高、受汇率影响明显"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('昆翎医药', '—', 'pharma', 'pharma-cro', false,
  '未披露', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cro", "code": "—", "desc": "临床 CRO，跨国多中心运营能力在国内较强，是承接出海临床的主要服务商之一。", "name": "昆翎医药", "tech": [{"date": "2026-06", "title": "承接国产 ADC 全球多中心临床"}], "gross": null, "round": "未披露", "listed": false, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('昭衍新药', '603127.SH', 'pharma', 'pharma-cro', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cro", "code": "603127.SH", "desc": "GLP 安评龙头，拥有国内最大规模的实验动物设施；2026H1 新签订单 20.2 亿元、同比 +98%。", "name": "昭衍新药", "tech": [{"date": "2026-08", "title": "H1 新签订单同比 +98%、合同负债增 87%"}, {"date": "2026-03", "title": "猴价涨至 22-26 万元/只且「有价无市」"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "利润改善含实验猴生物资产公允价值重估成分（猴价从 8.5 万涨至 22-26 万元/只），重估不产生现金流"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('普蕊斯', '301257.SZ', 'pharma', 'pharma-cro', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cro", "code": "301257.SZ", "desc": "国内规模最大的 SMO，CRC 覆盖数百家临床试验机构，人力密集但现金流稳定。", "name": "普蕊斯", "tech": [{"date": "2026-09", "title": "中心覆盖数破千"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "2026 年 GCP 监管趋严，小型 SMO 出清、头部中心覆盖数破千"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('晶泰控股', '02228.HK', 'pharma', 'pharma-cro', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cro", "code": "02228.HK", "desc": "AI 制药平台，以晶型预测与分子生成起家，收入结构中药物发现服务与里程碑占比持续上升。", "name": "晶泰控股", "tech": [{"date": "2026-04", "title": "自研管线进入临床"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "从卖软件转向卖管线与里程碑，自研管线进入临床阶段"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('泰格医药', '300347.SZ', 'pharma', 'pharma-cro', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cro", "code": "300347.SZ", "desc": "国内临床 CRO 龙头，覆盖临床运营、数统、注册与药物警戒，2026 年订单回暖但定价权分化。", "name": "泰格医药", "tech": [{"date": "2026-10", "title": "三季报订单回暖、净利增速分化"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "2026H1 国内创新药投融资 42 亿美元创新高，直接传导为临床订单"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('益诺思', '688710.SH', 'pharma', 'pharma-cro', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cro", "code": "688710.SH", "desc": "安评 CRO 第二梯队，2024 年科创板上市，专注非临床安全性评价。", "name": "益诺思", "tech": [{"date": "2026-07", "title": "ADC 安评订单增长"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('美迪西', '688202.SH', 'pharma', 'pharma-cro', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cro", "code": "688202.SH", "desc": "临床前综合 CRO，2026H1 新签订单 12.33 亿元、同比 +104.74%，是订单修复弹性最大的一家。", "name": "美迪西", "tech": [{"date": "2026-08", "title": "H1 新签订单同比翻倍"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "订单翻倍来自创新药投融资回暖与临床前需求集中释放"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('药明康德', '603259.SH', 'pharma', 'pharma-cro', true,
  '已上市', NULL, NULL, 455.37, NULL,
  '{"rd": null, "rev": 455.37, "seg": "pharma-cro", "code": "603259.SH", "desc": "全球 CRDMO 龙头，2026 前三季营收 455.37 亿元（+38.59%），在手订单 767.4 亿元（+36.4%）。", "name": "药明康德", "tech": [{"date": "2026-11", "title": "被美国国防部从 1260H 清单移出"}, {"date": "2026-10", "title": "前三季在手订单 767.4 亿元、同比 +36.4%"}, {"date": "2026-06", "title": "被列入 1260H 清单并提起诉讼"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": 38.59, "valuation": null, "latestTech": "全年收入指引上调至 610-619 亿元，capex 上调至 80-85 亿元；11 月被美国国防部从 1260H 清单移出"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('观合医药', '—', 'pharma', 'pharma-cro', false,
  '未披露', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cro", "code": "—", "desc": "中心实验室（迪安诊断与泰格医药合资），承接临床样本的集中检测。", "name": "观合医药", "tech": [{"date": "2026-04", "title": "ADC 多分析物检测平台上线"}], "gross": null, "round": "未披露", "listed": false, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('诺思格', '301333.SZ', 'pharma', 'pharma-cro', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cro", "code": "301333.SZ", "desc": "临床 CRO，专注数统与注册申报，是临床数据环节的技术型服务商。", "name": "诺思格", "tech": [{"date": "2026-06", "title": "海外注册申报订单增长"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "数统与注册业务随国产创新药出海需求增加"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('迪安诊断', '300244.SZ', 'pharma', 'pharma-cro', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-cro", "code": "300244.SZ", "desc": "第三方医学检验龙头，通过观合医药切入临床中心实验室业务。", "name": "迪安诊断", "tech": [{"date": "2026-05", "title": "特检业务占比提升"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('剂泰科技', '7666.HK', 'pharma', 'pharma-nucleic', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-nucleic", "code": "7666.HK", "desc": "用 AI 做 LNP 配方筛选，2026-05-13 以「全球 AI 药物递送第一股」登陆港交所，是核酸递送平台的稀缺标的。", "name": "剂泰科技", "tech": [{"date": "2026-05", "title": "港股上市（7666.HK）"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "AI 辅助脂质纳米颗粒设计，绕开 Arbutus 的 MLV 专利是国产化前提"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('圣诺医药', '02257.HK', 'pharma', 'pharma-nucleic', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-nucleic", "code": "02257.HK", "desc": "多靶点 siRNA 递送平台，PNP 递送系统是差异化技术路线。", "name": "圣诺医药", "tech": [{"date": "2026-05", "title": "PNP 递送管线进入 II 期"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "肿瘤与纤维化方向管线，商业化进度落后于肝靶向同行"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('康希诺', '688185.SH', 'pharma', 'pharma-nucleic', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-nucleic", "code": "688185.SH", "desc": "疫苗企业，mRNA 与腺病毒载体双平台，是新冠后少数活下来的疫苗公司。", "name": "康希诺", "tech": [{"date": "2026-04", "title": "mRNA 平台授权合作"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('斯微生物', '—', 'pharma', 'pharma-nucleic', false,
  '未披露', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-nucleic", "code": "—", "desc": "mRNA 疫苗企业，2025-2026 年陷入经营困境，是 mRNA 赛道出清的标志性案例。", "name": "斯微生物", "tech": [{"date": "2026-01", "title": "产能闲置、经营困难"}], "gross": null, "round": "未披露", "listed": false, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('瑞博生物', '6938.HK', 'pharma', 'pharma-nucleic', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-nucleic", "code": "6938.HK", "desc": "GalNAc 肝靶向小核酸平台，2026-08 在港股上市（06938.HK），是国产小核酸第一股。", "name": "瑞博生物", "tech": [{"date": "2026-08", "title": "港股上市（6938.HK）"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "从肝靶向向肝外递送延伸，肝外递送决定小核酸的市场天花板"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('石药集团', '01093.HK', 'pharma', 'pharma-nucleic', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-nucleic", "code": "01093.HK", "desc": "2026 年 1 月与阿斯利康达成 185 亿美元合作，缓释给药平台与多肽 AI 发现平台是授权标的。", "name": "石药集团", "tech": [{"date": "2026-01", "title": "与阿斯利康达成 185 亿美元合作"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "mRNA 平台与多肽平台双线，现金流支撑创新转型"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('舶望制药', '—', 'pharma', 'pharma-nucleic', false,
  '未披露', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-nucleic", "code": "—", "desc": "2024 年与诺华达成 41.65 亿美元合作（首付 1.85 亿美元），是国产小核酸最大单。", "name": "舶望制药", "tech": [{"date": "2024-08", "title": "与诺华达成 41.65 亿美元合作"}], "gross": null, "round": "未披露", "listed": false, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "心血管与代谢方向 siRNA 管线，是国产小核酸出海标杆"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('艾博生物', '—', 'pharma', 'pharma-nucleic', false,
  '未披露', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-nucleic", "code": "—", "desc": "国产 mRNA 龙头，自研 LNP 递送系统是其活下来的核心资产。", "name": "艾博生物", "tech": [{"date": "2026-06", "title": "mRNA 肿瘤疫苗进入 II 期"}], "gross": null, "round": "未披露", "listed": false, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "方向转向肿瘤治疗性疫苗与体内 CAR-T，LNP 自主 IP 是壁垒"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('艾码生物', '—', 'pharma', 'pharma-nucleic', false,
  '未披露', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-nucleic", "code": "—", "desc": "ASO 反义寡核苷酸，聚焦 CNS 与罕见病，是国内少见的 ASO 玩家。", "name": "艾码生物", "tech": [{"date": "2026-05", "title": "CNS 适应症 ASO 进入临床"}], "gross": null, "round": "未披露", "listed": false, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('银诺医药', '2591.HK', 'pharma', 'pharma-nucleic', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-nucleic", "code": "2591.HK", "desc": "依苏帕格鲁肽（人源化长效 GLP-1）2026 年在港股上市（02591.HK），是国产减重多肽第二梯队。", "name": "银诺医药", "tech": [{"date": "2026-06", "title": "港股上市（2591.HK）"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "减重与糖尿病双适应症，商业化能力是短板"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('亚盛医药', '06855.HK', 'pharma', 'pharma-small', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-small", "code": "06855.HK", "desc": "Bcl-2 抑制剂奥雷巴替尼（耐立克）是国产原创，全球权益已与武田合作。", "name": "亚盛医药", "tech": [{"date": "2026-02", "title": "奥雷巴替尼海外权益推进"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "Bcl-2 与 MDM2-p53 双线推进，海外权益授权带来里程碑收入"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('京新药业', '002020.SZ', 'pharma', 'pharma-small', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-small", "code": "002020.SZ", "desc": "精神神经与心脑血管药物，CNS 领域有成熟渠道与产品组合。", "name": "京新药业", "tech": [{"date": "2026-04", "title": "精神类新药获批"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('人福医药', '600079.SH', 'pharma', 'pharma-small', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-small", "code": "600079.SH", "desc": "麻醉药龙头，芬太尼系列占据国内麻醉市场主要份额，渠道壁垒极高。", "name": "人福医药", "tech": [{"date": "2026-06", "title": "麻醉新产品放量"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('众生药业', '002317.SZ', 'pharma', 'pharma-small', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-small", "code": "002317.SZ", "desc": "RAY1225 是 GLP-1/GIP 双激动剂，是国产减重多肽的第二梯队代表。", "name": "众生药业", "tech": [{"date": "2026-07", "title": "RAY1225 推进 III 期"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "RAY1225 双周制剂推进 III 期，减重适应症是核心看点"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('先声药业', '02096.HK', 'pharma', 'pharma-small', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-small", "code": "02096.HK", "desc": "从仿制转向创新，先必新（依达拉奉右莰醇）与自免小分子是转型支柱。", "name": "先声药业", "tech": [{"date": "2026-06", "title": "自免管线进入 II 期"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "SIM0237 等 PD-1/IL-2 与自免管线进入临床，创新收入占比提升"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('前沿生物', '688221.SH', 'pharma', 'pharma-small', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-small", "code": "688221.SH", "desc": "长效 HIV 融合抑制剂艾博韦泰是国产原创，2026 年 2 月将两条 siRNA 管线授权 GSK。", "name": "前沿生物", "tech": [{"date": "2026-02", "title": "两条 siRNA 管线授权 GSK（总额 9.5 亿美元）"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "siRNA 授权 GSK：首付 4000 万美元 + 近期里程碑 1300 万美元、总额最高 9.5 亿美元"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('恩华药业', '002262.SZ', 'pharma', 'pharma-small', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-small", "code": "002262.SZ", "desc": "麻醉与精神类药龙头，CNS 领域渠道壁垒深厚，是少见的「临床风险高但竞争少」标的。", "name": "恩华药业", "tech": [{"date": "2026-03", "title": "CNS 新产品获批"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "CNS 新药研发投入加大，渠道优势支撑新产品放量"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('歌礼制药', '01672.HK', 'pharma', 'pharma-small', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-small", "code": "01672.HK", "desc": "抗病毒（丙肝、HIV）与小分子代谢药物，是港股 18A 首批上市企业之一。", "name": "歌礼制药", "tech": [{"date": "2026-05", "title": "代谢管线进入 II 期"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('泽璟制药', '688266.SH', 'pharma', 'pharma-small', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-small", "code": "688266.SH", "desc": "多纳非尼（肝癌）与杰克替尼（JAK/FLT3）双产品，是科创板首家未盈利上市药企。", "name": "泽璟制药", "tech": [{"date": "2026-04", "title": "杰克替尼新适应症获批"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "杰克替尼自免适应症拓展，受 JAK 类黑框警告影响需做差异化定位"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('益方生物', '688382.SH', 'pharma', 'pharma-small', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-small", "code": "688382.SH", "desc": "小分子靶向药研发，管线覆盖 KRAS G12C、URAT1 与 ER 降解剂。", "name": "益方生物", "tech": [{"date": "2026-05", "title": "KRAS G12C 进入关键临床"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "KRAS G12C 与痛风药并行推进，2026 年推进港股上市"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('腾盛博药', '02137.HK', 'pharma', 'pharma-small', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-small", "code": "02137.HK", "desc": "抗感染与乙肝功能性治愈，新冠中和抗体是其唯一商业化产品。", "name": "腾盛博药", "tech": [{"date": "2026-03", "title": "乙肝治愈管线数据读出"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('艾力斯', '688578.SH', 'pharma', 'pharma-small', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-small", "code": "688578.SH", "desc": "伏美替尼差异化卡位 EGFR 20 号外显子插入突变，是小分子肿瘤药里商业化最成功的一家。", "name": "艾力斯", "tech": [{"date": "2026-06", "title": "伏美替尼一线适应症放量"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "伏美替尼一线适应症放量，辅助治疗与脑转移适应症拓展"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('贝达药业', '300558.SZ', 'pharma', 'pharma-small', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-small", "code": "300558.SZ", "desc": "以埃克替尼起家的国产靶向药先行者，恩沙替尼是首个由中国企业主导全球上市的肺癌靶向药。", "name": "贝达药业", "tech": [{"date": "2026-08", "title": "第 4 次递表港交所"}, {"date": "2025-12", "title": "恩沙替尼海外上市推进"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "2026 年 8 月第 4 次递表港交所，推进 A+H 与国际化"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('迪哲医药', '688192.SH', 'pharma', 'pharma-small', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-small", "code": "688192.SH", "desc": "舒沃替尼是美国 FDA 首个批准的中国原创肺癌小分子，2026 年推进 A+H。", "name": "迪哲医药", "tech": [{"date": "2026-07", "title": "舒沃替尼获美国 FDA 批准"}, {"date": "2026-03", "title": "推进 A+H 两地上市"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "舒沃替尼获 FDA 批准，是中国小分子创新药全球注册的里程碑"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('东富龙', '300171.SZ', 'pharma', 'pharma-upstream', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "300171.SZ", "desc": "制药装备龙头，覆盖冻干机、无菌灌装、生物反应器与一次性系统。", "name": "东富龙", "tech": [{"date": "2026-10", "title": "CXO 扩产带动订单回暖"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "头部 CXO 资本开支 2026 年同比增三成，装备订单能见度提升至 12 个月"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('义翘神州', '301047.SZ', 'pharma', 'pharma-upstream', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "301047.SZ", "desc": "以病毒相关蛋白与抗原见长的重组蛋白供应商，科研级 SKU 数量居国内前列。", "name": "义翘神州", "tech": [{"date": "2026-03", "title": "GMP 级蛋白产线扩产"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "从科研试剂向 GMP 级原料延伸，抗体与基因编辑工具酶同步扩充"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('健顺生物', '—', 'pharma', 'pharma-upstream', false,
  '未披露', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "—", "desc": "疫苗与抗体用无血清培养基供应商，客户以疫苗厂为主。", "name": "健顺生物", "tech": [{"date": "2026-02", "title": "疫苗培养基订单增长"}], "gross": null, "round": "未披露", "listed": false, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('华大智造', '688114.SH', 'pharma', 'pharma-upstream', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "688114.SH", "desc": "全球少数具备高通量测序仪自研自产能力的厂商，DNBSEQ 路线与 Illumina 形成对照。", "name": "华大智造", "tech": [{"date": "2026-09", "title": "高端测序仪海外注册推进"}, {"date": "2025-10", "title": "空间转录组平台发布"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "高端机型推进海外注册，单细胞与空间组学平台成为增量方向"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('博格隆', '—', 'pharma', 'pharma-upstream', false,
  '未披露', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "—", "desc": "Protein A 亲和填料国产化厂商，是纳微科技在层析介质上的直接对手。", "name": "博格隆", "tech": [{"date": "2026-07", "title": "耐碱 Protein A 填料上市"}], "gross": null, "round": "未披露", "listed": false, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('奥浦迈', '688293.SH', 'pharma', 'pharma-upstream', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "688293.SH", "desc": "国产 CHO 培养基龙头，已用于多个国产抗体药的商业化生产，2026 年海外收入占比升至三成。", "name": "奥浦迈", "tech": [{"date": "2026-08", "title": "海外收入占比提升至三成"}, {"date": "2026-02", "title": "化学成分限定培养基放量"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "化学成分限定培养基配方突破，随客户管线出海进入欧美 biotech 供应链"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('康为世纪', '688426.SH', 'pharma', 'pharma-upstream', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "688426.SH", "desc": "分子诊断原料与采样耗材，从科研试剂向临床诊断延伸。", "name": "康为世纪", "tech": [{"date": "2026-03", "title": "临床诊断试剂获批"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('拱东医疗', '605369.SH', 'pharma', 'pharma-upstream', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "605369.SH", "desc": "实验室与医用耗材供应商，一次性培养皿与冻存管出口占比高。", "name": "拱东医疗", "tech": [{"date": "2026-05", "title": "海外耗材订单恢复"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('擎科生物', '—', 'pharma', 'pharma-upstream', false,
  '未披露', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "—", "desc": "寡核苷酸合成与基因合成服务商，是金斯瑞在国内的主要竞争者。", "name": "擎科生物", "tech": [{"date": "2026-04", "title": "长片段基因合成突破"}], "gross": null, "round": "未披露", "listed": false, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('楚天科技', '300358.SZ', 'pharma', 'pharma-upstream', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "300358.SZ", "desc": "无菌灌装联动线与生物工程装备供应商，海外订单占比持续提升。", "name": "楚天科技", "tech": [{"date": "2026-06", "title": "模块化工厂订单落地"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "模块化工厂与连续生产装备成为新增长点"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('毕得医药', '688073.SH', 'pharma', 'pharma-upstream', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "688073.SH", "desc": "药物分子砌块供应商，SKU 超 30 万种，客户覆盖国内外创新药企与 CRO。", "name": "毕得医药", "tech": [{"date": "2026-07", "title": "砌块订单随投融资回暖"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "随 2026H1 国内创新药投融资创新高，砌块订单回暖"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('泰坦科技', '688133.SH', 'pharma', 'pharma-upstream', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "688133.SH", "desc": "科研试剂与耗材电商，SKU 超 60 万种，服务高校与药企实验室。", "name": "泰坦科技", "tech": [{"date": "2026-06", "title": "SKU 扩张至 60 万种"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('洁特生物', '688026.SH', 'pharma', 'pharma-upstream', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "688026.SH", "desc": "细胞培养耗材与细胞工厂供应商，经历 2022-2024 年产能出清后开工率回升。", "name": "洁特生物", "tech": [{"date": "2026-06", "title": "开工率回升至 70%"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "一次性耗材价格触底，2026 年头部企业开工率回到七成"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('澳斯康', '—', 'pharma', 'pharma-upstream', false,
  '未披露', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "—", "desc": "培养基+CDMO 一体化，是国内少数同时做培养基与抗体生产的公司。", "name": "澳斯康", "tech": [{"date": "2026-06", "title": "培养基产能扩建"}], "gross": null, "round": "未披露", "listed": false, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('百普赛斯', '301080.SZ', 'pharma', 'pharma-upstream', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "301080.SZ", "desc": "重组蛋白与抗体试剂龙头，HEK293 表达体系进入全球前 20 大药企供应链。", "name": "百普赛斯", "tech": [{"date": "2026-06", "title": "推进 A+H 两地上市"}, {"date": "2025-12", "title": "GMP 级细胞因子产线投产"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "GMP 级细胞因子与膜蛋白产品线扩展，2026 年推进 A+H 两地上市"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('禾信仪器', '688622.SH', 'pharma', 'pharma-upstream', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "688622.SH", "desc": "飞行时间质谱仪厂商，在 VOCs 在线监测与临床质谱两条线布局。", "name": "禾信仪器", "tech": [{"date": "2025-11", "title": "临床质谱机型获批"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "国产三重四极杆质谱进入临床检测市场，高端质谱仍受分辨率与稳定性制约"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('纳微科技', '688690.SH', 'pharma', 'pharma-upstream', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "688690.SH", "desc": "单分散色谱填料龙头，打破 Cytiva 在 Protein A 亲和介质上的垄断。", "name": "纳微科技", "tech": [{"date": "2026-08", "title": "Protein A 填料通过商业化验证"}, {"date": "2025-09", "title": "连续层析填料上市"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "Protein A 填料通过头部 CDMO 商业化验证，是国产填料首次进入抗体药生产环节"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('维通利华', '—', 'pharma', 'pharma-upstream', false,
  '未披露', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "—", "desc": "实验动物供应商（Charles River 在华合资），提供 SPF 级大鼠与小鼠。", "name": "维通利华", "tech": [{"date": "2026-01", "title": "SPF 级设施扩建"}], "gross": null, "round": "未披露", "listed": false, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('聚光科技', '300203.SZ', 'pharma', 'pharma-upstream', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "300203.SZ", "desc": "环境与工业过程分析仪器，在质谱与光谱两条线布局，医药是新兴应用场景。", "name": "聚光科技", "tech": [{"date": "2026-03", "title": "临床质谱合作落地"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('药康生物', '688046.SH', 'pharma', 'pharma-upstream', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "688046.SH", "desc": "基因编辑小鼠模型龙头，「斑点鼠」品系库超 2 万种，体内药效试验的上游。", "name": "药康生物", "tech": [{"date": "2026-08", "title": "人源化小鼠订单增长"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "人源化免疫系统小鼠需求随 CGT 与核酸药研发上升"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('莱伯泰科', '688056.SH', 'pharma', 'pharma-upstream', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "688056.SH", "desc": "ICP-MS 与样品前处理仪器，是国内质谱国产化的第二梯队。", "name": "莱伯泰科", "tech": [{"date": "2026-05", "title": "三重四极杆质谱上市"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('菲鹏生物', '—', 'pharma', 'pharma-upstream', false,
  'IPO 已撤回', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "—", "desc": "IVD 原料酶与抗原龙头，是体外诊断上游最完整的国产供应商。2024-02 主动撤回创业板注册申请，至今未挂牌。", "name": "菲鹏生物", "tech": [{"date": "2026-04", "title": "化学发光原料放量"}], "gross": null, "round": "IPO 已撤回", "listed": false, "ipo": {"stage": "终止", "board": "创业板", "date": "2024-02-22", "broker": ["华泰联合证券"], "note": "2024-02-22 公司与华泰联合主动撤回创业板发行注册申请，证监会终止注册程序；未挂牌"}, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('蓝晓科技', '300487.SZ', 'pharma', 'pharma-upstream', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "300487.SZ", "desc": "吸附分离树脂龙头，在固相合成载体、胰岛素与疫苗纯化领域有稳定份额。", "name": "蓝晓科技", "tech": [{"date": "2026-04", "title": "多肽合成载体订单增长"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "多肽固相合成载体随 GLP-1 需求增长，盐湖提锂业务提供现金流对冲"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('诺唯赞', '688105.SH', 'pharma', 'pharma-upstream', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "688105.SH", "desc": "分子生物学试剂国产替代最彻底的一家，从 PCR 酶做到 NGS 建库酶与 mRNA 原料酶。", "name": "诺唯赞", "tech": [{"date": "2026-05", "title": "mRNA 原料酶订单回升"}, {"date": "2025-11", "title": "单细胞建库试剂上市"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "mRNA 原料酶随国内 mRNA 疫苗复产放量，海外收入占比提升"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('近岸蛋白', '688137.SH', 'pharma', 'pharma-upstream', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "688137.SH", "desc": "mRNA 原料酶与细胞因子供应商，疫情期间完成产能扩张，现随 mRNA 复产回升。", "name": "近岸蛋白", "tech": [{"date": "2026-05", "title": "mRNA 原料酶订单回升"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": null}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

INSERT INTO public.research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data, updated_at)
VALUES ('阿拉丁', '688179.SH', 'pharma', 'pharma-upstream', true,
  '已上市', NULL, NULL, NULL, NULL,
  '{"rd": null, "rev": null, "seg": "pharma-upstream", "code": "688179.SH", "desc": "科研试剂电商，超 5 万种 SKU，本质是「科研界的京东」，靠履约效率取胜。", "name": "阿拉丁", "tech": [{"date": "2026-05", "title": "自产试剂比例提升"}], "gross": null, "round": "已上市", "listed": true, "industry": "pharma", "revGrowth": null, "valuation": null, "latestTech": "高端化学试剂自产比例提升，毛利率稳定在四成以上"}'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, data = EXCLUDED.data, updated_at = now();

-- 三家已归在 ai/ai-science（AI 制药视角）的公司，只补 data，不改行业归属
UPDATE public.research_companies SET data = data || '{"desc": "DEL（DNA 编码化合物库）龙头，库规模居亚洲首位，商业模式从卖服务转向首付+里程碑。", "latestTech": "多个自研苗头化合物进入 PCC 阶段，里程碑收入占比上升", "tech": [{"date": "2026-07", "title": "自研苗头进入 PCC 阶段"}], "pharmaSeg": "pharma-cro"}'::jsonb, updated_at = now() WHERE name = '成都先导';

UPDATE public.research_companies SET data = data || '{"desc": "生成式 AI 制药公司，用模型推进自研管线至临床 II 期，是少数把 AI 讲成临床数据的公司。", "latestTech": "管线里程碑收入与对外授权并行，估值对单一管线读出高度敏感", "tech": [{"date": "2026-02", "title": "自研管线进入 II 期"}], "pharmaSeg": "pharma-cro"}'::jsonb, updated_at = now() WHERE name = '英矽智能';

UPDATE public.research_companies SET data = data || '{"desc": "药物分子砌块起家，延伸至 DEL 与 CDMO，是砌块到中间体的一体化供应商。", "latestTech": "杂环砌块与 ADC 毒素中间体需求增长", "tech": [{"date": "2026-05", "title": "ADC 毒素中间体订单增长"}], "pharmaSeg": "pharma-cro"}'::jsonb, updated_at = now() WHERE name = '药石科技';
