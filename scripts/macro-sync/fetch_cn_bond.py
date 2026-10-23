#!/usr/bin/env python3
"""
抓取中债国债收益率（2Y/5Y/10Y/30Y + 10Y-2Y 期限利差）并写入 china_indicators。

数据源：东方财富数据中心「中美国债收益率」，原始数据来自中国债券信息网。
接口：RPTA_WEB_TREASURYYIELD，字段含义已与数据页逐日核对：
  EMM00588704 -> 2年    EMM00166462 -> 5年
  EMM00166466 -> 10年   EMM00166469 -> 30年
  EMM01276014 -> 10Y-2Y 利差

用法：
  SUPABASE_SERVICE_KEY=... python3 scripts/macro-sync/fetch_cn_bond.py --years 3
  python3 scripts/macro-sync/fetch_cn_bond.py --years 3 --dry-run
"""
import argparse, json, os, sys, time, urllib.parse, urllib.request
from datetime import date, timedelta

API = 'https://datacenter-web.eastmoney.com/api/data/v1/get'
REPORT = 'RPTA_WEB_TREASURYYIELD'
FIELDS = {
    'cn_bond_2y': 'EMM00588704',
    'cn_bond_5y': 'EMM00166462',
    'cn_bond_10y': 'EMM00166466',
    'cn_bond_30y': 'EMM00166469',
    'cn_term_spread_10y2y': 'EMM01276014',
}
SUPA_URL = (os.environ.get('SUPABASE_URL') or 'https://fqklpucwihbcgtwiwblr.supabase.co').rstrip('/')
SUPA_KEY = os.environ.get('SUPABASE_SERVICE_KEY') or os.environ.get('SUPABASE_KEY')


def fetch(start: str, end: str):
    """按日期区间分页拉取，返回 [(date, {indicator: value})]"""
    rows, page = [], 1
    filt = urllib.parse.quote(f"(SOLAR_DATE>='{start}')(SOLAR_DATE<='{end}')")
    while True:
        url = (f'{API}?reportName={REPORT}&columns=ALL&pageNumber={page}&pageSize=500'
               f'&sortColumns=SOLAR_DATE&sortTypes=1&filter={filt}')
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0', 'Referer': 'https://data.eastmoney.com/'})
        with urllib.request.urlopen(req, timeout=30) as r:
            payload = json.load(r)
        data = (payload.get('result') or {}).get('data') or []
        if not data:
            break
        for item in data:
            d = (item.get('SOLAR_DATE') or '')[:10]
            if not d:
                continue
            vals = {k: item.get(v) for k, v in FIELDS.items()}
            rows.append((d, vals))
        if page * 500 >= (payload.get('result') or {}).get('count', 0):
            break
        page += 1
        time.sleep(0.3)
    return rows


def supa_get(path, key):
    req = urllib.request.Request(f'{SUPA_URL}/rest/v1/{path}',
                                 headers={'apikey': key, 'Authorization': f'Bearer {key}'})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def supa_insert(rows, key):
    body = json.dumps(rows).encode()
    req = urllib.request.Request(f'{SUPA_URL}/rest/v1/china_indicators', data=body, method='POST',
                                 headers={'apikey': key, 'Authorization': f'Bearer {key}',
                                          'Content-Type': 'application/json',
                                          'Prefer': 'return=minimal'})
    urllib.request.urlopen(req, timeout=120)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--years', type=int, default=3, help='回补年数（默认 3）')
    ap.add_argument('--dry-run', action='store_true')
    args = ap.parse_args()

    if not SUPA_KEY:
        sys.exit('缺少 SUPABASE_SERVICE_KEY')

    end = date.today().isoformat()
    start = (date.today() - timedelta(days=args.years * 365)).isoformat()
    print(f'拉取 {start} ~ {end}')
    rows = fetch(start, end)
    print(f'抓到 {len(rows)} 个交易日')

    # 只保留有值的指标，并把缺失的日期跳过
    flat = []
    for d, vals in rows:
        for ind, v in vals.items():
            if v is None:
                continue
            flat.append({'indicator_id': ind, 'date': d, 'value': float(v)})
    print(f'展开后 {len(flat)} 条指标值')

    if args.dry_run:
        for x in flat[:5]:
            print(' ', x)
        return

    # 去重：先取库里已有的 (indicator_id, date)，只插缺失的
    existing = set()
    for ind in FIELDS:
        off = 0
        while True:
            d = supa_get(f'china_indicators?select=date&indicator_id=eq.{ind}'
                         f'&date=gte.{start}&limit=1000&offset={off}', SUPA_KEY)
            if not d:
                break
            existing.update((ind, x['date']) for x in d)
            off += 1000
            if len(d) < 1000:
                break
    todo = [x for x in flat if (x['indicator_id'], x['date']) not in existing]
    print(f'库内已有 {len(existing)} 条，待写入 {len(todo)} 条')

    for i in range(0, len(todo), 500):
        supa_insert(todo[i:i + 500], SUPA_KEY)
        print(f'  写入 {min(i + 500, len(todo))}/{len(todo)}')

    for ind in FIELDS:
        d = supa_get(f'china_indicators?select=date,value&indicator_id=eq.{ind}'
                     f'&order=date.desc&limit=1', SUPA_KEY)
        if d:
            print(f'  {ind:22s} {d[0]["date"]}  {d[0]["value"]}')


if __name__ == '__main__':
    main()
