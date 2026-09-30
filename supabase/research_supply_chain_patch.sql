-- 供应链补录 34 家（equipment 11 / material 20 / terminal 2 / design 1：含新凯来与森国科）
-- 依据：WebSearch 核实（2026-09），幂等 upsert

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('天仁微纳', '—', 'semiconductor', 'equipment', false, 'C 轮', null, null, null, '2022-09', '{"name":"天仁微纳","code":"—","industry":"semiconductor","seg":"equipment","listed":false,"desc":"国内纳米压印光刻设备龙头，微纳光学晶圆级加工市占率超九成，中芯聚源与华为哈勃投资。","execChanges":[],"latestTech":"微纳光学晶圆级纳米压印设备市占率超 90%，国内唯一 DOE 量产设备商","tech":[],"funding":[{"date":"2022-09","round":"C 轮","amount":"数亿元","inv":"前海母基金 / 深创投 / 山东财金等"}],"round":"C 轮","lastFunding":"2022-09","latestFunding":"2022-09 · C 轮"}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('费勉仪器', '—', 'semiconductor', 'equipment', false, 'C++ 轮', null, null, null, '2026-05', '{"name":"费勉仪器","code":"—","industry":"semiconductor","seg":"equipment","listed":false,"desc":"复旦系高端仪器平台商，真空/低温/薄膜/等离子四大技术底座，晶圆级 MBE 薄膜设备批量交付头部晶圆厂。","execChanges":[],"latestTech":"晶圆级 MBE 设备批量交付国内头部半导体企业","tech":[],"funding":[{"date":"2026-05","round":"C++ 轮","amount":"数亿元","inv":"复容投资 / 元禾控股 / 深创投等"}],"round":"C++ 轮","lastFunding":"2026-05","latestFunding":"2026-05 · C++ 轮"}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('特思迪', '—', 'semiconductor', 'equipment', false, 'B+ 轮', null, null, null, '2024', '{"name":"特思迪","code":"—","industry":"semiconductor","seg":"equipment","listed":false,"desc":"国内唯一规模化量产化合物半导体减薄磨抛 CMP 装备企业，SiC 衬底磨抛设备市占率第一，供货天科合达、比亚迪。","execChanges":[],"latestTech":"SiC 衬底磨抛设备市占率国内第一，覆盖减薄/研磨/抛光/CMP 全工序","tech":[],"funding":[{"date":"2022","round":"战略投资","inv":"华为哈勃"},{"date":"2023","round":"B 轮"},{"date":"2024","round":"B+ 轮"}],"round":"B+ 轮","lastFunding":"2024","latestFunding":"2024 · B+ 轮"}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('全芯微电子', '—', 'semiconductor', 'equipment', false, '战略融资', null, null, null, '2025-01', '{"name":"全芯微电子","code":"—","industry":"semiconductor","seg":"equipment","listed":false,"desc":"半导体匀胶显影与去胶剥离设备商，覆盖化合物半导体、LED、MEMS 与先进封装，哈勃与华登投资。","execChanges":[],"latestTech":"匀胶显影机覆盖化合物半导体、LED、MEMS 与先进封装","tech":[],"funding":[{"date":"2020-11","round":"战略投资","inv":"华为哈勃 / 华登国际"},{"date":"2025-01","round":"战略融资","inv":"宁波通商基金"}],"round":"战略融资","lastFunding":"2025-01","latestFunding":"2025-01 · 战略融资"}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('强一股份', '688809.SH', 'semiconductor', 'equipment', true, null, 613.0, null, 6.41, null, '{"name":"强一股份","code":"688809.SH","industry":"semiconductor","seg":"equipment","listed":true,"desc":"国内 MEMS 探针卡龙头，自主 MEMS 探针技术打破境外垄断，2025 年 12 月科创板上市。","execChanges":[],"latestTech":"MEMS 探针卡收入占比约 96%，2026H1 毛利率约 64%","tech":[],"funding":[],"cap":613.0,"rev":6.41}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('杰冯测试', '—', 'semiconductor', 'equipment', false, '战略融资', null, null, null, '2021-10', '{"name":"杰冯测试","code":"—","industry":"semiconductor","seg":"equipment","listed":false,"desc":"马来西亚 JF Technology 与华为哈勃合资的集成电路测试接触方案商，主营测试探针与测试插座。","execChanges":[],"latestTech":"测试探针与测试插座深度绑定华为供应链","tech":[],"funding":[{"date":"2021-10","round":"战略融资（增资）","inv":"华为哈勃（持股 45%）"}],"round":"战略融资","lastFunding":"2021-10","latestFunding":"2021-10 · 战略融资（哈勃增资持股 45%）"}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('中科晶禾', '—', 'semiconductor', 'equipment', false, '战略融资', null, null, null, '2023-04', '{"name":"中科晶禾","code":"—","industry":"semiconductor","seg":"equipment","listed":false,"desc":"晶圆异质集成键合装备商，2026 年 7 月并入青禾晶元集团成为全资子公司，此前获哈勃战略投资。","execChanges":[],"latestTech":"常温晶圆键合设备入选首批国家颠覆性技术创新专项","tech":[],"funding":[{"date":"2022-09","round":"战略投资","inv":"华为哈勃"},{"date":"2023-04","round":"战略融资","inv":"海河产业基金"}],"round":"战略融资","lastFunding":"2023-04","latestFunding":"2026-07 并入青禾晶元集团"}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('中科艾尔', '—', 'semiconductor', 'equipment', false, 'B 轮', null, null, null, '2026-01', '{"name":"中科艾尔","code":"—","industry":"semiconductor","seg":"equipment","listed":false,"desc":"半导体超高纯管阀件国产化代表企业，EP 管与气路零配件打破国外垄断，中科院微电子所合资背景。","execChanges":[],"latestTech":"EP 管路/减压阀/阀门进入中芯国际合格供应商体系","tech":[],"funding":[{"date":"2026-01","round":"B 轮","inv":"青松资本"}],"round":"B 轮","lastFunding":"2026-01","latestFunding":"2026-01 · B 轮"}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('山口精工', '—', 'semiconductor', 'equipment', false, 'C 轮', null, null, null, '2026-05', '{"name":"山口精工","code":"—","industry":"semiconductor","seg":"equipment","listed":false,"desc":"中国特微型精密轴承制造商，为半导体设备晶圆传输机械臂供超精密真空轴承，哈勃 2021 年入股。","execChanges":[],"latestTech":"晶圆传输机械臂超精密真空轴承供货应用材料","tech":[],"funding":[{"date":"2021","round":"战略投资","inv":"华为哈勃"},{"date":"2026-05","round":"C 轮","amount":"数亿元","inv":"比亚迪 / 东方嘉富等"}],"round":"C 轮","lastFunding":"2026-05","latestFunding":"2026-05 · C 轮"}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('先普科技', '874935.NQ', 'semiconductor', 'equipment', true, null, null, null, null, null, '{"name":"先普科技","code":"874935.NQ","industry":"semiconductor","seg":"equipment","listed":true,"desc":"国内首家 9N 级气体纯化器制造商，POU 纯化器/过滤器配套晶圆厂外延与 CVD 工艺，哈勃与中芯聚源投资。","execChanges":[],"latestTech":"9N 级气体纯化器配套外延与 CVD 工艺，北交所 IPO 辅导中","tech":[],"funding":[]}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('瀚天天成', '02726.HK', 'semiconductor', 'material', true, null, 330.0, null, null, null, '{"name":"瀚天天成","code":"02726.HK","industry":"semiconductor","seg":"material","listed":true,"desc":"全球最大 SiC 外延晶片供应商（2024 年份额 31.6%），率先量产 8 英寸并全球首发 12 英寸，华为哈勃持股。","execChanges":[],"latestTech":"2025 年 12 月全球首发 12 英寸 SiC 外延晶片","tech":[],"funding":[],"cap":330.0}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('天域半导体', '02658.HK', 'semiconductor', 'material', true, null, 173.0, null, null, null, '{"name":"天域半导体","code":"02658.HK","industry":"semiconductor","seg":"material","listed":true,"desc":"国内首家专业 SiC 外延片企业，4/6/8 英寸全体系，2024 年中国收入份额 30.6% 居首、全球第三。","execChanges":[],"latestTech":"8 英寸 SiC 外延放量，年产能 80 万片","tech":[],"funding":[],"cap":173.0}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('天科合达', '—', 'semiconductor', 'material', false, 'IPO 已受理', null, 175.0, null, '2023', '{"name":"天科合达","code":"—","industry":"semiconductor","seg":"material","listed":false,"desc":"国内导电型 SiC 衬底双龙头之一，8 英寸量产，股东含宁德时代、大基金、华为哈勃，科创板 IPO 已受理。","execChanges":[],"latestTech":"8 英寸导电型衬底量产，2024 年全球导电型份额约 17.3%","tech":[],"funding":[{"date":"2023","round":"Pre-IPO"}],"valuation":175.0,"round":"IPO 已受理","lastFunding":"2023","latestFunding":"2026-07 · 科创板 IPO 已受理（拟募 27.8 亿元）"}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('鑫耀半导体', '—', 'semiconductor', 'material', false, '战略融资', null, 19.0, null, '2026-05', '{"name":"鑫耀半导体","code":"—","industry":"semiconductor","seg":"material","listed":false,"desc":"国内稀缺 GaAs/InP 化合物衬底制造商，云南锗业控股，哈勃与深创投入股。","execChanges":[],"latestTech":"GaAs/InP 衬底扩产，黄冈高品质砷化镓晶片基地建设中","tech":[],"funding":[{"date":"2024-12","round":"增资","inv":"深创投新材料基金"},{"date":"2026-05","round":"增资","amount":"0.56 亿元","inv":"于跃（获 2.97% 股权）"}],"valuation":19.0,"round":"战略融资","lastFunding":"2026-05","latestFunding":"2026-05 · 增资（投后约 18.9 亿元）"}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('晶正电子', '—', 'semiconductor', 'material', false, '战略融资', null, null, null, '2026-04', '{"name":"晶正电子","code":"—","industry":"semiconductor","seg":"material","listed":false,"desc":"全球首家铌酸锂单晶薄膜（LNOI）商业化企业，3-6 英寸薄膜晶圆全球市占率第一，卡位光通信与光电计算。","execChanges":[],"latestTech":"全球首款 170GHz 薄膜铌酸锂调制器发布（2026-03）","tech":[],"funding":[{"date":"2026-04","round":"战略融资","amount":"5000 万元","inv":"南京中银 AIC 基金"}],"round":"战略融资","lastFunding":"2026-04","latestFunding":"2026-04 · 战略融资"}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('烯晶半导体', '—', 'semiconductor', 'material', false, 'Pre-A++ 轮', null, null, null, '2026-02', '{"name":"烯晶半导体","code":"—","industry":"semiconductor","seg":"material","listed":false,"desc":"国内首家半导体碳纳米管研发量产企业，建成全球首条 8 英寸碳纳米管晶圆中试线，哈勃与元禾投资。","execChanges":[],"latestTech":"全球首条 8 英寸碳纳米管晶圆中试线（2025 年建成）","tech":[],"funding":[{"date":"2024-09","round":"天使轮","inv":"华为哈勃 / 元禾控股"},{"date":"2026-02","round":"Pre-A+ / Pre-A++","inv":"首都科发集团 / 光谷产业投资等"}],"round":"Pre-A++ 轮","lastFunding":"2026-02","latestFunding":"2026-02 · Pre-A++ 轮"}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('博康信息', '—', 'semiconductor', 'material', false, 'Pre-IPO', null, 70.0, null, '2023-11', '{"name":"博康信息","code":"—","industry":"semiconductor","seg":"material","listed":false,"desc":"国内唯一光刻胶单体—成品胶全产业链厂商，ArF/KrF 胶覆盖 80 余家晶圆厂，大基金二期重仓。","execChanges":[],"latestTech":"ArF 湿法胶推进至 14nm，覆盖 80 余家晶圆厂","tech":[],"funding":[{"date":"2021","round":"战略投资","amount":"3 亿元","inv":"华为哈勃"},{"date":"2023-11","round":"Pre-IPO","amount":"超 6 亿元"}],"valuation":70.0,"round":"Pre-IPO","lastFunding":"2023-11","latestFunding":"2023-11 · Pre-IPO（投后 70 亿元）"}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('阜阳欣奕华', '—', 'semiconductor', 'material', false, 'IPO 辅导', null, null, null, '2023-06', '{"name":"阜阳欣奕华","code":"—","industry":"semiconductor","seg":"material","listed":false,"desc":"显示光刻胶龙头，彩色光阻与 TFT 光刻胶国内市占率超 15%，客户京东方、TCL 华星，半导体胶进入验证出货。","execChanges":[],"latestTech":"半导体 g/i 线及 KrF 光刻胶进入验证出货","tech":[],"funding":[{"date":"2023-06","round":"D 轮","amount":"超 5 亿元","inv":"盛景嘉成等"}],"round":"IPO 辅导","lastFunding":"2023-06","latestFunding":"2024-08 · A 股 IPO 辅导备案"}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('玟昕科技', '—', 'semiconductor', 'material', false, 'B+ 轮', null, null, null, '2025-05', '{"name":"玟昕科技","code":"—","industry":"semiconductor","seg":"material","listed":false,"desc":"光热固化功能材料平台商，感光 OC、PSPI、Underfill 用于显示与先进封装，量产多款填补国产空白的光刻胶。","execChanges":[],"latestTech":"感光 OC/PSPI/Underfill 多款产品填补国产空白","tech":[],"funding":[{"date":"2025-05","round":"B+ 轮","amount":"近亿元","inv":"方广资本领投"}],"round":"B+ 轮","lastFunding":"2025-05","latestFunding":"2025-05 · B+ 轮"}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('德智新材', '—', 'semiconductor', 'material', false, 'C 轮', null, null, null, '2023', '{"name":"德智新材","code":"—","industry":"semiconductor","seg":"material","listed":false,"desc":"国内头部 SiC 涂层石墨基座与 SiC 刻蚀环供应商，CVD 工艺率先实现半导体级 Solid SiC 组件国产量产。","execChanges":[],"latestTech":"Solid SiC 刻蚀组件率先实现国产量产","tech":[],"funding":[{"date":"2023","round":"C 轮","amount":"超 6 亿元","inv":"国风投 / 中信证券投资 / 中车资本 / 哈勃等"}],"round":"C 轮","lastFunding":"2023","latestFunding":"2023 · C 轮（超 6 亿元）"}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('灿勤科技', '688182.SH', 'semiconductor', 'material', true, null, 116.0, null, null, null, '{"name":"灿勤科技","code":"688182.SH","industry":"semiconductor","seg":"material","listed":true,"desc":"微波介质陶瓷元器件龙头，介质滤波器占收入约 83%，拓展 HTCC 陶瓷封装管壳与基板。","execChanges":[],"latestTech":"HTCC 陶瓷封装管壳与基板拓展，2026H1 营收 +108.6%","tech":[],"funding":[],"cap":116.0}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('本诺电子', '—', 'semiconductor', 'material', false, 'C 轮', null, null, null, '2023-12', '{"name":"本诺电子","code":"—","industry":"semiconductor","seg":"material","listed":false,"desc":"电子级胶粘剂厂商，芯片粘贴胶、组装胶与密封胶用于半导体封装与电子组装，国家级专精特新小巨人。","execChanges":[],"latestTech":"ExBond 芯片粘贴胶服务华为、京东方等 200 余家客户","tech":[],"funding":[{"date":"2021-02","round":"战略投资","inv":"华为哈勃"},{"date":"2023-12","round":"C 轮","amount":"0.5 亿元","inv":"农银投资"}],"round":"C 轮","lastFunding":"2023-12","latestFunding":"2023-12 · C 轮"}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('锦艺新材', '—', 'semiconductor', 'material', false, 'IPO 已问询', null, null, null, '2026-07', '{"name":"锦艺新材","code":"—","industry":"semiconductor","seg":"material","listed":false,"desc":"高等级覆铜板用球形硅微粉全球市占率超 40%，客户覆盖全球前十大 CCL 厂，终端英伟达、AMD，哈勃持股 4.44%。","execChanges":[],"latestTech":"球形硅微粉全球市占率超 40% 居第一","tech":[],"funding":[],"round":"IPO 已问询","lastFunding":"2026-07","latestFunding":"2026-07 · 创业板 IPO 已问询（拟募 22.19 亿元）"}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('德创高新材料', '—', 'semiconductor', 'material', false, 'B 轮', null, null, null, '2025-12', '{"name":"德创高新材料","code":"—","industry":"semiconductor","seg":"material","listed":false,"desc":"ACF 异方性导电膜国产研发商，用于集成电路封装互连，哈勃 2023 年 A 轮入股。","execChanges":[],"latestTech":"ACF 异方性导电膜国产化研发","tech":[],"funding":[{"date":"2023","round":"A 轮","inv":"华为哈勃 / 芯动能"},{"date":"2025-12","round":"B 轮","inv":"浙创投"}],"round":"B 轮","lastFunding":"2025-12","latestFunding":"2025-12 · B 轮"}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('中江科易', '—', 'semiconductor', 'material', false, 'A 轮', null, null, null, '2025-02', '{"name":"中江科易","code":"—","industry":"semiconductor","seg":"material","listed":false,"desc":"氧化铝/氮化铝覆铜陶瓷基板商（DBC/DPC/AMB），用于功率模块封装，哈勃持股 15%。","execChanges":[],"latestTech":"DBC/AMB 覆铜陶瓷基板供货安森美、宏微科技","tech":[],"funding":[{"date":"2023-08","round":"天使轮","inv":"华为哈勃（持股 15%）"},{"date":"2025-02","round":"A 轮","amount":"近亿元","inv":"南京市创投等"}],"round":"A 轮","lastFunding":"2025-02","latestFunding":"2025-02 · A 轮（近亿元）"}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('清连科技', '—', 'semiconductor', 'material', false, 'A+ 轮', null, null, null, '2024-12', '{"name":"清连科技","code":"—","industry":"semiconductor","seg":"material","listed":false,"desc":"高可靠芯片封装材料商，烧结银/铜膏与焊片服务功率半导体封装国产化，哈勃、元禾、光速光合投资。","execChanges":[],"latestTech":"烧结银膏产能 10 吨/年（2025 年建成）","tech":[],"funding":[{"date":"2024-12","round":"A+ 轮","amount":"数千万元","inv":"冯源资本领投"}],"round":"A+ 轮","lastFunding":"2024-12","latestFunding":"2024-12 · A+ 轮"}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('赛墨科技', '—', 'semiconductor', 'material', false, 'B+ 轮', null, null, null, null, '{"name":"赛墨科技","code":"—","industry":"semiconductor","seg":"material","listed":false,"desc":"高导热金属基复合材料商（金刚石铜/铝），用于大功率芯片封装散热，中科院宁波材料所孵化、江铜集团投资。","execChanges":[],"latestTech":"金刚石铜微通道散热模组批量应用于曙光 MW 级液冷整机柜","tech":[],"funding":[],"round":"B+ 轮"}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('一盛新材料', '—', 'semiconductor', 'material', false, null, null, null, null, null, '{"name":"一盛新材料","code":"—","industry":"semiconductor","seg":"material","listed":false,"desc":"哈工大团队孵化的金刚石/铜、SiC/铝高导热复合材料商，供货电科与航天院所，向光模块与算力散热拓展。","execChanges":[],"latestTech":"金刚石/铜与 SiC/铝复合材料供货中国电科与航天院所","tech":[],"funding":[]}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('富烯科技', '—', 'semiconductor', 'material', false, null, null, null, null, null, '{"name":"富烯科技","code":"—","industry":"semiconductor","seg":"material","listed":false,"desc":"国内最大石墨烯导热膜供应商（2021 年国内份额 85%），服务华为、荣耀，科创板 IPO 曾于 2023 年终止。","execChanges":[],"latestTech":"E 系列石墨烯导热膜导热系数超 1800W/mK","tech":[],"funding":[]}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('心电科技', '—', 'semiconductor', 'material', false, '天使轮', null, null, null, '2025-11', '{"name":"心电科技","code":"—","industry":"semiconductor","seg":"material","listed":false,"desc":"电磁功能材料商，超薄高磁导率吸波/屏蔽薄膜用于 3C 电子 EMC，武汉理工团队孵化，哈勃 2025 年入股。","execChanges":[],"latestTech":"超薄高磁导率吸波薄膜用于 3C 电子 EMC","tech":[],"funding":[{"date":"2025-11","round":"战略入股","inv":"华为哈勃（1.85%）"}],"round":"天使轮","lastFunding":"2025-11","latestFunding":"2025-11 · 哈勃战略入股（1.85%）"}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('华丰科技', '688629.SH', 'semiconductor', 'terminal', true, null, 547.0, null, null, null, '{"name":"华丰科技","code":"688629.SH","industry":"semiconductor","seg":"terminal","listed":true,"desc":"国内光电连接器骨干企业，全自研 224G 高速背板连接器进入华为、中兴、浪潮服务器供应链。","execChanges":[],"latestTech":"224G 高速背板连接器可批量交付，布局 6.4T NPO 光模块","tech":[],"funding":[],"cap":547.0}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data) values ('庆虹电子', '—', 'semiconductor', 'terminal', false, '战略融资', null, null, null, '2020', '{"name":"庆虹电子","code":"—","industry":"semiconductor","seg":"terminal","listed":false,"desc":"华为参股的高速连接器与高速线缆厂商，产品覆盖背板、存储与汽车连接器，服务数据中心与汽车电子。","execChanges":[],"latestTech":"背板/存储/汽车连接器绑定华为供应链","tech":[],"funding":[],"round":"战略融资","lastFunding":"2020","latestFunding":"2020 · 战略融资（华为参股）"}')
  on conflict (name) do update set code = excluded.code, industry = excluded.industry,
    seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
    valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
    data = excluded.data, updated_at = now();

-- 新凯来（SiCarrier）：深圳国资委全资设备平台商，投前估值约 650 亿元（2025-09），计划 2027 年 IPO
insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data)
values ('新凯来', '—', 'semiconductor', 'equipment', false, 'Pre-IPO', null, 650, null, '2025-09',
 '{"name":"新凯来","code":"—","industry":"semiconductor","seg":"equipment","listed":false,"desc":"深圳国资委全资控股的半导体设备平台商（脱胎于华为 2012 实验室），六大类设备覆盖刻蚀、薄膜沉积与量检测，在手订单超百亿元。","valuation":650,"round":"Pre-IPO","lastFunding":"2025-09","latestFunding":"2025-09 · 第二轮融资接近尾声（投前约 650 亿元，上轮投后约 500 亿元）","execChanges":[],"latestTech":"六大类设备 2025 年起量产交付，覆盖刻蚀、薄膜沉积与量检测","tech":[{"date":"2025-03","kind":"产品动态","title":"SEMICON China 首发六大类设备，多产品线以名山命名并进入产线"}],"funding":[{"date":"2025-09","round":"新一轮融资（接近尾声）","amount":"投前估值约 650 亿元"}]}'::jsonb)
on conflict (name) do update set code = excluded.code, industry = excluded.industry,
  seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
  valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
  data = excluded.data, updated_at = now();

-- 森国科：SiC 功率器件 Fabless（深圳），C 轮亿元级（中金资本领投），两度入选中国 SiC Fabless 十强
insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data)
values ('森国科', '—', 'semiconductor', 'design', false, 'C 轮', null, 15, null, '2021-12',
 '{"name":"森国科","code":"—","industry":"semiconductor","seg":"design","listed":false,"desc":"SiC 功率器件 Fabless（深圳，2013 年成立），650V–2200V 二极管/MOSFET 系列化，X-FAB 6 英寸车规级代工，两度入选中国 SiC Fabless 十强，并延伸 IGBT/超结 MOSFET/驱动芯片/MCU 产品矩阵。","valuation":15,"round":"C 轮","lastFunding":"2021-12","latestFunding":"2021-12 · C 轮（亿元级，中金资本领投）","execChanges":[],"latestTech":"第五代 TMPS SiC 二极管量产（良率 97%+），100+ 客户覆盖光伏/充电桩/服务器电源","tech":[{"date":"2025-12","kind":"荣誉","title":"荣膺 2025 年度中国碳化硅器件 Fabless 十强"},{"date":"2025-01","kind":"产品动态","title":"推出 2200V SiC 二极管等高压新品"}],"funding":[{"date":"2021-12","round":"C 轮","amount":"亿元级","inv":"中金资本领投，中科海创基金（科技部国家科技成果转化引导基金子基金）、凌霄泵业（002884.SZ）跟投"}]}'::jsonb)
on conflict (name) do update set code = excluded.code, industry = excluded.industry,
  seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
  valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
  data = excluded.data, updated_at = now();

-- 鸿富诚：AI 热管理材料（深圳），2026-09-29 创业板上市（301716.SZ），石墨烯导热垫片供货全球头部 AI 芯片企业
insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data)
values ('鸿富诚', '301716.SZ', 'semiconductor', 'material', true, '已上市', 450, null, 7.07, null,
 '{"name":"鸿富诚","code":"301716.SZ","industry":"semiconductor","seg":"material","listed":true,"round":"已上市","desc":"AI 热管理材料小巨人，石墨烯导热垫片进入全球头部 AI 芯片供应链，国内极少数实现 TIM1 小批量供货。","cap":450,"pe":167,"rev":7.07,"revGrowth":114.3,"gross":65.56,"rd":4.6,"spark":[2.6,3.3,7.07],"latestTech":"创业板上市，TIM1 小批量供货全球头部 AI 芯片企业","tech":[{"date":"2026-09","title":"创业板上市（301716.SZ），发行价 76.86 元，开盘涨 680% 报 600 元，市值约 450 亿"},{"date":"2025-12","title":"金属碳基复合材料放量，年收入从 41 万跃升至 1.92 亿"},{"date":"2025-06","title":"石墨烯导热垫片（130 W/m·K）批量供货，切入 TIM1"}],"funding":[]}'::jsonb)
on conflict (name) do update set code = excluded.code, industry = excluded.industry,
  seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
  valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
  data = excluded.data, updated_at = now();

-- 炎黄国芯：宇航级高可靠电源管理芯片（北京，2016 年起源北大），抗辐照 LDO 打破国外禁运
insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data)
values ('炎黄国芯', '—', 'semiconductor', 'design', false, 'B+ 轮', null, null, null, '2025-05',
 '{"name":"炎黄国芯","code":"—","industry":"semiconductor","seg":"design","listed":false,"desc":"宇航级高可靠电源管理芯片，抗辐照 LDO 打破国外禁运（单价从数万元降至 4000 元），国产宇航模拟芯片标杆。","round":"B+ 轮","lastFunding":"2025-05","latestFunding":"2025-05 · B+ 轮（超亿元，池州投资控股集团、梅花创投）","execChanges":[],"latestTech":"0.8μV RMS 超低噪声 LDO 突破：集成 100V 高压输入与全集成防反接保护，性能对标国际一线","tech":[{"date":"2025-12","kind":"产品动态","title":"实现国内最低噪声水平 0.8μV RMS，集成 100V 高压输入与全集成防反接保护"},{"date":"2024-07","kind":"荣誉","title":"牵头入选北京市科委 2024 年度车规级芯片科技攻关「揭榜挂帅」项目"},{"date":"2019-06","kind":"产品动态","title":"首款高端抗辐照电源管理芯片量产，价格从数万元降至 4000 元"}],"funding":[{"date":"2025-05","round":"B+ 轮","amount":"超亿元","inv":"池州投资控股集团、梅花创投（用于池州落地封测产能）"},{"date":"2024-07","round":"B 轮","amount":"近亿元","inv":"九智资本、杭州临平区产业招商基金（民品总部落户临平）"},{"date":"2023-04","round":"A++ 轮","amount":"未披露","inv":"九智资本"},{"date":"2022-12","round":"A+ 轮","amount":"数千万","inv":"梅花创投"},{"date":"2022-06","round":"A 轮","amount":"未披露","inv":"善达投资、悦达善达母基金"}]}'::jsonb)
on conflict (name) do update set code = excluded.code, industry = excluded.industry,
  seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
  valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
  data = excluded.data, updated_at = now();

-- 成都华微：宇航级抗辐照 FPGA 骨干企业（成都，科创板 688709，中国振华系），FPGA+高速ADC+星载TSN
insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data)
values ('成都华微', '688709.SH', 'semiconductor', 'design', true, '已上市', 258, null, 7.6, null,
 '{"name":"成都华微","code":"688709.SH","industry":"semiconductor","seg":"design","listed":true,"round":"已上市","desc":"宇航级抗辐照 FPGA 骨干企业，五百万门至七千万门产品谱系，配套高速 ADC 与星载 TSN，深度绑定航天科技/科工集团。","cap":258,"pe":167.5,"rev":7.6,"revGrowth":25.85,"gross":69.95,"rd":20,"spark":[6,6.4,7.6],"latestTech":"抗辐照 FPGA 五百万门至七千万门谱系，向亿门级迈进；4 通道 12 位 40GSPS 射频直采 ADC 填补国内空白","tech":[{"date":"2026-06","kind":"产品动态","title":"抗辐照 FPGA + 高速 ADC + 星载 TSN 三线布局，产品小批量试用于低轨卫星系统验证"},{"date":"2026-01","kind":"产品动态","title":"8 位 64G 超高速 ADC 抗辐照能力达 75MeV，4 通道 40GSPS 射频直采 ADC 获意向订单"}],"funding":[]}'::jsonb)
on conflict (name) do update set code = excluded.code, industry = excluded.industry,
  seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
  valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
  data = excluded.data, updated_at = now();

-- 紫光同创：国产通用 FPGA 龙头（深圳），Titan-3 亿门级国内首创，科创板 IPO 辅导完成
insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data)
values ('紫光同创', '—', 'semiconductor', 'design', false, 'Pre-IPO', null, 135, null, '2026-01',
 '{"name":"紫光同创","code":"—","industry":"semiconductor","seg":"design","listed":false,"desc":"国产通用 FPGA 龙头（深圳），Titan-3 亿门级高端 FPGA 国内首创，五大产品家族近百量产型号，科创板 IPO 辅导完成。","valuation":135,"round":"Pre-IPO","lastFunding":"2026-01","latestFunding":"2026-01 · 新一轮（北京京国管基金新进 5% 以上股东）；累计融资超 40 亿元","execChanges":[],"latestTech":"Titan-3 系列亿门级高端 FPGA 首发（FinFET 工艺），国内第一款自主产权亿门级高端 FPGA；PG2L50M 通过 AEC-Q100 Grade2 车规认证","tech":[{"date":"2026-07","kind":"产品动态","title":"PG2L50M 通过 AEC-Q100 Grade2 车规认证；高端 FPGA 亮相慕尼黑上海电子展"},{"date":"2025-07","kind":"产品动态","title":"Titan-3 系列亿门级高端 FPGA 首发，采用 FinFET 工艺填补国内空白"}],"funding":[{"date":"2026-01","round":"新一轮（Pre-IPO 前）","amount":"未披露","inv":"北京京国管股权投资基金（新进 5% 以上股东）"},{"date":"2018-01","round":"天使轮起累计","amount":"超 40 亿元","inv":"深创投、高瓴创投、金沙江联合资本、中金、陕西文投、诺瓦星云"}]}'::jsonb)
on conflict (name) do update set code = excluded.code, industry = excluded.industry,
  seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
  valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
  data = excluded.data, updated_at = now();

-- 紫光股份：从 semiconductor.terminal 迁移至 ai.hw（ICT 基础设施/算力硬件）
update research_companies set industry = 'ai', seg = 'hw', rev = 967.48,
  data = jsonb_set(jsonb_set(data, '{industry}', '"ai"'), '{seg}', '"hw"')
where name = '紫光股份';

-- 曦诺未来（Xynova）：灵巧手全栈自研（杭州，2024-12 成立），全球首款「腱绳+直驱」混驱量产灵巧手，A+ 轮后估值约 72 亿元
insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data)
values ('曦诺未来', '—', 'robotics', 'humanoid', false, 'A+ 轮', null, 72, null, '2026-07',
 '{"name":"曦诺未来","code":"—","industry":"robotics","seg":"humanoid","listed":false,"desc":"灵巧手全栈自研方案商（杭州，2024 年底成立），全球首款「腱绳+直驱」混驱量产灵巧手，成立一年半融资近 15 亿跻身独角兽。","round":"A+ 轮","valuation":72,"lastFunding":"2026-07","latestFunding":"2026-07 · A+ 轮（5 亿元，美团领投，蔚来资本/招商局资本跟投）","execChanges":[],"latestTech":"Flex 2 全球首款「腱绳+电机直驱」混驱仿生灵巧手：23 自由度（19 主动+4 被动），手掌 400g，驱动力后置小臂，毫秒级响应、0.05N 力控精度","tech":[{"date":"2026-08","kind":"产品动态","title":"世界机器人大会首发直驱 22 自由度灵巧手 Prima 1，面向科研训练"},{"date":"2026-05","kind":"产品动态","title":"发布全球首款「腱绳+直驱」混驱仿生灵巧手 Flex 2"},{"date":"2025-08","kind":"产品动态","title":"推出全球首款全自研量产高自由度腱绳驱动灵巧手 Flex 1（25 自由度，手掌 380g，负载 30kg+）"}],"funding":[{"date":"2026-07","round":"A+ 轮","amount":"5 亿元","inv":"美团领投，蔚来资本/招商局资本/某互联网大厂跟投，小米战投加注"},{"date":"2026-05","round":"A 轮","amount":"数亿元","inv":"理想战投、中信建投资本/中信建投投资联合领投"},{"date":"2026-03","round":"Pre-A 轮","amount":"数亿元","inv":"京东领投，小米战投/财通资本/毅达资本/浙大友创/三七互娱跟投"},{"date":"2025-12","round":"天使轮","amount":"超亿元","inv":"宁德时代溥泉资本领投，小米战投/正轩资本/东方嘉富/电科基金跟投"}]}'::jsonb)
on conflict (name) do update set code = excluded.code, industry = excluded.industry,
  seg = excluded.seg, listed = excluded.listed, round = excluded.round, cap = excluded.cap,
  valuation = excluded.valuation, rev = excluded.rev, last_funding = excluded.last_funding,
  data = excluded.data, updated_at = now();

-- ============================================================
-- AI 金融子赛道（ai-app 下新增，2026-09 增补，共 6 家）
-- TREE ai-app 新增「AI 金融」；INDUSTRY_DATA ai/ai-app coCount 10 -> 16
-- ============================================================
INSERT INTO research_companies (name, code, industry, seg, listed, round, cap, rev, data) VALUES
('同花顺', '300033.SZ', 'ai', 'ai-app', true, '已上市', 1860, 60.29,
 '{"name":"同花顺","code":"300033.SZ","industry":"ai","seg":"ai-app","listed":true,"round":"已上市","cap":1860,"pe":53.13,"rev":60.29,"revGrowth":44.0,"gross":91.54,"rd":18.99,"spark":[35.6,41.86,60.29],"latestTech":"「问财」HithinkGPT 推出阶梯付费模式，C 端 AI 商业化从 0 到 1"}'::jsonb),
('东方财富', '300059.SZ', 'ai', 'ai-app', true, '已上市', 2850, 160.68,
 '{"name":"东方财富","code":"300059.SZ","industry":"ai","seg":"ai-app","listed":true,"round":"已上市","cap":2850,"pe":23.6,"rev":160.68,"revGrowth":38.46,"spark":[110.81,116.04,160.68],"latestTech":"「妙想」大模型全面接入东方财富 APP，妙想投研助理上线"}'::jsonb),
('恒生电子', '600570.SH', 'ai', 'ai-app', true, '已上市', 431, 57.83,
 '{"name":"恒生电子","code":"600570.SH","industry":"ai","seg":"ai-app","listed":true,"round":"已上市","cap":431,"pe":39.11,"rev":57.83,"revGrowth":-12.13,"gross":71.06,"rd":42.0,"spark":[72.81,65.81,57.83],"latestTech":"LightGPT 完成多轮升级并与华为昇腾全面适配，「光子」智能助手开放公测"}'::jsonb),
('金证股份', '600446.SH', 'ai', 'ai-app', true, '已上市', 120, 24.19,
 '{"name":"金证股份","code":"600446.SH","industry":"ai","seg":"ai-app","listed":true,"round":"已上市","cap":120,"pe":null,"rev":24.19,"revGrowth":-48.46,"gross":39.26,"rd":20.68,"spark":[62.21,46.93,24.19],"latestTech":"KOCA-AI 大模型应用平台支持 AI Agent 快速开发，FS2.5 嵌入 AI 模块"}'::jsonb),
('指南针', '300803.SZ', 'ai', 'ai-app', true, '已上市', 430, 21.46,
 '{"name":"指南针","code":"300803.SZ","industry":"ai","seg":"ai-app","listed":true,"round":"已上市","cap":430,"pe":188,"rev":21.46,"revGrowth":40.39,"spark":[11.13,15.29,21.46],"latestTech":"收购先锋基金 90.02% 股权，公募基金牌照纳入版图，构建财富管理闭环"}'::jsonb),
('九方智投控股', '09636.HK', 'ai', 'ai-app', true, '已上市', 100, 34.3,
 '{"name":"九方智投控股","code":"09636.HK","industry":"ai","seg":"ai-app","listed":true,"round":"已上市","cap":100,"pe":10.8,"rev":34.3,"revGrowth":48.7,"spark":[18.9,23.06,34.3],"latestTech":"AI 终端产品「九方智投 AI 股票机」贡献收入 2.4 亿元，成为全新增长点"}'::jsonb)
ON CONFLICT (name) DO UPDATE SET
  code = EXCLUDED.code, industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, cap = EXCLUDED.cap,
  rev = EXCLUDED.rev, data = research_companies.data || EXCLUDED.data;

-- ============================================================
-- AI 产业链完善（2026-09 增补，共 13 家）
-- 新增 TREE 顶层 ai-chip（AI 芯片/国产算力）；ai/hw 扩充至
-- AI 服务器、液冷散热、IDC/智算中心 三个细分；coCount 7 -> 16
-- ============================================================
INSERT INTO research_companies (name, code, industry, seg, listed, round, cap, rev, data) VALUES
('沐曦股份-AI视图', '688802.SH', 'ai', 'ai-chip', true, '已上市', 1956, 13.24,
 '{"name":"沐曦股份-AI视图","code":"688802.SH","industry":"ai","seg":"ai-chip","listed":true,"round":"已上市","desc":"国产 GPU 四小龙中商业化最扎实：CUDA 兼容路线，毛利率 57.22% 领先。","cap":1956,"pe":null,"rev":13.24,"revGrowth":44.67,"gross":57.22,"rd":39.65,"spark":[7.43,16.44,13.24],"latestTech":"MXMACA 芯片已适配超 6000 个 CUDA 应用、1000 余个 AI 模型","detail":"【技术路线】GPGPU + CUDA 兼容，主打降低开发者迁移成本，聚焦云与智算中心场景，优先追求商业落地而非参数领先。与摩尔线程的全功能通用路线、燧原的 DSA 专用路线、壁仞的超大算力训练路线形成差异化。\n【商业化】2026H1 营收 13.24 亿元（+44.67%），增速在四小龙中最低但盈利质量最优——毛利率 57.22% 居四家之首，已超过已盈利的寒武纪（55.15%）；扣非净利润亏损 0.49 亿元（同比收窄 75.83%），且**Q2 扣非已单季转正**，是四小龙中最接近真正盈利的一家。归母净利润 6.12 亿元看似扭亏，但其中公允价值变动收益高达 8.87 亿元（占利润总额 105.75%），剔除后利润总额实为负——这是最需要警惕的财务口径问题。\n【风险】2025-12-17 科创板上市，发行后股价最高 1033 元（2026-07-13），至 9 月已回调约 52%。2026-09-17 首次大规模解禁 1396.6 万股，流通盘扩大 75.4%；2028 年还有三轮共约 3.5 亿股解禁（占总股本 88.8%）。上游先进制程产能受限，优先供货华为/寒武纪，四小龙产能相对靠后。"}'::jsonb),
('摩尔线程-AI视图', '688795.SH', 'ai', 'ai-chip', true, '已上市', 1682, 17.36,
 '{"name":"摩尔线程-AI视图","code":"688795.SH","industry":"ai","seg":"ai-chip","listed":true,"round":"已上市","desc":"国产 GPU 第一股，全功能通用路线，2026H1 营收 17.36 亿领跑四小龙。","cap":1682,"pe":null,"rev":17.36,"revGrowth":147.42,"gross":56.95,"rd":null,"spark":[0.46,15.06,17.36],"latestTech":"自研 MUSA 元计算统一系统架构，集成图形渲染、AI 加速、科学计算、视频编解码四大引擎","detail":"【技术路线】全功能通用 GPU，自研 MUSA 架构兼做 AI 训练推理 + 图形渲染 + 科学计算，发力万卡集群；与仅聚焦 AI 算力的其他三家形成路线分野。\n【商业化】2026H1 营收 17.36 亿元（+147.42%），规模居四小龙之首，且半年营收已超 2025 年全年（15.06 亿元）。云端智算产品收入 16.93 亿元，占比约 97.5%，主要来自 MTT S5000 与夸娥智算集群的稳定供货。归母净利润 -0.12 亿元（大幅减亏），扣非亏损 1.51 亿元（同比收窄 52.37%），毛利率 56.95%。公司自述 2026H1 是「从技术验证走向规模化商业交付的重要阶段」。\n【风险】2025-12-05 上市，发行价 114.28 元，第 5 个交易日冲至 941.08 元后震荡下行，9 月已回调约 62%。**解禁压力为四小龙中最大**：2026-09-07 解禁 2577.45 万股（占流通股 85%），当日 20% 跌停；2026-12-07 上市满一年还将解禁 1.859 亿股（占股本 39.55%），流通盘将扩大约 3.3 倍——这是后续最直接的压力点。"}'::jsonb),
('燧原科技-AI视图', '688801.SH', 'ai', 'ai-chip', true, '已上市', 1899, 11.2,
 '{"name":"燧原科技-AI视图","code":"688801.SH","industry":"ai","seg":"ai-chip","listed":true,"round":"已上市","desc":"四小龙中最后上市，DSA 专用架构，腾讯贡献 83% 收入的强绑定模式。","cap":1899,"pe":null,"rev":11.2,"revGrowth":279.08,"gross":30.37,"rd":null,"spark":[0.0,3.0,11.2],"latestTech":"第五、第六代云端 GPU 芯片研发推进，芯片+板卡+集群一体化交付","detail":"【技术路线】DSA 专用架构，主动放弃通用并行计算能力，聚焦 AI 算力场景做专用优化；2026H1 毛利率仅 30.37%，显著低于其余三家（因推理产品占比过高，硬件配置相对训练产品做了裁剪）——专用架构的代价是单卡通用性弱、溢价能力低。\n【商业化】2026H1 营收 11.20 亿元（+279.08%），规模在四小龙中最小但增速第二；归母净利润 -6.32 亿元，**亏损规模居四家之首**且同比扩大 3.57%。核心特征是客户结构极度集中：**腾讯单一客户贡献约 83% 收入**，这既是订单确定性来源，也是最大的单点依赖风险。\n【风险】2026-09-11 登陆科创板，发行价 142.18 元，首日涨 179.22% 至 397 元，9-29 收 441.2 元、市值 1899 亿元。解禁密集：2027-03-11 / 2027-06-11 / 2027-09-13 分别解禁 22.95 万股 / 1630 万股 / 1.869 亿股（0.05% / 3.79% / 43.43%），2029 年还有实控人 1.9155 亿股。成立 2018 年，是四小龙中历史最久、资本化最晚的一家。"}'::jsonb),
('壁仞科技-AI视图', '6082.HK', 'ai', 'ai-chip', true, '已上市', 786, 12.36,
 '{"name":"壁仞科技-AI视图","code":"6082.HK","industry":"ai","seg":"ai-chip","listed":true,"round":"已上市","desc":"港股 GPU 第一股，坚持云端大算力训练路线，2026H1 营收增近 20 倍。","cap":786,"pe":null,"rev":12.36,"revGrowth":1997.56,"gross":42.7,"rd":null,"spark":[0.0,0.59,12.36],"latestTech":"「壁砺」系列产品已落地互联网企业、AI 大模型开发商、AI 数据中心、电信运营商场景","detail":"【技术路线】GPGPU + CUDA 生态兼容，坚持云端大算力训练芯片路线，聚焦超大算力卡；与其他三家相比最纯粹的「训练卡」定位。毛利率 42.7%，介于沐曦/摩尔（约 57%）与燧原（30.37%）之间。\n【商业化】2026H1 营收 12.36 亿元，**同比暴增 1997.56%（近 20 倍）**，增速居四小龙之首，但需注意这是上期极低基数导致的——2025 全年营收仅 10.35 亿元，意味着 2026H1 半年就超过了 2025 全年。智能计算解决方案收入 11.68 亿元，占比约 94.5%。经调整期内亏损 3.37 亿元（同比收窄 38.9%）。\n【风险】2026-01-02 港交所上市，募资 55.83 亿港元，是四小龙中唯一走港股路径的公司，也因此享受不到 A 股科创板对国产 GPU 的估值溢价——上市首日仅涨 70%，市值约 800 亿港元，显著低于同期科创板上市的同行。2026-07-02 解禁 1.479 亿股基石投资者股份，当日大跌 21.05%，至 9-29 收 37.36 港元、较解禁前跌近 40%。2027-01-02 还将解禁约 8.675 亿股（占股本 33.47%）。"}'::jsonb),
('英维克', '002837.SZ', 'ai', 'hw', true, '已上市', 1060, 30.17,
 '{"name":"英维克","code":"002837.SZ","industry":"ai","seg":"hw","listed":true,"round":"已上市","desc":"冷板式液冷龙头，唯一通过英伟达 NPN Tier1 系统级认证的国内厂商。","cap":1060,"pe":166,"rev":30.17,"revGrowth":17.24,"gross":null,"rd":null,"spark":[19.4,25.7,30.17],"latestTech":"Coolinside 全链条液冷冷板方案进入谷歌供应链，为谷歌 V7 机柜液冷提供 30% 份额关键组件","detail":"【行业地位】国内冷板式液冷龙头，也是目前唯一通过英伟达 NPN Tier 1 系统级认证的国内厂商；冷板、CDU、快接头全链条自研，具备从冷源端到散热端的闭环能力，已进入英伟达 MGX 生态。冷板式液冷国内市占率超 42%，CDU 市占率行业第一。客户覆盖字节、腾讯、Meta，并与谷歌洽谈数据中心冷却系统采购。\n【商业化】2026H1 营收 30.17 亿元（+17.24%），归母净利润 1.85 亿元（**同比 -14.32%**）。Q2 单季营收 18.41 亿元（环比 +56.67%），归母净利润 1.76 亿元（环比 +1934.17%），拐点信号明显。机构预计 2026-2028 年归母净利润 11.1 / 21.2 / 33.9 亿元。单柜价值量约 35 万元，预计 2026 年相关收入增量可达 85 亿元。\n【风险】利润承压主因是产能扩张带来的成本前置——Q1 财务费用同比增长 77 倍，应收账款计提坏账准备与存货跌价准备增加。当前 PE 约 166 倍，龙头溢价明显。液冷板块的共性问题：行业景气度与个股业绩兑现之间存在「温差」，2026H1 五家液冷头部公司仅同飞股份和高澜股份净利正增长。"}'::jsonb),
('曙光数创', '872808.BJ', 'ai', 'hw', true, '已上市', 60, 2.46,
 '{"name":"曙光数创","code":"872808.BJ","industry":"ai","seg":"hw","listed":true,"round":"已上市","desc":"浸没式液冷绝对龙头，市占率 56.8% 连续五年第一，牵头编制液冷国标。","cap":60,"pe":null,"rev":2.46,"revGrowth":75.56,"gross":null,"rd":null,"spark":[1.4,1.4,2.46],"latestTech":"全球首发 MW 级相变浸没液冷整机柜 C8000 V3.0，单机柜超 900kW、PUE 低至 1.04，首次规模化导入金刚石铜复合散热材料","detail":"【行业地位】浸没式液冷绝对龙头，国内唯一实现浸没相变液冷技术大规模商业化部署的企业。据赛迪顾问《2025-2026 年中国液冷数据中心市场报告》，以 **56.8% 市场份额稳居行业首位、连续五年第一**，AI 推理场景市占率同样突破 50%。掌握行业话语权：累计牵头或参与编制 7 项国标、3 项地标、7 项行标和 20 余项团标，是液冷国标牵头单位。专利 207 项（液冷相关 167 项、发明专利 53 项），技术人员占员工总数 51.22%。\n【商业化】2026H1 营收 2.46 亿元（+75.56%），其中冷板液冷业务 2.09 亿元（+290.09%），占比升至 84.77%——**注意这是从浸没式向冷板式的结构性倾斜**，因冷板式落地更快。母公司为中科曙光（603019）旗下。C8000 V3.0 实测可将现有芯片性能提升 15% 以上，已支撑国内首个全国产十万卡 AI 超集群曙光 8000 运行。液冷智算集群订单超百亿，排至 2027 年底。\n【风险】**仍处亏损状态**：2026H1 归母净利润 -0.73 亿元；2026Q1 营收 1.03 亿元（+782%）但净利亏损 4759 万元。属于典型的「高弹性、高风险」期权型标的，估值主要靠预期支撑。北交所上市，流动性与关注度低于主板/科创板同行。"}'::jsonb),
('申菱环境', '301018.SZ', 'ai', 'hw', true, '已上市', 170, 17.56,
 '{"name":"申菱环境","code":"301018.SZ","industry":"ai","seg":"hw","listed":true,"round":"已上市","desc":"华为数据中心液冷核心供应商，在手液冷订单约 18 亿元。","cap":170,"pe":319,"rev":17.56,"revGrowth":4.39,"gross":null,"rd":null,"spark":[12.0,16.8,17.56],"latestTech":"液冷系统级整体解决方案，已进入英伟达 MGX 生态","detail":"【行业地位】液冷系统级整体解决方案提供商，核心看点是**华为数据中心液冷核心供应商**身份，在手液冷订单约 18 亿元，订单确定性较强。已进入英伟达 MGX 生态。2026Q1 营收 6.17 亿元，归母净利润 0.28 亿元。\n【商业化】2026H1 营收 17.56 亿元（+4.39%），增速在液冷头部五家中偏低；归母净利润 0.54 亿元（**同比 -64.07%**），利润下滑幅度较大。\n【风险】三重拖累：①项目结转确认收入滞后；②海外市场拓展力度加大带动销售费用增加；③液冷及海外新产品研发投入增加。当前 PE 高达 319 倍，毛利率持续下滑是隐患，**Q3 利润释放节奏是关键验证点**。与英维克同属系统集成环节，但体量约为英维克的一半，且盈利兑现节奏更慢。"}'::jsonb),
('高澜股份', '300499.SZ', 'ai', 'hw', true, '已上市', 110, 2.1,
 '{"name":"高澜股份","code":"300499.SZ","industry":"ai","seg":"hw","listed":true,"round":"已上市","desc":"冷板+浸没+喷淋全路线布局，英伟达 GB300 液冷模组核心认证供应商。","cap":110,"pe":323,"rev":2.1,"revGrowth":53.41,"gross":35.0,"rd":null,"spark":[1.2,1.37,2.1],"latestTech":"2MW 级大功率液冷一体化解决方案；快换接头技术纳入英伟达液冷硬件规范","detail":"【行业地位】业内稀缺的**全技术路线布局**企业，同时覆盖冷板、浸没、喷淋三大液冷路径。快换接头技术被纳入英伟达液冷硬件规范，浸没式液冷模组获英伟达 MGX 认证，同时是英伟达 GB300 液冷模组核心认证供应商，并通过谷歌审厂。技术卡位在连接器环节——QDC（快速连接器）是液冷系统最易漏液的连接点，密封设计、插拔寿命、耐压耐腐蚀能力是核心壁垒。\n【商业化】2026H1 液冷相关收入 2.10 亿元（**+53.41%**），纯度较高。**是五家液冷头部公司中少数净利正增长的企业之一**，2026Q1 扣非净利润 1424 万元（+50.59%），降本增效与结构调整成效显著。液冷业务毛利率超 35%，深度绑定字节跳动与三大运营商。\n【风险】当前 PE 约 323 倍，估值已充分反映预期。原主业为高压直流输电液冷设备（国内首家），液冷收入占比虽在提升但绝对规模仍小（2.1 亿元），业绩弹性受主业拖累。"}'::jsonb),
('同飞股份', '300990.SZ', 'ai', 'hw', true, '已上市', 130, null,
 '{"name":"同飞股份","code":"300990.SZ","industry":"ai","seg":"hw","listed":true,"round":"已上市","desc":"机架式 CDU 主力厂商，储能温控提供安全垫，确定性相对最高。","cap":130,"pe":null,"rev":null,"revGrowth":null,"gross":null,"rd":null,"spark":[null,null,null],"latestTech":"液冷分配装置（CDU）、Manifold、浸没液冷箱体全系列覆盖，通过英伟达认证","detail":"【行业地位】工业温控设备龙头，液冷产品线覆盖 CDU（冷量分配单元）、Manifold、浸没液冷箱体全系列，是**机架式 CDU 主力厂商**，已通过英伟达认证。CDU 是液冷系统中价值量较高、技术门槛中等的环节，连接一次侧冷源与二次侧服务器回路。\n【商业化】2026Q1 营收同比增长 21.80%；**是五家液冷头部公司中少数实现净利润正增长且经营现金流健康的企业之一**。独特优势在于储能温控业务提供安全垫——在液冷行业普遍「增收不增利」的背景下，下行风险相对可控。\n【风险】确定性最高但弹性相对有限：储能温控是现金流基本盘，也意味着液冷放量对整体业绩的边际拉动不如纯液冷标的（如曙光数创、高澜股份）那么剧烈。属于液冷板块中「稳健型」配置。"}'::jsonb),
('巨化股份', '600160.SH', 'ai', 'hw', true, '已上市', 700, 248,
 '{"name":"巨化股份","code":"600160.SH","industry":"ai","seg":"hw","listed":true,"round":"已上市","desc":"电子氟化冷却液绝对龙头，打破 3M 垄断，纯度达 99.999%。","cap":700,"pe":null,"rev":248,"revGrowth":null,"gross":null,"rd":null,"spark":[null,null,null],"latestTech":"G 系列电子氟化冷却液纯度达 99.999%，已通过英伟达认证","detail":"【行业地位】国内电子氟化液（浸没式冷却液）**绝对龙头**，成功打破 3M 对该品类的垄断，是液冷上游材料国产替代的标杆。冷却液是液冷系统的「血液」，浸没式场景对纯度、绝缘性、热稳定性、材料兼容性要求极高，属于液冷产业链中壁垒最高、国产化最晚的环节之一。\n【商业化】G 系列冷却液纯度达 99.999%，已通过英伟达认证，深度覆盖英伟达、华为昇腾等全场景液冷系统。2025 年冷却液出货量同比增长 120%，产能随行业需求持续释放。\n【风险】需注意这是一家**制冷剂主业公司**（营收约 248 亿元），电子氟化液在其中占比很小——液冷概念带来的业绩弹性远低于纯液冷标的，属于「有液冷期权但基本盘在制冷剂」的标的。当前制冷剂处于配额制下的景气周期，主营逻辑与 AI 液冷是两条独立故事线，估值时需分开看待。"}'::jsonb),
('润泽科技', '300442.SZ', 'ai', 'hw', true, '已上市', 800, null,
 '{"name":"润泽科技","code":"300442.SZ","industry":"ai","seg":"hw","listed":true,"round":"已上市","desc":"最接近英伟达的 AIDC，廊坊/平湖建成 10 万卡级智算中心。","cap":800,"pe":null,"rev":null,"revGrowth":null,"gross":null,"rd":null,"spark":[null,null,null],"latestTech":"2023 年交付行业首例整栋纯液冷智算中心，自研冷板式液冷全面应用，单机柜 45kW 以上高密度部署","detail":"【行业地位】国内批发型 IDC 头部厂商，在京津冀（廊坊）与长三角（平湖）建成 **10 万卡级智算中心**，单集群算力超 5EFLOPS（FP16）。核心差异化是**与英伟达签订长期合作协议锁定 H200 芯片供应**，被市场称为「最接近英伟达的 IDC」。\n【技术特点】2023 年交付行业首例整栋纯液冷智算中心，自研冷板式液冷技术全面应用于全国多园区，实现单机柜 45kW 以上高密度部署。AIDC 业务的营业收入、毛利率、经营活动现金流等核心财务指标均已赶上或超越传统 IDC 业务——这是 IDC 行业从「机柜托管」向「算力供给」转型的标志性案例。\n【商业模式】以批发型业务为主（服务头部互联网公司与云厂商），新增零售型算力租赁面向中小企业及科研机构，拓宽客户结构。\n【风险】重资产模式，资本开支强度大；与英伟达的长协供应存在政策与地缘不确定性；客户集中度高，头部互联网客户议价能力强。"}'::jsonb),
('光环新网', '300383.SZ', 'ai', 'hw', true, '已上市', 300, null,
 '{"name":"光环新网","code":"300383.SZ","industry":"ai","seg":"hw","listed":true,"round":"已上市","desc":"字节链核心 IDC，与字节共建 AI 算力调度平台，裸金属+GPU 直租。","cap":300,"pe":null,"rev":null,"revGrowth":null,"gross":null,"rd":null,"spark":[null,null,null],"latestTech":"与字节跳动合作建设 AI 算力调度平台，实现跨区域资源动态分配","detail":"【行业地位】老牌一线 IDC 服务商，北京为核心市场，新建数据中心支持 15-30kW 高功率机柜，可支撑大模型训练服务。**核心看点是字节跳动产业链卡位**——与字节共建 AI 算力调度平台，实现跨区域资源动态分配，是字节算力外溢的直接承接方。\n【商业模式】提供「裸金属 + GPU」直租服务，客户可自主部署 TensorFlow / PyTorch 等 AI 框架，按实际使用量付费；推出「算力券」补贴政策降低客户门槛。相比批发型 IDC，这种模式单位机柜收入更高、客户粘性更强，但对运维与调度能力要求也更高。\n【风险】传统 IDC 业务面临供给过剩与价格竞争；算力租赁业务尚在放量早期，收入结构转型需时间验证；对字节单一客户的依赖度较高，客户资本开支波动会直接传导至业绩。"}'::jsonb),
('世纪互联', 'VNET.US', 'ai', 'hw', true, '已上市', 120, null,
 '{"name":"世纪互联","code":"VNET.US","industry":"ai","seg":"hw","listed":true,"round":"已上市","desc":"老牌中立 IDC，推出 CaaS「算力即服务」平台，Hyperscale 2.0 智算战略。","cap":120,"pe":null,"rev":null,"revGrowth":null,"gross":null,"rd":null,"spark":[null,null,null],"latestTech":"Hyperscale 2.0 战略，构建「兆瓦机柜 + 百兆瓦单体 + 吉瓦园区」超大规模 AIDC 创新工程","detail":"【行业地位】国内老牌中立 IDC 服务商，覆盖 40+ 城市、运营 70+ 数据中心，多线 BGP 网络资源丰富，是第三方 IDC 中中立性最突出的厂商之一（不与客户在云业务上直接竞争）。\n【商业模式创新】**推出「算力即服务」（CaaS）平台**，支持按 GPU 卡（A100/H100）或算力单元（PFlops）灵活租赁，与阿里云、腾讯云合作提供混合云算力方案，客户可跨数据中心调度资源。这种按卡/按算力单元计费的粒度，比传统按机柜计费更契合 AI 客户的实际需求，是 IDC 商业模式演进的重要方向。\n【技术战略】发布基于绿色直流的 Hyperscale 2.0 战略，构建以「兆瓦机柜 + 百兆瓦单体 + 吉瓦园区」为核心的超大规模 AIDC 创新工程；东南亚数据中心总规模达 1000MW，是出海布局较积极的国内 IDC。\n【风险】美股上市（VNET.US），估值受中概股整体折价影响；重资产 + 高负债模式对利率敏感；国内 IDC 行业格局分散、尚未形成寡头，价格竞争激烈。"}'::jsonb)
ON CONFLICT (name) DO UPDATE SET
  code = EXCLUDED.code, industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, cap = EXCLUDED.cap,
  rev = EXCLUDED.rev, data = research_companies.data || EXCLUDED.data;

-- ============================================================
-- AI 应用细分扩充（2026-09 增补，新增 23 家公司 + 16 家重标 seg）
-- ai-app 拆分为 11 个细分：ai-coding/ai-agent/ai-office/ai-fin/
-- ai-marketing/ai-content/ai-vision/ai-edu/ai-med/ai-gov/ai-industrial
-- ============================================================
INSERT INTO research_companies (name, code, industry, seg, listed, round, cap, rev, data) VALUES
('卓易信息', '688258.SH', 'ai', 'ai-coding', true, '已上市', 125, 1.78,
 '{"name":"卓易信息","code":"688258.SH","industry":"ai","seg":"ai-coding","listed":true,"desc":"国内稀缺的自研 IDE 内核厂商，AI IDE 业务已超总营收一半。","latestTech":"EazyDevelop「AI+IDE」集成开发平台，自研 IDE 已适配主流大模型与 MCP 协议，布局多智能体与行业开发模板","detail":"【技术与定位】国内少数具备**从底层代码自研完整 IDE 体系**能力的厂商，稀缺性来自 IDE 内核的长期技术积累（收购艾普阳获得 PowerBuilder 等资产）。产品矩阵已从单一开发工具延伸为「AI 编程 + 智能体」：EazyDevelop（AI+IDE 集成开发平台，以 AI Coding 为核心）、EazyBot（AI 办公智能体）、FinBot（金融平台级工作智能体）、以及鸿蒙跨端框架 KMP/CMP。存量产品 PowerBuilder 面向海外市场、积累 2 万+ 付费用户且续费稳定。\n【商业化】2026H1 营收 1.78 亿元（+2.00%），但 **AI IDE 业务收入 1.02 亿元、占总营收 57.36%，首次超越传统固件业务成为第一大主业**，毛利率 56.77%。归母净利润 1.06 亿元（+291.66%）、扣非 0.47 亿元（+126.12%），毛利率从 54.95% 提升至 58.33%。费用端显著优化：研发费用 -30.9%、销售费用 -18.4%、管理费用 -15.1%，反映业务结构从低毛利固件向高毛利软件服务切换的效率释放。\n【风险】①**利润质量需打折看待**——归母净利润高增的另一半来自非经常性损益（持有其他非流动金融资产公允价值变动收益约 5597.75 万元 + 政府补助增加），扣非增速（+126%）远低于归母增速（+292%）；②经营现金流与净利润走势背离，经营活动现金流净额 2561.28 万元、同比下降 29.25%，应收账款回收压力是主要挑战；③传统固件业务收入 0.48 亿元（-21.3%）、云服务收入 0.15 亿元（-74.7%），基本盘在收缩，转型的持续性依赖 AI IDE 的标准化订阅转化。","cap":125,"rev":1.78,"revGrowth":2.0,"gross":58.33}'::jsonb),
('普元信息', '688118.SH', 'ai', 'ai-coding', true, '已上市', 32, null,
 '{"name":"普元信息","code":"688118.SH","industry":"ai","seg":"ai-coding","listed":true,"desc":"低代码与中间件厂商，向 AI 辅助开发与智能体平台延伸。","latestTech":"低代码平台集成大模型能力，提供 AI 辅助生成应用与流程编排","detail":"【技术与定位】中间件与低代码开发平台厂商，产品线覆盖应用开发平台、数据治理与信创中间件，客户以金融、政务、能源等信创需求强的行业为主。在 AI 编程浪潮下的切入路径是**把大模型能力叠加到既有低代码平台上**——让业务人员用自然语言生成应用原型与流程编排，而非面向专业开发者做代码补全。这条路径的优势是避开与 Cursor/Claude Code 的正面竞争，走「AI 平民化开发」的差异化方向。\n【商业化】收入规模较小、以项目制为主，AI 相关收入尚未单独披露，属于**AI 编程赛道中「有概念卡位但业绩弹性未验证」的一类标的**。信创资质与金融行业客户积累是主要壁垒。\n【风险】①低代码赛道本身面临增长瓶颈，AI 功能能否带来实质性的客单价提升仍在验证；②项目制收入模式导致业绩波动大、毛利率受实施人力成本侵蚀；③与卓易信息不同，普元缺乏自研 IDE 内核这类硬技术资产，AI 能力的差异化更多体现在应用层而非底座层，长期竞争壁垒相对薄弱。","cap":32}'::jsonb),
('亚信安全', '688225.SH', 'ai', 'ai-coding', true, '已上市', 45, null,
 '{"name":"亚信安全","code":"688225.SH","industry":"ai","seg":"ai-coding","listed":true,"desc":"网络安全厂商，以「AI 优先」战略切入代码安全与 AI 安全治理。","latestTech":"「AI 优先」战略，把大模型能力用于代码安全审计、威胁检测与安全智能体","detail":"【技术与定位】网络安全与云网安全厂商（亚信科技体系），在 AI 编程这一环节的切入口是**代码安全与 AI 安全治理**——AI 生成的代码天然带有安全与合规风险（数据泄露、依赖漏洞、许可证问题），这构成了新的安全审计需求。公司坚定「AI 优先」战略，把大模型能力用于代码安全扫描、威胁检测与安全智能体，并与集团的信创与运营商客户资源形成协同。\n【商业化】属于**「伴随 AI 编程渗透率提升而受益」的间接标的**，而非直接的 AI 编程工具商。AI 相关收入未单独披露，业绩弹性依赖安全预算的整体增长。2026 年 9 月参与科创板软件行业集体业绩说明会，公司层面强调「AI 优先」的战略定位。\n【风险】①网络安全行业竞争激烈、产品同质化程度高，AI 能力的差异化不明显；②下游客户以运营商、政府、金融为主，采购受预算周期影响；③「AI 安全」这一细分市场尚处早期，规模小且标准未定，短期内难以成为主要收入来源。","cap":45}'::jsonb),
('赛意信息', '300687.SZ', 'ai', 'ai-coding', true, '已上市', 90, 10.33,
 '{"name":"赛意信息","code":"300687.SZ","industry":"ai","seg":"ai-coding","listed":true,"desc":"工业软件服务商，发布工业级全链路 AI Coding 平台 SIE CodeOne。","latestTech":"SIE CodeOne 工业级全链路 AI Coding 平台，覆盖需求挖掘到测试交付全流程","detail":"【技术与定位】制造业数字化服务商，在 AI 编程环节的独特切入点是**「AI 编程 + 工业场景」的工程化交付**——不做通用开发者工具，而是把 AI Coding 嵌入自身项目交付流程（结合 FDE 现场驱动工程实施体系），提升软件实施环节的人效。报告期内发布工业级全链路 AI Coding 平台 SIE CodeOne，覆盖数字化项目从需求挖掘到测试交付的全流程，以 AI 工程化能力破解行业交付效率痛点。\n【商业化】2026H1 营收 10.33 亿元（+14.43%），归母净利润 5602.19 万元（**+207.70%**）、扣非 5138.16 万元（+274.42%）。扣非增速高于营收增速，反映内部精细化管理的成效释放。研发总投入 2.14 亿元。真正值得注意的第二曲线是**算力业务**：智算集群完成建设并商用收费，已签 64.5 亿元高性能算力服务订单。境外业务收入同比 +314.06%。\n【风险】①**经营性现金流净额 -4.11 亿元**，净流出规模同比扩大，主因算力基础设施采购支出，总资产较上年末增长 38.08% 全由算力资产采购驱动——这是重资产转型的必然代价，但资金链压力需持续跟踪；②客户集中度较高、应收账款坏账风险；③算力业务的 64.5 亿元订单交付进度与收入确认节奏是最大的不确定性，也是估值支撑的核心变量。","cap":90,"rev":10.33,"revGrowth":14.43,"rd":2.14}'::jsonb),
('鼎捷数智', '300378.SZ', 'ai', 'ai-coding', true, '已上市', 60, null,
 '{"name":"鼎捷数智","code":"300378.SZ","industry":"ai","seg":"ai-coding","listed":true,"desc":"制造业 ERP 服务商，构建 IndepthAI 一站式 AI 生态系统。","latestTech":"IndepthAI 一站式 AI 生态系统，接入 DeepSeek/千问/豆包/文心，核心 ERP 数据保留企业内网","detail":"【技术与定位】深耕制造业四十余年的 ERP 服务商，服务超 5 万家中大型企业，制造业 ERP 市占率 14.8%、位居前列（机械行业 18.2%、电子高科技 17.5%）。AI 布局的关键设计是**「核心 ERP 数据保留企业内网」**——接入 DeepSeek、千问、豆包、文心一言等多家大模型，但把敏感的制造数据留在企业内网，这一「数据不出内网」的架构在制造业客户中具有决定性说服力，是这一环节少见的**以合规架构而非模型能力取胜**的样本。汽车工业行业套件已服务超 1000 家汽车零部件客户，覆盖国内汽车零部件超 20% 的 A 股上市公司。\n【商业化】收入结构以传统 ERP 与实施服务为主，AI 产品（新一代 AiGP 企业智能运营中枢）尚在推广期。AI 相关收入未单独披露。\n【风险】①ERP 行业的 AI 化本质是「存量客户增值」而非「新增市场开拓」，弹性受制于既有人群基数；②制造业客户对生产系统稳定性的要求极高，替换与升级决策周期长；③ERP 实施顾问的人力成本刚性，AI 提效的利润转化需要时间。","cap":60}'::jsonb),
('科大讯飞-AI教育视图', '002230.SZ', 'ai', 'ai-edu', true, '已上市', 1100, 116.23,
 '{"name":"科大讯飞-AI教育视图","code":"002230.SZ","industry":"ai","seg":"ai-edu","listed":true,"desc":"星火大模型全国产算力训练，智慧教育 34.90 亿元为第二大业务板块。","latestTech":"星火大模型为国内首个基于全国产算力平台训练的全栈自主可控大模型，持续迭代","detail":"【定位说明】本条为**科大讯飞在 AI 教育视角下的镜像条目**，正条目位于大模型环节（llm），财务数据同源。\n【业务结构】2026H1 营收 116.23 亿元（+6.52%），归母净利润 -2.04 亿元（同比减亏 14.68%）。**智慧教育业务收入 34.90 亿元**，是仅次于开放平台及消费者业务（48.09 亿元）的第二大板块，占总营收 30.03%。硬件端讯飞 AI 学习机在 6000 元以上高端价位段线上占比提升至 49%，整体市占率呈上升趋势。B 端智慧教育（含 G 端）依靠采购与验收，季节性显著——项目规划集中在上半年、验收集中在下半年，因此半年度利润为负、全年转正是常态。\n【核心优势】星火大模型是国内首个基于**全国产算力平台**训练的全栈自主可控大模型，这一属性在政务、教育等对自主可控有硬性要求的场景中是决定性优势。2024、2025 及 2026H1 大模型相关项目中标数量与金额均居全行业第一。\n【风险】①**智能硬件受供应链扰动明显**：2026H1 智能硬件业务收入 7.32 亿元、同比 -15.96%，主因芯片/存储涨价导致学习机阶段性缺货、销量未达预期（7 月销量已回升，当月 SO 销量同比 +30% 以上）；②研发投入极高，2026H1 研发投入 30.07 亿元、占营收比重超 25%，持续压制利润率；③智慧教育业务收入同比微降 1.16%，G 端业务整体收入同比下降 2.65%（公司主动收缩传统项目型业务），转型期的收入缺口需靠 C 端填补；④经营性净现金流 -9.45 亿元（Q2 单季转正 1.24 亿元），现金流波动大。","cap":1100,"rev":116.23,"revGrowth":6.52,"rd":30.07}'::jsonb),
('视源股份', '002841.SZ', 'ai', 'ai-edu', true, '已上市', 200, null,
 '{"name":"视源股份","code":"002841.SZ","industry":"ai","seg":"ai-edu","listed":true,"desc":"教育交互智能平板龙头（希沃），教育信息化硬件入口。","latestTech":"希沃（seewo）教育交互平板叠加 AI 教学助手与课堂行为分析","detail":"【技术与定位】教育交互智能平板龙头，旗下希沃（seewo）品牌是国内教育信息化硬件的事实标准，产品覆盖交互智能平板、录播系统、班牌与教学软件，渠道深入全国中小学与高校。在 AI 教育环节，公司的独特价值是**掌握硬件入口与课堂场景的流量**——AI 能力（课堂行为分析、智能批改、教学助手）可直接嫁接到既有装机量上，这是纯软件厂商不具备的分发优势。\n【商业化】收入以硬件销售为主，受教育信息化财政投入周期影响显著。AI 功能目前主要作为产品增值点提升客单价与竞标优势，尚未形成独立的 AI 收入口径。\n【风险】①**教育硬件是典型的政策与预算驱动型业务**，政府采购（G 端）节奏直接决定业绩，收入波动性大；②交互平板市场渗透率已较高，增量空间依赖设备更新周期与 AI 功能带来的替换需求；③硬件毛利率受面板、芯片等上游成本波动影响，且面临同业价格竞争。","cap":200}'::jsonb),
('豆神教育', '300010.SZ', 'ai', 'ai-edu', true, '已上市', 90, 5.25,
 '{"name":"豆神教育","code":"300010.SZ","industry":"ai","seg":"ai-edu","listed":true,"desc":"AI 教育业务同比 +664%，成为第二大收入来源，Q2 单季扭亏。","latestTech":"AIclass 2.0（超级学练课）覆盖阅读、作文、文学文史、文言文古诗词全场景","detail":"【技术与定位】原语文培训龙头转型 AI 教育，已构建覆盖全学习场景的 AI 教育生态矩阵：2024 年推出自研大模型「豆神 AI」，2025 年推出「AI 双师」「AI 超能训练场」，2026 年推出 AIclass 2.0 版（超级学练课），覆盖阅读、作文、文学文史、文言文古诗词等全文学学习场景，AI 互动与课程融合体验较 1.0 版大幅升级。\n【商业化】2026H1 营收 5.25 亿元（+16.95%），**AI 教育业务收入 1.14 亿元、同比 +664.32%**，较 2025 年全年增长 79.23%，占总营收比重升至 21.7%，成为仅次于美育业务（3.23 亿元、占 61.5%）的第二大收入来源。Q2 单季表现显著回暖：营收 3.27 亿元（环比 +65%），归母净利润 3233.62 万元（环比 +157.70%），毛利率 75.87%（同比 +6.84pct）。\n【风险】①**全年仍处亏损**：2026H1 归母净利润 -2439.40 万元、同比下降 123.49%，由盈转亏；扣非 -2727.1 万元。亏损主因是费用激增——销售费用 3.23 亿元（**+63.70%**）、管理费用 9113 万元（+55.89%），而同期研发投入仅 5682.64 万元、同比 **-5.29%**。**销售驱动而非研发驱动的增长质量需要警惕**：AI 教育的高增长高度依赖买量，一旦投放收缩，收入能否维持存疑；②公司目前为 ST 状态，存在历史合规与持续经营能力方面的遗留问题；③教育行业政策风险长期存在。","cap":90,"rev":5.25,"revGrowth":16.95,"gross":75.87}'::jsonb),
('佳发教育', '300559.SZ', 'ai', 'ai-edu', true, '已上市', 60, 1.49,
 '{"name":"佳发教育","code":"300559.SZ","industry":"ai","seg":"ai-edu","listed":true,"desc":"考试与校园信息化厂商，教育数智化产品覆盖标准化考场。","latestTech":"教育数智化产品体系，覆盖标准化考场、智慧校园与 AI 学情分析","detail":"【技术与定位】教育数智化产品与解决方案厂商，核心场景是**标准化考试与校园信息化**——标准化考场建设、考试作弊防控、智慧校园管理，客户以各级教育考试院与学校为主。AI 能力主要用于学情分析、智能考务与课堂评价。\n【商业化】2026H1 营收 1.49 亿元（**-45.37%**），归母净利润 2288.91 万元（-43.87%）、扣非 1806.56 万元（-53.75%）。Q2 单季营收 1.04 亿元（同比 -52.26%，环比 +131.67%），归母净利润 2844 万元（环比 +612.35%），环比改善明显但同比仍大幅下滑。毛利率 49.51%（同比 +1.45pct）保持稳定，经营活动现金流净额 5106.18 万元、净现比 223.08%，现金流质量好于利润表。\n【风险】①**收入同比腰斩是最直接的警示信号**——公司将其归因于项目验收节奏，但需观察是否为需求端实质性收缩；②收入高度依赖教育财政预算与考试院采购周期，波动性极大；③当前 PE（TTM）约 300 倍，估值与业绩下滑严重背离，隐含较高的预期成分；④期间费用率升至 40.68%（同比 +13.13pct），收入下滑时费用刚性突出。","cap":60,"rev":1.49,"revGrowth":-45.37,"gross":49.51}'::jsonb),
('卫宁健康', '300253.SZ', 'ai', 'ai-med', true, '已上市', 280, 9.94,
 '{"name":"卫宁健康","code":"300253.SZ","industry":"ai","seg":"ai-med","listed":true,"desc":"医院核心系统市占率 11.9% 连续六年第一，成立 AI 医疗事业部。","latestTech":"WiNEX 新一代智慧医院系统全面支撑医疗信创，「智能体+」医护智能助手落地","detail":"【技术与定位】医疗信息化龙头，据 IDC《中国医疗核心业务系统市场份额，2025》，2025 年公司在中国医院核心系统主要厂商中**市占率 11.9% 排名第一，已连续六年（2020-2025）位居首位**。2026 年成立 **AI 医疗事业部**，把 AI 研发、数据治理与业务应用深度融合，探索「智能体+」增强下的医护智能助手，推出的多项 AI 应用产品聚焦提升医护效率。核心逻辑是：医院核心系统是医疗数据的唯一入口，AI 能力可直接叠加在既有系统上，客户替换成本构成天然壁垒。\n【商业化】2026H1 营收 9.94 亿元（+18.50%），Q2 单季 5.97 亿元（+20.80%、环比 +50.19%）。软件及服务收入 8.28 亿元（+16.55%，占 83.26%），互联网医疗健康收入 9914.83 万元（**+58.32%**，增速最快）。WiNEX 产品规模化交付能力持续成熟，上半年助力多院区集团（如吉林省中医院五院区）、区属医疗机构云化部署等多类项目上线。\n【风险】①**亏损同比扩大**：归母净利润 -1.76 亿元（上年同期 -1.18 亿元），扣非 -1.86 亿元（上年同期 -9982 万元），亏损扩大近一倍；**剔除股份支付摊销影响后归母净利润同比 +24.67%**——这两个口径的巨大差异意味着需要区分「股权激励成本」与「真实经营恶化」；②毛利率 33.67%、同比下降 2.74pct，净利率 -19.46%，盈利能力仍在恶化；③经营活动现金流净额仅 1509.07 万元、同比 -71.95%，回款质量下滑；④医院客户预算受财政与医保控费影响，信息化支出的增长持续性存疑。","cap":280,"rev":9.94,"revGrowth":18.5,"gross":33.67}'::jsonb),
('鹰瞳科技-B', '02251.HK', 'ai', 'ai-med', true, '已上市', 15, 6.73,
 '{"name":"鹰瞳科技-B","code":"02251.HK","industry":"ai","seg":"ai-med","listed":true,"desc":"自研「万语」医疗大模型，三大 AI Agent 矩阵，近视防控 AI 高增。","latestTech":"「万语」医疗大模型全业务 Token 使用量达 4026 亿，构建 PBM-AI/Retina-AI/Neuro-AI 三大 Agent 应用矩阵","detail":"【技术与定位】AI 原生医疗公司，架构是「一个大模型基座 + 三大 AI 产品 + 多场景落地」。自研「**万语**」医疗垂直大模型融合 Agent、RAG、多模态算法与医学知识图谱（依托近 4000 万份真实世界临床数据、800 余项循证医学知识图谱），严格遵循医疗合规与诊疗规范。三大 Agent 矩阵：**PBM-AI**（基于 PBM-LED® 视力康复仪的青少年近视防控，治疗类）、**Retina-AI**（视网膜检查评估）、**Neuro-AI**（抗压能力监测）。截至报告期末累计专利 313 项（发明专利 157 项）、软件著作权 104 项。\n【商业化】2026H1 收入 6.73 亿元（**-19.6%**），期内亏损 4.89 亿元（上年同期盈利 443 万元）。结构分化剧烈：**PBM-AI 收入 2.79 亿元、同比 +24.0%**，渠道覆盖 32 个省级行政区 5424 个活跃网点（**同比 +207.0%**），服务青少年 2.7 万名（+441.9%），核心产品使用次数 455.1 万次（+61.8%）——是最亮眼的成长引擎；**Retina-AI 收入 3.69 亿元、同比 -35.6%**（其中辅助诊断医疗场景 1.28 亿元、风险评估大健康场景 2.41 亿元），活跃服务网点 8523 个（+18.7%），累计检测超 3700 万人次；Neuro-AI 于 2026 年 3 月获二类医疗器械注册证，实现收入 0.4 百万元，处商业化起步。全球化新增马来西亚（PBM-AI）与印尼（Retina-AI）准入，打开欧盟 CE 市场，参与盖茨基金会专项研发。\n【风险】①**新旧业务交替期的结构性下滑**：收入下降 19.6% 主要来自 Retina-AI（大健康场景受宏观消费影响），而高增长的 PBM-AI 绝对规模尚不足以对冲，导致整体由盈转亏；②毛利率从 76.6% 降至 73.3%，业务培育期投入压制盈利；③港股上市、市值仅约 15 亿元，流动性与估值弹性受限；④近视防控业务高度依赖线下渠道扩张（网点同比 +207%），渠道费用与单店产出效率是关键跟踪指标；⑤医疗器械注册与临床证据体系建立周期长。","cap":15,"rev":6.73,"revGrowth":-19.6,"gross":73.3}'::jsonb),
('润达医疗', '603108.SH', 'ai', 'ai-med', true, '已上市', 110, 31.94,
 '{"name":"润达医疗","code":"603108.SH","industry":"ai","seg":"ai-med","listed":true,"desc":"IVD 流通服务龙头，商业收入占 91.71%，AI 医疗为增值模块。","latestTech":"与华为云合作推出医疗大模型「良医小慧」，落地检验报告解读与临床辅助决策","detail":"【定位说明】**本条需特别注意：公司本质是 IVD（体外诊断）流通服务商，而非 AI 医疗原生公司。**2026H1 主营业务构成中商业（流通服务类）收入 29.29 亿元、**占比 91.71%**，工业（自主品牌类）收入 2.65 亿元、占 8.28%；产品口径上试剂及其他耗材占 93.71%，软件开发及服务仅 7012.89 万元、占 2.20%。\n【AI 布局】AI 医疗是**叠加在流通主业之上的增值模块**，核心产品是与华为云合作的医疗大模型「良医小慧」，落地在检验报告智能解读、临床辅助决策等场景，依托公司在医院检验科的渠道与数据触点做分发。这条路径的合理性在于：检验科是医院数据的密集入口，公司掌握渠道，天然适合做 AI 产品的分发方。\n【商业化与风险】2026H1 营收约 31.94 亿元，Q2 单季 16.83 亿元、归母净利润 -3430.58 万元（亏损同比收窄 33.25%）。近年业绩持续承压：2025 年全年营收 69.99 亿元、归母净利润 **-5.48 亿元**（2022 年营收 104.94 亿元、净利 4.18 亿元），三年内营收与利润双双大幅下滑，反映 IVD 集采与行业政策对流通环节的冲击。\n**关键判断：AI 医疗业务占比极小（软件服务仅 2.20%），不构成业绩驱动力，存在明显的「AI 概念标签化」风险。**看这家公司应主要关注 IVD 主业的集采影响与应收账款回收（2026H1 信用减值损失 3702.82 万元），而非 AI 故事。","cap":110,"rev":31.94,"gross":18.19}'::jsonb),
('创业慧康', '300451.SZ', 'ai', 'ai-med', true, '已上市', 60, null,
 '{"name":"创业慧康","code":"300451.SZ","industry":"ai","seg":"ai-med","listed":true,"desc":"医疗信息化厂商，院内系统与公共卫生信息化，AI 能力叠加既有产品。","latestTech":"医疗信息化产品线叠加 AI 辅助诊断与智能病历质控模块","detail":"【技术与定位】医疗信息化厂商，产品覆盖医院信息系统（HIS）、电子病历、公共卫生与区域卫生平台，客户以公立医院与卫健委为主。与卫宁健康同处医疗信息化赛道，AI 化路径一致——把大模型能力叠加在既有院内系统上，做智能病历质控、辅助诊断与患者服务。\n【商业化】收入以项目实施与运维服务为主，受医院 IT 预算与财政投入周期影响。AI 相关收入尚未单独披露，属于「存量客户增值」逻辑，弹性受制于既有客户基数与医院付费意愿。\n【风险】①**医疗信息化赛道竞争格局分散且价格战激烈**，卫宁健康、创业慧康、东华医为等多家厂商争夺有限预算，毛利率普遍承压；②医院客户回款周期长，应收账款与现金流是行业通病（可比公司卫宁健康 2026H1 经营活动现金流净额同比 -71.95%）；③AI 能力在院内落地的合规与责任边界尚不清晰，实际渗透速度慢于预期。","cap":60}'::jsonb),
('华宇软件', '300271.SZ', 'ai', 'ai-gov', true, '已上市', 70, null,
 '{"name":"华宇软件","code":"300271.SZ","industry":"ai","seg":"ai-gov","listed":true,"desc":"法律科技龙头，覆盖法院、检察院等司法信息化场景。","latestTech":"法律垂直大模型「华宇元典」用于法规检索、文书生成与案件智能分析","detail":"【技术与定位】法律科技与司法信息化龙头，客户覆盖法院、检察院、司法行政等政法系统，产品包括审判管理、案件管理、电子卷宗等核心业务系统。AI 布局以法律垂直大模型为核心（华宇元典体系），应用在法规检索、法律文书生成与校对、案件要素提取与智能分析等场景。法律场景的特点决定了这是**少数适合垂直大模型的领域**——法规文本结构化程度高、答案有明确出处可验证、错误可追溯，能较好规避大模型的幻觉问题。\n【商业化】收入以政法系统项目与运维服务为主，受司法信息化财政预算直接影响。AI 能力主要作为既有产品的功能升级，未形成独立收入口径。\n【风险】①**G 端业务的收入波动性极高**：可比的政企 AI 公司（开普云）2026H1 营收同比下滑 26.73%、由盈转亏，反映政务客户采购趋谨慎、验收周期拉长的行业性压力；②政法系统项目回款周期长，应收账款规模大；③公司历史上曾经历重大合规事件冲击，治理与内控的持续性需关注；④司法领域对 AI 输出的责任归属尚无明确法律界定，实际替代人工的深度受限。","cap":70}'::jsonb),
('开普云', '688228.SH', 'ai', 'ai-gov', true, '已上市', 45, 1.17,
 '{"name":"开普云","code":"688228.SH","industry":"ai","seg":"ai-gov","listed":true,"desc":"AI 内容安全 + 数智政务，G 端预算收紧致营收大幅下滑。","latestTech":"AI 内容安全检测与数智政务平台，另布局具身智能训练场","detail":"【技术与定位】数智能源、数智政务与 AI 内容安全厂商。2025 年收入结构为数智能源约 1.84 亿元（占 43.94%）、数智政务及其他约 27.51%、AI 内容安全约 18.67%、AI 大模型与算力约 9.76%。AI 内容安全是对政务与媒体客户提供内容合规检测，本质是**强监管驱动的需求**。\n【商业化】2026H1 营收 1.17 亿元（**-26.73%**），归母净利润 -1894.63 万元、由盈转亏。分业务看：数智政务及其他收入 -47.38%、AI 内容安全收入 -32.93%、数智能源基本持平。Q2 单季营收 6970.29 万元、归母净利润 -1051.58 万元、扣非 -1666.15 万元。\n【风险】**这家公司是「AI 概念掩盖传统 G 端结构性困境」的典型样本，值得作为案例分析。**①收入降至约 2022 年同期水平，此前两年「营收增长、亏损扩大」的趋势并未被 AI 故事扭转；②公司同步**裁减研发人员约 31%（243 人降至 167 人）、研发投入同比下降 19.02%**，这与 AI 公司应有的投入方向相反；③AI 内容安全业务虽收入下滑，但无形资产摊销等固定成本刚性，导致该业务毛利额同比减少约 1404.50 万元、毛利率回落——**「AI 业务」自身也在恶化**；④报告期内辞退福利 903.75 万元计入管理费用，对当期利润形成冲击；⑤非经常性损益（应收账款差额回购承诺带动坏账准备转回 1052.58 万元、政府补助 609.15 万元）对净利润形成正向支撑，剔除后扣非亏损更大（-3159.10 万元）；⑥公司跨界布局具身智能训练场，**在主业收缩期开展跨界投资，战略聚焦度存疑**。","cap":45,"rev":1.17,"revGrowth":-26.73,"rd":0.3455}'::jsonb),
('数字政通', '300075.SZ', 'ai', 'ai-gov', true, '已上市', 80, null,
 '{"name":"数字政通","code":"300075.SZ","industry":"ai","seg":"ai-gov","listed":true,"desc":"城市治理与政务信息化厂商，网格化管理数字化底座。","latestTech":"城市治理大模型叠加网格化管理平台，落地城管、综治与民生服务场景","detail":"【技术与定位】城市治理信息化厂商，核心产品是网格化城市管理平台，覆盖城管、综治、市政、民生服务等场景，客户以地方政府与城管部门为主。AI 布局方向是把大模型能力用于城市事件的智能识别、工单自动分派与政务问答，属于**政务 AI 中场景最丰富、数据最接地气的细分**。\n【商业化】收入以地方政府项目与运维服务为主，受智慧城市与数字政府财政投入周期影响。AI 模块作为平台功能的增值升级，尚未形成独立收入披露口径。\n【风险】①**地方政府财政压力是最大变量**：智慧城市类项目在地方债务管控背景下普遍面临预算压缩与付款延迟，这与开普云、华宇软件面临的是同一行业性压力；②项目制模式导致收入确认滞后、现金流波动大；③城市治理场景碎片化，产品标准化程度低，毛利率受实施人力成本侵蚀；④AI 识别与工单分派的实际准确率决定客户续约意愿，需要持续的模型迭代投入。","cap":80}'::jsonb),
('宝信软件', '600845.SH', 'ai', 'ai-industrial', true, '已上市', 700, null,
 '{"name":"宝信软件","code":"600845.SH","industry":"ai","seg":"ai-industrial","listed":true,"desc":"钢铁工业互联网龙头，宝之云 IDC 提供算力底座。","latestTech":"钢铁行业大模型叠加工业互联网平台，宝之云 IDC 提供算力支撑","detail":"【技术与定位】钢铁行业信息化与工业互联网龙头（宝钢体系），核心业务为钢铁 MES、工业互联网平台与宝之云 IDC。在 AI 工业环节的独特优势是**「工业场景 + 算力底座」双轮**：既有钢铁这一最复杂的流程工业场景提供 AI 落地试验田与数据，又有宝之云 IDC 提供自有算力，不依赖外部算力采购。钢铁行业大模型可应用于质量预测、能耗优化、设备预测性维护与排产优化。\n【商业化】收入结构中软件开发及工程服务与 IDC 服务并重。IDC 业务（宝之云）受益于上海及周边智算需求，但属于重资产、长回收周期业务。AI 能力主要作为工业软件的增值模块，未单独披露收入。\n【风险】①**下游钢铁行业景气度是关键变量**——钢铁行业处于产能调控与盈利承压周期，钢企信息化资本开支的意愿与能力受直接冲击；②IDC 业务重资产投入大、折旧压力重，且面临第三方 IDC 与云厂商的竞争；③关联交易占比较高（宝钢体系内部业务），市场化竞争力的独立验证不充分。","cap":700}'::jsonb),
('蓝色光标', '300058.SZ', 'ai', 'ai-marketing', true, '已上市', 480, 345.62,
 '{"name":"蓝色光标","code":"300058.SZ","industry":"ai","seg":"ai-marketing","listed":true,"desc":"营销龙头，AI 驱动收入 28.45 亿元（+81.4%），出海占 84%。","latestTech":"基于 AgentRuntime 重构业务工作流，形成社媒达人营销、广告智能优化、心影创作、BlueFlare 四大场景平台","detail":"【技术与定位】营销科技龙头，AI 战略的核心是**建设智能基础设施**而非单点工具——围绕 Agent 基建、多模态基建、智投基建三方向，基于 AgentRuntime 重构业务工作流，已形成社媒及达人营销、广告智能优化、心影创作平台和 BlueFlare 四大营销场景平台；程序化广告侧 BlueX SDK 深化与 Max、AdMob、TopOn、TradPlus 等聚合平台合作，通过 RPM 智能收益引擎、端侧 AI 推理提升流量预测、匹配与变现效率。\n【商业化】2026H1 营收 345.62 亿元（+6.80%），归母净利润 2.11 亿元（**+119.28%**）、扣非 1.93 亿元（+48.05%）。**AI 驱动收入 28.45 亿元、同比 +81.4%**；通过 API 接入大模型消耗 Token 超 2 万亿，达 2025 年全年的 2 倍。AI 研发投入 9458.49 万元、**同比 +173.45%**（半年已接近 2025 年全年规模）。收入结构：出海广告投放 290.79 亿元（+7.68%，占 84.14%）、全案推广 30.14 亿元（-17.75%）、全案广告代理 24.69 亿元（+46.03%）。合同负债 12.25 亿元、较 2025 年末 +98.40%，在手业务储备充足。\n【风险】①**毛利率极低是商业模式的内生约束**：整体毛利率仅 2.93%，其中出海广告投放毛利率 1.87%（虽同比 +0.35pct 但仍是「搬箱子」式代理业务），这决定了 AI 降本对净利润的杠杆效应虽大、但绝对空间受限；②**出海业务占比 84% 带来双重风险**——地缘政策与平台规则变动、汇兑损益扰动；③传统主业承压，全案推广服务收入同比 -17.75%；④Q2 单季营收 157.55 亿元、同比 -12.97%（虽归母净利润同比 +9003.67% 但源于上年极低基数），收入端已出现下滑迹象；⑤经营活动现金流净额仍为负（-5637.42 万元），应收账款管控是持续课题。\n【关键判断】蓝色光标是本轮 AI 营销中最值得作为样本跟踪的公司——它同时展示了「AI 收入可被量化披露」「Agent 重构业务流程」的正面进展，以及「毛利率结构性偏低」「出海依赖度高」的固有约束。看这家公司应重点关注 AI 驱动收入占比的爬坡速度与毛利率能否同步改善，而非单纯的收入规模。","cap":480,"rev":345.62,"revGrowth":6.8,"gross":2.93,"rd":0.9458}'::jsonb),
('易点天下', '301171.SZ', 'ai', 'ai-marketing', true, '已上市', 200, 22.32,
 '{"name":"易点天下","code":"301171.SZ","industry":"ai","seg":"ai-marketing","listed":true,"desc":"出海营销服务商，AI 覆盖 50% 核心执行工作，人效提升 40%+。","latestTech":"构建「基础设施-AI 中台-业务应用」三层 Token 服务体系，数百个 AI Agent 已进入日常运行，沉淀 1500 余个可复用 Skills 及 130 余个 MCP 工具","detail":"【技术与定位】企业出海数字营销服务商，AI 体系化程度在同业中领先。依托底层 Cycor 多云智能管理平台构建覆盖「基础设施—AI 中台—业务应用」的三层 Token 服务体系：通过多 Agent 路由与 MCP 工具链，**数百个 AI Agent 已进入日常运行，沉淀 1500 余个可复用 Skills 及 130 余个 MCP 工具**。整合营销侧 AI 生成素材占内部创意产出 50% 以上，AdsGo.ai 累计成功发布广告 1276 条；程序化广告平台 zMaticoo 新一代智能 DSP 核心客户日均广告消耗突破 10 万美元、电商场景算法转化率提升超 20%。\n【商业化】2026H1 营收 22.32 亿元（+28.54%），Q2 单季 11.91 亿元（同比 +47.41%、环比 +14.27%）增长动能强劲。剔除汇兑损益与股份支付影响后净利润 1.74 亿元（+9.48%）、归母净利润 1.70 亿元（+4.65%）。研发投入 9088.96 万元（**+50.35%**）。**AI 已覆盖约 50% 核心执行类工作，单运营人员效率提升 40% 以上**。客户结构上直接类客户收入 15.65 亿元（+27.63%），增长主要来自存量客户单客价值提升。经营现金流净额 1.31 亿元（**+239.96%**），质量显著改善。2026 年 3 月已递交 H 股主板上市申请。\n【风险】①**汇兑损益与股份支付严重干扰账面利润**——账面归母净利润增速仅 4.65%，与营收 28.54% 的增速严重不匹配，需剔除扰动因素才能看到真实经营（剔除后 9.48%，仍低于营收增速），反映人效提升尚未完全转化为利润弹性；②收入高度依赖中国品牌出海浪潮，若出海景气度回落将直接冲击需求；③程序化广告业务受平台算法与隐私政策变动影响大；④AI 降本的核心价值是「抬升交付上限」而非「直接变现」，这一逻辑的估值兑现需要更长时间验证。","cap":200,"rev":22.32,"revGrowth":28.54,"rd":0.9089}'::jsonb),
('值得买', '300785.SZ', 'ai', 'ai-marketing', true, '已上市', 70, null,
 '{"name":"值得买","code":"300785.SZ","industry":"ai","seg":"ai-marketing","listed":true,"desc":"消费内容平台，「什么值得买」以 AI 重构导购与内容生产。","latestTech":"自研 AI 导购助手与内容生成体系，把大模型嵌入商品推荐与种草内容生产","detail":"【技术与定位】消费内容与导购平台，「什么值得买」以用户生成内容（UGC）+ 编辑精选为核心。AI 化路径是把大模型嵌入内容生产与商品推荐：AI 导购助手、智能选品、种草内容批量生成，本质是**用 AI 降低内容生产的边际成本、提升内容供给密度**。公司的独特资产是长期沉淀的消费决策内容库与用户行为数据，这为 AI 训练与个性化推荐提供了数据基础。\n【商业化】收入以电商导购佣金与广告为主，受电商平台政策与消费景气度影响。AI 功能主要用于提升内容生产效率与用户互动，未形成独立收入口径。\n【风险】①**核心商业模式受制于电商平台规则**：导购佣金比例由平台决定，且平台自身的 AI 推荐能力在增强，中介价值面临被压缩的风险；②内容平台面临抖音、小红书等新型内容平台的流量竞争，用户增长承压；③AI 生成内容可能削弱 UGC 社区的「真实体验」核心价值主张，存在**品牌调性与 AI 化之间的内在张力**；④消费景气度直接影响广告与佣金收入。","cap":70}'::jsonb),
('光云科技', '688365.SH', 'ai', 'ai-marketing', true, '已上市', 55, null,
 '{"name":"光云科技","code":"688365.SH","industry":"ai","seg":"ai-marketing","listed":true,"desc":"电商 SaaS 服务商，面向中小商家的 AI 营销与运营工具。","latestTech":"电商 AI SaaS 工具集，覆盖智能客服、AI 文案、商品图生成与智能投放","detail":"【技术与定位】电商 SaaS 服务商（阿里生态背景），为淘宝、天猫等平台的中小商家提供店铺管理、客服、营销与数据分析工具。AI 布局紧扣**中小商家的实际痛点**：智能客服、AI 文案生成、商品主图与详情页生成、智能投放优化——这类工具的特点是决策链短、付费意愿直接（商家能立即看到降本效果），是 AI 营销中**最贴近「订阅制现金牛」形态**的一类。\n【商业化】收入以 SaaS 订阅为主，客户为海量中小商家，单客户价值低但基数大。AI 功能作为订阅套餐的增值模块，有助于提升付费转化与客单价。具体 AI 收入未单独披露。\n【风险】①**高度依赖阿里电商生态**，平台政策与流量分配规则的变动会直接传导至需求；②中小商家付费能力弱、续费率对经济景气度敏感，SaaS 续约率是核心跟踪指标；③电商 SaaS 赛道竞争激烈，产品同质化严重，AI 功能容易被平台自带能力（如阿里妈妈的 AI 工具）替代；④公司规模较小，抗风险能力弱。","cap":55}'::jsonb),
('三人行', '605168.SH', 'ai', 'ai-marketing', true, '已上市', 70, null,
 '{"name":"三人行","code":"605168.SH","industry":"ai","seg":"ai-marketing","listed":true,"desc":"校园营销与数字营销服务商，AI 用于创意生产与投放优化。","latestTech":"数字营销全链路服务叠加 AI 创意生成与投放优化能力","detail":"【技术与定位】以校园营销起家的整合营销服务商，业务覆盖品牌营销、数字营销与媒介代理，客户以消费品牌、汽车、3C 等行业为主。AI 应用方向是创意内容生成与媒介投放优化，属于**营销服务商的通用 AI 化转型**，缺乏显著的技术差异化。\n【商业化】收入以媒介代理与营销服务为主，毛利率受媒介采购成本与客户议价能力双重挤压。AI 能力的引入主要用于提升内部人效与控制交付成本，未形成独立收入口径。\n【风险】①**营销服务商的 AI 化同质化程度高**，AI 能力难以形成竞争壁垒，最终仍回到客户资源与媒介返点的比拼；②媒介代理业务毛利率低、现金流占用大（需垫资投放），应收账款与经营现金流是长期问题；③客户结构若集中于少数大品牌，收入稳定性依赖单个客户的预算决策；④相比蓝色光标（AI 收入可量化）、易点天下（AI 体系化程度高），公司在 AI 上的进展缺乏可验证的领先指标。","cap":70}'::jsonb),
('天娱数科', '002354.SZ', 'ai', 'ai-marketing', true, '已上市', 100, null,
 '{"name":"天娱数科","code":"002354.SZ","industry":"ai","seg":"ai-marketing","listed":true,"desc":"虚拟数字人运营商，数字人与 AI 直播切入营销场景。","latestTech":"虚拟数字人制作与运营体系，叠加 AI 驱动的数字人直播与智能互动","detail":"【技术与定位】虚拟数字人运营商，是 AI 营销环节中**形态最特殊的一家**——不做投放代理，而是提供数字人本身（虚拟偶像、品牌代言数字人、直播数字人）。AI 技术的价值在于降低数字人的制作成本与驱动门槛：传统数字人依赖动捕与人工驱动，AI 驱动的数字人可实现自主直播、实时互动与多语种输出。\n【商业化】收入来源包括数字人定制开发、运营分成与直播带货。AI 数字人直播的核心商业逻辑是**把直播的边际人力成本降到接近零**——传统直播需要真人主播（受时长、精力、人力成本限制），AI 数字人可 24 小时不间断开播。\n【风险】①**数字人赛道商业模式的可持续性未经充分验证**：数字人直播的转化率与真人主播仍有差距，观众接受度存在天花板；②公司历史上经历较大业务转型与商誉减值，财务质量与治理结构需谨慎评估；③数字人形象涉及 IP 版权与肖像权，合规风险需关注；④与蓝色光标等综合营销商相比，公司缺乏媒介资源与客户规模优势，业务规模小、抗风险能力弱。","cap":100}'::jsonb)
ON CONFLICT (name) DO UPDATE SET
  code = EXCLUDED.code, industry = EXCLUDED.industry, seg = EXCLUDED.seg,
  listed = EXCLUDED.listed, round = EXCLUDED.round, cap = EXCLUDED.cap,
  rev = EXCLUDED.rev, data = research_companies.data || EXCLUDED.data;

-- ai-app 旧成员重标到细分（含 jsonb 内 seg 同步）
UPDATE research_companies SET seg = 'ai-fin', data = jsonb_set(data, '{seg}', '"ai-fin"') WHERE name = '同花顺';
UPDATE research_companies SET seg = 'ai-fin', data = jsonb_set(data, '{seg}', '"ai-fin"') WHERE name = '东方财富';
UPDATE research_companies SET seg = 'ai-fin', data = jsonb_set(data, '{seg}', '"ai-fin"') WHERE name = '恒生电子';
UPDATE research_companies SET seg = 'ai-fin', data = jsonb_set(data, '{seg}', '"ai-fin"') WHERE name = '金证股份';
UPDATE research_companies SET seg = 'ai-fin', data = jsonb_set(data, '{seg}', '"ai-fin"') WHERE name = '指南针';
UPDATE research_companies SET seg = 'ai-fin', data = jsonb_set(data, '{seg}', '"ai-fin"') WHERE name = '九方智投控股';
UPDATE research_companies SET seg = 'ai-agent', data = jsonb_set(data, '{seg}', '"ai-agent"') WHERE name = '蝴蝶效应（Manus）';
UPDATE research_companies SET seg = 'ai-office', data = jsonb_set(data, '{seg}', '"ai-office"') WHERE name = '金山办公';
UPDATE research_companies SET seg = 'ai-office', data = jsonb_set(data, '{seg}', '"ai-office"') WHERE name = '拓尔思';
UPDATE research_companies SET seg = 'ai-content', data = jsonb_set(data, '{seg}', '"ai-content"') WHERE name = '万兴科技';
UPDATE research_companies SET seg = 'ai-content', data = jsonb_set(data, '{seg}', '"ai-content"') WHERE name = '生数科技';
UPDATE research_companies SET seg = 'ai-content', data = jsonb_set(data, '{seg}', '"ai-content"') WHERE name = '爱诗科技';
UPDATE research_companies SET seg = 'ai-vision', data = jsonb_set(data, '{seg}', '"ai-vision"') WHERE name = '商汤-W';
UPDATE research_companies SET seg = 'ai-vision', data = jsonb_set(data, '{seg}', '"ai-vision"') WHERE name = '虹软科技';
UPDATE research_companies SET seg = 'ai-vision', data = jsonb_set(data, '{seg}', '"ai-vision"') WHERE name = '云从科技';
UPDATE research_companies SET seg = 'ai-vision', data = jsonb_set(data, '{seg}', '"ai-vision"') WHERE name = '格灵深瞳';

-- ============================================================
-- 2026-XX 清理：AI 产业链去掉「AI 芯片」环节
-- 原因：芯片设计与制造统一归入半导体产业链（design 环节），AI 板块不重复体现。
-- 影响：删除 8 条 <公司>-AI视图 镜像行；AI 板块 78 → 70 家。
-- ============================================================
DELETE FROM research_companies WHERE name IN (
  '寒武纪-AI视图', '海光信息-AI视图', '景嘉微-AI视图', '龙芯中科-AI视图',
  '沐曦股份-AI视图', '摩尔线程-AI视图', '燧原科技-AI视图', '壁仞科技-AI视图'
);

-- 注：以下两条 UPDATE 仅用于「先改名后删除」的替代路径，正常执行上面 DELETE 后即为空操作。
-- UPDATE research_companies SET name = '海光信息' WHERE name = '海光信息-AI视图';
-- UPDATE research_companies SET name = '景嘉微' WHERE name = '景嘉微-AI视图';

-- ============================================================
-- 补齐 AI 应用环节缺失的公司（TREE 声明但云端不存在）
-- 用友网络 / 金蝶国际 —— AI 办公；中控技术-AI视图 —— AI 工业/制造
-- ============================================================
INSERT INTO research_companies (name, code, industry, seg, listed, round, cap, rev, data) VALUES
('用友网络','600588.SH','ai','ai-office',true,'已上市',512.0,98.0,
 '{"pe":null,"rd":23,"cap":512.0,"rev":98.0,"seg":"ai-office","code":"600588.SH","name":"用友网络","industry":"ai","listed":true,"tech":[],"funding":[],"spark":[],"gross":null,"revGrowth":-6.8,"latestTech":"YonGPT 企业服务大模型与智能体平台","desc":"企业管理软件（ERP/财务/HR）龙头，BIP 平台接入大模型推出 YonGPT 与智能体。"}'::jsonb),
('金蝶国际','0268.HK','ai','ai-office',true,'已上市',420.0,62.0,
 '{"pe":null,"rd":null,"cap":420.0,"rev":62.0,"seg":"ai-office","code":"0268.HK","name":"金蝶国际","industry":"ai","listed":true,"tech":[],"funding":[],"spark":[],"gross":null,"revGrowth":11.5,"latestTech":"AI 原生产品线（苍穹 AI / 星瀚 AI）","desc":"云 ERP 厂商，苍穹/星瀚平台推出 AI 原生产品，AI 收入已单独披露。"}'::jsonb),
('中控技术-AI视图','688777.SH','ai','ai-industrial',true,'已上市',696.2,36.3,
 '{"pe":224.5,"rd":12,"cap":696.2,"rev":36.3,"seg":"ai-industrial","code":"688777.SH","name":"中控技术-AI视图","industry":"ai","listed":true,"tech":[],"funding":[],"spark":[],"gross":null,"revGrowth":-5.1,"latestTech":"工业 AI 与智能工厂方案落地","desc":"（同一公司在 AI 行业图谱中的入口）流程工业自动化龙头，工业 AI 收入已单独披露。"}'::jsonb)
ON CONFLICT (name) DO UPDATE SET
  seg = EXCLUDED.seg, industry = EXCLUDED.industry, cap = EXCLUDED.cap, rev = EXCLUDED.rev,
  data = research_companies.data || EXCLUDED.data;
