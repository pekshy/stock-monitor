# -*- coding: utf-8 -*-
"""
巨潮资讯网（cninfo.com.cn）公告抓取工具

用途：为「行业研究板块」的【行业动态】模块提供上市公司公告数据源。

设计要点（按研究需求）：
  · 不下载附件，只保留附件链接（attachUrl）与公告详情页链接（detailUrl），点击即可查看原文
  · 默认只保留 5 类关注信息：财报 / 业绩 / 融资 / 高管变动 / 风险
  · 全部公告均可打标，可用 --tags all 或指定标签查看其他类别

用法示例：
  # 抓中微公司近 180 天，只看 5 类关注信息（默认行为）
  python cninfo_announcement.py --code 688012 --keyword 中微公司 --days 180 \
      --out data/688012_announcements.json --csv-out data/688012_announcements.csv

  # 自定义关注类别
  python cninfo_announcement.py --code 688012 --tags 财报,风险,高管变动
  # 不过滤，保留全部公告
  python cninfo_announcement.py --code 688012 --tags all
  # 需要原件时才下载（默认不下载）
  python cninfo_announcement.py --code 688012 --download

注意：仅供抓取公开披露信息，请遵守对方站点 robots 与频控要求，勿高频并发。
"""
import argparse
import csv
import datetime as dt
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request

BASE = "http://www.cninfo.com.cn"
STATIC = "http://static.cninfo.com.cn"   # 附件真实存放域名（www 域访问 PDF 返回 404）
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36")

HEADERS = {
    "User-Agent": UA,
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "X-Requested-With": "XMLHttpRequest",
    "Origin": BASE,
    "Referer": BASE + "/new/index",
    "Connection": "keep-alive",
}

# 关注标签（默认只保留这五类）
FOCUS_TAGS = ["财报", "业绩", "融资", "高管变动", "风险"]
# 完整标签体系（含次级标签，便于扩展；用 --tags 可单独启用）
ALL_TAGS = FOCUS_TAGS + ["股权激励", "技术突破", "其他"]

# 巨潮公告类别代码（可用于接口级预筛 category 参数）
CATEGORIES = {
    "年报": "category_ndbg_szsh",
    "半年报": "category_bndbg_szsh",
    "一季报": "category_yjdbg_szsh",
    "三季报": "category_sjdbg_szsh",
    "业绩预告": "category_yjygjxz_szsh",
    "权益分派": "category_qyfpxzcs_szsh",
    "董事会": "category_dshgg_szsh",
    "股东大会": "category_gddh_szsh",
    "日常经营": "category_rcjy_szsh",
    "公司治理": "category_gszl_szsh",
    "中介报告": "category_zj_szsh",
    "首发": "category_sf_szsh",
    "增发": "category_zf_szsh",
    "股权激励": "category_gqjl_szsh",
    "配股": "category_pg_szsh",
    "解禁": "category_jj_szsh",
    "公司债": "category_gszq_szsh",
    "可转债": "category_kzzq_szsh",
    "股权变动": "category_gqbd_szsh",
    "补充更正": "category_bcgz_szsh",
    "澄清致歉": "category_cqdq_szsh",
    "风险提示": "category_fxts_szsh",
}

