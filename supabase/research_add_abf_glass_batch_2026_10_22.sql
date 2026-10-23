-- 载板/玻璃基板链补入 10 家企业（ABF 与玻璃基板研究）
-- 生成日期：2026-10-22
-- 产业链挂载：src/research/data.ts 的「封装测试 › IC 载板」（礼鼎、三星电机、景硕、东普雷、LG Innotek、方邦股份）、
--             「半导体材料 › 玻璃基板」（TCL科技、迈科科技）、「封装测试 › 后道设备 › 先进封装设备」（帝尔激光、东威科技）
-- 说明：data 字段整体以 jsonb 写入；执行前请按 name 核对是否已存在，避免重复

INSERT INTO research_companies (name, code, industry, seg, listed, round, last_funding, data)
VALUES (
  "礼鼎半导体", "—", "semiconductor", "material", false, "战略投资", null,
  $json${"name": "礼鼎半导体", "code": "—", "industry": "semiconductor", "seg": "material", "listed": false, "round": "战略投资", "last_funding": null, "data": {"seg": "material", "code": "—", "desc": "臻鼎科技旗下 ABF 载板厂，已实现规模化量产，深圳大幅扩产，2030 年前厂房将超 7 座。", "name": "礼鼎半导体", "tech": [{"date": "2026", "kind": "产能", "title": "深圳基地大幅扩产，规划 2030 年前厂房超 7 座"}], "round": "战略投资", "detail": "【定位】礼鼎半导体为臻鼎科技（鹏鼎控股母公司体系）旗下 IC 载板事业主体，主攻 ABF 载板，是国内少数已实现 ABF 载板规模化量产的厂商。鹏鼎控股直接持股 13.72%。\\n【产能】深圳为主要基地并大规模扩产，规划到 2030 年总厂房数量超过 7 座；被业内列为未来有能力大规模扩产的少数玩家之一（另两家为 AT&S、欣兴电子）。\\n【定位判断】与深南电路、兴森科技相比，礼鼎的量产经验与台系背景更强，且背靠臻鼎的 PCB 客户资源，是国产 ABF 载板里最被低估的一家；但其客户结构与 AI 产品占比未公开。\\n【风险】① 未上市，财务与客户结构不透明；② 扩产节奏依赖母公司资本开支；③ 高层数 AI 载板的认证进度未披露。", "listed": false, "funding": [], "industry": "semiconductor", "latestTech": "深圳基地大幅扩产，规划 2030 年前厂房超 7 座"}}$json$::jsonb
);

INSERT INTO research_companies (name, code, industry, seg, listed, round, last_funding, data)
VALUES (
  "三星电机", "009150.KS", "semiconductor", "material", true, "已上市", null,
  $json${"name": "三星电机", "code": "009150.KS", "industry": "semiconductor", "seg": "material", "listed": true, "round": "已上市", "last_funding": null, "data": {"seg": "material", "code": "009150.KS", "desc": "韩国 SEMCO，全球 ABF 载板主要供应商之一（份额约 9%），4.27 万亿韩元史上最大扩产；玻璃基板 GlaSSEM 合资主导者。", "name": "三星电机", "tech": [{"date": "2026-07", "kind": "资本", "title": "与住友化学东宇精细化学成立 GlaSSEM，注册资本 4821 亿韩元，持股 66.2%"}, {"date": "2026", "kind": "产能", "title": "宣布 4.27 万亿韩元史上最大 ABF 扩产，2027Q3 投产"}], "round": "已上市", "detail": "【定位】三星电机（Samsung Electro-Mechanics，009150.KS）是三星集团旗下电子零部件公司，ABF 载板全球份额约 9%，与 Ibiden、欣兴、AT&S、Shinko 同列前五；在 AI 载板上受益三星内部需求与 AMD 合作。\\n【产能与扩产】2026 年宣布 4.27 万亿韩元（约 30 亿美元）史上最大规模投资，用于 ABF 基板扩产，基地为世宗与越南，计划 2027Q3 形成新增产能，目标 2.5 万块基板面板/月、总产出提升约 35%。\\n【玻璃基板】2026-07 与住友化学旗下东宇精细化学签署合资合同成立 GlaSSEM（注册资本 4821 亿韩元，三星电机持股 66.2%），目标 2027 财年下半年建立玻璃芯供货体系。但其送测的 TGV 样品在高低温循环与湿热老化中出现形变、微孔导通不稳，可靠性未过，量产时间可能推迟到 2028 之后。\\n【客户】AMD（同产品良率与 Ibiden 接近）、谷歌 TPU（约 30% 份额）、三星内部。\\n【风险】① AI 产品供应占比仍不高；② 玻璃基板可靠性问题未解决，合资公司进度存在不确定性；③ 存储与被动元件业务周期性影响整体利润。", "listed": true, "funding": [], "industry": "semiconductor", "latestTech": "与住友化学东宇精细化学成立 GlaSSEM，注册资本 4821 亿韩元，持股 66.2%"}}$json$::jsonb
);

