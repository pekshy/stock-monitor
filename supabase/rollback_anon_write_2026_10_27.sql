-- ============================================================
-- 回退：恢复 anon 对 31 张表的写权限
-- 2026-10-27
--
-- 背景：2026-10-24 执行过 security_2026_10_24_revoke_anon_write.sql，
--       收回了 anon 的 INSERT/UPDATE/DELETE/TRUNCATE。
--       现因数据任务写入失败，需要回退。
--
-- 说明：本次只恢复 INSERT / UPDATE / DELETE，不恢复 TRUNCATE。
--       TRUNCATE 会无提示清空全表且不可回滚，任何脚本都不应依赖它。
--       如果确有需要，见文件末尾的可选语句。
--
-- 执行位置：Supabase Dashboard → SQL Editor
-- 幂等：可重复执行
-- ============================================================

GRANT INSERT, UPDATE, DELETE ON TABLE
  -- 行情与估值
  public.daily_quotes,
  public.daily_valuations,
  public.research_quotes,
  public.research_quote_runs,
  public.etf_daily_data,
  public.etf_weekly_data,
  public.etf_indicators,
  public.etf_tracked_index_history,
  public.index_valuation_latest,
  -- ETF 信号
  public.etf_signals,
  public.etf_momentum_signals,
  public.etf_butterworth_fit,
  public.etf_claw_signals,
  -- 宏观指标
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
  -- 研报/事件/公告
  public.research_events,
  public.research_reports,
  public.research_announcements,
  -- 模拟盘
  public.paper_accounts,
  public.paper_nav,
  public.paper_positions,
  public.paper_trades,
  -- 运行日志
  public.data_update_log
TO anon;

-- ------------------------------------------------------------
-- 保险：确保 service_role 拥有全表全权限
-- （数据任务若用 service key，这一句保证不会因 GRANT 缺失而失败）
-- ------------------------------------------------------------
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ------------------------------------------------------------
-- 复核：确认 anon / service_role 的实际权限
-- ------------------------------------------------------------
SELECT grantee,
       table_name,
       string_agg(privilege_type, ', ' ORDER BY privilege_type) AS privs
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND grantee IN ('anon', 'service_role')
  AND table_name IN ('daily_quotes','research_events','paper_nav','research_reports','etf_daily_data')
GROUP BY 1, 2
ORDER BY 1, 2;

-- ------------------------------------------------------------
-- 可选：如果确实需要 TRUNCATE（一般不需要，慎用）
-- ------------------------------------------------------------
-- GRANT TRUNCATE ON TABLE public.daily_quotes, public.daily_valuations TO anon;

-- ------------------------------------------------------------
-- 可选：彻底回退到加固前的状态（放弃全部加固，慎用）
-- ------------------------------------------------------------
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon;
