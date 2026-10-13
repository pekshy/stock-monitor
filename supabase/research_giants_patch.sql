-- 半导体产业链国际巨头补充（104 家）
-- 与 src/research/data.ts 中带 note 字段的条目一致
-- 幂等：可重复执行，data 整包覆盖

insert into research_companies (name, code, industry, seg, listed, data)
values ('阿斯麦','ASML.US','semiconductor','equipment',true,'{"name":"阿斯麦","code":"ASML.US","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":6889,"rev":374.4,"pe":57.2,"gross":52.7,"revGrowth":21,"desc":"全球唯一 EUV 光刻机供应商，光刻设备绝对垄断者，先进制程（7nm 及以下）EUV 市占率 100%，DUV 亦居主导。产品覆盖 EUV（含 High-NA EXE:5000）、DUV 浸没式 ArF、干式 KrF/ArF 与量检测。客户为台积电、三星、英特尔、SK 海力士、美光等全球全部先进晶圆厂。2025 年出货 327 台设备，其中 48 台 EUV。FY2025 营收 327 亿欧元、净利 96 亿欧元。中国区受出口管制影响，占比已降至约 20%。","latestTech":"High-NA EUV（EXE:5000）量产交付推进 2nm 逻辑制程；2025 年出货 327 台，其中 EUV 48 台","tech":[],"funding":[],"spark":[3200,4800,5600,6889],"note":"光刻设备全球垄断，国产上海微电子 28nm DUV 攻关中，与 ASML 存在代差"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('泛林','LRCX.US','semiconductor','equipment',true,'{"name":"泛林","code":"LRCX.US","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":3974,"rev":172.2,"pe":55.1,"gross":50.5,"revGrowth":30,"desc":"全球刻蚀设备龙头，与东京电子并列刻蚀双雄，同时在薄膜沉积（CVD/ALD/PECVD）与晶圆清洗上占据领先地位。等离子刻蚀（介质刻蚀 Flex、导体刻蚀 Kiyo、TSV 刻蚀 Syndion）为全球第一。3D NAND 高纵深刻蚀与 HBM/先进封装为增长核心，客户覆盖三星、SK 海力士、美光、台积电、中芯国际。FY2026 Q4（截至 2026-06-28）营收 67.2 亿美元（+30%）。","latestTech":"Vantex 介质刻蚀平台推动 3D NAND 向 300+ 层扩展；TSV 刻蚀 Syndion 受益 HBM 与 CoWoS 升级","tech":[],"funding":[],"spark":[2100,2900,3400,3974],"note":"刻蚀设备全球第一，国产中微公司（介质刻蚀）/北方华创（硅刻蚀）为主要对标"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('科磊','KLAC.US','semiconductor','equipment',true,'{"name":"科磊","code":"KLAC.US","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":2558,"rev":121.6,"pe":53.1,"gross":61.3,"revGrowth":15,"desc":"全球量检测（Process Control）设备绝对龙头，光学检测、缺陷分析、电子束量测与掩膜版检测合计全球份额超 49%，是晶圆厂良率管理最核心的供应商。产品线覆盖明场/暗场晶圆检测、套刻量测、薄膜厚度量测、掩膜版检测与量测。客户覆盖全球所有头部晶圆厂与存储厂。FY2026 Q4（截至 2026-06-30）营收 36.58 亿美元（+15%）。","latestTech":"过程控制/光学检测/电子束缺陷分析全球份额 >49%；面向 2nm 与 HBM 的检测需求驱动增长","tech":[],"funding":[],"spark":[1400,1900,2200,2558],"note":"量检测设备全球垄断，国产中科飞测/精测电子/睿励科学仪器加速替代"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('东京电子','8035.T','semiconductor','equipment',true,'{"name":"东京电子","code":"8035.T","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":1225.7,"rev":206,"pe":37.9,"gross":46,"revGrowth":33,"desc":"日本最大半导体设备厂商，涂胶显影机（Coater/Developer）全球市占率超 85%，与光刻机联机作业近乎垄断；同时在刻蚀、薄膜沉积、清洗与晶圆探针台领域位居全球前三。是先进 EUV 光刻胶工艺环节不可绕过的设备商。客户覆盖台积电、三星、SK 海力士、美光、中芯国际。FY2027 Q1（截至 2026-06-30）营收 7,323 亿日元（+33%）。","latestTech":"先进 EUV 光刻胶加工用涂胶显影机份额 >85%；刻蚀与沉积同步受益 HBM 与 3D NAND","tech":[],"funding":[],"spark":[760,950,1050,1225],"note":"涂胶显影近乎垄断，国产芯源微在前道实现突破；刻蚀对手为泛林"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('爱德万','6857.T','semiconductor','equipment',true,'{"name":"爱德万","code":"6857.T","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":1142.3,"rev":83.8,"pe":59.6,"gross":65.7,"revGrowth":44.8,"desc":"全球半导体测试设备（ATE）龙头，SoC 测试机（V93000）与 HBM/存储测试机全球市占率第一，是 HBM4 与 AI 芯片测试的核心瓶颈供应商。产品覆盖 SoC 测试、存储测试、系统级测试（SLT）与电子束量测。客户为台积电、三星、SK 海力士、美光及全球封测厂。FY2026 Q2 营收 1,162 亿日元（+15%）。","latestTech":"SoC 与 HBM（HBM3E/HBM4）自动测试设备全球主导，AI 芯片测试需求驱动增长","tech":[],"funding":[],"spark":[600,780,900,1142],"note":"测试机全球第一，国产长川科技/华峰测控在模拟与功率测试机突破"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('迪恩士','7735.T','semiconductor','equipment',true,'{"name":"迪恩士","code":"7735.T","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":114.6,"rev":24.3,"pe":20.9,"revGrowth":15.5,"desc":"日本 SCREEN Holdings，全球单片湿法清洗设备龙头，清洗与去胶设备份额全球领先，覆盖前道清洗、去胶灰化与湿法刻蚀。同时在半导体与显示设备布局，客户包括三星、台积电、SK 海力士。FY2026 Q2 营收 1,235 亿日元（+24%），营业利润环比 +79%。","latestTech":"单片晶圆湿式清洗与 strip 处理系统全球领先，受益 DRAM/HBM 扩产","tech":[],"funding":[],"spark":[65,82,95,114],"note":"清洗设备全球领先，国产盛美上海/至纯科技/富乐德对标替代"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('迪思科','6146.T','semiconductor','equipment',true,'{"name":"迪思科","code":"6146.T","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":456.1,"rev":52,"pe":40.4,"revGrowth":39.7,"desc":"日本 DISCO，全球晶圆切割/研磨/抛光设备垄断者，晶圆划片机与研磨机市占率约 70%，是先进封装（CoWoS、HBM 堆叠）与 SiC 衬底加工的关键设备商。独特「设备+耗材」模式（刀片、磨轮）带来高盈利。FY2026 净利润增速约 39.7%。","latestTech":"晶圆划片/研磨设备市占率约 70%，充分受益 HBM4 与 CoWoS 升级，耗材模式高盈利","tech":[],"funding":[],"spark":[220,290,350,456],"note":"切割研磨设备近乎垄断，国产特思迪（减薄磨抛）/京仪装备对标"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('国际电气','6525.T','semiconductor','equipment',true,'{"name":"国际电气","code":"6525.T","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":94.1,"rev":16,"pe":49.1,"revGrowth":18.2,"desc":"日本 Kokusai Electric，全球批量式（Batch）原子层沉积（ALD）与氧化/扩散炉管设备龙头，在 3D NAND 与 DRAM 高纵深结构的薄膜沉积环节份额领先，是存储扩产核心设备商。客户为三星、SK 海力士、美光、铠侠。","latestTech":"批量式 ALD 与氧化扩散炉管设备全球领先，深度绑定 3D NAND 与 DRAM 扩产","tech":[],"funding":[],"spark":[55,68,80,94],"note":"批量 ALD 炉管龙头，国产拓荆科技/屹唐股份在热处理与沉积环节对标"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('雷泰光学','6920.T','semiconductor','equipment',true,'{"name":"雷泰光学","code":"6920.T","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":212.9,"rev":18.5,"pe":38,"revGrowth":29.2,"desc":"日本 Lasertec，全球 EUV 掩膜版缺陷检测设备近乎垄断供应商，EUV 掩膜坯缺陷检测（ACTIS 系列）市占率超 90%，同时供应掩膜版修复与晶圆检测设备。是 EUV 光刻生态中最关键的检测卡点。","latestTech":"EUV 掩膜版缺陷检测设备近乎垄断，份额 >90%；AI 驱动的 EUV 掩膜需求持续放量","tech":[],"funding":[],"spark":[120,160,190,213],"note":"EUV 掩膜检测垄断，国产掩膜检测设备尚处起步阶段"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('尼康','7731.T','semiconductor','equipment',true,'{"name":"尼康","code":"7731.T","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":4.5,"rev":48.3,"revGrowth":-0.3,"desc":"日本尼康，老牌半导体光刻机厂商，曾是全球光刻机王者，现聚焦成熟制程（ArF 干式/浸没式）与功率半导体、MEMS、先进封装用光刻设备。EUV 赛道已彻底退出（研发失败）。2025 财年营收 7,152 亿日元（-0.3%）、营业利润暴跌 93.9% 至 24 亿日元；半年仅出货 9 台成熟制程光刻机，横滨工厂关闭。市值约 600-700 亿日元，不足 ASML 的 2%。正与大型半导体厂合作开发新一代 ArF 浸没式系统（计划 2028 交付原型机）。","latestTech":"聚焦成熟制程 ArF 与功率/MEMS/先进封装光刻；新一代 ArF 浸没式系统计划 2028 交付原型机","tech":[],"funding":[],"spark":[12,9,6,4.5],"note":"光刻机老牌王者已退出先进制程，国产上海微电子在 28nm DUV 上直接对标"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('佳能','7751.T','semiconductor','equipment',true,'{"name":"佳能","code":"7751.T","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":244,"rev":293,"revGrowth":2,"desc":"日本佳能，全球唯一的纳米压印光刻（NIL）设备供应商，走与 EUV 差异化路线，NIL 研发成本约为 EUV 的十分之一。在 DUV 光刻与 FPD 曝光设备亦有布局。2026 年初宣布突破性晶圆平坦化技术，预计 2027 年商用。市值约 244 亿美元，高于尼康。","latestTech":"押注纳米压印光刻（NIL）路线，2026 年突破晶圆平坦化技术、预计 2027 年商用","tech":[],"funding":[],"spark":[180,205,225,244],"note":"NIL 路线唯一供应商，与 ASML 的 EUV 形成技术分叉，国产天仁微纳在纳米压印赛道对标"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('泰瑞达','TER.US','semiconductor','equipment',true,'{"name":"泰瑞达","code":"TER.US","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":615,"rev":33,"pe":18.7,"revGrowth":3,"desc":"美国 Teradyne，全球第二大半导体测试设备（ATE）厂商，在模拟、混合信号、功率与射频测试领域领先，同时在机器人（UR 协作机器人、MiR 移动机器人）业务布局。AI 与汽车半导体测试为增长点。","latestTech":"模拟/混合信号/功率测试机全球领先，AI 与车规半导体测试需求驱动","tech":[],"funding":[],"spark":[350,420,490,615],"note":"ATE 全球第二，国产华峰测控（模拟测试机）/长川科技对标"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('奥托创新','ONTO.US','semiconductor','equipment',true,'{"name":"奥托创新","code":"ONTO.US","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":142,"rev":11,"pe":32,"desc":"美国 Onto Innovation，先进封装与晶圆量检测设备商，在 2.5D/3D 封装检测、薄膜量测与光刻配套设备上具备竞争力，受益 CoWoS 与 HBM 扩产。同时供应先进封装用光刻与检测设备。","latestTech":"2.5D/3D 先进封装检测与薄膜量测设备，受益 CoWoS/HBM 升级","tech":[],"funding":[],"spark":[85,105,125,142],"note":"先进封装检测设备商，国产中科飞测在检测环节对标"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('MKS 仪器','MKSI.US','semiconductor','equipment',true,'{"name":"MKS 仪器","code":"MKSI.US","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":175,"rev":36,"pe":27,"desc":"美国 MKS Instruments，半导体设备核心子系统与零部件龙头，产品覆盖真空（MKS/Atlas）、射频电源（ENI）、激光、光学与过程控制仪表，是应用材料、泛林、东京电子等设备大厂的关键上游供应商。","latestTech":"真空/射频电源/激光等设备核心子系统全球领先，为 WFE 大厂的共同上游","tech":[],"funding":[],"spark":[110,130,150,175],"note":"设备核心零部件龙头，国产富创精密/新莱应材/先锋精科在零部件环节对标"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('新思科技','SNPS.US','semiconductor','eda',true,'{"name":"新思科技","code":"SNPS.US","industry":"semiconductor","seg":"eda","market":"US","listed":true,"cap":9770,"desc":"全球第一大 EDA 厂商，2024 年收购 Ansys 后覆盖芯片设计到仿真全流程，与楷登电子合计占全球 EDA 市场 60% 以上。同时是全球最大高速接口 IP（PCIe/DDR/USB/以太网）供应商。","latestTech":"收购 Ansys 后形成设计—仿真全流程平台；接口 IP 市占率全球第一","tech":[],"funding":[],"spark":[5800,6900,8200,9770],"note":"全球 EDA 第一，国产对标华大九天（国内唯一数字全流程 EDA）/概伦电子"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('楷登电子','CDNS.US','semiconductor','eda',true,'{"name":"楷登电子","code":"CDNS.US","industry":"semiconductor","seg":"eda","market":"US","listed":true,"cap":9710,"desc":"全球第二大 EDA 厂商，FY2025 营收 52.97 亿美元，在模拟/定制设计、验证 IP 与硬件仿真（Palladium）领域领先。","latestTech":"模拟/定制设计与硬件仿真领先，AI 驱动的验证工具需求增长","tech":[],"funding":[],"spark":[5200,6400,7800,9710],"note":"与 Synopsys 并列全球前二，国产对标华大九天、概伦电子、合见工软"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('西门子 EDA','SIE.DE','semiconductor','eda',true,'{"name":"西门子 EDA","code":"SIE.DE","industry":"semiconductor","seg":"eda","market":"US","listed":true,"cap":null,"desc":"原 Mentor Graphics，隶属西门子数字化工业软件，在 DFT（Tessent）、光学邻近效应校正（OPC/Calibre）及先进封装设计领域全球领先。","latestTech":"Calibre OPC 与 Tessent DFT 全球领先，覆盖先进封装设计","tech":[],"funding":[],"spark":[],"note":"西门子集团整体市值约 2140 亿美元，EDA 仅其中一块；国产对标广立微（良率/DFT）"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('ARM','ARM.US','semiconductor','eda',true,'{"name":"ARM","code":"ARM.US","industry":"semiconductor","seg":"eda","market":"US","listed":true,"cap":32310,"desc":"全球第一 CPU IP 供应商，基于 Arm 架构的芯片累计出货超 3000 亿颗，智能手机应用处理器市占率超 99%，正加速渗透服务器与 PC（自研 CSS 平台）。","latestTech":"移动/嵌入式 IP 生态绝对主导，切入数据中心与 AI PC","tech":[],"funding":[],"spark":[19000,24000,28000,32310],"note":"CPU IP 绝对主导，国产对标芯原股份、平头哥（玄铁）、芯来科技"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('Imagination','—','semiconductor','eda',false,'{"name":"Imagination","code":"—","industry":"semiconductor","seg":"eda","market":"US","listed":false,"cap":null,"desc":"英国 GPU/NPU IP 供应商，曾长期为苹果、联发科提供 GPU IP，现聚焦汽车与云游戏。2017 年被凯桥资本私有化。","latestTech":"GPU/NPU IP 授权，聚焦汽车智能座舱与云游戏","tech":[],"funding":[],"spark":[],"note":"GPU IP 主要玩家，国产对标芯原股份、兆芯 GPU IP"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('Rambus','RMBS.US','semiconductor','eda',true,'{"name":"Rambus","code":"RMBS.US","industry":"semiconductor","seg":"eda","market":"US","listed":true,"cap":1140,"desc":"高速内存接口 IP 与 DDR5/HBM 控制器 IP 龙头，并供应内存接口芯片（RCD/MRDIMM），AI 服务器需求驱动业绩高增。","latestTech":"DDR5/HBM 控制器 IP 与内存接口芯片领先，AI 服务器驱动高增","tech":[],"funding":[],"spark":[600,750,950,1140],"note":"内存接口 IP 领先，国产对标澜起科技（内存接口芯片）/芯原"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('英伟达','NVDA.US','semiconductor','design',true,'{"name":"英伟达","code":"NVDA.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":565000,"desc":"全球 GPU 与 AI 加速芯片绝对龙头，数据中心 GPU 市占率约 90%，为首家市值突破 5 万亿美元的公司。产品覆盖 Hopper/Blackwell/Rubin 架构加速卡、CUDA 生态与网络（NVLink/InfiniBand）。","latestTech":"Blackwell/Rubin 架构迭代，数据中心 GPU 市占约 90%，CUDA 生态壁垒深厚","tech":[],"funding":[],"spark":[300000,380000,450000,565000],"note":"AI 芯片霸主，国产对标华为昇腾、寒武纪、海光信息、摩尔线程"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('AMD','AMD.US','semiconductor','design',true,'{"name":"AMD","code":"AMD.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":99270,"desc":"全球第二大 GPU/CPU 厂商，EPYC 服务器 CPU 份额持续提升，MI 系列数据中心加速卡为英伟达主要挑战者；2022 年收购赛灵思后成为全球最大 FPGA 厂商。","latestTech":"MI 系列加速卡挑战英伟达；EPYC 服务器 CPU 份额提升","tech":[],"funding":[],"spark":[60000,72000,85000,99270],"note":"x86 与 GPU 双线，国产对标海光信息、寒武纪"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('英特尔','INTC.US','semiconductor','design',true,'{"name":"英特尔","code":"INTC.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":52680,"desc":"老牌 CPU 巨头，PC/服务器 x86 处理器市占率长期领先，Gaudi AI 加速器与数据中心 GPU 布局，推进 IDM 2.0 转型（Intel Foundry），旗下 Altera 为全球第二大 FPGA 厂商、Mobileye 布局自动驾驶。","latestTech":"18A/14A 节点推进；Gaudi 加速器与 Foveros 封装技术布局","tech":[],"funding":[],"spark":[45000,38000,42000,52680],"note":"x86 阵营核心，国产对标海光、龙芯、兆芯、紫光同创"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('高通','QCOM.US','semiconductor','design',true,'{"name":"高通","code":"QCOM.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":18430,"desc":"全球智能手机 SoC 龙头，骁龙系列为安卓旗舰标配，并推出骁龙 X 系列进军 PC 处理器，汽车与物联网业务快速增长。","latestTech":"骁龙 X 系列切入 AI PC，汽车座舱与智驾芯片放量","tech":[],"funding":[],"spark":[14000,16000,17500,18430],"note":"移动 SoC 龙头，国产对标紫光展锐、联发科（台）"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('苹果','AAPL.US','semiconductor','design',true,'{"name":"苹果","code":"AAPL.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":4900000,"desc":"自研 M 系列（Mac）与 A 系列（iPhone）芯片，采用台积电最先进制程，是垂直整合自研芯片的全球标杆；同时自研 5G 基带与 AI 加速单元。","latestTech":"M 系列/A 系列自研芯片采用台积电 3nm/2nm，垂直整合标杆","tech":[],"funding":[],"spark":[3000000,3500000,4200000,4900000],"note":"自研处理器标杆，国产对标华为海思麒麟、龙芯"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('三星电子','005930.KS','semiconductor','design',true,'{"name":"三星电子","code":"005930.KS","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":135000,"desc":"韩国三星电子，全球最大存储芯片厂商（DRAM/NAND 份额均居第一），同时自研 Exynos 手机 SoC，并是唯一具备 3nm GAA 量产能力的台积电外代工厂。","latestTech":"HBM3E/HBM4 量产，3nm GAA 代工，Exynos SoC 自研","tech":[],"funding":[],"spark":[110000,120000,128000,135000],"note":"存储全球第一，国产对标长鑫存储、长江存储"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('SK 海力士','000660.KS','semiconductor','design',true,'{"name":"SK 海力士","code":"000660.KS","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":118200,"desc":"全球第二大 DRAM 厂商，HBM 市占率约 50-70% 居首，为英伟达 AI 芯片核心 HBM 供应商，2026 年 HBM4 率先量产。","latestTech":"HBM4 全球率先量产，绑定英伟达 Rubin 平台","tech":[],"funding":[],"spark":[90000,105000,112000,118200],"note":"HBM 绝对龙头，国产对标长鑫存储（HBM 国产化推进中）"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('美光','MU.US','semiconductor','design',true,'{"name":"美光","code":"MU.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":121000,"desc":"美国唯一存储大厂，DRAM 全球第三、NAND 全球前五，HBM3E/HBM4 已量产并供应英伟达，AI 服务器驱动业绩高增。","latestTech":"HBM3E/HBM4 量产供应英伟达；1γ DRAM 与 G9 NAND 推进","tech":[],"funding":[],"spark":[85000,98000,110000,121000],"note":"存储三巨头之一，国产对标长鑫存储、长江存储"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('铠侠','285A.T','semiconductor','design',true,'{"name":"铠侠","code":"285A.T","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":18660,"desc":"日本铠侠（原东芝存储），全球 NAND Flash 主要厂商之一，2024 年上市，与西部数据共享四日市与北上工厂产线。","latestTech":"BiCS FLASH 3D NAND 堆叠层数持续提升","tech":[],"funding":[],"spark":[12000,15000,17000,18660],"note":"NAND 重要厂商，国产对标长江存储"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('德州仪器','TXN.US','semiconductor','design',true,'{"name":"德州仪器","code":"TXN.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":25910,"desc":"全球最大模拟芯片厂商，产品超 8 万种，工业与汽车为核心市场，自建 12 英寸晶圆厂以压低成本。","latestTech":"12 英寸模拟晶圆自建产能扩张，成本优势显著","tech":[],"funding":[],"spark":[18000,21000,23000,25910],"note":"模拟芯片全球第一，国产对标圣邦股份、思瑞浦、杰华特"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('亚德诺','ADI.US','semiconductor','design',true,'{"name":"亚德诺","code":"ADI.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":19630,"desc":"全球第二大模拟芯片厂商，高性能信号链与电源管理领先，收购 Maxim 后规模进一步扩大。","latestTech":"高性能信号链与电源管理领先，工业与汽车为主战场","tech":[],"funding":[],"spark":[14000,17000,18500,19630],"note":"模拟第二极，国产对标圣邦股份、思瑞浦"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('英飞凌','IFX.DE','semiconductor','design',true,'{"name":"英飞凌","code":"IFX.DE","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":9200,"desc":"欧洲英飞凌，全球汽车半导体与功率半导体双料龙头，车规 MCU（AURIX）与 IGBT/SiC 器件领先，功率半导体市占率约 13% 全球第一。","latestTech":"AURIX 车规 MCU 与 SiC MOSFET 领先，绑定新能源汽车","tech":[],"funding":[],"spark":[6500,7500,8400,9200],"note":"车规/功率全球第一，国产对标士兰微、斯达半导、时代电气"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('意法半导体','STM.US','semiconductor','design',true,'{"name":"意法半导体","code":"STM.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":4600,"desc":"欧洲意法半导体，MCU（STM32 系列）、功率器件（SiC MOSFET 车规领先）与 MEMS 传感器全球领先，自建 SiC 衬底产能。","latestTech":"STM32 通用 MCU 龙头；SiC MOSFET 车规份额领先","tech":[],"funding":[],"spark":[3500,4000,4300,4600],"note":"MCU+功率综合厂商，国产对标兆易创新、士兰微、三安光电"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('恩智浦','NXPI.US','semiconductor','design',true,'{"name":"恩智浦","code":"NXPI.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":5800,"desc":"全球汽车半导体主要厂商，车用 MCU、车载网络（CAN/LIN 收发器）与安全芯片领先，电子车钥匙与车载网关强势。","latestTech":"车规 MCU 与车载网络芯片领先，软件定义汽车受益","tech":[],"funding":[],"spark":[4500,5100,5500,5800],"note":"车规芯片领先，国产对标兆易创新、比亚迪半导体"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('瑞萨','6723.T','semiconductor','design',true,'{"name":"瑞萨","code":"6723.T","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":7120,"desc":"日本瑞萨，全球车用 MCU 龙头（市占率约 30%），收购 Dialog 与 Altium 后拓展模拟、电源与电子设计软件能力。","latestTech":"车用 MCU 市占率第一；收购 Altium 强化系统设计能力","tech":[],"funding":[],"spark":[5200,6000,6600,7120],"note":"车规 MCU 龙头，国产对标兆易创新、中颖电子、芯海科技"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('微芯','MCHP.US','semiconductor','design',true,'{"name":"微芯","code":"MCHP.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":4110,"desc":"全球 8 位/16 位 MCU 领先厂商（PIC/AVR 系列），模拟与嵌入式混合信号组合广泛，旗下 Microsemi 提供抗辐照军工级 FPGA。","latestTech":"PIC/AVR MCU 领先；Microsemi 抗辐照 FPGA 供军用","tech":[],"funding":[],"spark":[3800,3600,3900,4110],"note":"MCU/模拟厂商，国产对标兆易创新、中颖电子、复旦微电"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('安森美','ON.US','semiconductor','design',true,'{"name":"安森美","code":"ON.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":3020,"desc":"全球车用图像传感器（CIS）与功率半导体重要厂商，SiC 器件快速放量，主攻新能源汽车与工业。","latestTech":"车用 CIS + 功率器件 + SiC 布局","tech":[],"funding":[],"spark":[2800,2500,2700,3020],"note":"汽车 CIS+功率，国产对标韦尔股份、士兰微"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('MPS','MPWR.US','semiconductor','design',true,'{"name":"MPS","code":"MPWR.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":6810,"desc":"美国 Monolithic Power Systems，高性能电源管理芯片领先厂商，数据中心（AI 供电）与汽车电源为主要增长点。","latestTech":"数据中心 AI 供电与汽车电源管理领先","tech":[],"funding":[],"spark":[4200,5100,5900,6810],"note":"高端电源管理，国产对标圣邦股份、杰华特、南芯科技"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('三菱电机','6503.T','semiconductor','design',true,'{"name":"三菱电机","code":"6503.T","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":6750,"desc":"日本三菱电机，功率半导体（IGBT 模块）在工业与轨道交通领域份额领先，同时布局 SiC 器件；集团业务含工业自动化、能源与轨交。（注：市值为集团整体）","latestTech":"IGBT 模块工业/轨交领先，SiC 模块推进","tech":[],"funding":[],"spark":[5200,5900,6300,6750],"note":"IGBT 模块领先，国产对标时代电气、斯达半导"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('富士电机','6504.T','semiconductor','design',true,'{"name":"富士电机","code":"6504.T","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":2150,"desc":"日本富士电机，功率半导体重要厂商，IGBT 与 SiC 模块供应工业、新能源与汽车。（注：市值为集团整体）","latestTech":"IGBT/SiC 模块供应工业与新能源","tech":[],"funding":[],"spark":[1700,1900,2050,2150],"note":"功率模块厂商，国产对标时代电气、士兰微"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('罗姆','6963.T','semiconductor','design',true,'{"name":"罗姆","code":"6963.T","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":1270,"desc":"日本罗姆，分立器件与 SiC 功率器件重要厂商，覆盖衬底、外延与器件垂直整合，车规 SiC 布局积极。","latestTech":"SiC 垂直整合（衬底—外延—器件），车规 SiC 推进","tech":[],"funding":[],"spark":[1150,1050,1180,1270],"note":"SiC 器件厂商，国产对标三安光电、天岳先进（衬底）"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('威世','VSH.US','semiconductor','design',true,'{"name":"威世","code":"VSH.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":520,"desc":"美国 Vishay，全球领先的分立器件与被动元件厂商，MOSFET、二极管、电阻电容产品线齐全。","latestTech":"分立器件与被动元件齐全，车规与工业应用广","tech":[],"funding":[],"spark":[420,460,490,520],"note":"分立器件厂商，国产对标扬杰科技、士兰微"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('思佳讯','SWKS.US','semiconductor','design',true,'{"name":"思佳讯","code":"SWKS.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":1320,"desc":"美国 Skyworks，全球射频前端龙头之一，为苹果等提供射频模组。2026 年宣布与 Qorvo 合并（约 220 亿美元），尚待中国监管批准。","latestTech":"射频前端模组领先；与 Qorvo 合并推进中","tech":[],"funding":[],"spark":[1500,1400,1350,1320],"note":"射频前端领先，国产对标卓胜微、唯捷创芯"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('Qorvo','QRVO.US','semiconductor','design',true,'{"name":"Qorvo","code":"QRVO.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":1030,"desc":"美国 Qorvo，射频前端主要厂商，手机与国防射频器件领先，正被 Skyworks 收购整合中。","latestTech":"射频前端与国防 RF 器件领先，被 Skyworks 收购中","tech":[],"funding":[],"spark":[1200,1100,1050,1030],"note":"射频前端厂商，国产对标卓胜微、唯捷创芯"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('博通','AVGO.US','semiconductor','design',true,'{"name":"博通","code":"AVGO.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":170000,"desc":"全球网络交换芯片（Tomahawk/Jericho）与定制 ASIC 龙头，数据中心以太网交换份额约 70%，同时射频滤波器（FBAR）市占率领先，AI 定制芯片（TPU 等）业务爆发。","latestTech":"Tomahawk 交换芯片与 AI 定制 ASIC 双轮驱动；FBAR 滤波器龙头","tech":[],"funding":[],"spark":[90000,115000,140000,170000],"note":"交换芯片/AI ASIC 龙头，国产对标盛科通信、寒武纪（ASIC）"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('美满','MRVL.US','semiconductor','design',true,'{"name":"美满","code":"MRVL.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":23970,"desc":"美国 Marvell，全球数据中心网络与存储控制器芯片龙头，定制 ASIC 与光电 DSP（800G/1.6T）领先，深度绑定云厂商。","latestTech":"定制 ASIC 与光模块 DSP（1.6T）领先，云厂商深度绑定","tech":[],"funding":[],"spark":[15000,18000,21000,23970],"note":"网络/存储控制器，国产对标盛科通信、澜起科技"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('瑞昱','2379.TW','semiconductor','design',true,'{"name":"瑞昱","code":"2379.TW","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":null,"desc":"中国台湾瑞昱，全球网卡/以太网芯片龙头，PC 网通、WiFi 与音效芯片份额领先。","latestTech":"以太网/WiFi 芯片份额领先","tech":[],"funding":[],"spark":[],"note":"以太网芯片厂商，国产对标盛科通信、裕太微"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('莱迪思','LSCC.US','semiconductor','design',true,'{"name":"莱迪思","code":"LSCC.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":1800,"desc":"美国 Lattice，全球第三大 FPGA 厂商，主打低功耗中小容量 FPGA，聚焦通信、工业与汽车。","latestTech":"低功耗中小容量 FPGA 领先","tech":[],"funding":[],"spark":[1400,1600,1700,1800],"note":"低功耗 FPGA 厂商，国产对标安路科技"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('台积电','TSM.US','semiconductor','fab',true,'{"name":"台积电","code":"TSM.US","industry":"semiconductor","seg":"fab","market":"US","listed":true,"cap":240000,"desc":"全球第一大晶圆代工厂，市占率约 64%，7nm 以下先进制程近乎垄断（约 90%），CoWoS 先进封装为 AI 芯片核心瓶颈。客户涵盖英伟达、苹果、AMD、高通、联发科等。","latestTech":"2nm（N2）量产推进；CoWoS 先进封装为 AI 芯片卡点","tech":[],"funding":[],"spark":[150000,185000,215000,240000],"note":"先进制程代工约 64% 份额，国产对标中芯国际（唯一先进制程代工）"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('格罗方德','GFS.US','semiconductor','fab',true,'{"name":"格罗方德","code":"GFS.US","industry":"semiconductor","seg":"fab","market":"US","listed":true,"cap":2630,"desc":"美国 GlobalFoundries，全球前五大代工厂，已放弃 7nm 以下先进制程，专注特色工艺（射频、电源、硅光）与车规。","latestTech":"专注特色工艺（RF/电源/硅光）与车规，放弃先进制程","tech":[],"funding":[],"spark":[2100,2300,2500,2630],"note":"成熟/特色代工，国产对标华虹公司"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('联电','UMC.US','semiconductor','fab',true,'{"name":"联电","code":"UMC.US","industry":"semiconductor","seg":"fab","market":"US","listed":true,"cap":5810,"desc":"中国台湾联电，全球第三大晶圆代工厂，聚焦成熟制程与特色工艺（28nm/22nm），客户覆盖驱动 IC、电源管理与通信。","latestTech":"成熟制程与特色工艺为主，22/28nm 扩产","tech":[],"funding":[],"spark":[4800,5200,5500,5810],"note":"成熟制程代工，国产对标华虹公司、晶合集成"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('世界先进','5347.TWO','semiconductor','fab',true,'{"name":"世界先进","code":"5347.TWO","industry":"semiconductor","seg":"fab","market":"US","listed":true,"cap":1160,"desc":"中国台湾世界先进（VIS），全球主要 8 英寸/12 英寸成熟制程代工厂，专注电源管理与显示驱动 IC。","latestTech":"8/12 英寸成熟制程，电源管理与驱动 IC 为主","tech":[],"funding":[],"spark":[950,1050,1100,1160],"note":"成熟制程代工，国产对标华虹公司、晶合集成"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('力积电','6770.TW','semiconductor','fab',true,'{"name":"力积电","code":"6770.TW","industry":"semiconductor","seg":"fab","market":"US","listed":true,"cap":1080,"desc":"中国台湾力积电，成熟制程代工厂，DRAM 与逻辑代工兼营。","latestTech":"成熟制程代工与 DRAM 兼营","tech":[],"funding":[],"spark":[900,980,1030,1080],"note":"成熟制程代工，国产对标华虹公司、士兰微"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('高塔半导体','TSEM.US','semiconductor','fab',true,'{"name":"高塔半导体","code":"TSEM.US","industry":"semiconductor","seg":"fab","market":"US","listed":true,"cap":2560,"desc":"以色列 Tower Semiconductor，全球领先的特色工艺代工厂，模拟、射频、电源与硅光（SiPh）平台突出，为 Intel 收购未果后的独立代工厂。","latestTech":"特色工艺（模拟/射频/硅光）领先","tech":[],"funding":[],"spark":[1800,2100,2350,2560],"note":"特色工艺代工，国产对标华虹公司、赛微电子"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('西部数据','WDC.US','semiconductor','fab',true,'{"name":"西部数据","code":"WDC.US","industry":"semiconductor","seg":"fab","market":"US","listed":true,"cap":null,"desc":"美国西部数据，全球硬盘（HDD）与 NAND 存储主要厂商，与铠侠共享 NAND 产能；NAND 业务已分拆为 SanDisk。","latestTech":"HDD 与 NAND 业务（NAND 已分拆至 SanDisk）","tech":[],"funding":[],"spark":[],"note":"NAND/HDD 厂商，国产对标长江存储"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('日月光','ASX.US','semiconductor','osat',true,'{"name":"日月光","code":"ASX.US","industry":"semiconductor","seg":"osat","market":"US","listed":true,"cap":10250,"desc":"中国台湾日月光投控（ASE），全球第一大封测厂，市占率约 30%，掌握 FOCoS、Fan-Out 等先进封装技术，承接台积电 CoWoS 溢出订单。","latestTech":"封测全球第一约 30%；FOCoS/Fan-Out 先进封装承接 CoWoS 溢出","tech":[],"funding":[],"spark":[7800,8800,9500,10250],"note":"封测全球第一，国产对标长电科技、通富微电、华天科技"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('安靠','AMKR.US','semiconductor','osat',true,'{"name":"安靠","code":"AMKR.US","industry":"semiconductor","seg":"osat","market":"US","listed":true,"cap":1270,"desc":"美国 Amkor，全球第二大封测厂，美国本土封测龙头，提供 2.5D/3D 与 SiP 先进封装，2026 年与台积电结盟在美国扩建先进封装产能。","latestTech":"2.5D/3D 与 SiP 先进封装；与台积电结盟在美扩产","tech":[],"funding":[],"spark":[950,1050,1150,1270],"note":"全球封测第二，国产对标长电科技、通富微电"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('力成科技','6239.TW','semiconductor','osat',true,'{"name":"力成科技","code":"6239.TW","industry":"semiconductor","seg":"osat","market":"US","listed":true,"cap":640,"desc":"中国台湾力成科技（Powertech），全球领先的内存封测厂，为美光、铠侠等提供存储封装测试。","latestTech":"存储封测领先，服务美光/铠侠等存储大厂","tech":[],"funding":[],"spark":[520,580,610,640],"note":"存储封测领先，国产对标深科技、太极实业"}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('信越化学','4063.T','semiconductor','material',true,'{"name":"信越化学","code":"4063.T","cap":6800,"desc":"全球半导体硅片绝对龙头，市占率约 26-28%，在 12 英寸高端硅片与 SOI 硅片领域技术与客户壁垒极高，同时是光刻胶、石英部件的重要供应商。","note":"信越+SUMCO 合计约占全球硅片 50%，国产沪硅产业/立昂微/西安奕材加速替代","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('胜高','3436.T','semiconductor','material',true,'{"name":"胜高","code":"3436.T","cap":820,"desc":"全球第二大硅片厂，市占率约 20-21%，主营抛光片、外延片与 SOI 片，客户覆盖台积电/三星/美光。2026 年主动收缩成熟制程转向先进制程。","note":"日系双雄之一，国产对标沪硅产业/中欣晶圆","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('环球晶圆','6488.TWO','semiconductor','material',true,'{"name":"环球晶圆","code":"6488.TWO","cap":1690,"desc":"全球第三大硅片厂，市占率约 16-17%，唯一在欧亚美三地均设厂，并购扩张能力强（曾并购 SunEdison 半导体）。","note":"台系龙头，对位国产沪硅产业","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('世创','WAF.DE','semiconductor','material',true,'{"name":"世创","code":"WAF.DE","cap":300,"desc":"德国 Siltronic，德国唯一半导体硅片制造商，全球市占率约 14%，主供欧洲汽车电子与工业半导体。","note":"欧洲硅片独苗，体量较日台小","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('SK Siltron','—','semiconductor','material',false,'{"name":"SK Siltron","code":"—","cap":null,"desc":"韩国唯一硅片厂，全球市占率约 10%，三星与 SK 海力士核心供应商，同时布局 SiC 衬底。SK 集团旗下未上市。","note":"韩系内供属性强，绑定本国存储双雄","industry":"semiconductor","seg":"material","market":"US","listed":false,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('IQE','IQE.L','semiconductor','material',true,'{"name":"IQE","code":"IQE.L","cap":80,"desc":"全球最大独立化合物半导体外延片供应商，覆盖 InP/GaAs/GaN/SiGe，服务 5G、光通信、激光器与 LED。","note":"化合物半导体外延全球龙头，国产对位立昂微/中科晶电","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('JSR','4185.T','semiconductor','material',true,'{"name":"JSR","code":"4185.T","cap":null,"desc":"半导体光刻胶全球第一梯队，ArF/EUV 胶份额领先，2024-25 年被日本产业革新机构 JIC 私有化收购。","note":"日系光刻胶四强（JSR/TOK/信越/住友）合计占全球约 70%，国产南大光电/彤程新材加速导入","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('东京应化','4186.T','semiconductor','material',true,'{"name":"东京应化","code":"4186.T","cap":750,"desc":"半导体光刻胶全球领先厂商，产品覆盖 g/i-Line 至 EUV 全系列，兼营涂胶显影工艺材料。","note":"与 JSR 并列全球光刻胶双雄，是国产 KrF/ArF 胶对标标杆","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('住友化学','4005.T','semiconductor','material',true,'{"name":"住友化学","code":"4005.T","cap":null,"desc":"高端光刻胶（含 EUV）主要供应商之一，同时在显示材料、偏光片等领域为全球龙头。","note":"日系光刻胶核心玩家，国产替代主要冲击其中低端份额","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('富士胶片','4901.T','semiconductor','material',true,'{"name":"富士胶片","code":"4901.T","cap":null,"desc":"通过并购切入半导体材料，在 EUV 光刻胶、CMP 材料、光刻配套化学品上具全球竞争力。","note":"跨环节巨头，同时覆盖光刻胶与 CMP，国产彤程/安集科技对标","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('凸版印刷','7911.T','semiconductor','material',true,'{"name":"凸版印刷","code":"7911.T","cap":890,"desc":"全球半导体掩膜版领先厂商之一，电子业务部门主营光掩膜、引线框架与彩色滤光片。","note":"日系掩膜版双雄之一，国产清溢光电/路维光电主攻中低端替代","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('大日本印刷','7912.T','semiconductor','material',true,'{"name":"大日本印刷","code":"7912.T","cap":840,"desc":"与凸版并列的日系光掩膜巨头，同时布局封装载板与显示材料。","note":"日系掩膜版另一极，高端掩膜版国产化率仍低","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('Photronics','PLAB.US','semiconductor','material',true,'{"name":"Photronics","code":"PLAB.US","cap":180,"desc":"全球最大独立第三方掩膜版制造商，在亚欧美营运 11 座工厂，服务 IC 与 FPD 掩膜。","note":"独立掩膜版龙头，与日系双雄三足鼎立，国产替代对标清溢光电","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('豪雅','7741.T','semiconductor','material',true,'{"name":"豪雅","code":"7741.T","cap":5450,"desc":"全球掩膜版基板（mask blanks）绝对龙头，IT 业务利润主要来自半导体掩膜基板与 HDD 玻璃盘片。","note":"掩膜版上游基板近乎垄断，是国产掩膜版产业链最难突破的卡点","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('英特格','ENTG.US','semiconductor','material',true,'{"name":"英特格","code":"ENTG.US","cap":2530,"desc":"美国 Entegris，全球 CMP 抛光液龙头（2022 年收购 CMC Materials），在抛光液、抛光垫与过滤净化材料上领先，兼营半导体材料输送与污染控制。","note":"CMP 耗材全球份额第一，国产安集科技（抛光液）/鼎龙股份（抛光垫）为主要替代者","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('林德','LIN.US','semiconductor','material',true,'{"name":"林德","code":"LIN.US","cap":22550,"desc":"全球最大工业气体集团，电子特气与现场制气服务覆盖全球主要晶圆厂，电子业务连续高增长。","note":"特气全球第一，国产华特气体/金宏气体在中小品种逐步替代","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('液化空气','AI.PA','semiconductor','material',true,'{"name":"液化空气","code":"AI.PA","cap":11000,"desc":"全球工业气体巨头之一，电子特气与超纯气体系统领先，电子业务在手订单创新高。","note":"欧系特气龙头，与林德、空气化工、大阳日酸构成全球特气四强","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('空气化工','APD.US','semiconductor','material',true,'{"name":"空气化工","code":"APD.US","cap":6800,"desc":"全球工业气体三巨头之一，为半导体厂提供电子特气与现场气体供应方案。","note":"美国特气主力，国产替代主要影响其中小气体品种份额","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('大阳日酸','4091.T','semiconductor','material',true,'{"name":"大阳日酸","code":"4091.T","cap":1500,"desc":"日本最大工业气体企业，电子特气在日韩台晶圆厂份额领先，亚洲特气主力供应商。","note":"亚系特气龙头，国产华特/南大光电对标其特气产品线","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('JX 金属','—','semiconductor','material',false,'{"name":"JX 金属","code":"—","cap":null,"desc":"全球半导体溅射靶材绝对龙头，市占率约 64-65%，铜/钽/钛/钨靶材及 InP 衬底均居全球前列。原 JX 日矿日石金属，2025 年独立 IPO 筹备中。","note":"靶材全球第一，国产江丰电子已进入全球第一梯队并加速替代","industry":"semiconductor","seg":"material","market":"US","listed":false,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('霍尼韦尔','HON.US','semiconductor','material',true,'{"name":"霍尼韦尔","code":"HON.US","cap":null,"desc":"原霍尼韦尔电子材料（已分拆至 Solstice Advanced Materials），超高纯铝/铜/钽/钛/钴靶材覆盖广，与国际主流 PVD 设备高度适配。","note":"美系靶材主力，国产江丰/有研新材对标","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('东曹','4042.T','semiconductor','material',true,'{"name":"东曹","code":"4042.T","cap":530,"desc":"日本东曹 Tosoh SMD，在铝/铜/钽/钛及合金靶材上积累深厚，颗粒控制能力突出，为国际一线晶圆厂长供。","note":"日系靶材重要一极，与 JX、霍尼韦尔共同主导高端靶材市场","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('默克','MRK.DE','semiconductor','material',true,'{"name":"默克","code":"MRK.DE","cap":6500,"desc":"德国默克电子科技，全球半导体前驱体龙头（ALD/CVD 前驱体份额约 29% 居首），业务同时覆盖光刻胶、湿电子化学品、CMP 与特气，是半导体材料综合平台型巨头。","note":"前驱体全球第一兼全环节平台，国产雅克科技/南大光电加速导入","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('DNF','092070.KS','semiconductor','material',true,'{"name":"DNF","code":"092070.KS","cap":null,"desc":"韩国半导体薄膜材料核心企业，CVD/ALD 前驱体韩本土份额领先，获三星战略投资绑定客户，DRAM 用前驱体地位突出。","note":"韩系前驱体主力，对位国产雅克科技","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('巴斯夫','BAS.DE','semiconductor','material',true,'{"name":"巴斯夫","code":"BAS.DE","cap":5160,"desc":"德国巴斯夫，全球化工巨头，电子材料业务覆盖湿电子化学品、CMP 与清洗液，主攻高端配方化学品。","note":"欧系湿化学品主力，国产晶瑞电材/江化微在中低端加速替代","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('关东化学','4047.T','semiconductor','material',true,'{"name":"关东化学","code":"4047.T","cap":null,"desc":"日本高纯试剂龙头，半导体用高纯度湿电子化学品（含超纯双氧水、显影液）主要供应商。","note":"日系超纯试剂代表，是国产湿化学品高端突破的对标对象","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('Stella Chemifa','4109.T','semiconductor','material',true,'{"name":"Stella Chemifa","code":"4109.T","cap":60,"desc":"全球高纯氢氟酸及氟系蚀刻液龙头，半导体级 BOE/HF 蚀刻液市占率全球领先。","note":"高纯氢氟酸全球龙头，国产多氟多/巨化股份在氟系化学品上对标替代","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('住友电木','4203.T','semiconductor','material',true,'{"name":"住友电木","code":"4203.T","cap":550,"desc":"全球半导体封装用环氧塑封料（EMC）龙头，兼供感光性晶圆涂覆树脂与基板材料。","note":"EMC 全球第一，国产华海诚科/飞凯材料加速替代封装材料","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('味之素','2802.T','semiconductor','material',true,'{"name":"味之素","code":"2802.T","cap":2130,"desc":"ABF 积层绝缘膜近乎垄断（份额 >95%），是高端 CPU/GPU 封装基板不可替代的核心材料，AI 芯片封装刚需。","note":"ABF 膜卡脖子环节，全球 AI 芯片封装刚需，国产尚无有效替代","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('纳美仕','—','semiconductor','material',false,'{"name":"纳美仕","code":"—","cap":null,"desc":"日本 Namics，全球半导体封装用底填胶（underfill）与时序胶龙头，在先进封装倒装/2.5D-3D 场景份额领先。未上市。","note":"先进封装底部填充胶龙头，国产德邦科技/华海诚科对标替代","industry":"semiconductor","seg":"material","market":"US","listed":false,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('3M','MMM.US','semiconductor','material',true,'{"name":"3M","code":"MMM.US","cap":null,"desc":"全球热界面材料（TIM）龙头之一，导热垫片/导热胶在数据中心与功率器件领域广泛应用。","note":"TIM 与导热材料全球领先，国产中石科技/飞荣达加速替代","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('汉高','HEN3.DE','semiconductor','material',true,'{"name":"汉高","code":"HEN3.DE","cap":3400,"desc":"德国汉高，全球电子胶粘与导热材料巨头，TIM、导电胶与封装胶粘剂在半导体与汽车电子领域份额领先。","note":"导热与胶粘剂全球龙头，国产回天新材/德邦科技对标替代","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('揖斐电','4062.T','semiconductor','material',true,'{"name":"揖斐电","code":"4062.T","cap":4300,"desc":"全球高端 FC-BGA/ABF 载板龙头，主供 Intel、NVIDIA 等顶级处理器的封装基板。","note":"最高端 ABF 载板领导者，国产深南电路/兴森科技加速载板替代","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('欣兴电子','3037.TW','semiconductor','material',true,'{"name":"欣兴电子","code":"3037.TW","cap":4900,"desc":"全球最大 ABF 载板制造商，深度绑定 NVIDIA/Apple，是台积电 CoWoS 先进封装关键一环。","note":"ABF 载板出货第一，是 AI 芯片封装核心卡点，国产深南/芯爱科技对标","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('南亚电路板','8046.TW','semiconductor','material',true,'{"name":"南亚电路板","code":"8046.TW","cap":950,"desc":"台塑集团旗下，ABF 载板与 HDI 板主要厂商，规模仅次于欣兴。","note":"台系载板第二，与欣兴共同承接 AI 服务器载板需求","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('AT&S','ATS.VI','semiconductor','material',true,'{"name":"AT&S","code":"ATS.VI","cap":300,"desc":"奥地利 AT&S，欧洲唯一高端 IC 载板龙头，主攻高端 FC-BGA 与模组封装，马来西亚 Kulim 厂扩产服务 AI 需求。","note":"欧系载板独苗，欧美供应链去风险主要受益者，国产对位深南电路","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('新光电气','—','semiconductor','material',false,'{"name":"新光电气","code":"—","cap":null,"desc":"日本 Shinko，高端 FC-BGA 封装基板领先厂商，2025 年被日本产业革新机构牵头财团私有化。","note":"日系高端载板第二极，与揖斐电共守最先进封装基板","industry":"semiconductor","seg":"material","market":"US","listed":false,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('康宁','GLW.US','semiconductor','material',true,'{"name":"康宁","code":"GLW.US","cap":13800,"desc":"全球显示玻璃基板龙头，正切入半导体先进封装用玻璃基板与载板，AI 光通信业务同步高增长。","note":"玻璃基板全球第一，在玻璃芯先进封装上卡位，国产凯盛科技等加速切入","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('AGC','5201.T','semiconductor','material',true,'{"name":"AGC","code":"5201.T","cap":null,"desc":"日本旭硝子，全球最大玻璃生产商之一，显示玻璃基板与合成石英玻璃（AQ 系列）供应半导体光刻与封装。","note":"日系玻璃巨头，与康宁双寡头垄断显示基板，国产彩虹股份/凯盛对标","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('肖特','—','semiconductor','material',false,'{"name":"肖特","code":"—","cap":null,"desc":"德国肖特，特种玻璃全球龙头，半导体级石英玻璃与玻璃载板供应先进封装，2024 年收购 QSIL 强化产能。未上市。","note":"欧系特种玻璃龙头，玻璃基板与光刻用石英为其卡位点","industry":"semiconductor","seg":"material","market":"US","listed":false,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('电气硝子','5214.T','semiconductor','material',true,'{"name":"电气硝子","code":"5214.T","cap":null,"desc":"日本电气硝子（NEG），全球显示玻璃基板三大供应商之一，同时在半导体封装用特种玻璃上布局。","note":"日系玻璃基板三强之一，与康宁/AGC 共占显示玻璃主要份额","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('迈图','—','semiconductor','material',false,'{"name":"迈图","code":"—","cap":null,"desc":"美国 Momentive Technologies，高纯熔融石英龙头，提供石英坩埚、管棒与部件，用于硅单晶生长与晶圆制程。未上市。","note":"石英部件全球龙头，国产石英股份/菲利华加速替代高纯石英耗材","industry":"semiconductor","seg":"material","market":"US","listed":false,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('贺利氏','—','semiconductor','material',false,'{"name":"贺利氏","code":"—","cap":null,"desc":"德国 Heraeus Covantics，高纯熔融石英与合成石英部件全球领先，服务 CVD/扩散/退火等半导体高温制程。未上市。","note":"欧系石英部件龙头，与迈图/东曹共占高端石英件主要份额","industry":"semiconductor","seg":"material","market":"US","listed":false,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('日本特殊陶业','5334.T','semiconductor','material',true,'{"name":"日本特殊陶业","code":"5334.T","cap":null,"desc":"日本 NGK，全球领先的精细陶瓷厂商，半导体用陶瓷静电吸盘（ESC）与精密陶瓷部件主要供应商。","note":"陶瓷部件（ESC 等）关键供应商，国产富创精密/珂玛科技对标替代","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('Wolfspeed','WOLF.US','semiconductor','material',true,'{"name":"Wolfspeed","code":"WOLF.US","cap":170,"desc":"全球 SiC 衬底与功率器件先驱，推进 200mm 平台并经历 Chapter 11 财务重组，获美国防部巨额贷款支持。","note":"SiC 衬底老牌龙头（重组中），国产天科合达/天岳先进加速 8 英寸替代","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('Coherent','COHR.US','semiconductor','material',true,'{"name":"Coherent","code":"COHR.US","cap":6880,"desc":"美国 Coherent（原 II-VI），全球最大 SiC 衬底供应商之一并自控外延，兼营 AI 光通信与光子器件业务。","note":"SiC 衬底与光通信双主业，国产天岳先进/天科合达在衬底环节对标","industry":"semiconductor","seg":"material","market":"US","listed":true,"latestTech":"","tech":[],"funding":[],"spark":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;
