# -*- coding: utf-8 -*-
"""
SQLite 数据层：建表、连接、UPSERT、payload 重组。

数据库文件：data/research.db
设计原则：
  - 数据库是唯一事实源；data/*.json 退化为「导出产物 / 页面内置回退数据」
  - 去重靠唯一约束（公告：代码+日期+标题；研报/事件：原文 URL），不需要 seen_ids.json
  - payload 重组函数返回与旧 inject 流程完全一致的结构，页面代码零改动

用法（其他脚本）：
  from db import connect, init_db, upsert_report, upsert_event, upsert_announcement, intel_payload, announcements_payload
"""
from __future__ import annotations

import calendar
import json
import os
import re
import sqlite3
from datetime import date, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(ROOT, "data", "research.db")

#: 自动抓取的研报 / 事件 / 公告只保留最近 N 个月（超出部分由 prune_old 清理）
RETENTION_MONTHS = 3

#: 个人资料的归档原件目录：data/library/YYYY-MM/（与 notes_cli.py 共用同一套规则）
LIBRARY_DIR = os.path.join(ROOT, "data", "library")

#: 可直接读成正文的纯文本类扩展名（PDF/Word 需由助手或用户把正文粘进 body）
TEXT_EXTS = (".md", ".txt", ".csv", ".json", ".html", ".htm", ".log")

#: 单份归档原件的体积上限（页面侧上传用；更大的文件请直接用 notes_cli.py --file 归档）
MAX_UPLOAD_BYTES = 8 << 20

#: payload 函数的默认 cutoff 哨兵：不传 = 按保留窗口过滤，传 None = 不过滤
_DEFAULT = object()

SCHEMA = """
PRAGMA journal_mode=WAL;

CREATE TABLE IF NOT EXISTS companies (
    code        TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    demo_name   TEXT,
    org_id      TEXT,
    industry    TEXT,
    seg         TEXT,
    days        INTEGER,
    updated_at  TEXT
);

CREATE TABLE IF NOT EXISTS announcements (
    ann_id      INTEGER PRIMARY KEY AUTOINCREMENT,
    code        TEXT NOT NULL REFERENCES companies(code),
    date        TEXT NOT NULL,
    tag         TEXT NOT NULL,
    title       TEXT NOT NULL,
    attach_url  TEXT,
    detail_url  TEXT,
    fetched_at  TEXT,
    UNIQUE(code, date, title)
);
CREATE INDEX IF NOT EXISTS idx_ann_code_date ON announcements(code, date DESC);
CREATE INDEX IF NOT EXISTS idx_ann_tag ON announcements(tag);

CREATE TABLE IF NOT EXISTS reports (
    url          TEXT PRIMARY KEY,
    date         TEXT,
    org          TEXT,
    title        TEXT,
    industry     TEXT,
    seg          TEXT,
    sub          TEXT,
    rtype        TEXT,
    industry_name TEXT,
    researcher   TEXT,
    rating       TEXT,
    fetched_at   TEXT
);
CREATE INDEX IF NOT EXISTS idx_rep_ind_date ON reports(industry, date DESC);

CREATE TABLE IF NOT EXISTS events (
    url       TEXT PRIMARY KEY,
    time      TEXT,
    date      TEXT,
    type      TEXT,
    industry  TEXT,
    seg       TEXT,
    sub       TEXT,
    title     TEXT,
    summary   TEXT,
    companies TEXT,
    fetched_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_evt_ind_date ON events(industry, date DESC);

CREATE TABLE IF NOT EXISTS meta (
    key   TEXT PRIMARY KEY,
    value TEXT
);

-- 个人研究资料：用户自己的研究文件 / 行业观点 / 企业观点。
-- 这是研究资产，**不纳入保留窗口清理**（与 reports/events/announcements 不同）。
-- 去重靠 hash（标题+正文的 sha1），同一份材料重复投喂不会重复入库。
CREATE TABLE IF NOT EXISTS notes (
    note_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    hash        TEXT NOT NULL UNIQUE,
    kind        TEXT NOT NULL,
    title       TEXT NOT NULL,
    body        TEXT,
    source      TEXT,
    industry    TEXT,
    seg         TEXT,
    sub         TEXT,
    companies   TEXT,
    tags        TEXT,
    occurred_at TEXT,
    file_path   TEXT,
    created_at  TEXT,
    updated_at  TEXT
);
CREATE INDEX IF NOT EXISTS idx_note_date ON notes(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_note_kind ON notes(kind);
CREATE INDEX IF NOT EXISTS idx_note_ind ON notes(industry);
"""

