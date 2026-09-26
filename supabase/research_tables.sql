-- ============================================================
-- 行业研究工作台 · 云端表（独立于既有表，research_ 前缀）
-- 在 Supabase Dashboard → SQL Editor 中整体执行一次即可
-- ============================================================

-- 1) 企业库（上市 + 未上市合成一张表）
--    data = 页面原始记录整包（desc/tech[]/funding[]/spark/latestTech/pe/rd/gross/market/latest 等）
create table if not exists research_companies (
  name         text primary key,
  code         text,
  industry     text not null,
  seg          text,
  listed       boolean not null default false,
  round        text,
  cap          numeric,
  valuation    numeric,
  rev          numeric,
  last_funding text,
  data         jsonb not null default '{}'::jsonb,
  updated_at   timestamptz not null default now()
);
create index if not exists idx_res_co_ind on research_companies(industry);
create index if not exists idx_res_co_seg on research_companies(industry, seg);

-- 2) 研究报告
create table if not exists research_reports (
  url           text primary key,
  date          text,
  org           text,
  title         text,
  industry      text,
  seg           text,
  sub           text,
  rtype         text,
  industry_name text,
  researcher    text,
  rating        text,
  fetched_at    text
);
create index if not exists idx_res_rep_ind_date on research_reports(industry, date desc);

-- 3) 重大事件
create table if not exists research_events (
  url        text primary key,
  time       text,
  date       text,
  type       text,
  industry   text,
  seg        text,
  sub        text,
  title      text,
  summary    text,
  companies  text,
  fetched_at text
);
create index if not exists idx_res_evt_ind_date on research_events(industry, date desc);

-- 4) 公司公告（只存链接，不存附件）
create table if not exists research_announcements (
  id         bigserial primary key,
  code       text not null,
  date       text not null,
  tag        text not null,
  title      text not null,
  attach_url text,
  detail_url text,
  fetched_at text,
  unique(code, date, title)
);
create index if not exists idx_res_ann_code_date on research_announcements(code, date desc);
create index if not exists idx_res_ann_tag on research_announcements(tag);

-- 5) 研究笔记（个人研究资产，不设保留窗口）
create table if not exists research_notes (
  id          bigserial primary key,
  hash        text not null unique,
  kind        text not null,
  title       text not null,
  body        text,
  source      text,
  industry    text,
  seg         text,
  sub         text,
  companies   text,
  tags        text,
  occurred_at text,
  file_path   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz
);
create index if not exists idx_res_note_date on research_notes(occurred_at desc);
create index if not exists idx_res_note_kind on research_notes(kind);

-- ============================================================
-- RLS：全部启用；读 = 登录用户（Supabase Auth authenticated 角色）
-- 本地抓取/迁移脚本用 service_role key 写库，自动绕过 RLS，无需写策略
-- ============================================================
alter table research_companies    enable row level security;
alter table research_reports      enable row level security;
alter table research_events       enable row level security;
alter table research_announcements enable row level security;
alter table research_notes        enable row level security;

-- 读：仅登录用户
create policy "research read for authenticated" on research_companies
  for select to authenticated using (true);
create policy "research read for authenticated" on research_reports
  for select to authenticated using (true);
create policy "research read for authenticated" on research_events
  for select to authenticated using (true);
create policy "research read for authenticated" on research_announcements
  for select to authenticated using (true);
create policy "research read for authenticated" on research_notes
  for select to authenticated using (true);

-- 写：研究笔记允许登录用户增改删（页面自助录入）
create policy "research notes write for authenticated" on research_notes
  for insert to authenticated with check (true);
create policy "research notes update for authenticated" on research_notes
  for update to authenticated using (true) with check (true);
create policy "research notes delete for authenticated" on research_notes
  for delete to authenticated using (true);

-- ============================================================
-- 备选：若改用「与既有表一致的公开读」，把上面的 select 策略
-- 换成下面这组（anon + authenticated 都可读）：
--
-- create policy "research public read" on research_companies
--   for select to anon, authenticated using (true);
-- （其余表同理）
-- ============================================================
