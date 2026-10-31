#!/usr/bin/env python3
"""
抓取宽基 ETF 份额，计算每日净申购，写入 etf_flow（明细）与 market_indicators（指数加总）。

数据源（均为交易所官方，免费）：
  上交所  query.sse.com.cn  sqlId=COMMON_SSE_ZQPZ_ETFZL_XXPL_ETFGM_SEARCH_L  -> TOT_VOL（万份）
  深交所  www.szse.cn/api/report  CATALOGID=1945                              -> dqgm（万份）
  净值    东财基金历史净值 api.fund.eastmoney.com/f10/lsjz                     -> DWJZ

时间窗：上交所 T 日盘后更新，深交所 T+1 上午更新，所以建议每天 9:00 后跑，
抓到的自然就是上一交易日的全量数据；若深市尚未更新，脚本会跳过该日并提示。

口径：
  shares      总份额（亿份）
  nav         单位净值（元）
  scale       总规模（亿元）= shares × nav
  net_shares  净申购份额（亿份）= 当日份额 − 上一披露日份额
  net_amount  净申购金额（亿元）= net_shares × nav

用法：
  SUPABASE_SERVICE_KEY=... python3 scripts/macro-sync/fetch_etf_flow.py
  SUPABASE_SERVICE_KEY=... python3 scripts/macro-sync/fetch_etf_flow.py --dry-run
  SUPABASE_SERVICE_KEY=... python3 scripts/macro-sync/fetch_etf_flow.py --rebuild   # 从 etf_flow 重算加总
"""
import argparse
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request

SUPA_URL = (os.environ.get('SUPABASE_URL') or 'https://fqklpucwihbcgtwiwblr.supabase.co').rstrip('/')
SUPA_KEY = os.environ.get('SUPABASE_SERVICE_KEY') or os.environ.get('SUPABASE_KEY')

# 跟踪池：指数 -> 代表性 ETF（覆盖各指数规模前 2-5 只）
POOL = {
    'csi300': ['510300', '510310', '510330', '159919'],
    'csi500': ['510500', '510580', '512500', '510510'],
    'csi1000': ['512100', '560010'],
    'sse50': ['510050', '510100'],
    'star50': ['588000', '588080', '588090', '588060', '588050'],
    'chinext': ['159915', '159952', '159977', '159948'],
    'chinext50': ['159949', '159682'],
    'csi_a500': ['512050', '563360', '563800'],
}
# 多市场成分指数：除总量外再拆沪/深
MIXED = ['csi300', 'csi500', 'csi1000', 'csi_a500']

UA = {'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.sse.com.cn/'}


def http_json(url, headers=None, timeout=25, retries=4):
    """带重试的 GET：交易所接口偶发不可达，单次失败不代表当天没数据"""
    last = None
    for i in range(retries):
        try:
            req = urllib.request.Request(url, headers={**UA, **(headers or {})})
            return json.load(urllib.request.urlopen(req, timeout=timeout))
        except Exception as e:
            last = e
            time.sleep(0.8 * (i + 1))
    raise last


def fetch_sse():
    """上交所全量 ETF 份额，返回 {code: (name, shares_wan)}"""
    url = ('https://query.sse.com.cn/commonQuery.do'
           '?sqlId=COMMON_SSE_ZQPZ_ETFZL_XXPL_ETFGM_SEARCH_L'
           '&pageHelp.pageSize=2000&pageHelp.pageNo=1')
    d = http_json(url, {'Referer': 'https://www.sse.com.cn/'})
    out = {}
    for r in d.get('result') or []:
        try:
            out[r['SEC_CODE']] = (r['SEC_NAME'], float(r['TOT_VOL']))
        except (KeyError, TypeError, ValueError):
            continue
    return out


def _szse_page(p):
    """单页抓取，失败重试 3 次（http/https 交替）"""
    last = None
    for attempt in range(3):
        scheme = 'https' if attempt % 2 else 'http'
        url = (f'{scheme}://www.szse.cn/api/report/ShowReport/data'
               f'?SHOWTYPE=JSON&CATALOGID=1945&TABKEY=tab1&PAGENO={p}')
        try:
            d = http_json(url, {'Referer': f'{scheme}://www.szse.cn/'}, timeout=30)
            return d[0].get('data') or []
        except Exception as e:
            last = e
            time.sleep(0.6 * (attempt + 1))
    print(f'  [szse] page {p} 三次失败: {last}', file=sys.stderr)
    return None