#: 个人资料的条目类型
NOTE_KINDS = ("观点", "纪要", "资料", "研报")


def connect(db_path: str | None = None) -> sqlite3.Connection:
    target = db_path or DB_PATH
    parent = os.path.dirname(target)
    if parent and not os.path.isdir(parent):
        os.makedirs(parent, exist_ok=True)
    conn = sqlite3.connect(target)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db(conn: sqlite3.Connection) -> None:
    os.makedirs(os.path.dirname(conn.execute("PRAGMA database_list").fetchone()[2]) or ".", exist_ok=True)
    conn.executescript(SCHEMA)
    conn.commit()


def set_meta(conn: sqlite3.Connection, key: str, value) -> None:
    if not isinstance(value, str):
        value = json.dumps(value, ensure_ascii=False)
    conn.execute(
        "INSERT INTO meta(key, value) VALUES(?, ?) "
        "ON CONFLICT(key) DO UPDATE SET value=excluded.value",
        (key, value),
    )


def get_meta(conn: sqlite3.Connection, key: str, default=None):
    row = conn.execute("SELECT value FROM meta WHERE key=?", (key,)).fetchone()
    if row is None:
        return default
    try:
        return json.loads(row["value"])
    except (json.JSONDecodeError, TypeError):
        return row["value"]


# ---------------------------------------------------------------- 数据保留窗口

def months_ago(months: int = RETENTION_MONTHS, today: date | None = None) -> date:
    """N 个月前的日期（目标月天数不足时取该月最后一天）。"""
    d = today or date.today()
    y, m = d.year, d.month - months
    while m <= 0:
        m += 12
        y -= 1
    return date(y, m, min(d.day, calendar.monthrange(y, m)[1]))


def retention_cutoff(months: int = RETENTION_MONTHS, today: date | None = None) -> str:
    """保留窗口起始日（含），ISO 格式，如 '2026-06-21'。"""
    return months_ago(months, today).isoformat()


def retention_days(months: int = RETENTION_MONTHS, today: date | None = None) -> int:
    """保留窗口的天数（用于抓取回溯窗口，保证漏跑后能自愈补齐）。"""
    return ((today or date.today()) - months_ago(months, today)).days


def retention_meta(months: int = RETENTION_MONTHS, today: date | None = None) -> dict:
    """下发给页面的保留窗口描述。"""
    return {"months": months, "cutoff": retention_cutoff(months, today),
            "days": retention_days(months, today)}


def prune_old(conn: sqlite3.Connection, cutoff: str | None = None,
              dry_run: bool = False) -> dict:
    """删除早于 cutoff 的研报 / 事件 / 公告，返回各表命中条数。

    只清理这三类自动抓取的数据；companies（企业库）与 meta 不动。
    """
    cutoff = cutoff or retention_cutoff()
    out = {}
    for table in ("reports", "events", "announcements"):
        n = conn.execute(
            "SELECT COUNT(*) FROM %s WHERE date IS NOT NULL AND date < ?" % table,
            (cutoff,)).fetchone()[0]
        out[table] = n
        if n and not dry_run:
            conn.execute("DELETE FROM %s WHERE date IS NOT NULL AND date < ?" % table,
                         (cutoff,))
    if not dry_run:
        conn.commit()
        refresh_span_meta(conn)
    return out