INSERT INTO research_companies (name, code, industry, seg, listed, round, last_funding, data)
VALUES (
  "景硕", "3189.TW", "semiconductor", "material", true, "已上市", null,
  $json${"name": "景硕", "code": "3189.TW", "industry": "semiconductor", "seg": "material", "listed": true, "round": "已上市", "last_funding": null, "data": {"seg": "material", "code": "3189.TW", "desc": "台系 IC 载板厂（和硕集团），ABF 月产能 4000 万颗，2027 年扩至 5000 万颗、2029 年 8000 万颗。", "name": "景硕", "tech": [{"date": "2026", "kind": "产能", "title": "ABF 月产能 4000 万颗，规划 2029 年达 8000 万颗"}], "round": "已上市", "detail": "【定位】景硕科技（Kinsus，3189.TW）为和硕集团旗下 IC 载板厂，ABF 载板月产能约 4000 万颗（约 8 万㎡/月，16 层折算），全球份额约 5%，属第二梯队但与英伟达等大客户绑定。\\n【扩产】2026 年底 ABF 月产能约 4000 万颗，2027 年增至 5000 万颗（+25%），2028 年 6500 万颗、2029 年 8000 万颗；幼狮厂由 1000 万颗倍增至 2000 万颗；新增产能集中于桃园杨梅六厂、K6C/D 厂，并寻找 K7、K8 用地。资本开支 2026 年约 140 亿台币、2027 年 160 亿、2028 年 180–200 亿台币，另追加 235 亿台币设备预算。\\n【结构】BT 载板稼动率约 75%，预计 2026 年底回升至 85%，暂无新增 BT 产能计划；资源集中投 ABF。\\n【风险】① 技术层级略低于欣兴，极高端产品能力有限；② 扩产受 T-glass 玻纤布供给约束；③ 台系同业（欣兴、南亚）同步扩产，价格竞争加剧。", "listed": true, "funding": [], "industry": "semiconductor", "latestTech": "ABF 月产能 4000 万颗，规划 2029 年达 8000 万颗"}}$json$::jsonb
);

INSERT INTO research_companies (name, code, industry, seg, listed, round, last_funding, data)
VALUES (
  "帝尔激光", "300776.SZ", "semiconductor", "equipment", true, "已上市", null,
  $json${"name": "帝尔激光", "code": "300776.SZ", "industry": "semiconductor", "seg": "equipment", "listed": true, "round": "已上市", "last_funding": null, "data": {"seg": "equipment", "code": "300776.SZ", "desc": "TGV 激光改质设备国内龙头，已取得成套订单与客户复购，是玻璃基板链上最先确认收入的环节。", "name": "帝尔激光", "tech": [{"date": "2026-08", "kind": "订单", "title": "TGV 激光改质设备持续取得订单与收入，出现改质+刻蚀成套订单及客户复购"}], "round": "已上市", "detail": "【定位】帝尔激光（300776.SZ）原以光伏激光加工设备为主，近年将激光改质技术延伸至 TGV（玻璃通孔）成孔，是国内玻璃基板设备端最领先的厂商之一。\\n【进展】2026 年 8 月投资者交流披露：TGV 激光改质设备持续取得订单和收入，已出现“激光改质 + 刻蚀”成套订单，并出现玻璃基板客户复购需求；同时布局刻蚀、AOI 检测等配套设备，AOI 处于验证阶段。可提供单机或整线方案。\\n【逻辑】玻璃基板产业化中，设备订单先于基板收入出现——基板厂还在客户验证，设备已随建线交付。帝尔是这一环节国产替代最直接的受益者。\\n【风险】① 光伏设备主业周期下行，拖累整体业绩；② TGV 订单绝对规模仍小，尚不足以对冲光伏；③ 估值偏高（2026-06 市值约 368 亿元、PE(TTM) 约 74 倍），题材属性强。", "listed": true, "funding": [], "industry": "semiconductor", "latestTech": "TGV 激光改质设备持续取得订单与收入，出现改质+刻蚀成套订单及客户复购"}}$json$::jsonb
);

