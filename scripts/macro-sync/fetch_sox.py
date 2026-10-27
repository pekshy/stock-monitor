#!/usr/bin/env python3
"""
费城半导体指数（PHLX Semiconductor Index, ^SOX）日线同步

数据源：NASDAQ 官方行情接口（无需 key）
写入：Supabase fred_indicators，indicator_id = 'sox_index'
     字段：indicator_id / date / value（收盘点位）

用法：
  SUPABASE_URL=... SUPABASE_SERVICE_KEY=... python3 scripts/macro-sync/fetch_sox.py
  # 回补指定年数（默认 2 年）
  python3 scripts/macro-sync/fetch_sox.py --years 5
"""

import argparse
import datetime as dt
import os
import sys
import time

import requests

SB_URL = os.environ.get("SUPABASE_URL", "https://fqklpucwihbcgtwiwblr.supabase.co").rstrip("/")
SB_KEY = (os.environ.get("SUPABASE_SERVICE_KEY") or "").strip()
INDICATOR_ID = "sox_index"
NASDAQ_API = "https://api.nasdaq.com/api/quote/SOX/historical"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"
    ),
    "Accept": "application/json",
}


def fetch_window(start: dt.date, end: dt.date, retries: int = 3) -> list[dict]:
    """拉取一个时间窗内的日线（NASDAQ 单次上限约 400 条）"""
    params = {
        "assetclass": "index",
        "fromdate": start.isoformat(),
        "todate": end.isoformat(),
        "limit": 400,
    }
    for attempt in range(retries):
        try:
            r = requests.get(NASDAQ_API, params=params, headers=HEADERS, timeout=30)
            r.raise_for_status()
            payload = r.json()
            rows = (payload.get("data") or {}).get("tradesTable", {}).get("rows") or []
            out = []
            for row in rows:
                # date: "10/26/2026"  close: "11,083.47"
                try:
                    d = dt.datetime.strptime(row["date"], "%m/%d/%Y").date()
                    v = float(str(row["close"]).replace(",", "").replace("$", ""))
                except (KeyError, ValueError):
                    continue
                out.append({"indicator_id": INDICATOR_ID, "date": d.isoformat(), "value": v})
            return out
        except Exception as exc:  # noqa: BLE001
            if attempt == retries - 1:
                print(f"[warn] {start}~{end} 抓取失败: {exc}", file=sys.stderr)
                return []
            time.sleep(2 * (attempt + 1))
    return []


def fetch_history(years: int) -> list[dict]:
    today = dt.date.today()
    start = today - dt.timedelta(days=365 * years + 5)
    buf: dict[str, dict] = {}
    cursor = start
    # 按 300 天切片，避开 400 条上限
    while cursor < today:
        end = min(cursor + dt.timedelta(days=300), today)
        for row in fetch_window(cursor, end):
            buf[row["date"]] = row
        cursor = end + dt.timedelta(days=1)
        time.sleep(0.3)
    return [buf[k] for k in sorted(buf)]


def upsert(rows: list[dict]) -> None:
    if not SB_KEY:
        print("[error] 缺少 SUPABASE_SERVICE_KEY", file=sys.stderr)
        sys.exit(1)
    if not rows:
        print("[warn] 无数据可写")
        return
    headers = {
        "apikey": SB_KEY,
        "Authorization": f"Bearer {SB_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=minimal",
    }
    total = 0
    for i in range(0, len(rows), 500):
        chunk = rows[i : i + 500]
        r = requests.post(
            f"{SB_URL}/rest/v1/fred_indicators",
            params={"on_conflict": "indicator_id,date"},
            headers=headers,
            json=chunk,
            timeout=60,
        )
        if r.status_code >= 300:
            print(f"[error] 写入失败 {r.status_code}: {r.text[:300]}", file=sys.stderr)
            sys.exit(1)
        total += len(chunk)
    print(f"[ok] 写入 {total} 条 → fred_indicators / {INDICATOR_ID}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--years", type=int, default=2, help="回补年数，默认 2")
    args = ap.parse_args()

    rows = fetch_history(args.years)
    if rows:
        print(f"[info] 抓到 {len(rows)} 条，区间 {rows[0]['date']} ~ {rows[-1]['date']}，"
              f"最新收盘 {rows[-1]['value']:.2f}")
    upsert(rows)


if __name__ == "__main__":
    main()