def refresh_span_meta(conn: sqlite3.Connection) -> None:
    """按库内实际数据重算时间跨度类 meta（清理后必须调用，否则页面标签会失真）。"""
    row = conn.execute("SELECT MIN(date), MAX(date) FROM events").fetchone()
    if row and row[0]:
        set_meta(conn, "eventCutoff", row[0])
        set_meta(conn, "eventDays",
                 (date.fromisoformat(row[1]) - date.fromisoformat(row[0])).days + 1)
    row = conn.execute("SELECT MIN(date), MAX(date) FROM reports").fetchone()
    if row and row[0]:
        set_meta(conn, "reportRange", [row[0], row[1]])
    conn.commit()


# ---------------------------------------------------------------- UPSERT

def upsert_company(conn, code, name, demo_name=None, org_id=None,
                   industry=None, seg=None, days=None, now=None) -> None:
    conn.execute(
        "INSERT INTO companies(code, name, demo_name, org_id, industry, seg, days, updated_at) "
        "VALUES(?,?,?,?,?,?,?,?) "
        "ON CONFLICT(code) DO UPDATE SET "
        "  name=excluded.name, demo_name=excluded.demo_name, org_id=excluded.org_id, "
        "  industry=excluded.industry, seg=excluded.seg, days=excluded.days, "
        "  updated_at=excluded.updated_at",
        (code, name, demo_name, org_id, industry, seg, days, now),
    )


def upsert_announcement(conn, code, date, tag, title,
                        attach_url=None, detail_url=None, now=None) -> bool:
    """返回 True 表示是新插入（去重靠 UNIQUE(code,date,title)）。"""
    cur = conn.execute(
        "INSERT INTO announcements(code, date, tag, title, attach_url, detail_url, fetched_at) "
        "VALUES(?,?,?,?,?,?,?) "
        "ON CONFLICT(code, date, title) DO UPDATE SET "
        "  tag=excluded.tag, attach_url=excluded.attach_url, "
        "  detail_url=excluded.detail_url, fetched_at=excluded.fetched_at",
        (code, date, tag, title, attach_url, detail_url, now),
    )
    return cur.rowcount == 1


def upsert_report(conn, r: dict, now=None) -> None:
    conn.execute(
        "INSERT INTO reports(url, date, org, title, industry, seg, sub, rtype, "
        "                    industry_name, researcher, rating, fetched_at) "
        "VALUES(?,?,?,?,?,?,?,?,?,?,?,?) "
        "ON CONFLICT(url) DO UPDATE SET "
        "  date=excluded.date, org=excluded.org, title=excluded.title, "
        "  industry=excluded.industry, seg=excluded.seg, sub=excluded.sub, "
        "  rtype=excluded.rtype, industry_name=excluded.industry_name, "
        "  researcher=excluded.researcher, rating=excluded.rating, "
        "  fetched_at=excluded.fetched_at",
        (r.get("url"), r.get("date"), r.get("org"), r.get("title"), r.get("industry"),
         r.get("seg"), r.get("sub"), r.get("rtype"), r.get("industryName"),
         r.get("researcher"), r.get("rating"), now),
    )


def upsert_event(conn, e: dict, now=None) -> None:
    companies = e.get("companies")
    if not isinstance(companies, str):
        companies = json.dumps(companies or [], ensure_ascii=False)
    conn.execute(
        "INSERT INTO events(url, time, date, type, industry, seg, sub, title, summary, "
        "                    companies, fetched_at) "
        "VALUES(?,?,?,?,?,?,?,?,?,?,?) "
        "ON CONFLICT(url) DO UPDATE SET "
        "  time=excluded.time, date=excluded.date, type=excluded.type, "
        "  industry=excluded.industry, seg=excluded.seg, sub=excluded.sub, "
        "  title=excluded.title, summary=excluded.summary, "
        "  companies=excluded.companies, fetched_at=excluded.fetched_at",
        (e.get("url"), e.get("time"), e.get("date"), e.get("type"), e.get("industry"),
         e.get("seg"), e.get("sub"), e.get("title"), e.get("summary"), companies, now),
    )


# ---------------------------------------------------------------- 个人研究资料（notes）

