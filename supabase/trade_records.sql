-- 交易记录表
CREATE TABLE IF NOT EXISTS trade_records (
  id BIGSERIAL PRIMARY KEY,
  symbol TEXT NOT NULL,
  name TEXT,
  direction TEXT NOT NULL CHECK (direction IN ('buy', 'sell')),
  trade_date DATE NOT NULL,
  amount NUMERIC NOT NULL,
  stop_loss NUMERIC,
  take_profit NUMERIC,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  linked_id BIGINT REFERENCES trade_records(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_trade_records_symbol ON trade_records(symbol);
CREATE INDEX IF NOT EXISTS idx_trade_records_trade_date ON trade_records(trade_date);
CREATE INDEX IF NOT EXISTS idx_trade_records_status ON trade_records(status);
