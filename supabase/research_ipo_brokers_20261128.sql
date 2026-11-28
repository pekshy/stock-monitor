-- 研究池：已启动 IPO 的未上市企业补充辅导/保荐券商（2026-11-28）
-- 数据源：证监会辅导公示系统、沪深交易所审核项目动态、证券时报 IPO 库、各券商辅导备案报告
-- 仅合并 data.ipo 一个键，不整包覆盖；round 单独校正 4 家明显脱节的状态

UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "辅导备案（子公司）", "board": "科创板", "broker": ["中信建投"], "date": "2026-01", "note": "母体 SMEE 已于 2024-10 撤回科创板辅导备案、终止整体 IPO；改由子公司上海芯上微装 2026-01 在上海证监局备案，辅导机构中信建投。母体专注 EUV，宇量昇承接 28nm 浸没式 DUV，均无上市计划。"}'::jsonb), updated_at = now() WHERE name = '上海微电子';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "中止（财报更新）", "board": "科创板", "broker": ["中金公司"], "date": "2025-06-18", "note": "2025-06-18 受理、2025-07-11 已问询，拟募 12.00 亿元；2026-09-30 因财务资料过有效期程序性中止。"}'::jsonb), updated_at = now() WHERE name = '上海超导';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "已问询", "board": "科创板", "broker": ["华泰联合"], "date": "2026-06-30", "note": "拟募 12.00 亿元；2026-10-28 披露首轮问询回复，2026H1 营收 2.27 亿元、首次半年度扭亏。"}'::jsonb), updated_at = now() WHERE name = '上海隐冠';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "已问询", "board": "科创板", "broker": ["中信建投"], "date": "2026-09-29"}'::jsonb), updated_at = now() WHERE name = '东方晶源';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "已受理", "board": "科创板", "broker": ["国联民生"], "date": "2026-06-28"}'::jsonb), updated_at = now() WHERE name = '中导光电';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "辅导备案", "board": "科创板", "broker": ["中信建投"], "date": "2025-11", "note": "2025-11 完成股改并与中信建投签辅导协议，浙江证监局备案；天普股份已明确 36 个月内无借壳安排。"}'::jsonb), updated_at = now() WHERE name = '中昊芯英';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "已上市", "board": "北交所", "broker": ["招商证券"], "date": "2026-04", "note": "2023-01 辅导备案（原拟科创板），2025-04 改道北交所、2025-06 辅导验收，2026 年公开发行 5,200 万股、募资 8.43 亿元，已挂牌（920186）。研究池 round 仍标 Pre-IPO，需更新为已上市。"}'::jsonb), updated_at = now() WHERE name = '中科仪';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "辅导完成", "board": "科创板", "broker": ["中信建投"], "date": "2026-06"}'::jsonb), updated_at = now() WHERE name = '中科信';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "已受理", "board": "科创板", "broker": ["国泰海通"], "date": "2026-03-31"}'::jsonb), updated_at = now() WHERE name = '中科宇航';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "已问询", "board": "创业板", "broker": ["中信证券"], "date": "2026-09-30"}'::jsonb), updated_at = now() WHERE name = '云豹智能';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "已受理", "board": "北交所", "broker": ["招商证券"]}'::jsonb), updated_at = now() WHERE name = '信联电科';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "已问询", "board": "科创板", "broker": ["东方证券"], "date": "2026-05-06"}'::jsonb), updated_at = now() WHERE name = '兆芯';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "已受理", "board": "创业板", "broker": ["国泰海通"], "date": "2026-11-27"}'::jsonb), updated_at = now() WHERE name = '光远新材';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "已问询", "board": "科创板", "broker": ["招商证券"], "date": "2026-09-18"}'::jsonb), updated_at = now() WHERE name = '华卓精科';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "辅导备案", "board": "科创板", "broker": ["国泰海通"], "date": "2026-08", "note": "2026-08-05 上海证监局辅导备案受理，预计 2027 年上半年递交申报材料。"}'::jsonb), updated_at = now() WHERE name = '图灵量子';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "辅导备案", "board": "科创板", "broker": ["国泰海通"], "date": "2026-02-02", "note": "湖南证监局备案，辅导期 2026-01 至 2026-06；律所中伦、会计师立信。"}'::jsonb), updated_at = now() WHERE name = '天仪空间';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "中止（财报更新）", "board": "科创板", "broker": ["中金公司"], "date": "2026-06-30", "note": "拟募 27.80 亿元投向 8/12 英寸碳化硅衬底；2026-07-14 已问询，2026-09-30 因财报过期中止。"}'::jsonb), updated_at = now() WHERE name = '天科合达';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "已问询", "board": "科创板", "broker": ["国泰海通"], "date": "2026-06-30"}'::jsonb), updated_at = now() WHERE name = '弥费科技';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "已受理", "board": "科创板", "broker": ["国泰海通"], "date": "2026-05-11"}'::jsonb), updated_at = now() WHERE name = '微纳星空';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "辅导备案", "board": "科创板", "broker": ["中金公司"], "date": "2026-04-29", "note": "A+H 双线：A 股 2026-04-29 北京证监局备案、2026-05-07 启动辅导（中金）；港股 2026-01-01 已保密递表，联席保荐中金、中信、华泰。现处保密申报阶段。"}'::jsonb), updated_at = now() WHERE name = '昆仑芯';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "已受理", "board": "北交所", "broker": ["中信建投"], "date": "2026-06-29"}'::jsonb), updated_at = now() WHERE name = '映日科技';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "辅导备案", "board": "科创板", "broker": ["中信建投"], "date": "2025-09-15", "note": "2025-09-15 安徽证监局辅导备案；2026 年初 Pre-IPO 轮投后估值逼近 240 亿元。"}'::jsonb), updated_at = now() WHERE name = '本源量子';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "已问询", "board": "科创板", "broker": ["申港证券"], "date": "2026-05-11", "note": "拟募 5.6 亿元；2023-06 首报科创板、2025-10-31 撤回，2026-05-11 二度申报受理。"}'::jsonb), updated_at = now() WHERE name = '株洲科能';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "已问询", "board": "北交所", "broker": ["华泰联合"], "date": "2026-06-25", "note": "2026-06-25 北交所受理，2026-09-28 已回复首轮问询。"}'::jsonb), updated_at = now() WHERE name = '永志股份';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "中止（财报更新）", "board": "创业板", "broker": ["中信证券"], "date": "2023-03-07", "note": "2022-09 浙江证监局辅导备案，2023-03-07 深交所受理、拟募 60 亿元；截至 2026-09-30 已第 7 次因财报过期中止，卡点在分拆独立性。"}'::jsonb), updated_at = now() WHERE name = '海康机器人';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "辅导完成", "board": "科创板", "broker": ["中信证券"], "date": "2025-07-18"}'::jsonb), updated_at = now() WHERE name = '瀚博半导体';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "辅导备案", "board": "科创板", "broker": ["华泰联合"], "date": "2022-10-20", "note": "2022-10-20 签辅导协议，至 2024-01 已披露第五期进展报告，尚未申报。此前市场误传国信证券、五矿证券，实为股东。"}'::jsonb), updated_at = now() WHERE name = '灵动微电子';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "已受理", "board": "科创板", "broker": ["广发证券"], "date": "2026-03-31"}'::jsonb), updated_at = now() WHERE name = '环动科技';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "辅导备案", "board": "科创板", "broker": ["国泰海通"], "date": "2026-07-06"}'::jsonb), updated_at = now() WHERE name = '玻色量子';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "已问询", "board": "科创板", "broker": ["国泰海通"], "date": "2026-11-17"}'::jsonb), updated_at = now() WHERE name = '神州股份';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "辅导备案", "board": "科创板", "broker": ["长江证券"], "date": "2026-05-12"}'::jsonb), updated_at = now() WHERE name = '科峰智能';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "辅导备案", "board": "科创板", "broker": ["中信证券"], "date": "2025-04-29"}'::jsonb), updated_at = now() WHERE name = '紫光同创';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "辅导备案", "board": "科创板", "broker": ["国泰海通"], "date": "2025-06-27"}'::jsonb), updated_at = now() WHERE name = '紫光展锐';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "注册生效", "board": "科创板", "broker": ["国泰海通"], "date": "2026-10-27", "note": "2026-06-30 受理、2026-08 过会（受理至上会 106 天），拟募 18.3 亿元，2026-10-27 注册生效。"}'::jsonb), updated_at = now() WHERE name = '羲禾科技';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "已问询", "board": "创业板", "broker": ["中金公司"], "date": "2026-06-16", "note": "拟募 30.21 亿元；适用创业板第四套标准。股东含国元、天风、方正、华西、广发、粤开等券商系资本合计约 4.91%。"}'::jsonb), updated_at = now() WHERE name = '腾盾科创';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "终止", "board": "科创板", "broker": ["国泰君安"], "date": "2025-12-19", "note": "2022-12-19 签辅导协议，2023-05-09 受理、拟募 7 亿元，2025-08-01 上会，2025-12-19 撤回终止。"}'::jsonb), updated_at = now() WHERE name = '节卡机器人';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "辅导完成", "board": "科创板", "broker": ["中信证券"], "date": "2025-02-07"}'::jsonb), updated_at = now() WHERE name = '芯和半导体';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "已受理", "board": "科创板", "broker": ["中信建投"], "date": "2026-03-31"}'::jsonb), updated_at = now() WHERE name = '莱普科技';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "已问询", "board": "科创板", "broker": ["中金公司"], "date": "2025-12-31", "note": "2025-07 辅导备案、2025-12 完成验收，2025-12-31 受理，拟募 75 亿元；2026-01-22 首轮问询，2026-06-29 恢复问询。"}'::jsonb), updated_at = now() WHERE name = '蓝箭航天';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "已受理", "board": "创业板", "broker": ["国信证券"], "date": "2026-06-24"}'::jsonb), updated_at = now() WHERE name = '锦艺新材';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "辅导筹备", "board": "科创板", "broker": ["中金公司"], "date": "2026", "note": "2022-12 曾获科创板受理（保荐海通证券）、拟募 26.83 亿元，2024-12 主动撤回；2026 年初重启，改聘中金公司，2026-07 完成近 50 亿元融资、投后估值约 230 亿元。"}'::jsonb), updated_at = now() WHERE name = '长光卫星';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "辅导备案", "board": "科创板", "broker": ["开源证券", "中金公司"], "date": "2026-04-26", "note": "2024-08 首次由中信建投备案；2026-04-23 重新报送、04-26 受理，改为开源证券与中金公司联席辅导，会计师毕马威华振。"}'::jsonb), updated_at = now() WHERE name = '阜阳欣奕华';
UPDATE public.research_companies SET data = data || jsonb_build_object('ipo', '{"stage": "已问询", "board": "科创板", "broker": ["中信证券"], "date": "2026-06-30"}'::jsonb), updated_at = now() WHERE name = '鲁汶仪器';

