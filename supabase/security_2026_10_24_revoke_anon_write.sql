-- ============================================================
-- 安全加固：收回 anon 对「前端从不写入」的表的写权限
-- 2026-10-24
--
-- 背景：前端只持有 anon key（公开在 bundle 里），任何拿到它的人都能
--       直接对 Supabase 读写。此前所有表的 INSERT/UPDATE/DELETE 对
--       anon 全开，行情/研究/模拟盘数据可被任意篡改。
--
-- 原则：前端不写的表 → 全部收回写权限（零功能影响）
--       前端要写的表 → 保留（否则自己的编辑功能失效），靠其他手段防护
--
-- 执行位置：Supabase Dashboard → SQL Editor
-- 幂等：可重复执行
-- ============================================================

-- ------------------------------------------------------------
-- 1. 收回写权限（前端只读 / 仅由 GitHub Actions 的 service key 写入）
-- ------------------------------------------------------------
-- service key 走的是 service_role，不受此处 REVOKE 影响，同步任务照常运行。
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE
  -- 行情与估值（Actions 写入）
  public.daily_quotes,
  public.daily_valuations,
  public.research_quotes,
  public.research_quote_runs,
  public.etf_daily_data,
  public.etf_weekly_data,
  public.etf_indicators,
  public.etf_tracked_index_history,
  public.index_valuation_latest,
  -- ETF 信号（Actions 写入）
  public.etf_signals,
  public.etf_momentum_signals,
  public.etf_butterworth_fit,
  public.etf_claw_signals,
  -- 宏观指标（Actions 写入）
  public.market_indicators,
  public.china_indicators,
  public.fred_indicators,
  public.fed_forecast,
  public.stock_market_volume,
  public.latest_indicators,
  public.latest_china_indicators,
  public.latest_fred_indicators,
  public.latest_fed_forecast,
  public.latest_market_indicators,
  -- 研报/事件/公告（Actions 写入）
  public.research_events,
  public.research_reports,
  public.research_announcements,
  -- 模拟盘（外部项目用 service key 写入，本站只读）
  public.paper_accounts,
  public.paper_nav,
  public.paper_positions,
  public.paper_trades,
  -- 运行日志
  public.data_update_log
FROM anon;

-- ------------------------------------------------------------
-- 2. 明确保留写权限的表（前端直接编辑，收回会锁死自己）
--    这些表仍然「公开可写」，风险不可消除，只能靠：
--      a) 定期备份（见 .github/workflows/backup.yml）
--      b) 将来迁移到 Supabase Auth 后按 auth.uid() 收紧
-- ------------------------------------------------------------
--   trade_records      交易记录
--   stock_notes        个股笔记
--   etf_notes          ETF 笔记
--   market_views       市场观点
--   research_notes     研究笔记
--   research_companies 企业档案（核心竞争力 desc）
--   watchlist          关注列表
--   etf_info           ETF 自选标记 is_focused
-- 无需操作，仅作记录。

-- ------------------------------------------------------------
-- 3. 复核：anon 在 public schema 下的实际权限
-- ------------------------------------------------------------
SELECT table_name,
       string_agg(privilege_type, ', ' ORDER BY privilege_type) AS anon_privs
FROM information_schema.role_table_grants
WHERE table_schema = 'public' AND grantee = 'anon'
GROUP BY table_name
ORDER BY table_name;

-- 期望结果：上表清单（daily_quotes / paper_* / research_events …）
-- 只剩 SELECT；trade_records / *_notes / watchlist / etf_info /
-- market_views / research_companies / research_notes 仍有
-- INSERT, UPDATE, DELETE。
