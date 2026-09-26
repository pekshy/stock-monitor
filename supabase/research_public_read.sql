-- ============================================================
-- RLS 调整：研究表改为「公开读」（与 stock-monitor 既有表一致）
-- 前提：research_tables.sql 已执行（里面默认是 authenticated-only 读）
-- 在 Supabase Dashboard → SQL Editor 执行一次
-- ============================================================

-- 删掉仅登录用户可读的策略
drop policy if exists "research read for authenticated" on research_companies;
drop policy if exists "research read for authenticated" on research_reports;
drop policy if exists "research read for authenticated" on research_events;
drop policy if exists "research read for authenticated" on research_announcements;
drop policy if exists "research read for authenticated" on research_notes;

-- 换成公开读（anon + authenticated）
create policy "research public read" on research_companies
  for select to anon, authenticated using (true);
create policy "research public read" on research_reports
  for select to anon, authenticated using (true);
create policy "research public read" on research_events
  for select to anon, authenticated using (true);
create policy "research public read" on research_announcements
  for select to anon, authenticated using (true);
create policy "research public read" on research_notes
  for select to anon, authenticated using (true);

-- 写策略不变：notes 仍仅登录用户（Supabase Auth）可写。
-- 当前应用没有 Supabase Auth，页面暂不能写笔记；
-- 本地 notes_cli.py 用 service_role key 写库不受影响。