# ---- 自动归类规则：顺序敏感，先匹配到的生效 ----
# 风险前置：减持/问询/诉讼类标题往往同时含「董事」「年度报告」等词，但研究上应归为风险
TAG_RULES = [
    ("风险", ["风险提示", "风险警示", "退市", "问询", "处罚", "诉讼", "仲裁",
              "违规", "关注函", "监管函", "警示", "减持", "权益变动",
              "冻结", "质押", "中止", "终止", "澄清", "致歉", "召回",
              "缺陷", "事故", "立案", "被诉", "亏损", "商誉减值",
              "计提减值", "业绩下滑"]),
    ("财报", ["年度报告", "半年度报告", "季度报告", "一季报", "三季报", "年报",
              "半年报", "季报", "财务报告", "审计报告", "内部控制评价报告",
              "内控评价报告", "财务报表", "会计政策", "会计估计", "财务决算",
              "审计委员会"]),
    ("业绩", ["业绩预告", "业绩快报", "业绩说明会", "业绩", "经营数据", "经营情况",
              "中标", "订单", "合同", "销售", "出货", "产能", "产量"]),
    # 股权激励单独成类：归属/行权/作废类公告数量大，混入「高管变动」会淹没真正的人事变动
    ("股权激励", ["限制性股票", "股权激励", "员工持股", "归属期", "归属条件",
                  "行权", "授予", "激励计划", "期权"]),
    ("高管变动", ["辞职", "辞任", "聘任", "换届", "选举", "任命", "离任", "解聘",
                  "董事长", "副董事长", "总经理", "副总经理", "财务总监",
                  "董事会秘书", "总工程师", "高级管理人员", "核心技术人员",
                  "监事", "独立董事", "述职"]),
    ("融资", ["募集资金", "募投", "定增", "增发", "发行股份", "发行股票",
              "可转债", "可转换公司债", "配股", "借款", "授信", "担保",
              "对外投资", "收购", "并购", "重组", "现金管理", "增资",
              "参股", "设立", "投资", "利润分配", "权益分派", "分红", "转增",
              "验资", "募集", "本次交易", "购买资产", "注册资本"]),
    ("技术突破", ["技术", "研发", "工艺", "制程", "新产品", "样机", "专利",
                  "量产", "突破", "首台", "首套", "验收", "交付"]),
]


def classify(title: str) -> str:
    """按标题关键词归类，返回标签"""
    for tag, kws in TAG_RULES:
        if any(k in title for k in kws):
            return tag
    return "其他"


def ts2date(ms):
    if not ms:
        return ""
    try:
        return dt.datetime.fromtimestamp(int(ms) / 1000).strftime("%Y-%m-%d")
    except Exception:  # noqa: BLE001
        return ""


