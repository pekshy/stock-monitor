-- 供应链补录 32 家（equipment 10 / material 20 / terminal 2）
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