INSERT INTO research_companies (name, code, industry, seg, listed, round, last_funding, data)
VALUES (
  "迈科科技", "—", "semiconductor", "material", false, "A 轮", "2025-10",
  $json${"name": "迈科科技", "code": "—", "industry": "semiconductor", "seg": "material", "listed": false, "round": "A 轮", "last_funding": "2025-10", "data": {"seg": "material", "code": "—", "desc": "成都迈科（TGV 3.0），全球唯一同时具备晶圆级与板级 TGV 生产能力的厂商，客户含华为海思、英伟达、AMD、博通。", "name": "迈科科技", "tech": [{"date": "2025-10", "kind": "资本", "title": "完成亿元级 A 轮，元禾璞华、隐山资本、成都交子金控等参与"}, {"date": "2026-08", "kind": "产能", "title": "与崇州经开区签约三叠纪光电项目，投向光模块、硅光、CPO"}], "round": "A 轮", "detail": "【定位】成都迈科科技有限公司，2017 年成立，电子科技大学成果转化企业，国家高新技术企业、四川省专精特新、国家重点研发计划牵头单位。围绕玻璃通孔（TGV）技术做玻璃基三维封装基板、3D 微结构玻璃与 Chiplet 三维集成。\\n【技术】行业内最早开展 TGV 研发的第一梯队，提出 TGV3.0 概念，率先突破亚 10 微米通孔与垂直互连；板级实现 10:1 深径比金属化填铜。产品包括 Panel 级 AI 算力芯片 TGV Glass Core、310×310mm 玻璃基 Interposer（RDL 4-2-4、L/S 2/2μm）、Wafer 级多层 RDL 转接板、玻璃基 FAU（精度 ≤0.3μm）、折叠屏玻璃背板、IPD 无源器件。\\n【产能】东莞松山湖设生产基地三叠纪（广东），成都崇州明湖科创园设研发与中试基地三叠纪（四川）；为国际上唯一同时具备晶圆级和板级 TGV 生产能力的单位。\\n【资本】2025-10 完成亿元级 A 轮（元禾璞华、隐山资本（普洛斯）、成都交子金控、成都高投创投、励石创投），累计融资约 1.73 亿元；2026-08 与崇州经开区签约“三叠纪光电”项目，投向光模块、硅光、光引擎、CPO。\\n【客户】华为海思、京东方、长电科技、安捷利美维、三星、英伟达、AMD、博通、盛美、华星光电、中国电科、肖特 AG。\\n【风险】① 仍处中试向量产跨越阶段，良率与产能爬坡未验证；② 累计融资仅 1.7 亿元，扩产资金压力大；③ 玻璃基板整体产业化在 2028 后，短期收入有限；④ 设备部分依赖自研与外购，产能弹性受限。", "listed": false, "funding": [{"inv": "元禾璞华、隐山资本（普洛斯）、成都交子金控、成都高投创投、励石创投", "date": "2025-10", "round": "A 轮", "amount": "亿元级"}], "industry": "semiconductor", "latestTech": "完成亿元级 A 轮，元禾璞华、隐山资本、成都交子金控等参与", "lastFunding": "2025-10"}}$json$::jsonb
);