def fetch_szse(workers=2):
    """深交所全量 ETF 份额，返回 {code: (name, shares_wan)}。每页固定 10 条，需翻页。"""
    from concurrent.futures import ThreadPoolExecutor

    head = _szse_page(1)
    if head is None:
        return {}
    total = 0
    try:
        # metadata.recordcount 不总是有值，改用「探到空页为止」的保守上限
        total = int(head[0].get('metadata', {}).get('recordcount') or 0)
    except (IndexError, ValueError):
        total = 0
    pages_needed = (total + 9) // 10 if total else 90
    pages_needed = min(max(pages_needed, 2), 120)

    chunks = [head]
    with ThreadPoolExecutor(max_workers=workers) as ex:
        rest = list(ex.map(_szse_page, range(2, pages_needed + 1)))
    chunks += [r for r in rest if r]

    out = {}
    for rows in chunks:
        for x in rows:
            m = re.search(r'code=(\d{6})', x.get('sys_key') or '')
            if not m:
                continue
            name = re.sub('<[^>]+>', '', x.get('kzjcurl') or '').strip()
            try:
                out[m.group(1)] = (name, float((x.get('dqgm') or '0').replace(',', '')))
            except ValueError:
                continue
    print(f'  [szse] 抓取 {len(chunks)}/{pages_needed} 页', file=sys.stderr)
    return out


def fetch_nav(code):
    """东财历史净值，返回 (date, nav)；失败返回 (None, None)"""
    url = ('https://api.fund.eastmoney.com/f10/lsjz'
           f'?fundCode={code}&pageIndex=1&pageSize=1')
    try:
        d = http_json(url, {'Referer': 'https://fundf10.eastmoney.com/'})
        item = (d.get('Data') or {}).get('LSJZList') or []
        if not item:
            return None, None
        return item[0]['FSRQ'], float(item[0]['DWJZ'])
    except Exception:
        return None, None


def supa(path, method='GET', body=None, prefer=None):
    headers = {'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY,
               'Content-Type': 'application/json'}
    if prefer:
        headers['Prefer'] = prefer
    data = json.dumps(body, ensure_ascii=False).encode() if body is not None else None
    req = urllib.request.Request(SUPA_URL + '/rest/v1/' + path, data=data, headers=headers, method=method)
    resp = urllib.request.urlopen(req, timeout=60)
    raw = resp.read().decode()
    return json.loads(raw) if raw.strip() else None


def load_prev_shares(trade_date):
    """取上一披露日的份额，用于算净申购"""
    rows = supa(f'etf_flow?select=date,code,shares&date=lt.{trade_date}&order=date.desc&limit=200')
    prev, prev_date = {}, None
    for r in rows or []:
        if prev_date is None:
            prev_date = r['date']
        if r['date'] != prev_date:
            break
        prev[r['code']] = float(r['shares'])
    return prev, prev_date


def build_rows(trade_date, quotes, prev):
    """把交易所份额 + 净值拼成 etf_flow 行"""
    rows, missing = [], []
    for idx, codes in POOL.items():
        for code in codes:
            if code not in quotes:
                missing.append(code)
                continue
            name, wan = quotes[code]
            nav_date, nav = fetch_nav(code)
            if nav is None:
                missing.append(code + '(净值)')
                continue
            shares = round(wan / 10000.0, 4)          # 亿份
            scale = round(shares * nav, 4)             # 亿元
            prev_share = prev.get(code)
            net_shares = round(shares - prev_share, 4) if prev_share is not None else 0.0
            net_amount = round(net_shares * nav, 4)
            rows.append({
                'date': trade_date, 'code': code, 'name': name, 'index_id': idx,
                'shares': shares, 'nav': nav, 'scale': scale,
                'net_shares': net_shares, 'net_amount': net_amount,
            })
    return rows, missing


