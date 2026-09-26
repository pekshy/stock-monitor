# -*- coding: utf-8 -*-
"""
云端保留窗口清理：删除 research_events / research_reports / research_announcements
中超过保留窗口（默认 3 个月）的旧行，口径与本地 prune_db.py 一致。

需要环境变量：SUPABASE_URL、SUPABASE_SERVICE_KEY（service_role）。
GitHub Actions 每次日更后调用；本地跑也行（需能直连 supabase.co）。
"""
from __future__ import annotations

import datetime as dt
import os
import sys
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from supabase_writer import from_env  # noqa: E402

RETENTION_DAYS = 92  # 与 db.retention_days() 同口径


def main():
    cw = from_env()
    if cw is None:
        print("未配置 SUPABASE_URL / SUPABASE_SERVICE_KEY，跳过云端清理")
        return
    cutoff = (dt.date.today() - dt.timedelta(days=RETENTION_DAYS)).isoformat()
    print("保留窗口：%d 天，清理 %s 之前的云端数据" % (RETENTION_DAYS, cutoff))
    for table, col in [("research_events", "date"),
                       ("research_reports", "date"),
                       ("research_announcements", "date")]:
        url = "%s/rest/v1/%s?%s=lt.%s" % (cw.base, table, col, cutoff)
        req = urllib.request.Request(url, method="DELETE", headers={
            "apikey": cw.key,
            "Authorization": "Bearer " + cw.key,
            "Prefer": "return=minimal",
        })
        try:
            r = urllib.request.urlopen(req, timeout=60)
            print("  %-24s %s" % (table, r.status))
        except Exception as e:
            print("  %-24s ERR %s" % (table, e))


if __name__ == "__main__":
    main()
