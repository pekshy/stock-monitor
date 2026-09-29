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
