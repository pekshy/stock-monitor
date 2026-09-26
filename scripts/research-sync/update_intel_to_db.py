# -*- coding: utf-8 -*-
"""
抓取行业情报（研报 / 快讯事件）并直接写入 SQLite。

这是「抓取脚本改为 UPSERT 写库」的落地：数据不再落到 JSON 再由 inject 脚本注入，
数据库是唯一事实源，页面刷新即可见。

用法：
  python scripts/update_intel_to_db.py --event-days 2                # 抓近 2 天事件写库
  python scripts/update_intel_to_db.py --event-days 1 --dry-run      # 只看不写
  python scripts/update_intel_to_db.py --reports 3                   # 顺便刷新近 3 天研报
  python scripts/update_intel_to_db.py --dry-run --industry semiconductor --type 并购融资
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import db
import fetch_industry_intel as fi

ROOT = db.ROOT
PAGE = os.path.join(ROOT, "demo", "index.html")


def _load_anchor_companies():
    """云同步环境：从 companies.json 读上市公司锚点（仓库内无页面文件）。"""
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "companies.json")
    if not os.path.exists(path):
        return fi.load_tracked_companies(PAGE)
    code_map = {}
    for a in json.load(open(path, encoding="utf-8")).get("anchors", []):
        parts = a["code"].split(".")
        prefix = {"SH": "1", "SZ": "0"}.get(parts[-1]) if len(parts) == 2 else None
        if prefix and parts[0].isdigit():
            code_map[prefix + "." + parts[0]] = {
                "name": a["name"], "industry": a["industry"], "seg": a["seg"]}
    return code_map


def main():
    ap = argparse.ArgumentParser(description="抓取行业情报并写入数据库")
    ap.add_argument("--event-days", type=int, default=2, help="快讯回溯天数")
    ap.add_argument("--reports", type=int, default=0, help="研报回溯天数（0 = 不抓）")
    ap.add_argument("--dry-run", dest="dry_run", action="store_true", help="只打印不写库")
    ap.add_argument("--industry", default=None, help="打印时按行业过滤")
    ap.add_argument("--type", dest="etype", default=None, help="打印时按事件类型过滤")
    args = ap.parse_args()

    code_map = _load_anchor_companies()
    events, cutoff = fi.fetch_events(args.event_days, 30, code_map)
    reports = fi.fetch_reports(args.reports, 30, code_map)[0] if args.reports else []

    show = events
    if args.industry:
        show = [e for e in show if e["industry"] == args.industry]
    if args.etype:
        show = [e for e in show if e["type"] == args.etype]
    show.sort(key=lambda e: e["time"], reverse=True)

    label = fi.INDUSTRY_LABEL
    print("抓取结果：事件 %d 条（近 %d 天）%s" % (
        len(events), args.event_days,
        ("，研报 %d 篇（近 %d 天）" % (len(reports), args.reports)) if reports else ""))
    if args.industry or args.etype:
        print("过滤后 %d 条：" % len(show))
        for e in show:
            print("  [%s] %s | %s | %s" % (
                e["time"], e["type"], label.get(e["industry"], e["industry"]), e["title"]))
            print("        %s" % e["url"])

    if args.dry_run:
        print("\n--dry-run：未写库")
        return

    conn = db.connect()
    db.init_db(conn)
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    for e in events:
        db.upsert_event(conn, e, now=now)
    for r in reports:
        db.upsert_report(conn, r, now=now)
    db.set_meta(conn, "generatedAt", now)
    # 事件的时间跨度以库内实际数据为准（库会累积历史，比本次抓取窗口更宽）
    row = conn.execute("SELECT MIN(date), MAX(date) FROM events").fetchone()
    if row and row[0]:
        db.set_meta(conn, "eventCutoff", row[0])
        span = (datetime.strptime(row[1], "%Y-%m-%d") - datetime.strptime(row[0], "%Y-%m-%d")).days + 1
        db.set_meta(conn, "eventDays", span)
    if reports:
        db.set_meta(conn, "reportDays", args.reports)
        db.set_meta(conn, "reportRange", [min(r["date"] for r in reports),
                                          max(r["date"] for r in reports)])
    conn.commit()

    n_evt = conn.execute("SELECT COUNT(*) FROM events").fetchone()[0]
    n_rep = conn.execute("SELECT COUNT(*) FROM reports").fetchone()[0]
    conn.close()
    print("\n已写库（%s）：事件累计 %d 条，研报累计 %d 篇" % (now, n_evt, n_rep))

    # —— 云端同步（可选）：设置 SUPABASE_URL / SUPABASE_SERVICE_KEY 后自动启用 ——
    try:
        import supabase_writer as sw
        cw = sw.from_env()
        if cw:
            for e in events:
                cw.upsert_event(e, now=now)
            for r in reports:
                cw.upsert_report(r, now=now)
            n = cw.flush()
            print("云端同步：research_events / research_reports 共 %d 行" % n)
    except Exception as e:  # noqa: BLE001
        print("[云端同步失败，本地库不受影响] %s" % e, file=sys.stderr)


if __name__ == "__main__":
    main()