def _as_json_list(v) -> str:
    """把 list / JSON 字符串 / 逗号分隔串统一成 JSON 数组字符串。"""
    if v is None or v == "":
        return "[]"
    if isinstance(v, list):
        return json.dumps([str(x).strip() for x in v if str(x).strip()], ensure_ascii=False)
    if isinstance(v, str):
        s = v.strip()
        if s.startswith("["):
            try:
                return json.dumps(json.loads(s), ensure_ascii=False)
            except json.JSONDecodeError:
                pass
        return json.dumps([x.strip() for x in s.replace("，", ",").split(",") if x.strip()],
                          ensure_ascii=False)
    return json.dumps([str(v)], ensure_ascii=False)


def _loads_list(s) -> list:
    try:
        v = json.loads(s or "[]")
        return v if isinstance(v, list) else []
    except (json.JSONDecodeError, TypeError):
        return []


def note_hash(title: str, body: str | None = None) -> str:
    """标题 + 正文的 sha1，用于幂等去重（同一份材料重复投喂不重复入库）。"""
    import hashlib
    return hashlib.sha1(("%s\n%s" % (title or "", body or "")).encode("utf-8")).hexdigest()


def upsert_note(conn, note: dict, now: str | None = None) -> bool:
    """写入一条个人资料；返回 True 表示新建，False 表示已存在（按 hash 命中）。"""
    title = (note.get("title") or "").strip()
    if not title:
        raise ValueError("note.title 不能为空")
    body = note.get("body") or ""
    h = note.get("hash") or note_hash(title, body)
    exists = conn.execute("SELECT 1 FROM notes WHERE hash=?", (h,)).fetchone()
    conn.execute(
        "INSERT INTO notes(hash, kind, title, body, source, industry, seg, sub, companies, "
        "                  tags, occurred_at, file_path, created_at, updated_at) "
        "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?) "
        "ON CONFLICT(hash) DO UPDATE SET "
        "  kind=excluded.kind, title=excluded.title, body=excluded.body, "
        "  source=excluded.source, industry=excluded.industry, seg=excluded.seg, "
        "  sub=excluded.sub, companies=excluded.companies, tags=excluded.tags, "
        "  occurred_at=excluded.occurred_at, file_path=excluded.file_path, "
        "  updated_at=excluded.updated_at",
        (h, note.get("kind") or "观点", title, body, note.get("source"),
         note.get("industry"), note.get("seg"), note.get("sub"),
         _as_json_list(note.get("companies")), _as_json_list(note.get("tags")),
         note.get("occurred_at") or (now or "")[:10],
         note.get("file_path"), note.get("created_at") or now, now),
    )
    return exists is None


def _note_dict(row) -> dict:
    return {
        "id": row["note_id"],
        "kind": row["kind"],
        "title": row["title"],
        "body": row["body"] or "",
        "source": row["source"] or "",
        "industry": row["industry"] or "",
        "seg": row["seg"] or "",
        "sub": row["sub"] or "",
        "companies": _loads_list(row["companies"]),
        "tags": _loads_list(row["tags"]),
        "occurredAt": row["occurred_at"] or "",
        "filePath": row["file_path"] or "",
        "createdAt": row["created_at"] or "",
    }


def get_note(conn, note_id: int) -> dict | None:
    """按 id 取一条个人资料，不存在返回 None。"""
    row = conn.execute("SELECT * FROM notes WHERE note_id=?", (note_id,)).fetchone()
    return _note_dict(row) if row else None


#: 可编辑字段（对外名） -> notes 表列名；hash / created_at 由代码维护，不允许直接改
NOTE_EDITABLE = {
    "kind": "kind", "title": "title", "body": "body", "source": "source",
    "industry": "industry", "seg": "seg", "sub": "sub",
    "companies": "companies", "tags": "tags",
    "occurred_at": "occurred_at", "file_path": "file_path",
}

_DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")

#: 标题留空时自动生成的截断长度（页面「新增笔记」只填正文，标题由此推出）
TITLE_MAX = 40