INSERT INTO research_companies (name, code, industry, seg, listed, round, last_funding, data)
VALUES (
  "东威科技", "688700.SH", "semiconductor", "equipment", true, "已上市", null,
  $json${"name": "东威科技", "code": "688700.SH", "industry": "semiconductor", "seg": "equipment", "listed": true, "round": "已上市", "last_funding": null, "data": {"seg": "equipment", "code": "688700.SH", "desc": "TGV 电镀与 PVD、RDL 设备供应商，2026H1 新增 TGV 设备订单，配套玻璃通孔金属化环节。", "name": "东威科技", "tech": [{"date": "2026-06", "kind": "订单", "title": "2026H1 新增 TGV 设备订单 1 台，2025 年 PVD/TGV/RDL 设备已交付"}], "round": "已上市", "detail": "【定位】东威科技（688700.SH）以电镀设备起家（PCB 垂直连续电镀），近年延伸至 TGV 电镀、PVD 与 RDL 设备，服务高端 SiP 与高算力芯片封装。\\n【进展】2025 年 PVD、TGV 及 RDL 设备已交付客户；2026 年上半年新增 TGV 设备订单 1 台。玻璃基板相关设备可应用于半导体封装，配套玻璃通孔金属化这一当前最大瓶颈环节。\\n【逻辑】TGV 金属化（填铜）是玻璃基板量产的最大卡点，电镀设备是必需环节；东威与天承科技（填孔化学品）构成“设备+药水”组合。\\n【风险】① TGV 订单规模仍小、以台计；② 主业 PCB 电镀设备随下游资本开支波动；③ 玻璃基板量产时点若后移，订单兑现节奏同步推迟。", "listed": true, "funding": [], "industry": "semiconductor", "latestTech": "2026H1 新增 TGV 设备订单 1 台，2025 年 PVD/TGV/RDL 设备已交付"}}$json$::jsonb
);

INSERT INTO research_companies (name, code, industry, seg, listed, round, last_funding, data)
VALUES (
  "TCL科技", "000100.SZ", "semiconductor", "material", true, "已上市", null,
  $json${"name": "TCL科技", "code": "000100.SZ", "industry": "semiconductor", "seg": "material", "listed": true, "round": "已上市", "last_funding": null, "data": {"seg": "material", "code": "000100.SZ", "desc": "华星推进玻璃基封装，攻关 TGV 填铜与多膜层应力，2026H2 展示样品并启动中试平台。", "name": "TCL科技", "tech": [{"date": "2026", "kind": "产品动态", "title": "计划 2026H2 展示玻璃基封装样品并启动中试平台筹建"}], "round": "已上市", "detail": "【定位】TCL 科技（000100.SZ）通过旗下华星光电推进玻璃基封装载板，是面板企业切入半导体先进封装的第二家（第一家为京东方）。\\n【进展】已组建专业团队，与目标客户联合攻关 TGV 填铜、多膜层应力控制及玻璃深加工；计划 2026 年下半年展示样品并启动中试研发平台筹建。\\n【优势】大尺寸玻璃处理、薄膜沉积与图形化能力可复用于玻璃芯载板，与面板产线设备同源，是面板厂做玻璃基板的天然优势。\\n【风险】① 进度落后京东方约 1–2 年，尚处样品与中试筹备；② 半导体级玻璃原片仍依赖康宁、AGC 等；③ 面板主业资本开支大，玻璃基板投入优先级存在不确定性。", "listed": true, "funding": [], "industry": "semiconductor", "latestTech": "计划 2026H2 展示玻璃基封装样品并启动中试平台筹建"}}$json$::jsonb
);

INSERT INTO research_companies (name, code, industry, seg, listed, round, last_funding, data)
VALUES (
  "方邦股份", "688020.SH", "semiconductor", "material", true, "已上市", null,
  $json${"name": "方邦股份", "code": "688020.SH", "industry": "semiconductor", "seg": "material", "listed": true, "round": "已上市", "last_funding": null, "data": {"seg": "material", "code": "688020.SH", "desc": "国内少数做载体可剥离超薄铜箔的厂商，替代三井金属 MicroThin（全球 95%），已过多家客户测试、小批量订单。", "name": "方邦股份", "tech": [{"date": "2025", "kind": "产品动态", "title": "可剥铜通过多家客户测试认证，取得小批量订单"}], "round": "已上市", "detail": "【定位】方邦股份（688020.SH）原以电磁屏蔽膜为主，近年布局带载体可剥离超薄铜箔（载体铜箔），主要用于 IC 载板精细线路。\\n【逻辑】高端 IC 载板线宽线距向 10/10μm 演进，mSAP 工艺需要 ≤3μm 超薄铜层、低表面粗糙度与稳定剥离控制。全球该材料 95% 以上由三井金属 MicroThin 供应，是载板链上又一个“单点垄断”环节。\\n【进展】据公司 2025 年报，可剥铜相关型号已陆续通过多家下游客户测试认证，并持续取得小批量订单，处于技术验证向商业化放量过渡阶段。\\n【风险】① 载板厂验证周期长，放量节奏取决于深南、兴森等客户上量；② 屏蔽膜主业增长乏力；③ 与三井金属在一致性与批次稳定性上仍有差距。", "listed": true, "funding": [], "industry": "semiconductor", "latestTech": "可剥铜通过多家客户测试认证，取得小批量订单"}}$json$::jsonb
);

