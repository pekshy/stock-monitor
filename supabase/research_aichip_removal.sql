-- ============================================================
-- 算力芯片（ai-chip）环节删除补丁：清空研报/事件上的该环节标签
-- 生成时间：2026-09-26
-- 用法：Supabase Dashboard → SQL Editor 整体粘贴执行
-- 幂等：重复执行无副作用
-- ============================================================

update research_reports set seg = '' where seg = 'ai-chip';
update research_events  set seg = '' where seg = 'ai-chip';