def _post(path, data, retry=3, timeout=25):
    url = BASE + path
    body = urllib.parse.urlencode(data, encoding="utf-8").encode("utf-8")
    h = dict(HEADERS)
    h["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8"
    last = None
    for i in range(retry):
        try:
            req = urllib.request.Request(url, data=body, headers=h, method="POST")
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return json.loads(r.read().decode("utf-8"))
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(1.2 * (i + 1))
    raise RuntimeError("POST %s 失败: %s" % (url, last))


def search(keyword, max_num=10):
    """搜索证券，返回 [{code, orgId, name, category}]"""
    res = _post("/new/information/topSearch/query",
                {"keyWord": keyword, "maxNum": max_num})
    items = res if isinstance(res, list) else (
        res.get("keyBoardList") or res.get("result") or [])
    return [{
        "code": it.get("code"),
        "orgId": it.get("orgId"),
        "name": it.get("zwjc") or it.get("name") or "",
        "category": it.get("category") or "",
        "type": it.get("type") or "",
    } for it in items]


def column_of(code):
    """判断所属板块：沪市 sse / 深市 szse / 北交所 bj"""
    if code.startswith(("4", "8")):
        return "bj"
    if code.startswith(("6", "9")):
        return "sse"
    return "szse"


def fetch_page(code, org_id, page=1, size=30, se_date="", category="",
               column=None, searchkey=""):
    column = column or column_of(code)
    stock = "%s,%s" % (code, org_id) if org_id else code
    res = _post("/new/hisAnnouncement/query", {
        "pageNum": page, "pageSize": size, "column": column,
        "tabName": "fulltext", "plate": "", "stock": stock,
        "searchkey": searchkey, "secid": "", "category": category,
        "trade": "", "seDate": se_date, "sortName": "", "sortType": "",
        "isHLtitle": "true",
    }) or {}
    anns = res.get("announcements") or []
    total = res.get("totalAnnouncement") or 0
    pages = res.get("totalpages") or 0
    rows = []
    for a in anns:
        title = re.sub(r"</?em>", "", a.get("announcementTitle") or "")
        adjunct = (a.get("adjunctUrl") or "").lstrip("/")
        aid = a.get("announcementId")
        date = ts2date(a.get("announcementTime"))
        rows.append({
            "announcementId": aid,
            "code": a.get("secCode"),
            "name": a.get("secName"),
            "orgId": a.get("orgId"),
            "title": title,
            "date": date,
            "ts": a.get("announcementTime"),
            "type": a.get("announcementType"),
            # 附件链接（只存链接，不下载）
            "attachUrl": "%s/%s" % (STATIC, adjunct) if adjunct else "",
            "attachType": a.get("adjunctType"),
            "attachSizeKB": a.get("adjunctSize"),
            # 巨潮官方公告详情页（浏览器可直接打开阅读）
            "detailUrl": ("%s/new/disclosure/detail?stockCode=%s&announcementId=%s"
                          "&orgId=%s&announcementTime=%s" % (
                              BASE, a.get("secCode"), aid, a.get("orgId"), date)),
            "tag": classify(title),
        })
    return rows, total, pages


def fetch_all(code, org_id, days=0, category="", limit=0, size=30,
              searchkey="", sleep=1.0, verbose=True):
    """分页抓取全部（或指定天数内）公告"""
    se_date = ""
    if days > 0:
        end = dt.date.today()
        start = end - dt.timedelta(days=days)
        se_date = "%s~%s" % (start.isoformat(), end.isoformat())
    all_rows, page, total, pages = [], 1, None, None
    while True:
        rows, total, pages = fetch_page(code, org_id, page=page, size=size,
                                        se_date=se_date, category=category,
                                        searchkey=searchkey)
        if not rows:
            break
        all_rows.extend(rows)
        if verbose:
            print("   第 %d/%s 页，累计 %d 条" % (page, pages or "?", len(all_rows)),
                  file=sys.stderr)
        if limit and len(all_rows) >= limit:
            all_rows = all_rows[:limit]
            break
        if pages and page >= pages:
            break
        page += 1
        time.sleep(sleep)   # 限速，尊重对方站点
        if page > 200:      # 安全上限
            break
    return all_rows, total


def download_pdf(row, outdir, sleep=0.5, retry=3, timeout=60):
    """【可选】下载附件原件；默认流程不调用此函数，仅保留链接即可"""
    if not row.get("attachUrl"):
        return None
    safe = re.sub(r'[\\/:*?"<>|\s]+', "_", row["title"])[:50]
    fn = "%s_%s_%s_%s_%s.pdf" % (row["code"], row["name"], row["date"],
                                 safe, row.get("announcementId") or "")
    path = os.path.join(outdir, fn)
    if os.path.exists(path) and os.path.getsize(path) > 1024:
        return path
    last = None
    for i in range(retry):
        try:
            req = urllib.request.Request(row["attachUrl"], headers={
                "User-Agent": UA, "Referer": BASE + "/new/index"})
            with urllib.request.urlopen(req, timeout=timeout) as r:
                data = r.read()
            if not data.startswith(b"%PDF"):
                raise RuntimeError("返回内容不是 PDF（可能被 WAF 拦截）")
            tmp = path + ".part"
            with open(tmp, "wb") as f:
                f.write(data)
            os.replace(tmp, path)   # 原子落盘，避免半截文件
            time.sleep(sleep)
            return path
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(1.5 * (i + 1))
    print("   [附件失败] %s -> %s" % (row["title"][:30], last), file=sys.stderr)
    return None


def load_seen(state_file):
    if state_file and os.path.exists(state_file):
        with open(state_file, "r", encoding="utf-8") as f:
            return set(json.load(f))
    return set()


def save_seen(state_file, seen):
    if not state_file:
        return
    d = os.path.dirname(os.path.abspath(state_file))
    if d:
        os.makedirs(d, exist_ok=True)
    with open(state_file, "w", encoding="utf-8") as f:
        json.dump(sorted(seen), f, ensure_ascii=False)


def main():
    ap = argparse.ArgumentParser(description="巨潮资讯网公告抓取（默认不下载附件）")
    ap.add_argument("--code", help="股票代码，如 688012")
    ap.add_argument("--keyword", help="公司名称关键词，如 中微公司")
    ap.add_argument("--org-id", help="已知 orgId 可直传，跳过搜索")
    ap.add_argument("--days", type=int, default=0, help="仅抓最近 N 天（0=全部）")
    ap.add_argument("--tags", default=",".join(FOCUS_TAGS),
                    help="只保留这些类别，逗号分隔；all=不过滤（默认：%s）"
                         % ",".join(FOCUS_TAGS))
    ap.add_argument("--category", default="", help="公告类别代码或中文名，如 年报")
    ap.add_argument("--searchkey", default="", help="标题关键词过滤")
    ap.add_argument("--limit", type=int, default=0, help="最多抓取条数（0=不限）")
    ap.add_argument("--page-size", type=int, default=30, help="每页条数")
    ap.add_argument("--out", help="JSON 输出路径")
    ap.add_argument("--csv-out", help="CSV 输出路径")
    ap.add_argument("--download", action="store_true",
                    help="【默认关闭】下载附件原件；默认只保存附件链接")
    ap.add_argument("--pdf-dir", default="data/announcements", help="附件归档目录")
    ap.add_argument("--state", default="data/seen_ids.json", help="增量去重状态文件")
    ap.add_argument("--only-new", action="store_true", help="仅输出未见过的新公告")
    ap.add_argument("--list-categories", action="store_true", help="打印类别代码表")
    args = ap.parse_args()

    if args.list_categories:
        for k, v in CATEGORIES.items():
            print("%-8s %s" % (k, v))
        return

    if not args.code and not args.keyword:
        ap.error("请提供 --code 或 --keyword")

    # 类别接口级预筛
    category = CATEGORIES.get(args.category, args.category)

    # 关注标签集合
    if args.tags.strip().lower() == "all":
        keep_tags = set(ALL_TAGS)
    else:
        keep_tags = {t.strip() for t in args.tags.split(",") if t.strip()}
    unknown = keep_tags - set(ALL_TAGS)
    if unknown:
        print("警告：未知标签 %s，可选：%s" % (sorted(unknown), ", ".join(ALL_TAGS)),
              file=sys.stderr)

    code, org_id, name = args.code, args.org_id, ""
    if args.keyword or not org_id:
        kw = args.keyword or args.code
        print("① 搜索：%s" % kw)
        hits = search(kw)
        if not hits:
            print("   未找到匹配证券"); return
        for h in hits[:8]:
            print("   %s  %s  orgId=%s" % (h["code"], h["name"], h["orgId"]))
        t = next((h for h in hits if h["code"] == code), hits[0]) if code else hits[0]
        code, org_id, name = t["code"], t["orgId"], t["name"]

    print("② 目标：%s (%s) orgId=%s 板块=%s" % (name, code, org_id, column_of(code)))

    print("③ 抓取公告%s%s ..." % (
        "（最近 %d 天）" % args.days if args.days else "",
        "（类别 %s）" % args.category if category else ""))
    rows, total = fetch_all(code, org_id, days=args.days, category=category,
                            limit=args.limit, size=args.page_size,
                            searchkey=args.searchkey)
    print("   完成：命中总数 %s，实际获取 %d 条" % (total, len(rows)))

    # 全部标签分布
    full_stat = {}
    for r in rows:
        full_stat[r["tag"]] = full_stat.get(r["tag"], 0) + 1
    print("④ 全量标签分布：%s" % "，".join(
        "%s %d" % (k, v) for k, v in sorted(full_stat.items(), key=lambda x: -x[1])))

    # 按关注标签过滤
    kept = [r for r in rows if r["tag"] in keep_tags]
    dropped = len(rows) - len(kept)
    print("⑤ 关注类别（%s）保留 %d 条，过滤掉 %d 条" % (
        "/".join(FOCUS_TAGS if keep_tags == set(FOCUS_TAGS) else sorted(keep_tags)),
        len(kept), dropped))
    kept_stat = {}
    for r in kept:
        kept_stat[r["tag"]] = kept_stat.get(r["tag"], 0) + 1
    for t in ALL_TAGS:
        if t in kept_stat:
            print("     %-6s %3d 条" % (t, kept_stat[t]))
    drop_stat = {}
    for r in rows:
        if r["tag"] not in keep_tags:
            drop_stat[r["tag"]] = drop_stat.get(r["tag"], 0) + 1
    if drop_stat:
        print("   已过滤：%s（如需保留，用 --tags %s）" % (
            "，".join("%s %d" % (k, v) for k, v in
                     sorted(drop_stat.items(), key=lambda x: -x[1])),
            ",".join(sorted(keep_tags) + sorted(drop_stat))))

    # 增量去重
    seen = load_seen(args.state)
    new_rows = [r for r in kept if r["announcementId"] not in seen]
    print("⑥ 新公告 %d 条（历史已见 %d 条）" % (
        len(new_rows), len(kept) - len(new_rows)))
    out_rows = new_rows if args.only_new else kept

    # 附件处理：默认只保留链接
    if args.download:
        os.makedirs(args.pdf_dir, exist_ok=True)
        ok = 0
        for r in out_rows:
            p = download_pdf(r, args.pdf_dir)
            if p:
                r["attachLocal"] = os.path.relpath(p)
                ok += 1
        print("⑦ 附件下载完成：%d/%d 个 -> %s" % (ok, len(out_rows), args.pdf_dir))
    else:
        print("⑦ 附件：仅保存链接，未下载原件（共 %d 个链接可用）"
              % sum(1 for r in out_rows if r["attachUrl"]))

    # 输出
    if args.out:
        d = os.path.dirname(os.path.abspath(args.out))
        if d:
            os.makedirs(d, exist_ok=True)
        payload = {
            "code": code, "name": name, "orgId": org_id,
            "source": "cninfo.com.cn",
            "sourceNote": "数据源：巨潮资讯网（证监会指定信息披露平台）；附件仅保存链接，点击可查看原文",
            "fetchedAt": dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "dateRange": args.days,
            "totalAnnouncement": total,
            "totalFetched": len(rows),
            "filteredTags": sorted(keep_tags),
            "filteredOut": dropped,
            "count": len(out_rows),
            "tagStats": full_stat,
            "announcements": out_rows,
        }
        with open(args.out, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)
        print("⑧ JSON 已写入：%s（%d 条）" % (args.out, len(out_rows)))
    if args.csv_out:
        with open(args.csv_out, "w", encoding="utf-8-sig", newline="") as f:
            w = csv.DictWriter(f, fieldnames=["date", "code", "name", "tag",
                                              "title", "attachUrl", "detailUrl"])
            w.writeheader()
            for r in out_rows:
                w.writerow({k: r.get(k, "") for k in w.fieldnames})
        print("   CSV 已写入：%s" % args.csv_out)

    save_seen(args.state, seen | {r["announcementId"] for r in rows})

    print("\n⑨ 前 12 条预览：")
    for i, r in enumerate(out_rows[:12], 1):
        print("  %2d. [%s] %-6s 《%s》" % (i, r["date"], r["tag"], r["title"][:44]))


if __name__ == "__main__":
    main()
