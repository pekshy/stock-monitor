-- ============================================================
-- research_notes 页面增改删 + 原件存储（配套 research_notes 页面 CRUD）
-- 在 Supabase Dashboard → SQL Editor 整体粘贴执行，可重复执行
--
-- 口径：公开读 + 站点密码挡 UI（与 research_public_read.sql 一致）。
-- 注意：这意味着任何拿到 publishable key 的人技术上可以写/删笔记，
--       站点密码只是 UI 层的门槛。若不可接受，改用 Supabase Auth 方案。
-- ============================================================

-- ---------- 1. research_notes：anon 可写（insert / update / delete） ----------
drop policy if exists "research read for authenticated" on research_notes;
drop policy if exists "research notes public read" on research_notes;
create policy "research notes public read" on research_notes
  for select using (true);

drop policy if exists "research notes anon insert" on research_notes;
create policy "research notes anon insert" on research_notes
  for insert to anon, authenticated with check (true);

drop policy if exists "research notes anon update" on research_notes;
create policy "research notes anon update" on research_notes
  for update to anon, authenticated using (true) with check (true);

drop policy if exists "research notes anon delete" on research_notes;
create policy "research notes anon delete" on research_notes
  for delete to anon, authenticated using (true);

-- ---------- 2. Storage：research-library 桶（原件归档，公开读） ----------
insert into storage.buckets (id, name, public)
values ('research-library', 'research-library', true)
on conflict (id) do update set public = true;

-- 公开读
drop policy if exists "research library public read" on storage.objects;
create policy "research library public read" on storage.objects
  for select using (bucket_id = 'research-library');

-- anon 上传 / 覆盖 / 删除（限本桶）
drop policy if exists "research library anon insert" on storage.objects;
create policy "research library anon insert" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'research-library');

drop policy if exists "research library anon update" on storage.objects;
create policy "research library anon update" on storage.objects
  for update to anon, authenticated
  using (bucket_id = 'research-library') with check (bucket_id = 'research-library');

drop policy if exists "research library anon delete" on storage.objects;
create policy "research library anon delete" on storage.objects
  for delete to anon, authenticated using (bucket_id = 'research-library');
