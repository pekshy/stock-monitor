-- 半导体产业链细分领域国际龙头补充（68 家）
-- 对应 src/research/data.ts 新增条目
-- 幂等：可重复执行

insert into research_companies (name, code, industry, seg, listed, data)
values ('维易科','VECO.US','semiconductor','equipment',true,'{"name":"维易科","code":"VECO.US","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":3190,"rev":6.64,"pe":48.4,"gross":39.9,"revGrowth":-7.4,"desc":"美国MOCVD与化合物半导体外延设备龙头，在LED用MOCVD市场份额约15-24%。核心产品为TurboDisc EPIK、Lumina+（GaN-on-Si 300mm及Micro LED）、Propel 300mm GaN-on-SiC反应腔，以及EpiStride SiC外延CVD。主要客户包括三安光电、Coherent、Lumentum等激光及功率器件厂商。","latestTech":"2025年发布Lumina+并获Rocket Lab砷化镓/磷化铟航天级订单；2025年11月获Propel 300mm GaN-on-Si反应腔订单拓展Micro LED与功率应用。","spark":[11.9,13.2,15.6,31.9],"note":"国产对标中微公司(AMEC)与晶盛机电，中微在LED MOCVD已全球领先，但GaN功率器件与光通信外延国产化率不足10%。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('爱思强','AIXA.DE','semiconductor','equipment',true,'{"name":"爱思强","code":"AIXA.DE","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":4640,"rev":6.02,"pe":69.2,"gross":40,"revGrowth":-12,"desc":"德国化合物半导体沉积设备龙头，MOCVD全球份额约22-35%，在GaN/SiC功率及光电领域市占高达70-90%。核心产品为G10系列、AIX G5+ C、CRIUS平台，2025年以35%份额超越ASM成为SiC沉积设备全球第一。主要客户为英飞凌、意法半导体、台积电、Coherent、Lumentum。","latestTech":"2025年G10平台放量，光电领域营收增长；公司预计AI光互连驱动2026年营收约5.2亿欧元，SiC受EV放缓拖累承压。","spark":[1710,1950,3690,4640],"note":"国产对标中微公司(Prismo系列)与晶盛机电，GaN功率及SiC外延设备国产化率不足10%，MOCVD高端机型仍依赖进口。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('NuFlare','6256.T','semiconductor','equipment',true,'{"name":"NuFlare","code":"6256.T","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":1800,"rev":5.2,"pe":28,"gross":42,"revGrowth":10,"desc":"东芝旗下半导体设备商，除电子束光刻主业外，提供单晶圆外延反应腔，包括面向硅外延的HT2000FD及面向SiC的EPIREVO S6/S8，强调高生长速率与高质量外延膜，服务功率器件与化合物半导体产线。","latestTech":"EPIREVO S6/S8系列持续迭代，针对6/8英寸SiC外延片的高生长速率与低缺陷需求。","spark":[1400,1550,1700,1800],"note":"国产对标晶盛机电（SiC外延炉6/8英寸兼容），国产SiC外延设备处于验证导入期，良率与缺陷密度仍有差距。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('PSK','319660.KS','semiconductor','equipment',true,'{"name":"PSK","code":"319660.KS","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":2860,"rev":3.13,"pe":33.3,"gross":45,"revGrowth":14.9,"desc":"韩国KrF去胶设备龙头，自称全球干法去胶市场份额第一，核心产品SUPRA系列（SUPRA Vplus/N/Nm）覆盖bulk ash、RF bias、离子注入后去胶及新型硬掩模去胶，以低损伤、高选择比著称。2025年营收4572亿韩元，主要客户为三星、SK海力士。","latestTech":"2025年在SEMICON China展出SUPRA系列，主打bulk ash到RF bias全流程覆盖及低损伤高选择比。","spark":[1100,1400,1900,2860],"note":"国产对标屹唐股份，屹唐在干法去胶领域全球份额领先，与PSK形成直接竞争，先进节点硬掩模去胶为差距点。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('玛特森','—','semiconductor','equipment',false,'{"name":"玛特森","code":"—","industry":"semiconductor","seg":"equipment","market":"US","listed":false,"cap":null,"rev":null,"pe":null,"gross":null,"revGrowth":null,"desc":"美国去胶设备专业厂商（现属北京屹唐全资子公司，此处列其美国主体），核心产品SUPREMA系列干法去胶系统，采用ICP等离子体源与双腔设计，用于光刻胶去除及先进图形膜去除，主打低拥有成本，服务逻辑、代工与存储产线。","latestTech":"SUPREMA系列持续以ICP源+双腔架构推进低损伤、高选择比去胶，针对新型光刻胶需求升级。","spark":[500,620,700,780],"note":"该公司现为屹唐股份全资子公司，正是国产替代的核心载体；国际上仍是去胶设备主要玩家之一。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('Axcelis','ACLS.US','semiconductor','equipment',true,'{"name":"Axcelis","code":"ACLS.US","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":1300,"rev":9.3,"pe":12,"gross":44,"revGrowth":-12,"desc":"美国离子注入设备商，同时提供专用干法去胶技术，支持逻辑、存储及化合物半导体制造应用，在功率器件与成熟节点去胶领域具有一定份额。","latestTech":"围绕离子注入后去胶（post-implant strip）与功率半导体工艺持续优化专用去胶方案。","spark":[1600,1400,1200,1300],"note":"国产对标屹唐股份/中科信，国产去胶与注入后灰化在功率器件领域正加速替代。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('是德科技','KEYS.US','semiconductor','equipment',true,'{"name":"是德科技","code":"KEYS.US","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":65730,"rev":53.8,"pe":37.3,"gross":62.1,"revGrowth":8,"desc":"全球最大WAT（晶圆允收测试）设备供应商，在中国WAT测试机市场份额约73.4%，其4082机型为业界主流WAT测试机。核心产品为4080系列及4881HV高压晶圆测试系统，支持参数验证、PCM及WAT，涵盖硅光与3000V以下功率器件单次通过测试。主要客户为全球头部晶圆厂。","latestTech":"2024年10月推出4881HV高压晶圆测试系统，实现功率半导体WAT/PCM最高3kV单次通过参数测试。","spark":[45000,52000,60000,65730],"note":"国产对标广立微、联讯仪器，广立微T4000/T4100S已在国内12英寸产线量产应用，但Keysight仍占中国WAT市场约73%，国产化率不足15%。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('FormFactor','FORM.US','semiconductor','equipment',true,'{"name":"FormFactor","code":"FORM.US","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":11040,"rev":7.85,"pe":97.5,"gross":39.1,"revGrowth":2.8,"desc":"美国探针卡与探针台龙头，WAT参数测试系统主要玩家。核心产品为Pyramid Parametric系列参数测试方案、自动化探针台及各型探针卡，主打高精度DC参数量产测试与工艺监控，与Keysight、Keithley并列WAT领域第一梯队。","latestTech":"2025年9月为TESLA200/TESLA300探针台推出自主高功率测量助手，提升功率器件晶圆级测试精度与吞吐。","spark":[4500,5500,8000,11040],"note":"国产对标广立微、精测电子（探针台），国产探针台在成熟节点实现突破，先进节点探针卡仍以FormFactor等为主。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('吉时利','—','semiconductor','equipment',false,'{"name":"吉时利","code":"—","industry":"semiconductor","seg":"equipment","market":"US","listed":false,"cap":null,"rev":null,"pe":null,"gross":null,"revGrowth":null,"desc":"美国高精度源表（SMU）与参数测试仪器厂商（泰克旗下），WAT测试核心仪器供应商，其高精度源表与开关矩阵广泛用于晶圆级参数测试，与Keysight、FormFactor共同主导全球WAT设备第一梯队（泰克为丹纳赫旗下私营公司，未单独上市）。","latestTech":"持续迭代高精度源表与低漏电流开关矩阵，支持亚飞安级电流与高精度C-V表征，服务3nm以下WAT需求。","spark":[3000,3400,3800,4200],"note":"国产对标广立微（并行测试技术）、联讯仪器，国产高精度SMU/AWG仪器仍高度依赖进口。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('旺矽','6223.TW','semiconductor','equipment',true,'{"name":"旺矽","code":"6223.TW","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":4200,"rev":8.5,"pe":30,"gross":50,"revGrowth":25,"desc":"中国台湾探针台与探针卡龙头，提供与参数化WAT配置兼容的先进晶圆探测系统，用于半导体工艺控制与允收测试，在探针卡及光电测试领域具全球竞争力。","latestTech":"推进高频与光电（硅光）晶圆级探测方案，配合先进节点参数测试需求升级。","spark":[2600,3100,3700,4200],"note":"国产对标广立微、精测电子，探针台国产化率仍较低，台湾旺矽/Cascade为高端探针台主要供应商。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('SCREEN 迪恩士','7735.T','semiconductor','equipment',true,'{"name":"SCREEN 迪恩士","code":"7735.T","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":12000,"rev":39,"pe":26.3,"gross":37.5,"revGrowth":-3.1,"desc":"日本半导体设备厂商（迪恩士），激光退火设备市场第二，份额约12-18%。在高温激光退火细分领域占有率约30%，产品用于功率半导体与先进逻辑激活退火，支持200/300mm晶圆兼容，是晶圆清洗龙头之外的明星增长业务。","latestTech":"2025年持续投入激光退火系统模块化产能与宽晶圆兼容性，瞄准功率器件与先进逻辑20%的市场增速。","spark":[9000,10200,11000,12000],"note":"国产对标上海微电子、华卓精科，国产激光退火在功率半导体领域开始导入，先进逻辑退火仍由AMAT/SCREEN主导。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('EO Technics','039030.KS','semiconductor','equipment',true,'{"name":"EO Technics","code":"039030.KS","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":2600,"rev":4.5,"pe":28,"gross":42,"revGrowth":15,"desc":"韩国最大激光加工设备商，晶圆激光打标系统全球份额约11-17%，位居前列。核心产品为晶圆激光打标及激光退火/加工设备，用于晶圆追踪标识（traceability）与先进封装，2025年3月强化自动化晶圆识别配置。主要客户为三星、SK海力士。","latestTech":"2025年3月升级高自动化晶圆识别配置，处理效率提升约20%，人工操作减少约16%。","spark":[1600,1900,2200,2600],"note":"国产对标大族激光、华工科技，国产激光打标在半导体封装领域份额快速提升，晶圆级高精度低热损伤打标仍存差距。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('通快','TRU.DE','semiconductor','equipment',true,'{"name":"通快","code":"TRU.DE","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":5500,"rev":55,"pe":22,"gross":30,"revGrowth":0,"desc":"德国激光与机床巨头（未上市，此处code为示意），在激光退火/显示TFT退火领域份额约12.8%，以固态激光技术及针对汽车、工业显示的应用定制见长，是欧洲激光退火主要供应商。","latestTech":"推进固态激光技术在多晶硅退火与Micro LED制造中的应用，强化汽车与工业显示定制方案。","spark":[4800,5100,5300,5500],"note":"国产对标大族激光、华工科技及北京优镨科技，国产激光器与退火设备在功率器件领域加速导入，高端固态激光仍依赖通快等。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('费罗泰克','6890.T','semiconductor','equipment',true,'{"name":"费罗泰克","code":"6890.T","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":900,"rev":18,"pe":15,"gross":25,"revGrowth":5,"desc":"日本晶体生长与热管理设备商，单晶炉市场份额约24.5%居首。核心产品为CZ法单晶硅炉及面向SiC/GaN等难生长材料的高温长晶炉，具备先进热管理专长，2024年推出可连续运行1500小时的新一代CZ炉，生产率提升16%。","latestTech":"2024年推出新一代CZ单晶炉，支持连续1500小时运行，生产率提升16%，强化SiC/化合物长晶能力。","spark":[700,780,850,900],"note":"国产对标晶升股份（SiC长晶炉）、晶盛机电（单晶炉），国产单晶炉在光伏与半导体成熟环节已规模化，半导体级大直径CZ炉仍存差距。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('PVA TePla','TPE.DE','semiconductor','equipment',true,'{"name":"PVA TePla","code":"TPE.DE","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":820,"rev":2.65,"pe":27.4,"gross":31.9,"revGrowth":-9.6,"desc":"德国晶体生长与半导体系统专业厂商，单晶炉市场份额约15-21.5%（欧洲先进硅长晶设备交付占比约15%）。核心产品为半导体级CZ/FZ单晶炉、SiC长晶系统及晶圆质量检测、等离子体清洗系统，主打高纯硅片生产。2025年营收2.44亿欧元。","latestTech":"2024年扩建德国工厂提升产能12%，持续推进大直径CZ炉与SiC长晶系统的热管理与自动化升级。","spark":[465,557,700,820],"note":"国产对标晶升股份、晶盛机电，国产SiC长晶炉在6/8英寸取得突破，半导体级高纯大直径CZ炉与缺陷控制仍有差距。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('林顿晶体','—','semiconductor','equipment',false,'{"name":"林顿晶体","code":"—","industry":"semiconductor","seg":"equipment","market":"US","listed":false,"cap":null,"rev":null,"pe":null,"gross":null,"revGrowth":null,"desc":"美国大直径CZ单晶炉专业厂商（Kayex-Lintoncrystal，属SPX旗下，未独立上市），单晶炉市场份额约16.3%。据美国ITA数据，2024年其大直径CZ炉占北美进口量的19%，主要服务半导体级硅片生产，是北美长晶设备主要供应商。","latestTech":"持续迭代大直径（300mm及研发面向450mm）CZ单晶炉，强化自动化与少子寿命/缺陷控制。","spark":[600,680,760,850],"note":"国产对标晶盛机电（半导体单晶炉国内领先）、晶升股份，国产半导体级大直径单晶炉正快速追赶，超大规模与高端半导体级仍有差距。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('住友电工','5802.T','semiconductor','equipment',true,'{"name":"住友电工","code":"5802.T","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":24000,"rev":290,"pe":16,"gross":20,"revGrowth":2,"desc":"日本综合材料厂商，单晶炉市场占有率约3.3%，同时是SiC/GaN等化合物半导体衬底与长晶技术主要玩家，在垂直一体化（长晶设备+衬底）模式上具优势，服务功率与射频器件。","latestTech":"推进8英寸SiC衬底与相关长晶技术，配合功率半导体需求扩张。","spark":[19000,21000,22500,24000],"note":"国产对标晶升股份、天岳先进（衬底），国产SiC衬底与长晶设备协同进步，但设备-衬底一体化与良率仍存差距。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('蔡司','—','semiconductor','equipment',false,'{"name":"蔡司","code":"—","industry":"semiconductor","seg":"equipment","market":"US","listed":false,"cap":null,"rev":null,"pe":null,"gross":null,"revGrowth":null,"desc":"德国光学巨头（卡尔蔡司SMT，蔡司基金会旗下未上市），掩模检测与修复高端玩家。核心产品为PROVE配准/套刻计量系统、AIMS系列浸没式成像测量系统（用于EUV及先进光刻掩模认证与缺陷复检）及掩模修复/调校方案，是EUV掩模认证的关键供应商。","latestTech":"持续推进AIMS EUV掩模成像测量与PROVE配准计量系统，支持High-NA EUV掩模认证与修复工作流。","spark":[10000,11000,12000,13000],"note":"国产对标上海微电子、中科飞测，EUV掩模认证/修复设备全球由蔡司垄断，国产化率近乎为0，差距达代际级。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('MueTec','—','semiconductor','equipment',false,'{"name":"MueTec","code":"—","industry":"semiconductor","seg":"equipment","market":"US","listed":false,"cap":null,"rev":null,"pe":null,"gross":null,"revGrowth":null,"desc":"德国掩模计量与检测专业厂商（未上市），专注光罩高精度光学测量与检测方案，面向半导体及微电子掩模厂，以精密光学测量和检测系统服务成熟及先进节点掩模质量管控。","latestTech":"持续迭代高精度光学掩模测量与检测系统，强化对先进节点掩模的质量控制能力。","spark":[300,330,360,400],"note":"国产对标中科飞测、上海精测，国产掩模光学检测在成熟节点开始导入，高精度掩模计量仍依赖进口。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('艾克尔','ICHR.US','semiconductor','equipment',true,'{"name":"艾克尔","code":"ICHR.US","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":1100,"rev":9.5,"pe":20,"gross":22,"revGrowth":8,"desc":"美国半导体设备气体与化学品输送子系统专业厂商，在亚太市场具较强实力，提供气体面板、气体棒及关键流体输送子系统，聚焦高毒/腐蚀性气体平台与超高纯加工，服务领先晶圆厂。","latestTech":"2025年8月与亚洲领先晶圆厂合作开发面向AI加速器量产的模块化气体输送平台。","spark":[800,900,1000,1100],"note":"国产对标正帆科技、富创精密，国产气体输送模组（gas panel）加速替代，腐蚀性/高纯特种气体输送仍存差距。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('大福','6383.T','semiconductor','equipment',true,'{"name":"大福","code":"6383.T","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":14300,"rev":46,"pe":26.4,"gross":15.7,"revGrowth":-10.4,"desc":"日本物料搬运与洁净室系统龙头，洁净室自动化与厂务输送主要供应商。通过Clean Factomation及洁净室物料搬运系统，提供半导体/面板厂洁净室传输与存储、气体化学品相关洁净环境解决方案，2025年洁净室订单中先进封装（后道）占比20-30%。","latestTech":"Clean Factomation 2025上半年订单激增187.3%，源于生成式AI相关产能扩张；2025年韩国洁净室单元订单增长55.6%。","spark":[11150,12500,13500,14300],"note":"国产对标正帆科技、京仪装备（厂务系统），国产洁净室与厂务系统在成熟领域替代较快，整厂洁净室自动化集成交付仍以国际厂商为主。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('村田机械','—','semiconductor','equipment',false,'{"name":"村田机械","code":"—","industry":"semiconductor","seg":"equipment","market":"US","listed":false,"cap":null,"rev":34,"pe":null,"gross":null,"revGrowth":5.8,"desc":"日本自动化设备商（非上市，1935年创立），AMHS全球双寡头之一，与大福合计占约90%份额（村田约占13%，不同口径约46%+13%）。核心为洁净室自动搬运系统（Clean FA），2024财年合并营收5260亿日元（首破5000亿），其中Clean FA部门约2227亿日元（占43%）。主要客户为台湾及韩国晶圆厂。","latestTech":"2025财年设备投资额计划325亿日元（同比+104%），因台湾等地半导体工厂自动搬运设备订单增加。","spark":[26000,30000,32000,34000],"note":"国产对标弥费科技、广纳半导体，村田与大福构成的高度垄断使国产替代主要依托新建产线窗口期切入。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('三星SEMES','—','semiconductor','equipment',false,'{"name":"三星SEMES","code":"—","industry":"semiconductor","seg":"equipment","market":"US","listed":false,"cap":null,"rev":null,"pe":null,"gross":null,"revGrowth":null,"desc":"三星集团旗下设备子公司（未上市），AMHS市场占有率约9.1%（不同口径约5-9%），主要服务三星电子与三星显示的晶圆厂/面板厂产线，凭借集团内部供应链优势占据稳定的市场份额。","latestTech":"持续为三星电子/三星显示新建产线提供AMHS整厂方案，配合三星先进制程与HBM扩产。","spark":[4000,4300,4600,4900],"note":"国产对标弥费科技、广纳半导体，SEMES高度依赖三星内部订单，第三方市场空间有限，但仍是全球AMHS第三大玩家。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('SFA Engineering','056190.KS','semiconductor','equipment',true,'{"name":"SFA Engineering","code":"056190.KS","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":1500,"rev":12,"pe":12,"gross":20,"revGrowth":5,"desc":"韩国自动化设备与AMHS供应商（韩国KOSPI上市），AMHS市场份额约10%。核心为半导体/显示厂自动化物料搬运系统与后道物流设备，主要服务三星、SK海力士及显示面板厂，在韩国本土AMHS市场具较强地位。","latestTech":"推进后道/先进封装自动化（OSAT）物流方案，配合HBM与先进封装扩产需求升级搬运系统。","spark":[1100,1250,1380,1500],"note":"国产对标弥费科技、广纳半导体，SFA依托韩系客户，代表AMHS领域除日系双寡头外的主要竞争者，国产替代空间仍大。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('盟立','2464.TW','semiconductor','equipment',true,'{"name":"盟立","code":"2464.TW","industry":"semiconductor","seg":"equipment","market":"US","listed":true,"cap":900,"rev":6.5,"pe":18,"gross":25,"revGrowth":8,"desc":"中国台湾自动化设备与AMHS供应商，AMHS市场份额约8%。核心为半导体/面板厂自动化物料搬运系统、OHT天车与存储系统，依托台湾半导体与面板产业集群，主要客户为台系晶圆厂与面板厂。","latestTech":"推进AMHS软硬件一体化（OHT+Stocker+MCS）方案，配合台湾先进制程与先进封装扩产。","spark":[650,740,820,900],"note":"国产对标弥费科技、广纳半导体，盟立代表台湾AMHS力量，国产AMHS整厂交付能力与调度软件成熟度仍有明显差距，国产化率不足5%。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('迈威尔科技','MRVL.US','semiconductor','design',true,'{"name":"迈威尔科技","code":"MRVL.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":2436,"rev":82,"pe":92.3,"gross":58.9,"revGrowth":43,"desc":"DPU/SmartNIC 第三名（约 12-13% 份额），OCTEON 10 DPU 平台以包处理密度和能效见长，基于台积电 5nm、集成最高 24 核 Arm Neoverse N2、1Tb 交换机与 ML/AI 加速引擎，在电信/5G vRAN 领域设计导入强劲。FastLinQ 网卡与定制 AI ASIC 也是其数据中心业务支柱，客户包括 AWS、微软、谷歌（三大定制 ASIC 客户）。","latestTech":"2026 财年数据中心营收占比 79%，Q2 达 21.7 亿美元；Nova 2 DSP 支持 1.6T 光引擎与 CPO 集成。","spark":[1100,1700,2100,2436],"note":"国产对标为云豹智能、芯启源。差距在高速 SerDes、电信级确定性时延处理与大规模定制 ASIC 交付能力。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('Cerebras Systems','—','semiconductor','design',false,'{"name":"Cerebras Systems","code":"—","industry":"semiconductor","seg":"design","market":"US","listed":false,"cap":null,"rev":null,"pe":null,"gross":null,"revGrowth":null,"desc":"晶圆级引擎（WSE）路线的开创者，第三代 WSE-3 在单芯片上集成数万亿晶体管，主打超大模型训练与云推理服务，系统如 Condor Galaxy 3。2025 年以约 110 亿美元估值完成 11 亿美元 G 轮融资，2026 年 5 月完成约 55 亿美元 IPO，首日全稀释估值约 660 亿美元，为最具价值的 AI 芯片独角兽。客户包括 G42、美国政府/国防项目。","latestTech":"2026 年在阿联酋数据中心扩张，并获 DARPA 合同以光子路由连接其芯片。","spark":[200,400,5500,6600],"note":"国产对标为寒武纪、壁仞、燧原科技。差距在晶圆级封装工艺与大规模集群软件栈；但国产在推理落地与信创市场具备本地化优势。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('SambaNova Systems','—','semiconductor','design',false,'{"name":"SambaNova Systems","code":"—","industry":"semiconductor","seg":"design","market":"US","listed":false,"cap":null,"rev":null,"pe":null,"gross":null,"revGrowth":null,"desc":"可重构数据流架构（RDU）AI 芯片与系统厂商，主打企业级/政府级 AI 推理与训练一体化平台（DataScale）。2026 年 2 月发布 SN50，宣称是面向 Agentic AI 的最快芯片（1.6 PFLOPS FP16、3.2 PFLOPS FP8，支持 10 万亿参数模型），SoftBank 为首家客户。累计融资超 11 亿美元，2025 年估值约 22 亿美元。","latestTech":"2026 年 2 月 SN50 发布并与英特尔达成多年软硬件协同设计合作，同期融资 3.5 亿美元。","spark":[1500,2200,2200,2200],"note":"国产对标为燧原科技、壁仞科技、昆仑芯。差距在数据流编译器成熟度与大规模部署案例；国产在本地化交付和信创场景更灵活。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('Groq','—','semiconductor','design',false,'{"name":"Groq","code":"—","industry":"semiconductor","seg":"design","market":"US","listed":false,"cap":null,"rev":null,"pe":null,"gross":null,"revGrowth":null,"desc":"由前谷歌 TPU 架构师创立的 LPU（语言处理单元）推理芯片厂商，采用确定性、无缓存流式架构，主打极低延迟 LLM 推理与 GroqCloud 云服务。2025 年 9 月以约 69 亿美元估值融资 7.5 亿美元；2025 年 12 月与英伟达达成约 200 亿美元的非独家技术授权+人才协议，创始人 Jonathan Ross 等核心成员加入英伟达，Groq 保留 GroqCloud 独立运营。","latestTech":"2025 年 12 月与英伟达达成约 200 亿美元授权交易，2026 年 6 月再获 6.5 亿美元融资专注云服务。","spark":[280,500,690,350],"note":"国产对标为墨芯人工智能（稀疏化推理）、天数智芯。差距在确定性架构的软件成熟度与超大规模推理集群运维经验。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('Google（TPU）','GOOGL.US','semiconductor','design',true,'{"name":"Google（TPU）","code":"GOOGL.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":null,"rev":null,"pe":null,"gross":null,"revGrowth":null,"desc":"自研 TPU（张量处理单元）是 AI 推理/训练专用加速器的标杆，最新 TPU v6/v7 由博通、联发科等参与设计，仅通过 Google Cloud 对外提供服务，不单独售卖芯片。2026 年有报道谷歌向英特尔下达约 300 万颗定制 TPU 订单，是自研 ASIC 生态最强的超大规模玩家。","latestTech":"2026 年 TPU 多代路线图推进并外溢至英特尔代工，成为训练/推理 ASIC 需求的最大来源之一。","spark":[null,null,null,null],"note":"国产对标为昆仑芯（百度自研，与谷歌 TPU 模式最接近）、阿里平头哥。差距在代际迭代速度、软件栈（XLA/JAX TPU 后端）与超大规模集群调度。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('慧荣科技','SIMO.US','semiconductor','design',true,'{"name":"慧荣科技","code":"SIMO.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":94.1,"rev":8.86,"pe":19.2,"gross":48.3,"revGrowth":10.5,"desc":"独立 SSD/eMMC/UFS 主控芯片龙头之一，控制着约 30% 的客户端 SSD 主控与约 20-23% 的手机 eMMC/UFS 主控份额。产品线涵盖客户端 SSD、移动存储、Ferri 车规（客户含丰田、特斯拉、比亚迪）与 MonTitan 企业级 PCIe Gen5 主控，曾为 Blackwell/BlueField 供货定制存储。","latestTech":"2026 年 MonTitan 企业级 Gen5 主控进入放量，两条一线客户设计导入自 2026 起量产。","spark":[20,30,42,94],"note":"国产对标为联芸科技、国科微、得一微。差距在企业级 PCIe Gen5 主控的 QLC/固件成熟度与大客户设计导入；国产则在 SATA/消费级主控具成本优势。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('群联电子','8299.TW','semiconductor','design',true,'{"name":"群联电子","code":"8299.TW","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":149,"rev":23,"pe":10.1,"gross":34.4,"revGrowth":23.3,"desc":"全球最大的第三方 NAND 主控供应商（独立厂商份额约 25-30%），消费级 SSD 主控领导者，PS5026-E26 等 PCIe 5.0 主控实现 14,000 MB/s 顺序读。近年全力转型 AI 存储，推出 Pascari 企业级 SSD 与 aiDAPTIV+ 平台，企业级 SSD 营收占比 2026Q1 超 30%，与英特尔合作导入 AI PC。","latestTech":"2026 年 6 月全面转型 AI 赋能者，构建 Pascari/aiDAPTIV 生态，4nm 主控投入研发。","spark":[80,120,200,149],"note":"国产对标为江波龙、佰维存储、德明利（模组）与联芸科技（主控）。差距在高端主控 IP、企业级固件与 NAND 原厂长协资源。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('联发科','2454.TW','semiconductor','design',true,'{"name":"联发科","code":"2454.TW","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":null,"rev":191,"pe":null,"gross":48.4,"revGrowth":16,"desc":"全球第二大手机 SoC 厂，无线连接（WiFi 6/7、蓝牙）业务 2025 年营收超 30 亿美元，其 WiFi 芯片与天玑 SoC 深度捆绑，广泛用于智能手机、路由器、Chromebook 与 IoT。Connectivity 业务增长强劲，是手机/平板/TWS 音频与无线连接的主要国际供给方之一。","latestTech":"2026 年天玑 9500 放量，WiFi 7 与蓝牙方案随 AI PC/边缘设备扩展，数据中心 ASIC 目标 2026 年 10 亿美元。","spark":[150,170,185,191],"note":"国产对标为乐鑫科技、恒玄科技、博通集成。差距在手机级射频前端与高端 SoC 集成；国产在 IoT WiFi/BLE 与 TWS SoC 领域已具备规模竞争力。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('Nordic Semiconductor','NOD.OL','semiconductor','design',true,'{"name":"Nordic Semiconductor","code":"NOD.OL","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":36.5,"rev":6.68,"pe":124.8,"gross":51.8,"revGrowth":30.5,"desc":"超低功耗蓝牙 SoC 领导者，nRF52/nRF53 系列在可穿戴、信标、IoT 市场份额领先，2025 年第三季度占蓝牙 LE 新 SIG 认证设计约 31%（为最强对手的 3-4 倍）。新一代 nRF54 系列自 2026 起放量，并扩展到蜂窝 IoT（nRF91 系列，含 NTN 卫星）与云服务（Memfault）。客户包括 Garmin、Tile、飞利浦 Hue、亚马逊 Sidewalk。","latestTech":"2026 年 nRF54 系列加速出货，叠加 Memfault 云服务形成 chip-to-cloud 平台，Q2 2026 营收同比 +33%。","spark":[22,26,30,36.5],"note":"国产对标为泰凌微、乐鑫科技、中科蓝讯。差距在低功耗射频 IP 与开发者生态；国产在 Zigbee/BLE Mesh 与 IoT 连接芯片已快速追赶。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('Silicon Labs','SLAB.US','semiconductor','design',true,'{"name":"Silicon Labs","code":"SLAB.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":null,"rev":12.2,"pe":null,"gross":null,"revGrowth":null,"desc":"纯 IoT 无线 SoC 专精厂商，聚焦安全、低功耗的蓝牙多协议（BLE/Zigbee/Thread/Matter）SoC，EFR32BG24、BG27 等系列广泛用于智能家居与工业 IoT。软件（Simplicity Studio）营收占比约 18.5%，与涂鸦、Matter 联盟深度合作，客户含 Signify、施耐德、Ecobee。","latestTech":"2026 年扩张 Simplicity Studio AI 能力，深化 Matter/Zigbee 多协议平台与安全 IoT 布局。","spark":[null,null,null,null],"note":"国产对标为泰凌微、乐鑫科技、力合微（PLC/无线）。差距在多协议射频集成与安全 IP；国产在 Matter 时代具备替代窗口。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('索尼','6758.T','semiconductor','design',true,'{"name":"索尼","code":"6758.T","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":1473,"rev":796.8,"pe":19.8,"gross":32.2,"revGrowth":-10,"desc":"全球 CIS 绝对龙头（份额约 53-54%），Exmor RS/IMX 系列主导高端手机主摄，在工业 CMOS（份额 55-60%）与全局快门（60-70%）领域优势更强。FY2025 影像与传感（I&SS）业务营收 2.15 万亿日元（+20%），其中图像传感器 1.98 万亿日元，为苹果、尼康、特斯拉等供货。与台积电合作推进 fab-light 战略。","latestTech":"2026 年 8 月与台积电敲定合资建厂（约 1 万亿日元），采用先进工艺量产手机图像传感器，2029 年量产。","spark":[1300,1460,1200,1473],"note":"国产对标为韦尔股份（豪威）、思特威、格科微。差距在堆栈式像素、大底高端手机与工业/车规全局快门；国产已在车载 CIS（豪威全球第一）和中低端手机实现突破。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('博世','—','semiconductor','design',false,'{"name":"博世","code":"—","industry":"semiconductor","seg":"design","market":"US","listed":false,"cap":null,"rev":null,"pe":null,"gross":null,"revGrowth":null,"desc":"全球最大 MEMS 厂商（份额约 19-22%，2025 年营收约 22 亿美元），Bosch Sensortec 在惯性传感器（加速度计/陀螺仪/IMU）领域尤其领先，BMA/BMP/BHI 系列广泛用于手机、可穿戴与汽车。手机 IMU 市场约占 28%，客户包括苹果、华为、小米、特斯拉，并在德国德累斯顿运营 300mm MEMS 产线。","latestTech":"2026 年扩展 300mm 产线并推进 AI-enabled 传感器融合（BHI 系列 AI 传感器中枢）。","spark":[null,null,null,null],"note":"国产对标为敏芯股份（声学/压力/惯性）、芯动联科（高性能陀螺仪）、士兰微。差距在高精度车规 IMU 与工艺良率；国产在消费级惯性/压力传感器已实现全环节国产化。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('TDK','6762.T','semiconductor','design',true,'{"name":"TDK","code":"6762.T","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":null,"rev":1100,"pe":null,"gross":null,"revGrowth":null,"desc":"通过收购 InvenSense 成为消费级 MEMS 惯性传感器主力，ICM42605 等 6 轴 IMU 采用 28nm 制程、功耗较前代降低 50%，是安卓中高端机型首选（手机 IMU 份额约 22%），客户含三星、OPPO、vivo。同时是磁性/被动元件大厂，MEMS 业务（约 11 亿美元）与消费电子强相关。","latestTech":"2026 年推进 IMU 的 3D 集成与低功耗运动传感，绑定安卓旗舰与可穿戴。","spark":[null,null,null,null],"note":"国产对标为敏芯股份、芯动联科、士兰微。差距在低功耗消费级 IMU 的规模与一致性；国产在中低端已具备替代能力。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('Lumentum','LITE.US','semiconductor','design',true,'{"name":"Lumentum","code":"LITE.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":null,"rev":16.45,"pe":null,"gross":34.7,"revGrowth":21,"desc":"高速激光器芯片（EML/DML）与光模块核心供应商，FY2025 营收 16.45 亿美元（+21%），云与网络业务增长 30%。EML 芯片收入较上年近乎翻倍（数据中心互连需求驱动），窄线宽激光器与泵浦激光器连续多季增长，并推进面向 CPO 的超高功率激光器与光路交换（OCS）产品。客户为超大规模云与主流光模块厂商。","latestTech":"2026 财年下半年面向 CPO 的超高功率激光器预计规模放量，并首次实现 OCS 营收。","spark":[12,14,15,16.5],"note":"国产对标为源杰科技（EML/DFB）、长光华芯、云岭光电。差距在高速 EML/大功率 CW 激光器的良率与产能；国产 EML 正逐步导入国内模块厂。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('MACOM','MTSI.US','semiconductor','design',true,'{"name":"MACOM","code":"MTSI.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":null,"rev":null,"pe":null,"gross":null,"revGrowth":null,"desc":"高速模拟/RF 与光通信芯片厂商，光通信芯片营收约 4.2 亿美元，主打 400G/800G 激光驱动器、TIA 与时钟数据恢复（CDR）芯片，是光模块模拟前端的关键供给方。SiGe/GaAs 技术平台深厚，正推出 1.6T 就绪的模拟前端方案，客户含中际旭创、海信宽带等主流模块厂。","latestTech":"2026 年推出 1.6T 级模拟前端并强化 SiGe/GaAs 平台，切入 200G/lane 光模块。","spark":[null,null,null,null],"note":"国产对标为源杰科技、仕佳光子、光迅科技。差距在高速 TIA/驱动 IC 的性能与本土模块厂依赖度；国产模拟前端仍在追赶。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('Lightmatter','—','semiconductor','design',false,'{"name":"Lightmatter","code":"—","industry":"semiconductor","seg":"design","market":"US","listed":false,"cap":null,"rev":null,"pe":null,"gross":null,"revGrowth":null,"desc":"MIT 孵化的硅光独角兽，光计算与光互连双线布局。互连产品 Passage 系列（L200/L200x 提供 200Tbps 级 3D CPO，M1000 光中介层支持 114Tbps）通过台积电 COUPE 平台投片，与创意电子合作面向超大云；计算产品 Envise 为完整光子 AI 加速器。截至 2025 年 10 月累计融资 8.22 亿美元，估值约 44 亿美元，是硅光新创中最受资本青睐者。","latestTech":"2026 年推进 Passage L200x（>200Tbps）与台积电/创意电子 CPO 量产合作，面向超大云 AI 客户。","spark":[null,null,null,null],"note":"国产对标为曦智科技（Lightelligence 的中国实体，聚焦光计算芯片）、光本位科技（光电混合计算）。差距在光子器件规模集成与代工/封装生态（COUPE）；曦智在光互连与光子计算 IP 上已接近国际前沿但产业化稍慢。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('Lightelligence','—','semiconductor','design',false,'{"name":"Lightelligence","code":"—","industry":"semiconductor","seg":"design","market":"US","listed":false,"cap":null,"rev":null,"pe":null,"gross":null,"revGrowth":null,"desc":"由沈亦晨（MIT）创立的美国公司，专注光子计算与光电混合计算加速芯片，推出光子计算加速卡与光互连方案，主打以光子矩阵运算降低 AI 计算能耗。需区分其中国关联实体曦智科技——两者同源但法律与融资主体不同。2024 年 B 轮 1.24 亿美元、2025 年 C 轮 2.5 亿美元，是全球光计算赛道头部创业公司之一。","latestTech":"2025 年完成 2.5 亿美元 C 轮融资，推进光子计算加速卡商业化与数据中心光互连落地。","spark":[null,null,null,null],"note":"国产对标即其中国关联实体曦智科技，以及光联芯科、光本位科技。差距/关系在于中美主体分拆后的技术协同与各自本地化供应链；国内光计算仍处早期验证阶段。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('Ayar Labs','—','semiconductor','design',false,'{"name":"Ayar Labs","code":"—","industry":"semiconductor","seg":"design","market":"US","listed":false,"cap":null,"rev":null,"pe":null,"gross":null,"revGrowth":null,"desc":"光 I/O chiplet 与光互连的核心厂商，产品为 TeraPHY（UCIe 光 I/O chiplet）与 SuperNova（多波长激光源），用于芯片间光学互连以突破铜互连带宽瓶颈。累计融资约 3.75 亿美元、估值超 10 亿美元，投资人阵容豪华——英伟达、英特尔资本、AMD Ventures、GlobalFoundries 同投，反映光互连被全行业视为「预竞争」基础设施。已开始量产出货。","latestTech":"2026 年推进 TeraPHY/SuperNova 量产与 UCIe 光 chiplet 生态标准化，进入超大规模云 AI 集群。","spark":[null,null,null,null],"note":"国产对标为曦智科技（光互连）、光联芯科。差距在 UCIe 光 chiplet 的标准化与代工验证；国产光互连新创尚处于样品/小批量阶段。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('Celestial AI','—','semiconductor','design',false,'{"name":"Celestial AI","code":"—","industry":"semiconductor","seg":"design","market":"US","listed":false,"cap":null,"rev":null,"pe":null,"gross":null,"revGrowth":null,"desc":"光互连芯片厂商，核心产品 Photonic Fabric 硅光互连平台，支持芯片内到机架间的光学 scale-up 网络，实现计算与内存解耦，兼容 2.5D 封装与台积电制程。2025 年 3 月完成 2.5 亿美元 C1 轮（Fidelity 领投，投后估值 25 亿美元），累计融资 5.2 亿美元，投资人含 AMD Ventures、三星 Catalyst、保时捷 SE 等。2025 年 12 月被迈威尔以 32.5 亿美元收购。","latestTech":"2025 年 12 月被 Marvell 以 32.5 亿美元收购，Photonic Fabric 将并入 Marvell 光互连战略。","spark":[null,null,null,null],"note":"国产对标为曦智科技、光联芯科。差距在硅光互连与量产供应链（台积电）；国产光互连正从原型走向工程化。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('PsiQuantum','—','semiconductor','design',false,'{"name":"PsiQuantum","code":"—","industry":"semiconductor","seg":"design","market":"US","listed":false,"cap":null,"rev":null,"pe":null,"gross":null,"revGrowth":null,"desc":"全球融资最多、估值最高的光量子计算公司（估值约 70 亿美元），采用双轨编码（dual-rail）硅光路线，依托 GlobalFoundries 商业代工量产光量子芯片（Omega 芯片组），目标是 2027-2029 年实现百万量子比特容错量子计算机。累计融资超 23 亿美元（含 2025 年 9 月 10 亿美元 E 轮），并获澳洲政府 9.4 亿美元及美国多州 5 亿美元税收激励，布里斯班设施在建。","latestTech":"2025 年 9 月完成 10 亿美元 E 轮（估值约 70 亿美元），2026 年推进布里斯班百万比特容错系统与 GF 代工芯片。","spark":[null,null,null,null],"note":"国产对标为图灵量子（光子集成/光量子计算）、奇算光启、玻色量子（QBoson）。差距在硅光代工规模与容错架构工程化；图灵量子聚焦光量子芯片与算法，尚处早期，QBoson 已在深圳建光量子计算机制造工厂。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('Xanadu','—','semiconductor','design',false,'{"name":"Xanadu","code":"—","industry":"semiconductor","seg":"design","market":"US","listed":false,"cap":null,"rev":null,"pe":null,"gross":null,"revGrowth":null,"desc":"加拿大光量子计算龙头（份额约 14%），采用压缩光（squeezed light）连续变量编码与模块化网络架构，2022 年 Borealis（216 量子比特）实现量子计算优势。2025 年 1 月推出模块化联网系统 Aurora（35 个光子芯片、12 量子比特，登上 Nature）。其 PennyLane 软件被全球约 47% 量子程序员使用。2026 年 Q1 拟通过 SPAC 以约 36 亿美元估值登陆纳斯达克，成首家纯光量子上市公司。","latestTech":"2026 年 Q1 拟经 SPAC 上市（估值约 36 亿美元），推进 Aurora 模块化光量子网络。","spark":[null,null,null,null],"note":"国产对标为图灵量子、奇算光启、本源量子（光量子方向）。差距在光量子硬件成熟度与软件生态（PennyLane）；国产在光量子芯片设计与测控上快速追赶。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('ORCA Computing','—','semiconductor','design',false,'{"name":"ORCA Computing","code":"—","industry":"semiconductor","seg":"design","market":"US","listed":false,"cap":null,"rev":null,"pe":null,"gross":null,"revGrowth":null,"desc":"英国光量子计算公司（份额约 12%），采用时间复用+量子存储（铷原子）架构，实现确定性（非概率性）光子操作，主打室温机架式系统直接与 GPU 竞争 AI/ML 负载。PT-1 已部署 7 套（研究机构、国防、HPC 中心），PT-2（90 光子量子比特）获 2025 年 HPC 创新卓越奖，为少数已实现商业化交付的光量子厂商。","latestTech":"2025 年 PT-2（90 光子量子比特）获 HPC 创新奖，2026 年推进面向 AI/ML 的室温光量子加速应用。","spark":[null,null,null,null],"note":"国产对标为图灵量子、奇算光启。差距在量子存储与时间复用工程的商业化落地；国产光量子在专用加速场景仍处实验室/早期商用阶段。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('Quandela','—','semiconductor','design',false,'{"name":"Quandela","code":"—","industry":"semiconductor","seg":"design","market":"US","listed":false,"cap":null,"rev":null,"pe":null,"gross":null,"revGrowth":null,"desc":"法国光量子计算公司（份额约 10%），以量子点确定性单光子源解决光子概率性问题，2022 年推出欧洲首台云端光量子计算机，其 MerLin 框架服务 30 国 1200+ 研究者，通过 OVHcloud 部署 Belenos 12 量子比特系统，云平台可用性超 92%，在单光子云端量子计算领域领先。","latestTech":"2026 年扩展基于量子点单光子源的云量子计算平台与 Belenos 系统。","spark":[null,null,null,null],"note":"国产对标为图灵量子、奇算光启、国盾量子（光量子相关）。差距在单光子源工程化与云平台成熟度；国产在光量子器件与云服务上起步追赶。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('稳懋半导体','3105.TW','semiconductor','fab',true,'{"name":"稳懋半导体","code":"3105.TW","industry":"semiconductor","seg":"fab","market":"US","listed":true,"cap":77,"rev":5.45,"pe":45.75,"gross":23.2,"revGrowth":10,"desc":"全球最大的 6 英寸砷化镓（GaAs）晶圆代工厂，市占率领先，是化合物半导体射频代工龙头。核心产品为 GaAs HBT/pHEMT 及 GaN 射频晶圆代工，覆盖蜂窝 PA、WiFi PA、基础设施与光电子（3D 感测 VCSEL）。主要客户为美系与中系手机射频前端供应链厂商（如 Skyworks、Qorvo、Avago 等）。","latestTech":"2025 年 2 月法说会公布 2024 年 EPS 由亏转盈，并启动 GaN 产能扩张以承接 5G/卫星通讯基建需求。","spark":[70,62,58,77],"note":"国产替代对标三安光电：三安已具备 GaAs/GaN 射频代工能力并在扩产，但稳懋在 6 英寸 GaAs 代工份额、良率与顶级射频客户认证上仍大幅领先，三安在高端 PA 代工良率与产能规模上差距明显。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('宏捷科','8086.TW','semiconductor','fab',true,'{"name":"宏捷科","code":"8086.TW","industry":"semiconductor","seg":"fab","market":"US","listed":true,"cap":13,"rev":1.39,"pe":45,"gross":30,"revGrowth":63.6,"desc":"台湾第二大 GaAs 晶圆代工厂，专注 6 英寸砷化镓 HBT 代工，聚焦手机功率放大器（PA）与 WiFi 射频市场。客户以中系与美系手机射频供应链为主，是稳懋之外的重要二供。","latestTech":"2025 年 2 月公布 2024 年营收 44.55 亿新台币、年增 63.6%，EPS 创 3 年新高，受惠 WiFi 7 PA 拉货。","spark":[9,11,12,13],"note":"国产替代对标三安光电：宏捷科体量小但专注 GaAs PA 代工利基，三安在 GaAs 射频代工上产能更大但客户结构与宏捷科重叠度提升中，差距在成熟良率与量产经验。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('全新光电','2455.TW','semiconductor','fab',true,'{"name":"全新光电","code":"2455.TW","industry":"semiconductor","seg":"fab","market":"US","listed":true,"cap":15,"rev":1.01,"pe":30,"gross":40,"revGrowth":20.3,"desc":"台湾砷化镓（GaAs）与磷化铟（InP）上游磊晶（Epi）厂，是化合物半导体制造的上游关键环节，供应微波通讯与光电子磊晶片。产品用于手机 PA、WiFi 及资料中心光通讯（矽光子发射/接收端）。客户涵盖台系与日系磊晶/代工厂。","latestTech":"2025 年受惠矽光子发射端产品出货日系客户，资料中心相关营收持续提升。","spark":[11,12,13,15],"note":"国产替代对标三安光电及国内磊晶厂：三安在 GaAs/InP 磊晶具备一体化能力，但全新在微波与光电子磊晶品质、MOCVD 工艺成熟度及日系高阶客户认证上仍领先。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('Tower Semiconductor','TSEM.US','semiconductor','fab',true,'{"name":"Tower Semiconductor","code":"TSEM.US","industry":"semiconductor","seg":"fab","market":"US","listed":true,"cap":55,"rev":14.36,"pe":27.8,"gross":23.6,"revGrowth":0.9,"desc":"以色列特色模拟晶圆代工厂，是化合物半导体及矽光子代工的重要平台，提供 SiGe、GaAs 及 GaN 射频与电源代工。产品覆盖射频前端、电源管理、图像感测与矽光子，客户为全球无晶圆 IC 设计公司。","latestTech":"2025 年第一季营收指引约 3.58 亿美元、同比增约 10%，持续推进 Agrate 12 英寸及射频/电源特色工艺平台。","spark":[40,50,48,55],"note":"国产替代对标三安光电：Tower 在 SiGe BiCMOS 及特色模拟代工上具独特地位，三安以化合物射频/功率代工为主，二者在特色模拟平台广度上差距大。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('X-FAB','XFAB.PA','semiconductor','fab',true,'{"name":"X-FAB","code":"XFAB.PA","industry":"semiconductor","seg":"fab","market":"US","listed":true,"cap":6.5,"rev":8.16,"pe":5.8,"gross":22,"revGrowth":-10,"desc":"欧洲专业特色晶圆代工厂，在 SiC 与 GaN 功率代工及模拟特色工艺领域地位突出，是欧洲 SiC 代工的重要平台。产品用于汽车、工业与医疗，涵盖 SiC 功率器件代工与氮化镓代工。客户为欧洲及全球车规与工业 IC 设计公司。","latestTech":"2024 年营收 8.16 亿美元（同比 -10%），推出下一代 SiC 工艺平台使每片晶圆良品率提升 30%。","spark":[8,7,6,6.5],"note":"国产替代对标三安光电及国内特色代工厂：X-FAB 在车规 SiC/GaN 代工认证上领先，中国 SiC 代工（如积塔、芯联集成）快速追赶但车规良率与客户认证仍有差距。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('GlobalFoundries','GFS.US','semiconductor','fab',true,'{"name":"GlobalFoundries","code":"GFS.US","industry":"semiconductor","seg":"fab","market":"US","listed":true,"cap":234,"rev":67.5,"pe":30,"gross":24.5,"revGrowth":-8.7,"desc":"全球第三大晶圆代工厂，通过特色工艺平台布局 GaN 与 SiC 等化合物半导体代工，在射频（FDX）、功率及光电特色工艺具地位。其 Burlington 厂扩产 GaN 产能、Malta 厂发展先进封装与光子。客户为全球无晶圆与 IDM 厂商。","latestTech":"2024 年营收 67.5 亿美元（同比 -9%），依托 CHIPS 法案扩产 GaN 及先进封装光子中心。","spark":[200,180,200,234],"note":"国产替代对标三安光电及中芯国际/华虹：GF 在特色化合物代工与 RF-SOI 上领先，中国在 GaN/SiC 代工处于追赶期，规模与工艺平台成熟度差距明显。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('东芝','6502.T','semiconductor','design',true,'{"name":"东芝","code":"6502.T","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":160,"rev":210,"pe":12,"gross":28,"revGrowth":2,"desc":"日本综合电机与半导体厂商，功率器件事业提供低损耗 DTMOS MOSFET、IGBT 及 SiC 器件，在工业电机驱动与消费电源领域占有一席。产品覆盖工业、家电与汽车，客户为全球工业与消费电子厂商。","latestTech":"推进岩手工厂改造及 650V 沟槽 MOSFET 量产，聚焦工业驱动与高能效电源市场。","spark":[130,140,150,160],"note":"国产替代对标士兰微、华润微、新洁能：东芝在中高压 MOSFET 与 IGBT 上有技术积累，中国在 MOSFET/IGBT 国产替代进度较快，中低压已大量替代，高压与车规器件仍有差距。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('Vishay','VSH.US','semiconductor','design',true,'{"name":"Vishay","code":"VSH.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":53.9,"rev":29.38,"pe":148,"gross":21.3,"revGrowth":-13.7,"desc":"美国分立器件与被动元件巨头，是功率 MOSFET 重要供应商，产品覆盖功率 MOSFET、二极管、整流器及被动元件。应用广泛于工业、汽车、计算及消费市场，客户遍布全球。","latestTech":"2024 年营收 29.38 亿美元、同比 -13.7%，推进产品组合向高价值车规与数据中心电源倾斜。","spark":[60,45,40,53.9],"note":"国产替代对标士兰微、华润微、新洁能：威世在中低压 MOSFET 与分立器件规模领先，中国 MOSFET 厂商国产替代已在中低压领域大规模实现，高压与车规器件及产品线广度仍有差距。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('Alpha & Omega','AOSL.US','semiconductor','design',true,'{"name":"Alpha & Omega","code":"AOSL.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":11.6,"rev":6.57,"pe":null,"gross":26,"revGrowth":-5,"desc":"美国功率半导体 fabless/IDM（混合模式），专注中低压功率 MOSFET 及功率 IC，产品用于计算、消费电子、通讯与工业。是笔记本电脑与消费电源 MOSFET 的重要供应商。客户涵盖全球 PC 与消费电子 ODM。","latestTech":"FY2024 营收 6.57 亿美元，持续拓展中高压 MOSFET 与功率 IC 产品线。","spark":[11,8,7,11.6],"note":"国产替代对标士兰微、新洁能、华润微：AOS 在消费类中低压 MOSFET 上与国产厂商直接竞争，中国厂商在 PC/消费 MOSFET 国产替代进度快，AOS 优势正被侵蚀，双方差距已大幅缩小。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('微芯科技','MCHP.US','semiconductor','design',true,'{"name":"微芯科技","code":"MCHP.US","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":320,"rev":39,"pe":30,"gross":58,"revGrowth":-30,"desc":"美国嵌入式控制与模拟半导体 IDM，通过收购 Microsemi 获得功率器件业务，产品覆盖 IGBT、MOSFET、SiC 及功率模组，结合 MCU 提供功率+控制方案。应用覆盖工业、汽车、数据中心与航天。客户为全球工业与汽车厂商。","latestTech":"FY2025 营收约 39 亿美元，推进功率器件与 dsPIC 控制器整合的电机控制方案。","spark":[400,350,300,320],"note":"国产替代对标士兰微、斯达半导、兆易创新：微芯在功率+MCU 系统级方案上具优势，中国在 MCU 与功率器件国产替代同步推进，但系统级整合方案与高端功率器件仍存差距。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('瑞萨电子','6723.T','semiconductor','design',true,'{"name":"瑞萨电子","code":"6723.T","industry":"semiconductor","seg":"design","market":"US","listed":true,"cap":250,"rev":87,"pe":20,"gross":55.6,"revGrowth":-8.2,"desc":"日本 MCU 与模拟半导体巨头，功率器件业务以中压车规 IGBT 及功率 IC 为主，与 MCU/模拟产品协同提供汽车与工业方案。产品用于汽车动力总成、ADAS 及工业，客户为全球车厂与 Tier 1。","latestTech":"FY2024 营收 13485 亿日元、同比 -8.2%，推进功率 IC 整合，重启甲府工厂。","spark":[280,220,200,250],"note":"国产替代对标士兰微、兆易创新、斯达半导：瑞萨以功率 IC 与 MCU 协同见长，中国在车规 MCU 与功率器件国产替代加速，但在车规级高可靠器件与车厂认证上差距明显。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('颀邦科技','6147.TW','semiconductor','osat',true,'{"name":"颀邦科技","code":"6147.TW","industry":"semiconductor","seg":"osat","market":"US","listed":true,"cap":53.4,"rev":20.34,"pe":52.3,"gross":22,"revGrowth":-0.3,"desc":"全球显示驱动芯片（DDIC）封测龙头，专精金凸块（gold bump）、COF/COG/COP 及 TCP 封装与晶圆测试。是面板驱动 IC 封测市占率第一的厂商，产品用于大尺寸 LCD/OLED、手机、穿戴及车载显示。客户涵盖全球主要驱动 IC 设计公司与面板厂。","latestTech":"2024 年营收 203 亿新台币基本持平，2025 年营收回升至约 214 亿新台币、年增约 5.5%，受惠 OLED 及车载显示需求。","spark":[45,40,48,53.4],"note":"国产替代对标颀中科技、汇成股份：颀邦是全球 DDIC 金凸块与 COF 封测龙头，颀中与汇成在显示驱动封测（金凸块/COF）上直接对标并快速扩张产能，但颀邦在高端 COF 工艺、良率及全球大客户份额上仍领先。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('南茂科技','8150.TW','semiconductor','osat',true,'{"name":"南茂科技","code":"8150.TW","industry":"semiconductor","seg":"osat","market":"US","listed":true,"cap":30,"rev":6.92,"pe":25,"gross":13,"revGrowth":6.3,"desc":"台湾封测厂，显示驱动 IC（含金凸块）封测与记忆体封测并重，DDIC 业务约占营收过半。提供 COF/COG/COP 封测及金凸块服务，产品用于手机、电视、车载及穿戴显示。客户为全球驱动 IC 设计与面板供应链厂商。","latestTech":"2024 年营收 226.96 亿新台币、年增 6.3%，受益车用与 OLED 驱动 IC 稳健需求。","spark":[26,24,28,30],"note":"国产替代对标颀中科技、汇成股份：南茂 DDIC 封测与颀邦共同构成本细分主要国际竞争者，中国颀中/汇成在显示驱动封测领域扩产迅速，在中低端已实现替代，高端 COF 及车载认证仍在追赶。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('LB Semicon','000000.KS','semiconductor','osat',true,'{"name":"LB Semicon","code":"000000.KS","industry":"semiconductor","seg":"osat","market":"US","listed":true,"cap":null,"rev":null,"pe":null,"gross":null,"revGrowth":null,"desc":"韩国显示驱动芯片封测厂，专注 DDIC 金凸块及 COF/COG 封装测试，是韩国显示产业链重要的驱动 IC 封测供应商，服务韩系面板与驱动 IC 厂商。","latestTech":"持续投入 DDIC 先进封装与车用显示封测产能。","spark":[null,null,null,null],"note":"国产替代对标颀中科技、汇成股份：中国显示驱动封测产能已具规模，颀中/汇成在 COF 封测环节直接竞争，与韩系封测厂在技术层面接近，差距主要在高端车载与 OLED 驱动封测认证。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('京元电子','2449.TW','semiconductor','osat',true,'{"name":"京元电子","code":"2449.TW","industry":"semiconductor","seg":"osat","market":"US","listed":true,"cap":45,"rev":9.1,"pe":20,"gross":34.8,"revGrowth":-14.5,"desc":"全球最大专业第三方 IC 测试厂之一，提供晶圆针测、IC 成品测试、预烧测试及封装服务，聚焦消费、通讯、数据处理及车用芯片测试。是 AI/HPC 芯片（CoWoS WoS 段成品测试）测试的关键供应商，客户涵盖台积电、NVIDIA 等。","latestTech":"2024 年营收 268.56 亿新台币、毛利率 34.8%、EPS 创历史新高，2025 年资本支出达 233 亿新台币创历史新高，主攻 AI/HPC 测试设备。","spark":[40,35,38,45],"note":"国产替代对标伟测科技、利扬芯片：京元电是全球第三方测试龙头且在 AI 先进封装测试上占据关键位置，伟测、利扬作为中国第三方测试厂快速成长，但在高端 SoC/AI 测试平台、设备与规模上差距明显。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('矽格','6257.TW','semiconductor','osat',true,'{"name":"矽格","code":"6257.TW","industry":"semiconductor","seg":"osat","market":"US","listed":true,"cap":25,"rev":5.7,"pe":13,"gross":26.1,"revGrowth":17.7,"desc":"台湾专业 IC 测试厂，提供晶圆测试与成品测试服务，聚焦 AI 及光通讯芯片、HPC、手机及网通芯片测试。子公司台星科亦为美系处理器大厂测试供应链伙伴。客户涵盖全球 IC 设计与 IDM 厂商。","latestTech":"2024 年营收 182.18 亿新台币、年增 17.7%，规划竹东中兴三厂扩产，锁定 AI/HPC 测试。","spark":[20,22,23,25],"note":"国产替代对标伟测科技、利扬芯片、华岭股份：矽格在台湾第三方测试厂中稳居前列，中国伟测/利扬在测试产能与客户上扩张快，但矽格在 AI/光通讯高端测试与规模上仍领先。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('欣铨','3264.TW','semiconductor','osat',true,'{"name":"欣铨","code":"3264.TW","industry":"semiconductor","seg":"osat","market":"US","listed":true,"cap":12,"rev":4.1,"pe":16,"gross":27.5,"revGrowth":-6.8,"desc":"台湾专业半导体测试厂，主营晶圆针测与成品测试，产品线集中于车用/安控、通讯/网通及通用 MCU 测试。积极争取晶圆代工大厂委外 CP 订单及 AI ASIC 测试。客户为国际 IDM 与晶圆代工厂。","latestTech":"2024 年营收约 131 亿新台币、年减 6.8%，龙潭新厂 2025 年中取得使用执照，布局 AI ASIC 测试。","spark":[11,10,11,12],"note":"国产替代对标伟测科技、利扬芯片、华岭股份：欣铨在车用/安控与网通芯片测试上具优势，中国第三方测试厂在通用测试领域替代加快，但车规测试认证与 AI ASIC 测试能力仍存差距。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('久元电子','6261.TW','semiconductor','osat',true,'{"name":"久元电子","code":"6261.TW","industry":"semiconductor","seg":"osat","market":"US","listed":true,"cap":5,"rev":1.5,"pe":15,"gross":30,"revGrowth":5,"desc":"台湾专业 IC 测试与设备厂商，提供晶圆测试、成品测试服务及测试设备，聚焦消费、通讯与 MCU 芯片测试。是台湾中小型第三方测试服务厂代表之一。客户为 IC 设计与 IDM 厂商。","latestTech":"持续拓展晶圆测试与成品测试业务，布局车用与工控测试需求。","spark":[4.5,4.8,4.6,5],"note":"国产替代对标伟测科技、利扬芯片、华岭股份：久元代表台湾中小型第三方测试厂，中国第三方测试厂在通用与成熟制程测试已具替代能力，差距主要在高端测试平台与客户认证。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('Amkor','AMKR.US','semiconductor','osat',true,'{"name":"Amkor","code":"AMKR.US","industry":"semiconductor","seg":"osat","market":"US","listed":true,"cap":126,"rev":63.18,"pe":23,"gross":14.8,"revGrowth":-2.8,"desc":"全球第二大半导体封测（OSAT）厂，提供存储与逻辑芯片的先进封装（倒装、晶圆级）及主流封装测试。存储封测是其业务组成之一，同时强于 SiP 与先进封装。客户涵盖全球存储、汽车与消费电子厂商。","latestTech":"2024 年营收 63.18 亿美元、同比 -2.8%，越南新厂量产并获 CHIPS 法案资助强化美国制造。","spark":[120,80,90,126],"note":"国产替代对标深科技、太极实业、长电科技：Amkor 在存储与先进 SiP 封测上全球领先，中国封测厂在存储封测领域随存储厂扩产成长，但在先进封装技术、规模与全球客户上仍有差距。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;

insert into research_companies (name, code, industry, seg, listed, data)
values ('华泰电子','2329.TW','semiconductor','osat',true,'{"name":"华泰电子","code":"2329.TW","industry":"semiconductor","seg":"osat","market":"US","listed":true,"cap":37,"rev":5.08,"pe":24.1,"gross":14.4,"revGrowth":-2.5,"desc":"台湾封测与 EMS 厂，半导体封测业务以 NAND Flash 封测为主（占约 53%），并提供记忆体模组 EMS 代工。主要客户为金士顿、群联、江波龙等存储模组厂商，产品用于 SSD、手机及服务器。","latestTech":"2024 年营收 162.77 亿新台币、年减 2.5%，受益 AI 伺服器与边缘 AI 带动记忆体需求回温。","spark":[25,20,30,37],"note":"国产替代对标深科技、太极实业：华泰是以 NAND Flash 封测为核心的专业厂，与深科技存储封测业务高度对标，中国存储封测随长江存储扩产而成长，双方在 NAND 封测领域竞争激烈，差距逐步缩小。","tech":[],"funding":[]}'::jsonb)
on conflict (name) do update set code=excluded.code, industry=excluded.industry, seg=excluded.seg, listed=excluded.listed, data=excluded.data;
