-- 股票笔记表
create table if not exists stock_notes (
  id bigserial primary key,
  stock_code text not null,
  note text not null,
  created_at timestamptz default now(),
  updated_at timestamptz
);

create index if not exists idx_stock_notes_stock_code on stock_notes(stock_code);
create index if not exists idx_stock_notes_created_at on stock_notes(created_at desc);
