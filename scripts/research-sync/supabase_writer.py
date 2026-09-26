# -*- coding: utf-8 -*-
"""
Supabase 云端写入器（research_ 前缀表）。

设计：
  - 抓取脚本本地写 SQLite 照旧；若环境变量 SUPABASE_URL / SUPABASE_SERVICE_KEY
    均已设置，则同步 upsert 到云端（service_role 绕过 RLS，无需写策略）。
  - 缓冲模式：upsert_* 只进缓冲，flush() 统一分批 POST（merge-duplicates 幂等）。
  - 云端失败不影响本地链路：调用方包 try/except 即可。

环境变量：
  SUPABASE_URL          如 https://xxx.supabase.co
  SUPABASE_SERVICE_KEY  sb_secret_...（仅本机使用，勿提交仓库）
  SUPABASE_PROXY        可选，如 http://127.0.0.1:7890（本机需要代理访问时）
"""
from __future__ import annotations

import json
import os
import urllib.error
import urllib.request

BATCH = 200
TIMEOUT = 45


class CloudWriter:
    def __init__(self, base_url: str, service_key: str, proxy: str = ""):
        self.base = base_url.rstrip("/")
        self.key = service_key
        self.proxy = proxy
        self.buf: dict[str, list] = {}

    # ---------- 环境 ----------
    @classmethod
    def from_env(cls):
        url = os.environ.get("SUPABASE_URL", "").strip()
        key = os.environ.get("SUPABASE_SERVICE_KEY", "").strip()
        if not url or not key:
            return None
        return cls(url, key, os.environ.get("SUPABASE_PROXY", "").strip())

    # ---------- HTTP ----------
    def _post(self, table: str, rows: list, on_conflict: str) -> int:
        url = f"{self.base}/rest/v1/{table}?on_conflict={on_conflict}"
        data = json.dumps(rows, ensure_ascii=False).encode("utf-8")
        req = urllib.request.Request(url, data=data, method="POST", headers={
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=minimal",
        })
        if self.proxy:
            opener = urllib.request.build_opener(urllib.request.ProxyHandler(
                {"http": self.proxy, "https": self.proxy}))
        else:
            opener = urllib.request.build_opener()
        try:
            with opener.open(req, timeout=TIMEOUT) as resp:
                resp.read()
        except urllib.error.HTTPError as e:
            body = ""
            try:
                body = e.read().decode("utf-8", "replace")[:300]
            except Exception:  # noqa: BLE001
                pass
            hint = ""
            if e.code == 401:
                hint = ("（密钥无效：请确认 SUPABASE_SERVICE_KEY 用的是 sb_secret_ 开头的 "
                        "service_role 密钥，且不带引号/换行；sb_publishable_ 开头的公开密钥无写权限）")
            raise RuntimeError(
                f"Supabase 写入 {table} 失败 HTTP {e.code}{hint}: {body}") from e
        return len(rows)

    def flush(self) -> int:
        """把缓冲分批写云端，返回成功写入行数；失败抛异常（由调用方兜底）。"""
        conflicts = {
            "research_reports": "url",
            "research_events": "url",
            "research_announcements": "code,date,title",
            "research_notes": "hash",
        }
        done = 0
        for table, rows in self.buf.items():
            for i in range(0, len(rows), BATCH):
                done += self._post(table, rows[i:i + BATCH], conflicts[table])
        self.buf = {}
        return done

    # ---------- 行构造与缓冲 ----------
    def _push(self, table: str, row: dict) -> None:
        self.buf.setdefault(table, []).append(row)

    def upsert_report(self, r: dict, now=None) -> None:
        self._push("research_reports", {
            "url": r.get("url"), "date": r.get("date"), "org": r.get("org"),
            "title": r.get("title"), "industry": r.get("industry"),
            "seg": r.get("seg"), "sub": r.get("sub"), "rtype": r.get("rtype"),
            "industry_name": r.get("industryName"),
            "researcher": r.get("researcher"), "rating": r.get("rating"),
            "fetched_at": now,
        })

    def upsert_event(self, e: dict, now=None) -> None:
        companies = e.get("companies")
        if not isinstance(companies, str):
            companies = json.dumps(companies or [], ensure_ascii=False)
        self._push("research_events", {
            "url": e.get("url"), "time": e.get("time"), "date": e.get("date"),
            "type": e.get("type"), "industry": e.get("industry"),
            "seg": e.get("seg"), "sub": e.get("sub"), "title": e.get("title"),
            "summary": e.get("summary"), "companies": companies,
            "fetched_at": now,
        })

    def upsert_announcement(self, code, date, tag, title,
                            attach_url=None, detail_url=None, now=None) -> None:
        self._push("research_announcements", {
            "code": code, "date": date, "tag": tag, "title": title,
            "attach_url": attach_url, "detail_url": detail_url,
            "fetched_at": now,
        })

    def upsert_note(self, note: dict, now=None) -> None:
        import db as _db  # 复用 hash / 列表规范化，避免口径分叉
        title = (note.get("title") or "").strip()
        self._push("research_notes", {
            "hash": note.get("hash") or _db.note_hash(title, note.get("body")),
            "kind": note.get("kind") or "观点",
            "title": title, "body": note.get("body"),
            "source": note.get("source"),
            "industry": note.get("industry"), "seg": note.get("seg"),
            "sub": note.get("sub"),
            "companies": _db._as_json_list(note.get("companies")),
            "tags": _db._as_json_list(note.get("tags")),
            "occurred_at": note.get("occurred_at") or (now or "")[:10],
            "file_path": note.get("file_path"),
            "created_at": note.get("created_at") or now,
            "updated_at": now,
        })


def from_env() -> CloudWriter | None:
    """模块级便捷入口：环境变量齐全返回写入器，否则返回 None。"""
    return CloudWriter.from_env()
