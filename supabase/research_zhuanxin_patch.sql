-- 展芯股份（江苏展芯半导体技术股份有限公司，301707.SZ）纳入研究池
-- 已上市 · 产业链环节 semiconductor / design（模拟芯片 · 军工电源管理）
-- 重放安全：data 为整包覆盖（excluded.data），重放时必须带上全部字段
insert into research_companies (name, code, industry, seg, listed, round, cap, valuation, rev, last_funding, data)
values (
  '展芯股份',
  '301707.SZ',
  'semiconductor',
  'design',
  true,
  null,
  273.4,
  null,
  6.39,
  null,
  '{"name":"展芯股份","code":"301707.SZ","industry":"semiconductor","seg":"design","listed":true,"cap":273.4,"rev":6.39,"pe":112.2,"gross":null,"revGrowth":54.9,"desc":"江苏展芯半导体技术股份有限公司（简称展芯股份，2018 年成立，总部南京雨花台区），国家级专精特新「小巨人」、江苏省独角兽企业，专注高可靠模拟芯片及微模块的研发设计、测试与销售，是国内军工电源管理芯片「自主正向设计」路线的代表。产品以电源管理芯片为主导，涵盖 DC/DC 转换芯片、线性稳压器（LDO）、负载及限流开关（Load Switch）、漏极调制芯片，并配套晶闸管、MOSFET、二极管等分立器件；微模块产品采用扇出型三维堆叠封装工艺，将主控芯片与无源器件高密度集成，实现隔离/非隔离 DC/DC 变换、逻辑控制与信号调制。公司正将产品矩阵向信号链延伸，已布局电流检测、电压基准、比较器、运放、时序芯片等品类。产品广泛应用于机载、弹载、舰载、陆基、单兵等国防装备平台，服务雷达探测、精确制导、军事通信等场景，客户覆盖中国电科、中国电子、中航工业、航天科工、航天科技、兵器工业等集团下属科研院所，报告期内累计向超 1600 家客户供货。","latestTech":"累计获授权发明专利 51 项、集成电路布图设计专有权 56 项，掌握「带隙基准电源抑制比设计技术」「无源器件堆叠的多芯片埋入三维封装可靠性设计技术」等 15 项核心技术；2026-08-07 创业板上市，从 IPO 受理到挂牌仅 233 天，创年内创业板第二快","tech":[{"date":"2026-08","title":"创业板上市，首日开盘涨 360.55%，总市值一度达 444 亿元"},{"date":"2026-05","title":"创业板 IPO 注册生效，拟募资投向高可靠模拟芯片及微模块产线"},{"date":"2025","title":"完成电流检测、电压基准、比较器、运放、时序芯片等多品类信号链产品研发布局"}],"funding":[{"date":"2026-08","round":"IPO 上市","amount":"创业板挂牌","investors":"深交所创业板，证券代码 301707.SZ"},{"date":"2025-12","round":"IPO 受理","amount":"—","investors":"保荐机构辅导，审计与法律中介进场"},{"date":"—","round":"战略融资","amount":"1500 万元","investors":"南京富安创合投资基金（雨花台区软件谷参投基金）"}],"spark":[444,320,300,273.4],"note":"军工模拟芯片领域国产替代代表：区别于消费级模拟芯片追求性价比，军工模拟芯片需满足高可靠、长寿命、抗极端环境、高集成度、100% 自主可控五大要求，长期由 TI、ADI、英飞凌等国际巨头垄断高端市场；国内企业多聚焦低端替代与逆向设计，展芯以自主正向设计 + 全链条技术闭环（设计-封装-测试筛选）切入，是军工电源管理芯片较早实现全品类覆盖的企业"}'::jsonb
)
on conflict (name) do update set
  code = excluded.code,
  industry = excluded.industry,
  seg = excluded.seg,
  listed = excluded.listed,
  cap = excluded.cap,
  rev = excluded.rev,
  data = excluded.data;