INSERT INTO research_companies (name, code, industry, seg, listed, round, last_funding, data)
VALUES (
  "东普雷", "7911.T", "semiconductor", "material", true, "已上市", null,
  $json${"name": "东普雷", "code": "7911.T", "industry": "semiconductor", "seg": "material", "listed": true, "round": "已上市", "last_funding": null, "data": {"seg": "material", "code": "7911.T", "desc": "日本 Toppan（凸版印刷），FC-BGA 载板新潟新线已投产、产能约翻倍，新加坡厂 2026 末启动。", "name": "东普雷", "tech": [{"date": "2025-12", "kind": "产能", "title": "新潟 FC-BGA 新线投产，产能约翻倍"}], "round": "已上市", "detail": "【定位】东普雷（Toppan，7911.T）是日本印刷与电子材料巨头，IC 载板业务以 FC-BGA 为主，客户覆盖 CPU/GPU 与网络芯片。\\n【产能】2025-12 新潟 FC-BGA 新线投产，使该厂产能约翻倍；新加坡厂计划 2026 年末启动，贴近东南亚封测基地。\\n【行业位置】属第二梯队，份额低于 Ibiden、Shinko、欣兴，但在 FC-BGA 与玻璃基板配套（玻璃芯加工）上均有布局。\\n【风险】① 载板业务占集团收入比重小，业绩弹性被印刷主业稀释；② 扩产节奏偏保守；③ 日系厂商普遍涨价意愿弱。", "listed": true, "funding": [], "industry": "semiconductor", "latestTech": "新潟 FC-BGA 新线投产，产能约翻倍"}}$json$::jsonb
);

INSERT INTO research_companies (name, code, industry, seg, listed, round, last_funding, data)
VALUES (
  "LG Innotek", "011070.KS", "semiconductor", "material", true, "已上市", null,
  $json${"name": "LG Innotek", "code": "011070.KS", "industry": "semiconductor", "seg": "material", "listed": true, "round": "已上市", "last_funding": null, "data": {"seg": "material", "code": "011070.KS", "desc": "韩国 LG 旗下，玻璃基板 2028 年量产目标，龟尾试线已建成；嵌入式 FC-BGA（含硅电容）2027 年目标。", "name": "LG Innotek", "tech": [{"date": "2026-09", "kind": "产品动态", "title": "公告 2027 年 AI 加速器用 FC-BGA 量产目标；玻璃基板 2028 年目标"}], "round": "已上市", "detail": "【定位】LG Innotek（011070.KS）为 LG 集团电子零部件公司，光学模组（摄像头）为最大业务，近年沿 FC-BGA 能力延伸至玻璃芯封装基板。\\n【玻璃基板】流程覆盖 TGV、金属镀覆、多层增层及分割；龟尾试线已建成，与玻璃精密加工企业 UTI 合作开发玻璃强化技术；量产目标 2028 年。\\n【FC-BGA】2026-09 公告提出 2027 年 AI 加速器用 FC-BGA 量产目标（与玻璃基板为两个不同产品）；已展示嵌入式 FC-BGA（内嵌硅电容）方案。\\n【风险】① 玻璃基板业务尚处试线阶段；② 摄像头模组主业受手机周期影响大；③ 韩国同业（三星电机、SKC/Absolics）进度更快。", "listed": true, "funding": [], "industry": "semiconductor", "latestTech": "公告 2027 年 AI 加速器用 FC-BGA 量产目标；玻璃基板 2028 年目标"}}$json$::jsonb
);