def aggregate(rows, skip_idx=None):
    """按指数加总 -> market_indicators 行（4 指标 + 混合指数沪/深拆分）

    某指数成分缺失时整体跳过：宁可不更新，也不写一个规模突然缩水一半的假数。
    """
    out = []
    skip_idx = skip_idx or set()
    by_idx = {}
    for r in rows:
        by_idx.setdefault(r['index_id'], []).append(r)
    for idx, items in by_idx.items():
        if idx in skip_idx:
            print(f'  [skip] {idx} 成分不全（{len(items)}/{len(POOL[idx])}），跳过加总', file=sys.stderr)
            continue
        net_amount = sum(i['net_amount'] for i in items)
        net_shares = sum(i['net_shares'] for i in items)
        total_amount = sum(i['scale'] for i in items)
        total_shares = sum(i['shares'] for i in items)
        d = items[0]['date']
        for k, v in [('net_amount', net_amount), ('net_shares', net_shares),
                     ('total_amount', total_amount), ('total_shares', total_shares)]:
            out.append({'indicator_id': f'etf_{k}_{idx}', 'date': d, 'value': round(v, 4)})
        if idx in MIXED:
            sh = [i for i in items if i['code'].startswith('5')]
            sz = [i for i in items if i['code'].startswith('1')]
            out.append({'indicator_id': f'etf_net_amount_{idx}_sh', 'date': d,
                        'value': round(sum(i['net_amount'] for i in sh), 4)})
            out.append({'indicator_id': f'etf_net_amount_{idx}_sz', 'date': d,
                        'value': round(sum(i['net_amount'] for i in sz), 4)})
    return out


def rebuild_from_flow():
    """不抓交易所，直接从 etf_flow 已存明细重算加总（补缺口用）"""
    rows = supa('etf_flow?select=date,code,name,index_id,shares,nav,scale,net_shares,net_amount'
                '&order=date.desc&limit=5000')
    by_date = {}
    for r in rows or []:
        by_date.setdefault(r['date'], []).append(r)
    total = 0
    for d in sorted(by_date):
        agg = aggregate(by_date[d])
        if not agg:
            continue
        supa('market_indicators?on_conflict=indicator_id,date', 'POST', agg,
             'resolution=merge-duplicates,return=minimal')
        total += len(agg)
        print(f'  {d}: {len(by_date[d])} 只 ETF -> {len(agg)} 个指标')
    print(f'重算完成，共写入 {total} 条')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--rebuild', action='store_true', help='只从 etf_flow 重算加总')
    ap.add_argument('--dry-run', action='store_true', help='只打印不写库')
    args = ap.parse_args()

    if not SUPA_KEY:
        sys.exit('缺少 SUPABASE_SERVICE_KEY')

    if args.rebuild:
        rebuild_from_flow()
        return

    print('抓取上交所 ...')
    sse = fetch_sse()
    print(f'  {len(sse)} 只')
    print('抓取深交所 ...')
    szse = fetch_szse()
    print(f'  {len(szse)} 只')

    quotes = {**sse, **szse}
    # 用已入库的最新日期做基准：只在份额确有变化时写入，避免重复覆盖
    latest = supa('etf_flow?select=date&order=date.desc&limit=1')
    base_date = latest[0]['date'] if latest else '2000-01-01'

    nav_date, _ = fetch_nav(POOL['csi300'][0])
    trade_date = nav_date or base_date
    print(f'披露日 {trade_date}（库内最新 {base_date}）')

    if trade_date <= base_date:
        print(f'库内已有 {base_date}，本次按同一交易日覆盖补写（补齐缺失成分）')

    prev, prev_date = load_prev_shares(trade_date)
    print(f'基准日 {prev_date}，{len(prev)} 只可比')

    rows, missing = build_rows(trade_date, quotes, prev)
    skip = {idx for idx, codes in POOL.items()
            if set(codes) - {r['code'] for r in rows if r['index_id'] == idx}}
    print(f'待写入 {len(rows)} 只，缺 {len(missing)} 只：{missing[:8]}')
    if skip:
        print(f'  成分不全的指数：{sorted(skip)}')

    agg = aggregate(rows, skip)
    print(f'加总指标 {len(agg)} 条')
    if args.dry_run:
        for r in rows[:5]:
            print(' ', r)
        for a in agg[:6]:
            print(' ', a)
        return

    supa('etf_flow?on_conflict=date,code', 'POST', rows, 'resolution=merge-duplicates,return=minimal')
    supa('market_indicators?on_conflict=indicator_id,date', 'POST', agg,
         'resolution=merge-duplicates,return=minimal')
    print(f'写入完成：etf_flow {len(rows)} 行，market_indicators {len(agg)} 行')


if __name__ == '__main__':
    main()
