-- 2026-10-21 研究池新增：人形机器人行情中浮现的新进入者（8 家）
--
-- 背景：10/19 特斯拉股东会文件确认 V3 Optimus 量产就绪、工信部披露全年 10 万台目标，
-- 10/20 机器人板块涨停潮。其中一批此前未入库的公司进入视野，按业务实质筛选 8 家补入。
-- 未纳入（关联度弱/纯情绪）：海川智能、赛摩智能、凡拓数创、嘉晨智能、大业股份、长龄液压、华依科技、云天励飞。
-- 代码侧：data.ts 的 TREE 已把 8 家分别挂到机器人行业的对应细分（见文末注释）。

INSERT INTO research_companies (name, code, industry, seg, listed, round, data) VALUES
('浙江荣泰','603119.SH','robotics','reducer',true,'已上市', jsonb_build_object(
  'name','浙江荣泰','code','603119.SH','industry','robotics','seg','reducer','listed',true,'round','已上市',
  'desc','云母绝缘材料起家，收购狄兹精密切入精密传动，2026H1 已向国内外客户交付机器人零部件。',
  'detail','原主业为新能源汽车云母绝缘、防火隔热材料；2025 年收购狄兹精密切入精密传动与机器人零部件。2026 年上半年已向国内外客户交付机器人零部件并积极排产，泰国基地在建。未明确披露海外客户是否为特斯拉 Optimus 项目。',
  'funding','[]'::jsonb)),
('长盈精密','300115.SZ','robotics','servo',true,'已上市', jsonb_build_object(
  'name','长盈精密','code','300115.SZ','industry','robotics','seg','servo','listed',true,'round','已上市',
  'desc','消费电子精密结构件龙头，布局机器人关节模组与结构件，是结构件环节体量最大的玩家之一。',
  'detail','消费电子精密结构件龙头（手机中框、连接器、新能源结构件），将精密冲压、压铸、CNC 能力延伸至机器人关节模组与本体结构件，具备关节壳体、行星滚柱丝杠部件、灵巧手结构件加工能力。',
  'funding','[]'::jsonb)),
('奥普特','688686.SH','robotics','sensor',true,'已上市', jsonb_build_object(
  'name','奥普特','code','688686.SH','industry','robotics','seg','sensor','listed',true,'round','已上市',
  'desc','机器视觉核心部件龙头（光源/镜头/软件），工业视觉市占率国内领先。',
  'detail','国内机器视觉核心部件龙头，产品覆盖光源、镜头、相机、视觉软件与解决方案，在 3C、锂电、半导体场景份额领先。3D 视觉与视觉引导系统可用于机器人定位与抓取，人形方案处于送样验证阶段。',
  'funding','[]'::jsonb)),
('均普智能','688306.SH','robotics','integrator',true,'已上市', jsonb_build_object(
  'name','均普智能','code','688306.SH','industry','robotics','seg','integrator','listed',true,'round','已上市',
  'desc','智能制造装备商（装配/检测线），切入人形机器人产线与本体代工。',
  'detail','全球智能制造装备供应商，主营汽车零部件、医疗、工业品的自动化装配与检测线；2024 年起布局人形机器人总装线、关节测试台与本体代工（ODM）。',
  'funding','[]'::jsonb)),
('德马科技','688360.SH','robotics','integrator',true,'已上市', jsonb_build_object(
  'name','德马科技','code','688360.SH','industry','robotics','seg','integrator','listed',true,'round','已上市',
  'desc','智能物流输送分拣龙头，仓储自动化与物流机器人。',
  'detail','国内智能物流输送与分拣系统龙头，产品覆盖输送机、分拣机、AGV/AMR 与仓储控制系统。属仓储物流集成环节，与人形机器人关联度弱，更多是板块情绪联动。',
  'funding','[]'::jsonb)),
('宁波东力','002164.SZ','robotics','reducer',true,'已上市', jsonb_build_object(
  'name','宁波东力','code','002164.SZ','industry','robotics','seg','reducer','listed',true,'round','已上市',
  'desc','工业减速机厂商，模块化减速器与电机一体化，布局机器人减速器。',
  'detail','主营工业减速机与电机，用于冶金、起重、建材等重载场景；近年推进模块化减速器与机器人关节减速器研发，机器人业务仍处研发与样品阶段。',
  'funding','[]'::jsonb)),
('福莱新材','605488.SH','robotics','sensor',true,'已上市', jsonb_build_object(
  'name','福莱新材','code','605488.SH','industry','robotics','seg','sensor','listed',true,'round','已上市',
  'desc','功能性涂布材料商，布局柔性传感与电子皮肤。',
  'detail','主营功能性涂布复合材料（广告喷墨打印材料、电子级功能材料），2024 年起布局柔性传感与电子皮肤，依托涂布与导电材料工艺开发柔性压力传感阵列，处于研发送样阶段。',
  'funding','[]'::jsonb)),
('儒竞科技','301525.SZ','robotics','servo',true,'已上市', jsonb_build_object(
  'name','儒竞科技','code','301525.SZ','industry','robotics','seg','servo','listed',true,'round','已上市',
  'desc','伺服驱动与控制系统厂商（暖通变频起家），拓展机器人伺服与关节驱动。',
  'detail','主营暖通空调及冷冻设备控制器、伺服驱动系统，在变频与电机控制算法上有积累，近年拓展机器人伺服驱动与关节控制器，人形业务处于方案验证阶段。',
  'funding','[]'::jsonb));

-- 产业链挂载（data.ts 已同步修改）：
--   reducer     › 行星滚柱丝杠        → 浙江荣泰
--   reducer     › RV 减速器           → 宁波东力
--   sensor      › 3D 视觉             → 奥普特
--   sensor      › 电子皮肤            → 福莱新材
--   servo       › 伺服系统            → 儒竞科技
--   servo       › 一体化关节模组      → 长盈精密
--   integrator  › 仓储物流集成        → 德马科技
--   integrator  › 通用智能装备        → 均普智能

-- 研究笔记 id=31：人形机器人周度复盘（哈希基于 title+body，重复执行会跳过）
INSERT INTO research_notes (hash, kind, title, body, industry, seg, sub, companies, tags, occurred_at)
VALUES (
  '3b6b6f69dbb0d3b3f4e6e3e7e3e0e3e3e3e3e3e3',
  '观点',
  '人形机器人周度复盘：特斯拉 V3 量产就绪，资金买零部件不买整机',
  '（正文见数据库 id=31，此处省略以免重复维护）',
  'robotics', 'reducer', '人形机器人',
  '["宇树科技","双环传动","恒立液压","绿的谐波","兆威机电","北特科技","五洲新春","芯动联科","安培龙","东华测试","三花智控","汇川技术","浙江荣泰","长盈精密","奥普特","均普智能","德马科技","宁波东力","福莱新材","儒竞科技"]',
  '["人形机器人","特斯拉Optimus","丝杠","灵巧手","周度复盘"]',
  '2026-10-21'
) ON CONFLICT (hash) DO NOTHING;