def auto_title(body: str | None, file_path: str | None = None) -> str:
    """标题留空时按内容推一个短标题：正文首个有内容的行 → 归档原件文件名。

    只求「列表里认得出是哪条」，不追求概括；用户在页面上编辑一次就能改掉。
    正文首行会先剥掉 Markdown 的 # / * / - / > 等行首符号。
    """
    for line in (body or "").splitlines():
        text = re.sub(r"^[\s#>*+·\-\u3000]+", "", line).strip()
        if text:
            return text[:TITLE_MAX] + ("…" if len(text) > TITLE_MAX else "")
    if file_path:
        stem = os.path.splitext(os.path.basename(str(file_path)))[0].strip()
        if stem:
            return stem[:TITLE_MAX]
    return ""


def _note_norm(data: dict, now: str | None = None) -> tuple:
    """归一化并校验资料公共字段（就地改 data），返回 (title, kind, occurred_at)。

    新建与编辑共用同一套口径：前端预校验只是提前拦，最终判定以后端为准。
    标题允许留空（页面极简表单就不填标题）：按正文首行 / 原件文件名自动生成，
    只有「正文与原件都空」才报错 —— 那种情况下没有任何内容可记。
    """
    for k in ("title", "source", "industry", "seg", "sub"):
        if isinstance(data.get(k), str):
            data[k] = data[k].strip()
    title = data.get("title") or ""
    if not title:
        title = auto_title(data.get("body"), data.get("file_path"))
    if not title:
        raise ValueError("正文或归档原件至少要有一项（标题留空时按内容自动生成）")
    kind = (data.get("kind") or "").strip()
    if kind not in NOTE_KINDS:
        raise ValueError("类型必须是 %s 之一" % "/".join(NOTE_KINDS))
    occurred = (data.get("occurred_at") or "").strip()
    if occurred and not _DATE_RE.match(occurred):
        raise ValueError("内容日期格式需为 YYYY-MM-DD")
    if not occurred:
        occurred = (now or date.today().isoformat())[:10]

    data["title"], data["kind"], data["occurred_at"] = title, kind, occurred
    data["body"] = data.get("body") or ""
    data["companies"] = _as_json_list(data.get("companies"))
    data["tags"] = _as_json_list(data.get("tags"))
    return title, kind, occurred


def create_note(conn, fields: dict, now: str | None = None) -> dict:
    """新建一条个人资料，返回 {"created": bool, "note": {...}}。

    幂等：标题 + 正文与已有资料完全相同时不重复入库，
    此时 created=False，note 是既有那条（页面据此提示「内容相同，未重复录入」）。
    """
    src = fields or {}
    data = {k: src.get(k) for k in NOTE_EDITABLE}
    title, kind, occurred = _note_norm(data, now)

    h = note_hash(title, data["body"])
    row = conn.execute("SELECT * FROM notes WHERE hash=?", (h,)).fetchone()
    if row is not None:
        return {"created": False, "note": _note_dict(row)}

    conn.execute(
        "INSERT INTO notes(hash, kind, title, body, source, industry, seg, sub, companies, "
        "                  tags, occurred_at, file_path, created_at, updated_at) "
        "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        (h, kind, title, data["body"], data["source"], data["industry"], data["seg"],
         data["sub"], data["companies"], data["tags"], occurred, data["file_path"],
         now, now),
    )
    conn.commit()
    new_id = conn.execute("SELECT note_id FROM notes WHERE hash=?", (h,)).fetchone()["note_id"]
    return {"created": True, "note": get_note(conn, new_id)}


# --------------------------------------------------- 归档原件（页面侧上传）

def safe_filename(name: str) -> str:
    """只取基名并清掉路径分隔符 / 非法字符，避免上传的文件名跳出 library 目录。"""
    name = os.path.basename(str(name or "").replace("\\", "/"))
    name = re.sub(r'[<>:"|?*\x00-\x1f]', "_", name).strip(" .")
    if not name:
        return "upload"
    stem, ext = os.path.splitext(name)
    return (stem[:80] + ext[:16]) or "upload"


