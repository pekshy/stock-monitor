-- 交易记录表
CREATE TABLE IF NOT EXISTS trade_records (
  id BIGSERIAL PRIMARY KEY,
  symbol TEXT NOT NULL,
  name TEXT,
  direction TEXT NOT NULL CHECK (direction IN ('buy', 'sell')),
  trade_date DATE NOT NULL,
  amount NUMERIC NOT NULL,
  stop_loss_pct NUMERIC,
  take_profit_pct NUMERIC,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  linked_id BIGINT REFERENCES trade_records(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_trade_records_symbol ON trade_records(symbol);
CREATE INDEX IF NOT EXISTS idx_trade_records_trade_date ON trade_records(trade_date);
CREATE INDEX IF NOT EXISTS idx_trade_records_status ON trade_records(status);

-- 已存在表的迁移脚本（如需修改已建好的表）:
-- ALTER TABLE trade_records DROP COLUMN IF EXISTS stop_loss;
-- ALTER TABLE trade_records DROP COLUMN IF EXISTS take_profit;
-- ALTER TABLE trade_records ADD COLUMN IF NOT EXISTS stop_loss_pct NUMERIC;
-- ALTER TABLE trade_records ADD COLUMN IF NOT EXISTS take_profit_pct NUMERIC;
