-- 研究池新增：旌晟超导（量子科技 › 关键材料 › 超导线材与带材）2026-10-28
-- 第二代双面 REBCO 高温超导带材，2026-03 成立于成都温江，电子科大陶伯万教授创立
-- 2026-03 种子轮 + 2026-09 天使轮，累计近亿元；估值未披露
INSERT INTO public.research_companies (name, code, industry, seg, listed, round, valuation, rev, data) VALUES
('旌晟超导', '—', 'quantum', 'q-material', false,
 '天使轮', NULL, NULL, '{"rd": null, "rev": null, "seg": "q-material", "code": "—", "desc": "第二代双面 REBCO 高温超导带材企业，2026-03 成立于成都温江，由电子科技大学陶伯万教授创立，自我定位「全球双面 REBCO 高温超导带材开创者」。", "name": "旌晟超导", "team": "创始人陶伯万，电子科技大学教授、博士生导师，师从中国工程院院士李言荣，深耕高温超导薄膜及带材 20 余年，入选教育部「新世纪优秀人才计划」、获「中国青年科技奖」", "tech": [], "gross": null, "round": "天使轮", "listed": false, "funding": [{"inv": "千乘资本、武岳峰鼎峰科创", "date": "2026-03", "round": "种子轮", "amount": "数千万元"}, {"inv": "千乘资本、武岳峰鼎峰科创（连续两轮）；道翼资本、普华资本、捷创资本", "date": "2026-09", "round": "天使轮", "amount": "数千万元"}], "industry": "quantum", "customers": "目标场景为可控核聚变磁体、高场 MRI、大科学装置、超导电力设备（超导电缆/限流器/储能），尚处产业化早期、未披露订单", "revGrowth": null, "valuation": null, "descDetail": "传统单面 REBCO 带材只有一面镀超导层，绕制磁体时需双倍带材长度；双面带材在金属基带两面同时沉积缓冲层与超导层，同等磁场下用料减半、磁体更紧凑，是紧凑型托卡马克与高场 MRI 的关键降本路径。难点在双面一致性（两面临界电流匹配）、面内均匀性与双面同步制备——陶伯万团队用 20 余年积累掌握了 3 英寸单晶双面 YBCO 薄膜与双面 REBCO 带材制备的核心工艺，并自研薄膜制备装备，这是其与国内其他带材厂的差异点。", "executives": [{"bio": "电子科技大学教授、博士生导师；师从中国工程院院士李言荣，深耕高温超导薄膜及带材 20 余年；入选教育部「新世纪优秀人才计划」，获「中国青年科技奖」。", "name": "陶伯万", "role": "management", "title": "创始人、董事长"}], "latestTech": "掌握双面一致性、面内均匀性与双面同步制备三项关键工艺；本轮资金投向核心技术研发、产业化工艺与装备升级、产能建设及团队扩充", "milestones": ["2026-03-05 公司成立", "2026-03 种子轮", "2026-09 天使轮，成立半年累计融资近亿元", "第二代高温超导材料产业化基地落地电子科技大学科技园温江园"], "lastFunding": "2026-09"}'::jsonb)
ON CONFLICT (name) DO UPDATE SET
  code=EXCLUDED.code, industry=EXCLUDED.industry, seg=EXCLUDED.seg,
  listed=EXCLUDED.listed, round=EXCLUDED.round, valuation=EXCLUDED.valuation,
  rev=EXCLUDED.rev, data=EXCLUDED.data, updated_at=now();