UPDATE public.research_companies SET round = 'IPO 终止' WHERE name = '节卡机器人';
UPDATE public.research_companies SET round = '创业板已受理' WHERE name = '海康机器人';
UPDATE public.research_companies SET round = '北交所已上市' WHERE name = '中科仪';
UPDATE public.research_companies SET round = 'IPO 辅导' WHERE name = '长光卫星';

-- 统一两家早期手工录入的 ipo 结构（原为 status/sponsors/raise 口径，前端已做兼容，此处对齐 stage/broker/note）
UPDATE public.research_companies
SET data = data || jsonb_build_object('ipo', '{"date": "2026-09-02", "board": "港交所主板 18C", "structure": "已股改；拆除开曼 VIE、注册地迁回境内", "preIpoValuation": "500 亿美元", "stage": "已保密递表（A1）", "broker": ["中金公司", "高盛"], "note": "拟募 30–50 亿美元，目标 2027Q1 挂牌；美银、德银参与；18C 章特专科技公司"}'::jsonb),
    updated_at = now()
WHERE name = '月之暗面';

UPDATE public.research_companies
SET data = data || jsonb_build_object('ipo', '{"stage": "未启动", "structure": "境外平台 Pingu Tech Limited 经华封集芯（北京）科技发展 100% 持股", "preIpoValuation": "未披露（A 轮粗算投后约 45.5 亿元）"}'::jsonb),
    updated_at = now()
WHERE name = '华封集芯';
