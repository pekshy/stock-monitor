-- 模拟交易（Paper Trading）表结构
-- 生成日期：2026-10-24
-- 设计原则：写入端（模拟盘项目）负责计算，展示端（本站）只读，不重算净值
-- 执行方式：Supabase Dashboard → SQL Editor 粘贴执行（REST 接口无法建表）

-- 1) 账户
CREATE TABLE IF NOT EXISTS paper_accounts (
  id            TEXT PRIMARY KEY,                 -- 如 'ai_hw_rotation'
  name          TEXT NOT NULL,
  strategy      TEXT,                             -- 策略描述，用于页面副标题
  init_cash     NUMERIC NOT NULL,                 -- 初始资金（元）
  start_date    DATE NOT NULL,
  benchmark_code TEXT DEFAULT '000300',           -- 基准指数代码（沪深300）
  benchmark_name TEXT DEFAULT '沪深300',
  status        TEXT DEFAULT 'active',            -- active / paused / closed
  note          TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- 2) 成交明细（事件流，只追加不修改）
CREATE TABLE IF NOT EXISTS paper_orders (
  id          BIGSERIAL PRIMARY KEY,
  account_id  TEXT NOT NULL REFERENCES paper_accounts(id) ON DELETE CASCADE,
  ts          TIMESTAMPTZ NOT NULL,               -- 成交时间（精确到分钟即可）
  trade_date  DATE NOT NULL,
  symbol      TEXT NOT NULL,
  name        TEXT,
  side        TEXT NOT NULL CHECK (side IN ('buy','sell')),
  price       NUMERIC NOT NULL,
  qty         NUMERIC NOT NULL,                   -- 股数/份数
  amount      NUMERIC,                            -- 成交金额 = price*qty
  fee         NUMERIC DEFAULT 0,
  reason      TEXT,                               -- 决策理由：三个月后归因的唯一依据
  created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_paper_orders_acc_date ON paper_orders(account_id, trade_date DESC);

-- 3) 当前持仓（覆盖写，不保留历史）
CREATE TABLE IF NOT EXISTS paper_positions (
  account_id  TEXT NOT NULL REFERENCES paper_accounts(id) ON DELETE CASCADE,
  symbol      TEXT NOT NULL,
  name        TEXT,
  qty         NUMERIC NOT NULL,
  avg_cost    NUMERIC NOT NULL,
  last_price  NUMERIC,
  updated_at  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (account_id, symbol)
);

-- 4) 每日净值快照（核心表：历史永不修改）
CREATE TABLE IF NOT EXISTS paper_nav_daily (
  account_id    TEXT NOT NULL REFERENCES paper_accounts(id) ON DELETE CASCADE,
  date          DATE NOT NULL,
  nav           NUMERIC NOT NULL,                 -- 归一化净值，起始日 = 1.0
  total_asset   NUMERIC,
  cash          NUMERIC,
  market_value  NUMERIC,
  benchmark_nav NUMERIC,                          -- 基准同期归一化净值
  drawdown      NUMERIC,                          -- 当日相对历史高点的回撤（负数）
  positions     JSONB,                            -- 当日持仓快照 [{symbol,qty,price,value}]，用于归因
  PRIMARY KEY (account_id, date)
);
CREATE INDEX IF NOT EXISTS idx_paper_nav_date ON paper_nav_daily(date DESC);

-- 5) 只读策略：允许匿名读取（模拟盘数据不含真实持仓，公开无风险）
ALTER TABLE paper_accounts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_orders    ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_nav_daily ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS paper_accounts_read  ON paper_accounts;
DROP POLICY IF EXISTS paper_orders_read    ON paper_orders;
DROP POLICY IF EXISTS paper_positions_read ON paper_positions;
DROP POLICY IF EXISTS paper_nav_read       ON paper_nav_daily;

CREATE POLICY paper_accounts_read  ON paper_accounts  FOR SELECT USING (true);
CREATE POLICY paper_orders_read    ON paper_orders    FOR SELECT USING (true);
CREATE POLICY paper_positions_read ON paper_positions FOR SELECT USING (true);
CREATE POLICY paper_nav_read       ON paper_nav_daily FOR SELECT USING (true);

-- 写入由模拟盘项目使用 service_role key 完成（绕过 RLS）

-- 示例：注册一个账户（按需修改）
-- INSERT INTO paper_accounts (id, name, strategy, init_cash, start_date, benchmark_code, benchmark_name)
-- VALUES ('ai_hw', 'AI 硬件轮动', '半导体设备 + 光模块 + 存储，月度调仓', 1000000, '2026-06-01', '000300', '沪深300');
