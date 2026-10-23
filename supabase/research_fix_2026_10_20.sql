-- 2026-10-20 研究池数据修正：上市公司档案里的过期 IPO 表述
--
-- 背景：模型公司/机器人公司陆续上市后，research_companies 的 desc、latestFunding
-- 仍停留在上市前状态（如 MiniMax「港股 IPO 推进中」），详情页会展示过期信息。
--
-- 受影响：MiniMax(0100.HK)、智谱(02513.HK)、宇树科技(688836.SH)
-- 另附：福斯特(603806.SH)、鼎龙股份(300054.SZ) 的企业说明改写（体现新能源业务）

-- 1) MiniMax：2026-01-09 港交所上市，发行价 165 港元，募资约 55.4 亿港元
UPDATE research_companies
SET data = data
  || jsonb_build_object(
       'desc', '多模态大模型公司（海螺 AI / Talkie / 星野），2026-01-09 港股上市；海外收入占比超七成，覆盖 200 余个国家、个人用户逾 2.1 亿。',
       'latestFunding', '2026-01 · 港股 IPO（发行价 165 港元，募资约 55.4 亿港元）',
       'lastFunding', '2026-01',
       'ipo', jsonb_build_object(
         'date', '2026-01-09', 'board', '港交所主板', 'price', 165,
         'raised', '55.4 亿港元', 'firstDayClose', 345, 'firstDayPct', 109.09,
         'peak', '2026-03-18 盘中 1330 港元，市值一度超 4000 亿港元',
         'note', '公开发售超额认购 1837 倍；基石 14 家含 ADIA、阿里巴巴、易方达')
     ),
    valuation = NULL
WHERE code = '0100.HK';

-- 2) 智谱：2026-01-08 港交所上市，发行价 116.20 港元；2026-07 配售募资约 314 亿港元
UPDATE research_companies
SET data = data
  || jsonb_build_object(
       'desc', '国产大模型头部公司，GLM 系列模型 + MaaS 商业化，2026-01-08 港股上市。',
       'latestFunding', '2026-01 · 港股 IPO（发行价 116.20 港元）；2026-07 配售募资约 314 亿港元',
       'lastFunding', '2026-07',
       'ipo', jsonb_build_object(
         'date', '2026-01-08', 'board', '港交所主板', 'price', 116.2,
         'firstMarketCap', '约 528 亿港元',
         'peak', '2026-06-22 盘中 2980 港元，市值一度触及 1.33 万亿港元',
         'placement', '2026-07-13 配售 1978 万股新 H 股，募资约 314 亿港元')
     ),
    valuation = NULL
WHERE code = '02513.HK';

-- 3) 宇树科技：2026-08-19 科创板上市（688836.SH），发行价 150.80 元
UPDATE research_companies
SET data = data
  || jsonb_build_object(
       'desc', '四足机器人全球龙头，人形机器人 H1/G1 量产领先，2026-08-19 科创板上市。',
       'latestFunding', '2026-08 · 科创板 IPO（发行价 150.80 元，募资约 60.99 亿元）',
       'lastFunding', '2026-08'
     ),
    valuation = NULL
WHERE code = '688836.SH';

-- 4) 福斯特：主业是光伏胶膜，图谱按感光干膜归入半导体·PCB，说明里写清主业
UPDATE research_companies
SET data = jsonb_set(data, '{desc}', to_jsonb(
  '新能源（光伏）为主业：光伏胶膜全球龙头，EVA/POE 胶膜全球市占率约五成，客户覆盖主流组件厂；同时以精密涂布平台切入 PCB 上游的感光干膜，为国产干膜龙头，江门基地建成后规划年产能 5 亿平米。（图谱按感光干膜业务归入半导体·PCB）'::text))
WHERE code = '603806.SH';

-- 5) 鼎龙股份：补上锂电辅材这块新业务
UPDATE research_companies
SET data = jsonb_set(data, '{desc}', to_jsonb(
  'CMP 抛光垫国产龙头，国内唯一掌握全流程核心技术的供应商；产品线延伸至 CMP 抛光液/清洗液、YPI/PSPI 显示材料、KrF/ArF 晶圆光刻胶与先进封装材料。2026 年收购皓飞新材 70% 切入锂电分散剂/粘结剂，另保留打印复印耗材业务。'::text))
WHERE code = '300054.SZ';
