-- ============================================================
-- 行业研究 · 上市企业行情与估值（独立于行情板块的 daily_quotes / daily_valuations）
-- 设计口径：
--   1) 覆盖对象 = research_companies 中 listed = true 且有有效代码的企业（全池）
--   2) 行情板块的 watchlist 是「关注子集」，两者互不写入、互不影响
--   3) 市值统一换算为「亿」计量，币种单独存 currency，避免跨币种混排
-- 执行：Supabase Dashboard → SQL Editor，可重复执行
-- ============================================================

create table if not exists research_quotes (
  code              text        not null,   -- 池内原始代码：688981.SH / 0700.HK / NVDA.US
  trade_date        date        not null,   -- 该市场当日交易日
  name              text,
  market            text,                   -- cn / hk / us / tw / eu
  currency          text,                   -- CNY / HKD / USD / EUR / TWD ...
  open              numeric,
  high              numeric,
  low               numeric,
  close             numeric,
  prev_close        numeric,
  pct_change        numeric,                -- 当日涨跌幅 %
  volume            numeric,
  amount            numeric,
  turnover_rate     numeric,
  total_market_cap  numeric,                -- 亿（CNY/HKD/USD/EUR/TWD 各自计量）
  pe_ttm            numeric,
  pb                numeric,
  psr               numeric,
  source            text,                   -- akshare-em / yfinance
  fetched_at        timestamptz not null default now(),
  primary key (code, trade_date)
);

create index if not exists idx_rq_date      on research_quotes(trade_date desc);
create index if not exists idx_rq_code_date on research_quotes(code, trade_date desc);
create index if not exists idx_rq_market    on research_quotes(market, trade_date desc);

-- 读：公开（与 research_ 系列表口径一致）；写：service_role 绕过 RLS
alter table research_quotes enable row level security;

drop policy if exists "research quotes public read" on research_quotes;
create policy "research quotes public read" on research_quotes
  for select to anon, authenticated using (true);

-- 抓取批次留痕（哪天真抓挂了，能一眼看出是接口问题还是代码问题）
create table if not exists research_quote_runs (
  id          bigserial primary key,
  run_at      timestamptz not null default now(),
  market      text,
  total       int,
  ok          int,
  failed      int,
  trade_date  date,
  note        text
);
alter table research_quote_runs enable row level security;
drop policy if exists "research quote runs public read" on research_quote_runs;
create policy "research quote runs public read" on research_quote_runs
  for select to anon, authenticated using (true);
