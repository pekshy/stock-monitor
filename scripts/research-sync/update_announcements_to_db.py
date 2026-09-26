# -*- coding: utf-8 -*-
"""
抓取上市公司公告并直接写入 SQLite。

这是公告链路的「抓取即写库」改造：替代 batch_announcements.py（抓成 JSON）
+ migrate_json_to_db.py（手工导入）两步走。去重靠 UNIQUE(code, date, title)，
因此可以每天重复跑、也可以只跑最近几天增量补。

公司清单以库内 companies 表为准（库是唯一事实源），含 org_id 时跳过搜索直接抓取。

用法：
  python scripts/update_announcements_to_db.py --days 7          # 日更：只补最近 7 天
  python scripts/update_announcements_to_db.py --days 180        # 首次全量
  python scripts/update_announcements_to_db.py --days 7 --dry-run
  python scripts/update_announcements_to_db.py --only 688981,300124
"""
from __future__ import annotations

import argparse
import datetime as dt
import importlib.util
import json
import os
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import db  # noqa: E402

_spec = importlib.util.spec_from_file_location(
    "cninfo", os.path.join(HERE, "cninfo_announcement.py"))
cn = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(cn)


def load_targets(conn):
    """云同步环境：优先读 companies.json 的追踪清单（含 orgId，可跳过证券搜索）；
    本地环境（无 companies.json 或为空）回退库内 companies 表。"""
    path = os.path.join(HERE, "companies.json")
    if os.path.exists(path):
        tracked = json.load(open(path, encoding="utf-8")).get("tracked") or []
        if tracked:
            return [dict(t) for t in tracked]
    return [dict(r) for r in conn.execute(
        "SELECT code, name, demo_name, org_id, industry, seg FROM companies ORDER BY code")]


def main():
    ap = argparse.ArgumentParser(description="抓取上市公司公告并写入 SQLite")
    ap.add_argument("--days", type=int, default=7, help="公告回溯天数（日更用 7，首次全量用 180）")
    ap.add_argument("--tags", default=",".join(cn.FOCUS_TAGS),
                    help="保留的公告类别，逗号分隔（默认：%s）" % ",".join(cn.FOCUS_TAGS))
    ap.add_argument("--sleep", type=float, default=0.8, help="翻页间隔（秒）")
    ap.add_argument("--only", default="", help="只抓指定代码，逗号分隔")
    ap.add_argument("--dry-run", dest="dry_run", action="store_true", help="只打印不写库")
    args = ap.parse_args()

    keep = {t.strip() for t in args.tags.split(",") if t.strip()}
    only = {c.strip() for c in args.only.split(",") if c.strip()}

    conn = db.connect()
    db.init_db(conn)
    targets = [t for t in load_targets(conn) if not only or t["code"] in only]
    if not targets:
        print("库中没有登记公司，请先运行 scripts/migrate_json_to_db.py")
        conn.close()
        return

    before = conn.execute("SELECT COUNT(*) FROM announcements").fetchone()[0]
    now = dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    summary, failures = [], []

    print("公告抓取（近 %d 天）：%d 家公司" % (args.days, len(targets)))

    # —— 云端同步（可选）：设置 SUPABASE_URL / SUPABASE_SERVICE_KEY 后自动启用 ——
    try:
        import supabase_writer as sw
        cw = sw.from_env()
    except Exception:  # noqa: BLE001
        cw = None

    for t in targets:
        code = t["code"]
        label = t["demo_name"] or t["name"]
        print("\n" + "=" * 64)
        print("→ %s (%s)" % (label, code))
        try:
            org_id, real_name = t["org_id"], t["name"]
            if not org_id:
                hits = cn.search(code)
                if not hits:
                    print("   未找到该证券，跳过")
                    failures.append((label, "未找到证券"))
                    continue
                hit = next((h for h in hits if h["code"] == code), hits[0])
                org_id, real_name = hit["orgId"], hit["name"]

            rows, total = cn.fetch_all(code, org_id, days=args.days,
                                       size=30, sleep=args.sleep, verbose=False)
            kept = [r for r in rows if r["tag"] in keep]
            stat = {}
            for r in kept:
                stat[r["tag"]] = stat.get(r["tag"], 0) + 1
            print("   命中 %s 条，抓取 %d 条，关注类别保留 %d 条%s" % (
                total, len(rows), len(kept),
                ("（%s）" % "，".join("%s %d" % (k, v)
                                    for k, v in sorted(stat.items(), key=lambda x: -x[1]))) if stat else ""))

            if not args.dry_run:
                db.upsert_company(conn, code, real_name, demo_name=t["demo_name"],
                                  org_id=org_id, industry=t["industry"], seg=t["seg"],
                                  days=args.days, now=now)
                for r in kept:
                    db.upsert_announcement(conn, code, r["date"], r["tag"], r["title"],
                                           r.get("attachUrl"), r.get("detailUrl"), now=now)
                    if cw:
                        cw.upsert_announcement(code, r["date"], r["tag"], r["title"],
                                               r.get("attachUrl"), r.get("detailUrl"),
                                               now=now)
                conn.commit()
            summary.append((real_name, code, len(kept)))
        except Exception as e:  # noqa: BLE001
            print("   [失败] %s: %s" % (label, e), file=sys.stderr)
            failures.append((label, str(e)[:120]))
        time.sleep(1.0)

    if args.dry_run:
        print("\n--dry-run：未写库")
        conn.close()
        return

    after = conn.execute("SELECT COUNT(*) FROM announcements").fetchone()[0]
    db.set_meta(conn, "annDays", args.days)
    db.set_meta(conn, "annRefreshedAt", now)
    conn.commit()
    conn.close()

    print("\n" + "=" * 64)
    print("汇总：%d 家抓取成功，新增 %d 条公告（库内累计 %d 条）" % (
        len(summary), after - before, after))
    for nm, cd, n in summary:
        print("  %-10s %-8s %3d 条" % (nm, cd, n))
    if failures:
        print("  失败 %d 家：" % len(failures))
        for nm, err in failures:
            print("    %s — %s" % (nm, err))

    if cw:
        try:
            n = cw.flush()
            print("云端同步：research_announcements 共 %d 行" % n)
        except Exception as e:  # noqa: BLE001
            print("[云端同步失败，本地库不受影响] %s" % e, file=sys.stderr)


if __name__ == "__main__":
    main()