def archive_bytes(name: str, data: bytes, occurred_at: str | None = None) -> str:
    """把上传的原件写入 data/library/YYYY-MM/，返回相对工程根目录的路径。

    同名但体积不同的文件加时间戳后缀，避免覆盖已有归档；体积相同视为同一份，跳过写盘。
    """
    month = (occurred_at or date.today().isoformat())[:7]
    out_dir = os.path.join(LIBRARY_DIR, month)
    os.makedirs(out_dir, exist_ok=True)
    fname = safe_filename(name)
    dst = os.path.join(out_dir, fname)
    if os.path.exists(dst) and os.path.getsize(dst) != len(data):
        stem, ext = os.path.splitext(fname)
        dst = os.path.join(out_dir, "%s_%s%s" % (stem, datetime.now().strftime("%H%M%S"), ext))
    if not os.path.exists(dst):
        with open(dst, "wb") as f:
            f.write(data)
    return os.path.relpath(dst, ROOT).replace("\\", "/")


def decode_text_bytes(data: bytes) -> str | None:
    """按 UTF-8 / GBK 依次尝试把字节解成文本；都不行返回 None。"""
    for enc in ("utf-8-sig", "utf-8", "gbk"):
        try:
            return data.decode(enc)
        except UnicodeDecodeError:
            continue
    return None


def update_note(conn, note_id: int, fields: dict, now: str | None = None) -> dict:
    """局部更新一条个人资料，返回更新后的完整字典。

    只改 fields 里出现的键（页面表单会传全量，对话侧可只传要改的）。
    标题或正文变化会重算 hash（幂等去重键）；若改后与另一条资料内容完全相同，
    直接拒绝并报错，避免把两条资料改成同一份内容。
    """
    row = conn.execute("SELECT * FROM notes WHERE note_id=?", (note_id,)).fetchone()
    if row is None:
        raise KeyError("没有 id=%s 的资料" % note_id)

    data = {k: row[col] for k, col in NOTE_EDITABLE.items()}
    for k, v in (fields or {}).items():
        if k in NOTE_EDITABLE:
            data[k] = v
    title, kind, occurred = _note_norm(data, now)

    h = note_hash(title, data["body"])
    dup = conn.execute("SELECT note_id, title FROM notes WHERE hash=? AND note_id<>?",
                       (h, note_id)).fetchone()
    if dup is not None:
        raise ValueError("与已有资料 [%s] %s 内容重复（标题+正文相同），未保存"
                         % (dup["note_id"], dup["title"]))

    conn.execute(
        "UPDATE notes SET hash=?, kind=?, title=?, body=?, source=?, industry=?, seg=?, "
        "  sub=?, companies=?, tags=?, occurred_at=?, file_path=?, updated_at=? "
        "WHERE note_id=?",
        (h, kind, title, data["body"] or "", data["source"], data["industry"], data["seg"],
         data["sub"], data["companies"], data["tags"], occurred, data["file_path"],
         now, note_id),
    )
    conn.commit()
    return get_note(conn, note_id)


def delete_note(conn, note_id: int) -> dict | None:
    """删除一条个人资料（只删库记录，data/library 下的归档原件保留）；不存在返回 None。"""
    note = get_note(conn, note_id)
    if note is None:
        return None
    conn.execute("DELETE FROM notes WHERE note_id=?", (note_id,))
    conn.commit()
    return note


def notes_payload(conn, kind: str | None = None, industry: str | None = None) -> list:
    """全部个人资料，按内容日期倒序（不做保留窗口过滤 —— 研究资产永久保留）。"""
    sql = "SELECT * FROM notes"
    cond, args = [], []
    if kind:
        cond.append("kind=?")
        args.append(kind)
    if industry:
        cond.append("industry=?")
        args.append(industry)
    if cond:
        sql += " WHERE " + " AND ".join(cond)
    sql += " ORDER BY occurred_at DESC, note_id DESC"
    return [_note_dict(r) for r in conn.execute(sql, args)]


