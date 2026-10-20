#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
研究池上市公司 · 行情与估值抓取（独立于行情板块 daily_quotes / daily_valuations）

数据源分工（2026-10 实测）：
    腾讯财经 qt.gtimg.cn  → A 股 / 港股 / 美股 / 日股，一次可批量 150+，含 PE(TTM)/PB/总市值
    新浪财经 hq.sinajs.cn → 仅行情兜底（无 PE/PB/市值），http 可用、https 被拦
    yfinance             → 台股(.TW/.TWO) + 欧股(.DE/.KS/.PA/.L/.VI/.OL)，腾讯不覆盖
    跳过                  → .NQ 新三板，无公开源

    注：东财 push2 接口对海外 IP 返回 403，不作为 A 股通道。

写入：research_quotes（主键 code，只保留最新交易日一行，upsert 幂等覆盖）

用法：
    export SUPABASE_SERVICE_KEY='sb_secret_...'
    python3 fetch_quotes.py                       # 全部市场
    python3 fetch_quotes.py --market cn           # 只跑 A 股
    python3 fetch_quotes.py --dry-run --limit 5   # 试跑
"""
from __future__ import annotations

import argparse
import json
import math
import os
import re
import sys
import time
import urllib.request
from datetime import date, datetime

BASE = os.environ.get("SUPABASE_URL", "https://fqklpucwihbcgtwiwblr.supabase.co").rstrip("/")
KEY = os.environ.get("SUPABASE_SERVICE_KEY", "").strip()

CN_SUFFIX = {"SH", "SZ", "BJ"}
TX_SUFFIX = {"SH", "SZ", "BJ", "HK", "US", "T"}          # 腾讯可覆盖
YF_SUFFIX = {"TW", "TWO", "DE", "KS", "PA", "L", "VI", "OL"}
SKIP_SUFFIX = {"NQ"}

CURRENCY = {"SH": "CNY", "SZ": "CNY", "BJ": "CNY", "HK": "HKD", "US": "USD",
            "T": "JPY", "TW": "TWD", "TWO": "TWD", "DE": "EUR", "PA": "EUR",
            "VI": "EUR", "OL": "NOK", "L": "GBP", "KS": "KRW"}

# 腾讯 f[0] → 市场
TX_MARKET = {"1": "cn", "51": "cn", "100": "hk", "200": "us", "351": "jp"}
TX_BATCH = 150


# ---------------- HTTP ----------------
def http_get(url, encoding="gbk", timeout=30):
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
        "Referer": "https://finance.sina.com.cn/",
    })
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode(encoding, "replace")


# ---------------- Supabase ----------------
def sb(method, path, body=None, prefer="return=minimal"):
    h = {"apikey": KEY, "Authorization": f"Bearer {KEY}",
         "Content-Type": "application/json", "Prefer": prefer}
    data = json.dumps(body, ensure_ascii=False, allow_nan=False).encode() if body is not None else None
    req = urllib.request.Request(BASE + path, data=data, method=method, headers=h)
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            raw = r.read().decode()
            return json.loads(raw) if raw.strip() else []
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")[:400]
        raise RuntimeError(f"HTTP {e.code}: {detail}") from None


def load_pool():
    out, start = [], 0
    while True:
        h = {"apikey": KEY, "Authorization": f"Bearer {KEY}",
             "Range": f"{start}-{start+999}", "Range-Unit": "items"}
        req = urllib.request.Request(
            BASE + "/rest/v1/research_companies?select=name,code&listed=is.true", headers=h)
        with urllib.request.urlopen(req, timeout=60) as r:
            d = json.loads(r.read().decode())
        out += d
        if len(d) < 1000:
            break
        start += 1000
    return [{"name": r["name"], "code": r["code"].strip()} for r in out
            if (r.get("code") or "").strip() not in ("", "—", "-")]


# ---------------- 代码工具 ----------------
def suffix(code):
    return code.rsplit(".", 1)[-1].upper() if "." in code else ""


def route(code):
    s = suffix(code)
    if s in CN_SUFFIX:
        return "cn"
    if s == "HK":
        return "hk"
    if s in YF_SUFFIX:
        return "yf"
    if s in SKIP_SUFFIX:
        return "skip"
    if s in TX_SUFFIX:                 # .US / .T
        return "us" if s == "US" else "jp"
    return "us"                        # 无后缀（如 DD 杜邦）按美股


def tx_symbol(code):
    base, s = (code.rsplit(".", 1) + [""])[:2] if "." in code else (code, "")
    s = s.upper()
    if s == "SH":
        return "sh" + base
    if s == "SZ":
        return "sz" + base
    if s == "BJ":
        return "bj" + base
    if s == "HK":
        return "hk" + base.zfill(5)
    if s == "US":
        return "us" + base
    if s == "T":
        return "jp" + base
    return "us" + base


def norm(code_field):
    """腾讯返回代码 → 归一化键：002371 / 00700 / NVDA.OQ / 4004.T"""
    s = code_field.split(".")[0].strip()
    return str(int(s)) if s.isdigit() else s.lower()


def yf_symbol(code):
    if "." not in code:
        return code
    base, s = code.rsplit(".", 1)
    s = s.upper()
    if s == "TWO":                     # 上柜，yfinance 用 .TWO
        return f"{base}.TWO"
    if s == "US":
        return base
    return f"{base}.{s}"


# ---------------- 腾讯：A股/港股/美股/日股 ----------------
def fetch_tx(targets, want_date=None):
    rows, miss = [], []
    for i in range(0, len(targets), TX_BATCH):
        batch = targets[i:i + TX_BATCH]
        q = ",".join(t["sym"] for t in batch)
        try:
            txt = http_get(f"https://qt.gtimg.cn/q={q}")
        except Exception as e:
            print(f"  批次 {i//TX_BATCH+1} 请求失败: {type(e).__name__}")
            miss += [t["code"] for t in batch]
            continue

        index = {(t["market"], t["norm"]): t for t in batch}
        seen = set()
        for line in txt.split(";"):
            if '="' not in line:
                continue
            f = line.split('="', 1)[1].rstrip('";\n').split("~")
            if len(f) < 50:
                continue
            mk = TX_MARKET.get(f[0].strip())
            if not mk:
                continue
            key = (mk, norm(f[2]))
            t = index.get(key)
            if not t:
                continue
            seen.add(t["code"])
            rows.append(parse_tx(t, f, want_date))
        miss += [t["code"] for t in batch if t["code"] not in seen]
        time.sleep(0.15)
    return rows, miss


def parse_tx(t, f, want_date=None):
    mk = t["market"]
    # PB：A 股在 46，港股/美股在 47；日股无。
    # 港股新股常返回 0，0 不是有效 PB（不是「市净率 0 倍」），按缺失处理。
    pb = _num(f[46]) if mk == "cn" else (_num(f[47]) if mk in ("hk", "us") else None)
    if pb is not None and pb <= 0:
        pb = None
    amount = _num(f[37])
    if mk == "cn" and amount:                 # A 股成交额单位「万元」
        amount = round(amount * 1e4)
    close, prev = _num(f[3]), _num(f[4])
    pct = _num(f[32])
    if mk == "jp":        # 日股该字段是小数（0.0998）= 9.98%，统一换算成百分数
        pct = round((close / prev - 1) * 100, 2) if (close and prev) else None
    return {
        "code": t["code"],
        "trade_date": tx_date(f[30]) or want_date or str(date.today()),
        "name": f[1].strip() or None,
        "market": mk,
        "currency": _currency_of(t["code"], mk, f),
        "open": _num(f[5]), "high": _num(f[33]), "low": _num(f[34]),
        "close": close, "prev_close": prev,
        "pct_change": pct,
        "volume": _num(f[36]), "amount": amount,
        "turnover_rate": _num(f[38]) if mk != "jp" else None,
        "total_market_cap": _num(f[45]),      # 已是「亿」
        "pe_ttm": _num(f[39]) if mk != "jp" else None,
        "pb": pb, "psr": None,
        "source": "tencent",
    }


def _currency_of(code, mk, f):
    if mk == "us" and len(f) > 35 and f[35].strip() in ("USD", "HKD", "EUR"):
        return f[35].strip()
    return CURRENCY.get(suffix(code), "CNY" if mk == "cn" else "")


def tx_date(s):
    s = (s or "").strip()
    m = re.match(r"(\d{4})[-/]?(\d{2})[-/]?(\d{2})", s)
    return f"{m.group(1)}-{m.group(2)}-{m.group(3)}" if m else None


# ---------------- 新浪：行情兜底（无估值） ----------------
def fetch_sina(codes, want_date=None):
    """http 协议可用；https 返回 403。只补行情，不补 PE/PB。"""
    rows, miss = [], []
    for i in range(0, len(codes), 60):
        batch = codes[i:i + 60]
        q = ",".join(("sh" if c.endswith(".SH") else
                      "sz" if c.endswith(".SZ") else "bj") + c.split(".")[0] for c in batch)
        try:
            txt = http_get(f"http://hq.sinajs.cn/list={q}")
        except Exception as e:
            print(f"  新浪批次失败: {type(e).__name__}")
            miss += batch
            continue
        for c, line in zip(batch, [l for l in txt.split("\n") if "hq_str_" in l]):
            f = line.split('="', 1)[1].rstrip('";\n').split(",")
            if len(f) < 10 or not f[0]:
                miss.append(c)
                continue
            rows.append({
                "code": c, "trade_date": want_date or str(date.today()),
                "name": f[0], "market": "cn", "currency": "CNY",
                "open": _num(f[1]), "prev_close": _num(f[2]), "close": _num(f[3]),
                "high": _num(f[4]), "low": _num(f[5]),
                "pct_change": round((_num(f[3]) / _num(f[2]) - 1) * 100, 2)
                if (_num(f[2]) and _num(f[3])) else None,
                "volume": _num(f[8]), "amount": _num(f[9]),
                "turnover_rate": None, "total_market_cap": None,
                "pe_ttm": None, "pb": None, "psr": None, "source": "sina",
            })
        time.sleep(0.2)
    return rows, miss


# ---------------- yfinance：台股 / 欧股 ----------------
def fetch_yf(codes, want_date=None, sleep=0.4):
    import yfinance as yf
    rows, miss = [], []
    for i, code in enumerate(codes, 1):
        try:
            t = yf.Ticker(yf_symbol(code))
            info = {}
            try:
                info = t.info or {}
            except Exception:
                pass
            fi = {}
            try:
                fi = dict(t.fast_info) if t.fast_info else {}
            except Exception:
                pass
            close = info.get("regularMarketPrice") or fi.get("last_price")
            prev = info.get("regularMarketPreviousClose") or fi.get("previous_close")
            if close is None:
                print(f"  [{i}/{len(codes)}] {code:<12} 无价格")
                miss.append(code)
                time.sleep(sleep)
                continue
            rows.append({
                "code": code, "trade_date": want_date or str(date.today()),
                "name": info.get("shortName") or None,
                "market": "yf", "currency": info.get("currency") or CURRENCY.get(suffix(code), ""),
                "open": _num(fi.get("open")), "high": _num(fi.get("day_high")),
                "low": _num(fi.get("day_low")), "close": _num(close),
                "prev_close": _num(prev),
                "pct_change": round((close / prev - 1) * 100, 2) if (close and prev) else None,
                "volume": _num(fi.get("last_volume")), "amount": None, "turnover_rate": None,
                "total_market_cap": _yi(info.get("marketCap")),
                "pe_ttm": _num(info.get("trailingPE")),
                "pb": _num(info.get("priceToBook")),
                "psr": _num(info.get("priceToSalesTrailing12Months")),
                "source": "yfinance",
            })
            print(f"  [{i}/{len(codes)}] {code:<12} {close}")
        except Exception as e:
            print(f"  [{i}/{len(codes)}] {code:<12} 失败 {type(e).__name__}")
            miss.append(code)
        time.sleep(sleep)
    return rows, miss


# ---------------- 工具 ----------------
def _num(v):
    try:
        if v is None or v == "" or v == "-":
            return None
        f = float(v)
        return f if math.isfinite(f) else None
    except (TypeError, ValueError):
        return None


def _yi(v):
    f = _num(v)
    return round(f / 1e8, 1) if f else None


def upsert(rows, chunk=200):
    path = "/rest/v1/research_quotes?on_conflict=code"     # 主键=code：每只股票只留最新一条
    prefer = "resolution=merge-duplicates,return=minimal"
    done, bad = 0, []
    for i in range(0, len(rows), chunk):
        batch = rows[i:i + chunk]
        try:
            sb("POST", path, batch, prefer=prefer)
            done += len(batch)
        except RuntimeError as e:
            print(f"  批次 {i // chunk + 1} 失败（{str(e)[:120]}），转逐行重试")
            for r in batch:
                try:
                    sb("POST", path, [r], prefer=prefer)
                    done += 1
                except RuntimeError as e2:
                    bad.append((r.get("code"), str(e2)[:80]))
    if bad:
        print(f"  仍失败 {len(bad)} 行: {bad[:6]}")
    return done


def log_run(market, total, ok, failed, trade_date, note=""):
    try:
        sb("POST", "/rest/v1/research_quote_runs", [{
            "market": market, "total": total, "ok": ok, "failed": failed,
            "trade_date": trade_date, "note": note[:400],
        }])
    except Exception as e:
        print(f"  运行日志未写入（表未建？）: {str(e)[:80]}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--market", default="cn,hk,us,jp,yf")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--date", default=None, help="YYYY-MM-DD，默认取响应里的行情时间")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--no-yf", action="store_true", help="跳过 yfinance（台股/欧股）")
    args = ap.parse_args()

    if not KEY:
        print("缺少 SUPABASE_SERVICE_KEY")
        return 1

    pool = load_pool()
    buckets = {"cn": [], "hk": [], "us": [], "jp": [], "yf": [], "skip": []}
    for r in pool:
        buckets[route(r["code"])].append(r["code"])
    print(f"研究池上市企业 {len(pool)} 家 | " +
          " ".join(f"{k}={len(v)}" for k, v in buckets.items() if v))

    want = {m.strip() for m in args.market.split(",") if m.strip()}
    all_rows, all_miss = [], []

    # 腾讯通道：cn / hk / us / jp 一次批量
    tx_targets = []
    tx_miss: list[str] = []
    seen_code: set[str] = set()
    dup = 0
    for mk in ("cn", "hk", "us", "jp"):
        if mk not in want:
            continue
        codes = buckets[mk][:args.limit] if args.limit else buckets[mk]
        for c in codes:
            if c in seen_code:        # 同一公司多视图/多别名共用一个代码，行情只存一份
                dup += 1
                continue
            seen_code.add(c)
            tx_targets.append({"code": c, "sym": tx_symbol(c),
                               "market": mk, "norm": norm(c.split(".")[0])})
    if dup:
        print(f"按代码去重：跳过 {dup} 条同码别名记录（视图副本）")

    if tx_targets:
        t0 = time.time()
        print(f"\n[腾讯] {len(tx_targets)} 只 ...")
        rows, miss = fetch_tx(tx_targets, args.date)
        print(f"[腾讯] 成功 {len(rows)} 失败 {len(miss)} 耗时 {time.time()-t0:.1f}s")
        if miss:
            print(f"      失败样例: {miss[:8]}")
        all_rows += rows
        all_miss += miss
        tx_miss = miss
        if not args.dry_run and rows:
            print(f"      写入 {upsert(rows)} 行")
            log_run("tx", len(tx_targets), len(rows), len(miss),
                    rows[0]["trade_date"], ",".join(miss[:30]))

    # yfinance 通道：台股 / 欧股 + 腾讯漏掉的个别代码（北交所除外）
    yf_codes = []
    if "yf" in want and not args.no_yf:
        yf_codes += buckets["yf"]
    if not args.no_yf:
        yf_codes += [c for c in tx_miss if suffix(c) not in CN_SUFFIX]
    yf_codes = list(dict.fromkeys(yf_codes))

    if yf_codes:
        codes = yf_codes[:args.limit] if args.limit else yf_codes
        t0 = time.time()
        print(f"\n[yfinance] {len(codes)} 只（台股/欧股）...")
        try:
            rows, miss = fetch_yf(codes, args.date)
        except Exception as e:
            print(f"[yfinance] 整体失败: {type(e).__name__}: {e}")
            rows, miss = [], codes
        print(f"[yfinance] 成功 {len(rows)} 失败 {len(miss)} 耗时 {time.time()-t0:.1f}s")
        all_rows += rows
        all_miss += miss
        if not args.dry_run and rows:
            print(f"      写入 {upsert(rows)} 行")
            log_run("yf", len(codes), len(rows), len(miss),
                    rows[0]["trade_date"], ",".join(miss[:30]))

    # 汇总
    if args.dry_run:
        print(f"\n[预览] 共 {len(all_rows)} 行")
        for r in all_rows[:8]:
            print("  ", {k: r[k] for k in ("code", "trade_date", "close", "pct_change",
                                           "pe_ttm", "pb", "total_market_cap", "currency")})
    else:
        print(f"\n合计 {len(all_rows)} 行，失败 {len(all_miss)} 只")
        if all_miss[:15]:
            print("失败代码:", all_miss[:15])

    # 覆盖率自检
    if all_rows:
        filled = {r["code"] for r in all_rows}
        print(f"覆盖率 {len(filled)}/{len(pool)} = {len(filled)/len(pool)*100:.1f}%")
        print(f"PE 有值 {sum(1 for r in all_rows if r['pe_ttm'])} / "
              f"PB 有值 {sum(1 for r in all_rows if r['pb'])} / "
              f"市值有值 {sum(1 for r in all_rows if r['total_market_cap'])}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