def search_notes(conn, q: str, kind: str | None = None, industry: str | None = None,
                 company: str | None = None, limit: int = 50) -> list:
    """关键词检索个人资料（标题 / 正文 / 标签 / 来源 / 关联企业）。

    用 LIKE 而非 FTS5：FTS5 的可选 trigram 分词器要求查询词 ≥3 字符，
    中文里「估值」「芯片」这类两字词会查不到；个人笔记是千条量级，LIKE 完全够快。
    """
    q = (q or "").strip()
    cond, args = [], []
    if q:
        like = "%" + q + "%"
        cond.append("(title LIKE ? OR body LIKE ? OR tags LIKE ? OR source LIKE ? "
                    "OR companies LIKE ? OR occurred_at LIKE ?)")
        args += [like] * 6
    if kind:
        cond.append("kind=?")
        args.append(kind)
    if industry:
        cond.append("industry=?")
        args.append(industry)
    if company:
        cond.append("companies LIKE ?")
        args.append('%' + company + '%')
    sql = "SELECT * FROM notes"
    if cond:
        sql += " WHERE " + " AND ".join(cond)
    # 标题命中优先，其次按内容日期倒序
    sql += (" ORDER BY CASE WHEN title LIKE ? THEN 0 ELSE 1 END, occurred_at DESC, note_id DESC"
            " LIMIT ?")
    args += [("%" + q + "%") if q else "", limit]
    return [_note_dict(r) for r in conn.execute(sql, args)]


# ---------------------------------------------------------------- payload 重组

def intel_payload(conn, cutoff=_DEFAULT) -> dict:
    """重组 industry_intel.json 的原始结构，页面无需任何适配。

    cutoff 默认取保留窗口（RETENTION_MONTHS 个月前），只下发窗口内的数据；
    传 None 表示不过滤（全量导出用）。
    """
    if cutoff is _DEFAULT:
        cutoff = retention_cutoff()
    where = "WHERE date >= ?" if cutoff else ""
    args = (cutoff,) if cutoff else ()

    reports = [dict(r) for r in conn.execute(
        "SELECT date, org, title, industry, seg, sub, rtype, "
        "       industry_name AS industryName, researcher, rating, url "
        "FROM reports " + where + " ORDER BY date DESC, url", args)]
    events = []
    for r in conn.execute(
            "SELECT time, date, type, industry, seg, sub, title, summary, companies, url "
            "FROM events " + where + " ORDER BY date DESC, time DESC, url", args):
        e = dict(r)
        try:
            e["companies"] = json.loads(e["companies"] or "[]")
        except json.JSONDecodeError:
            e["companies"] = []
        events.append(e)
    payload = {
        "generatedAt": get_meta(conn, "generatedAt"),
        "sources": get_meta(conn, "sources"),
        "reportRange": get_meta(conn, "reportRange"),
        "eventCutoff": get_meta(conn, "eventCutoff"),
        "reportDays": get_meta(conn, "reportDays"),
        "eventDays": get_meta(conn, "eventDays"),
        "retention": retention_meta() if cutoff else None,
        "reports": reports,
        "events": events,
    }
    return payload


def announcements_payload(conn, cutoff=_DEFAULT) -> dict:
    """重组页面 ANNOUNCEMENTS 常量的原始结构：{code: {..., announcements: [...]}}。

    cutoff 语义同 intel_payload：默认按保留窗口过滤，传 None 不过滤。
    """
    if cutoff is _DEFAULT:
        cutoff = retention_cutoff()
    out = {}
    for co in conn.execute("SELECT * FROM companies ORDER BY code"):
        sql = ("SELECT date, tag, title, attach_url AS attachUrl, detail_url AS detailUrl "
               "FROM announcements WHERE code=?" + (" AND date >= ?" if cutoff else "") +
               " ORDER BY date DESC, ann_id DESC")
        params = (co["code"], cutoff) if cutoff else (co["code"],)
        anns = [dict(a) for a in conn.execute(sql, params)]
        tag_stats = {}
        for a in anns:
            tag_stats[a["tag"]] = tag_stats.get(a["tag"], 0) + 1
        out[co["code"]] = {
            "code": co["code"],
            "name": co["name"],
            "days": co["days"],
            "count": len(anns),
            "tagStats": tag_stats,
            "announcements": anns,
        }
    return out
