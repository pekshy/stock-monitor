# -*- coding: utf-8 -*-
"""
行业情报抓取（半导体 / AI / 机器人）

两个数据源，均为公开接口，返回真实数据：

  1. 行业研究报告 —— 东方财富研报中心
     https://reportapi.eastmoney.com/report/list   (qType=1 行业研报)
  2. 重大事件     —— 东方财富 7x24 快讯
     https://np-weblist.eastmoney.com/comm/web/getFastNewsList

归类逻辑（本脚本自己的规则，非数据源字段）：
  - 行业归属：标题关键词打分；无命中时回退到研报的 industryName；
              若命中「图谱已收录的上市公司代码」则该行业加权（公司锚点更可靠）
  - 环节归属：按 SEG_RULES / SUB_RULES 映射到产业链 seg / 二级细分 sub
  - 报告类型：深度报告 / 定期跟踪 / 事件点评 / 策略
  - 事件类型：政策规划 / 并购融资 / 技术突破 / 产能投资 / 订单业绩 / 行业数据

用法：
  python scripts/fetch_industry_intel.py                        # 默认研报 120 天、事件 30 天
  python scripts/fetch_industry_intel.py --report-days 180 --event-days 15
  python scripts/fetch_industry_intel.py --out data/industry_intel.json
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timedelta

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

REPORT_API = "https://reportapi.eastmoney.com/report/list"
REPORT_PAGE = "https://data.eastmoney.com/report/zw_industry.jshtml?infocode=%s"
FLASH_API = "https://np-weblist.eastmoney.com/comm/web/getFastNewsList"
FLASH_PAGE = "https://finance.eastmoney.com/a/%s.html"

# ---------------------------------------------------------------- 行业关键词
# 归属采用打分模型，精度优先：
#   强关键词 +2 / 弱关键词 +1 / "AI" 单词边界 +1 / 研报行业分类佐证 +0~2 / 已收录公司锚点 +3
#   总分 >= 2 才归类；否则丢弃（宁可少，不可错）
STRONG_KEYWORDS = {
    "semiconductor": [
        "半导体", "集成电路", "晶圆", "晶圆代工", "晶圆厂", "晶圆制造", "封测",
        "先进封装", "存储芯片", "DRAM", "NAND", "EDA", "光刻", "刻蚀", "薄膜沉积",
        "离子注入", "硅片", "光刻胶", "电子特气", "前驱体", "功率半导体", "功率器件",
        "IGBT", "碳化硅", "SiC", "氮化镓", "分立器件", "MCU", "SoC", "Chiplet",
        "HBM", "微电子", "芯片", "晶圆设备", "半导体设备", "半导体材料",
    ],
    "ai": [
        "人工智能", "大模型", "多模态", "AIGC", "生成式", "智能体", "算力", "智算",
        "机器学习", "深度学习", "MaaS", "Agent", "Transformer", "神经网络",
    ],
    "robotics": [
        "机器人", "人形", "具身", "减速器", "谐波", "丝杠", "伺服", "灵巧手",
        "运动控制", "协作机器人", "工业机器人", "机械臂", "关节模组", "六维力",
        "电子皮肤", "SCARA", "行星滚柱",
    ],
}
WEAK_KEYWORDS = {
    "semiconductor": ["CIS", "射频", "模拟芯片", "抛光液", "抛光垫", "电子化学品",
                      "量测", "零部件", "元器件", "制程", "光电"],
    "ai": ["模型", "推理", "训练", "智能", "AI应用", "AI 应用"],
    "robotics": ["自动化", "无框电机", "空心杯电机", "力矩传感器"],
}
# AI 按单词边界匹配，避免 "said" / "chair" 之类误命中
INDUSTRY_REGEX = {
    "ai": re.compile(r"(?<![A-Za-z])AI(?![A-Za-z])"),
}
# 研报自带行业分类的佐证权重（半导体是明确口径给 2，其余只作弱佐证）
NAME_BONUS = {
    "semiconductor": {"半导体": 2, "元件": 1, "光学光电子": 1, "电子化学品": 1,
                      "消费电子": 1},
    "ai": {"软件开发": 1, "IT服务": 1, "计算机设备": 1, "通信设备": 1,
           "通信服务": 1, "互联网服务": 1, "游戏": 1, "计算机应用": 1},
    "robotics": {"通用设备": 1, "专用设备": 1, "自动化设备": 1, "仪器仪表": 1},
}
INDUSTRY_ORDER = ["semiconductor", "ai", "robotics"]

# ---------------------------------------------------------------- 环节 / 细分映射
SEG_RULES = {
    "semiconductor": [
        ("eda", ["EDA", "电子设计自动化", "IP授权", "IP 授权"]),
        ("equipment", ["设备", "光刻", "刻蚀", "薄膜沉积", "离子注入", "清洗",
                       "炉管", "量测", "检测设备"]),
        ("material", ["材料", "硅片", "光刻胶", "抛光液", "抛光垫", "前驱体",
                      "电子特气", "特气", "电子化学品"]),
        ("osat", ["封测", "封装", "测试", "HBM", "Chiplet", "先进封装"]),
        ("fab", ["晶圆代工", "代工", "晶圆制造", "制造", "制程", "产能"]),
        ("design", ["芯片设计", "设计", "GPU", "SoC", "CIS", "射频", "模拟芯片",
                    "功率半导体", "MCU", "ASIC"]),
        ("terminal", ["终端", "手机", "汽车电子", "数据中心", "消费电子", "服务器"]),
    ],
    "ai": [
        ("llm", ["大模型", "模型", "LLM", "多模态", "Agent", "智能体", "开源"]),
        ("maas", ["MaaS", "模型服务", "API", "工具链", "向量数据库"]),
        ("ai-app", ["应用", "办公", "编程", "营销", "内容生成", "商业化", "落地"]),
    ],
    "robotics": [
        ("humanoid", ["人形", "具身", "灵巧手", "本体", "VLA"]),
        ("reducer", ["减速器", "谐波", "丝杠", "RV"]),
        ("servo", ["伺服", "控制器", "电机", "关节模组", "运动控制"]),
        ("sensor", ["传感器", "视觉", "力传感", "触觉", "电子皮肤"]),
        ("industrial", ["工业机器人", "协作机器人", "SCARA", "六轴"]),
        ("integrator", ["集成", "产线", "仓储", "物流"]),
    ],
}
# 细分（二级）映射，key = seg id，名称需与页面 SUBS 保持一致
SUB_RULES = {
    "equipment": [
        ("光刻设备", ["光刻"]),
        ("刻蚀设备", ["刻蚀"]),
        ("薄膜沉积", ["薄膜沉积", "PECVD", "ALD", "外延", "EPI"]),
        ("离子注入", ["离子注入"]),
        ("清洗设备", ["清洗"]),
        ("炉管 / 扩散", ["炉管", "扩散炉", "氧化炉"]),
    ],
    "material": [
        ("12 英寸大硅片", ["硅片"]),
        ("光刻胶", ["光刻胶"]),
        ("CMP 抛光材料", ["抛光液", "抛光垫", "CMP"]),
        ("前驱体", ["前驱体"]),
        ("电子特气", ["电子特气", "特气"]),
    ],
    "eda": [
        ("数字全流程 EDA", ["数字EDA", "数字 EDA", "数字全流程", "仿真器", "形式验证"]),
        ("制造类 EDA", ["制造类EDA", "制造类 EDA", "良率", "OPC"]),
        ("封装 EDA", ["封装EDA", "封装 EDA"]),
        ("IP 授权", ["IP授权", "IP 授权", "IP核", "IP 核"]),
        ("模拟全流程 EDA", ["模拟EDA", "模拟 EDA", "模拟全流程"]),
    ],
    "design": [
        ("GPU / AI 芯片", ["GPU", "AI芯片", "AI 芯片", "算力芯片", "加速卡", "ASIC"]),
        ("射频前端", ["射频"]),
        ("CIS 传感器", ["CIS", "图像传感器"]),
        ("功率半导体", ["功率半导体", "功率器件", "碳化硅", "SiC", "氮化镓", "IGBT"]),
        ("模拟芯片", ["模拟芯片", "模拟IC", "模拟 IC"]),
        ("SoC / 主控", ["SoC", "主控芯片", "MCU"]),
    ],
    "fab": [
        ("先进制程代工", ["先进制程", "先进工艺", "N+2"]),
        ("特色工艺代工", ["特色工艺", "BCD", "成熟制程", "成熟工艺"]),
        ("存储制造", ["存储", "DRAM", "NAND"]),
    ],
    "osat": [
        ("HBM 封测", ["HBM"]),
        ("2.5D/3D 先进封装", ["先进封装", "2.5D", "3D封装", "3D 封装", "Chiplet",
                            "CoWoS", "TSV"]),
        ("传统封装测试", ["封测", "封装测试"]),
    ],
    "terminal": [
        ("数据中心 / 智算", ["数据中心", "智算", "服务器"]),
        ("智能汽车", ["汽车电子", "车载", "智能汽车"]),
        ("AI 手机 / PC", ["手机", "PC", "消费电子"]),
        ("工业控制", ["工业控制", "工控"]),
    ],
    "llm": [
        ("多模态大模型", ["多模态"]),
        ("Agent 框架", ["Agent", "智能体"]),
        ("开源模型", ["开源"]),
        ("语言大模型", ["大模型", "语言模型", "LLM"]),
    ],
    "maas": [
        ("模型 API 服务", ["API", "模型服务"]),
        ("向量数据库", ["向量数据库"]),
        ("微调工具链", ["微调", "工具链"]),
    ],
    "ai-app": [
        ("AI 编程", ["编程", "代码"]),
        ("AI 办公", ["办公"]),
        ("AI 营销", ["营销"]),
        ("多模态内容生成", ["内容生成", "视频生成"]),
    ],
    "humanoid": [
        ("灵巧手", ["灵巧手"]),
        ("具身大脑（VLA）", ["VLA", "具身大脑", "端到端模型"]),
        ("本体制造", ["本体", "整机"]),
    ],
    "reducer": [
        ("谐波减速器", ["谐波"]),
        ("RV 减速器", ["RV"]),
        ("行星滚柱丝杠", ["丝杠", "滚柱"]),
    ],
    "servo": [
        ("一体化关节模组", ["关节模组", "一体化关节"]),
        ("运动控制器", ["运动控制", "控制器"]),
        ("伺服系统", ["伺服"]),
    ],
    "sensor": [
        ("3D 视觉", ["3D视觉", "3D 视觉", "深度相机", "视觉传感"]),
        ("六维力传感器", ["六维力", "力矩传感器", "力传感"]),
        ("电子皮肤", ["电子皮肤", "触觉"]),
    ],
    "industrial": [
        ("六轴工业机器人", ["六轴", "工业机器人"]),
        ("协作机器人", ["协作机器人"]),
        ("SCARA", ["SCARA"]),
    ],
    "integrator": [
        ("汽车产线集成", ["汽车产线", "汽车"]),
        ("仓储物流集成", ["仓储", "物流"]),
    ],
}

# ---------------------------------------------------------------- 报告类型
REPORT_TYPE_RULES = [
    ("深度报告", ["深度报告", "深度研究", "深度：", "首次覆盖", "行业深度"]),
    ("定期跟踪", ["周报", "月报", "半月报", "季报", "双周", "每周", "跟踪报告", "定期报告"]),
    ("策略报告", ["策略", "中期策略", "年度策略", "投资策略"]),
    ("事件点评", ["点评", "快评", "事件点评", "业绩点评", "公告点评"]),
]

# ---------------------------------------------------------------- 事件类型（按优先级）
EVENT_RULES = [
    ("政策规划", ["政策", "规划", "印发", "实施意见", "指导意见", "行动方案",
                  "实施方案", "工作方案", "试点", "补贴", "关税", "出口管制",
                  "管制清单", "国家标准", "行业标准", "工信部", "国务院", "发改委",
                  "科技部", "财政部", "条例", "管理办法", "白名单", "新规", "立法",
                  "部委", "支持政策", "国家队", "专项"]),
    ("并购融资", ["收购", "并购", "重组", "合并", "要约", "股权转让", "增资入股",
                  "战略投资", "融资", "定增", "IPO", "上市辅导", "递交招股书",
                  "过会", "注册生效", "入股", "股权融资", "分拆", "拟上市",
                  "完成交割", "估值"]),
    ("技术突破", ["突破", "量产", "流片", "通过验证", "验证通过", "首发", "首台",
                  "首款", "首例", "下线", "成功发射", "点亮", "装车", "自研",
                  "攻克", "里程碑", "刷新", "国产化", "技术攻关", "量产交付",
                  "正式发布", "重磅发布", "进入量产", "送样", "首次公开", "全球首",
                  "推出", "上线", "亮相", "问世", "联合发布", "新品发布"]),
    ("产能投资", ["投产", "扩产", "开工", "奠基", "封顶", "增资", "投资建设",
                  "签约", "落地", "新建", "基地", "工厂", "产线", "产能",
                  "开工建设", "募集资金投资", "成立", "启用", "启幕", "开业",
                  "落成", "达成合作", "战略合作", "布局"]),
    ("订单业绩", ["订单", "中标", "合同", "业绩", "净利润", "营收", "预增",
                  "扭亏", "减亏", "毛利率", "出货量", "交付", "销售收入",
                  "营业利润", "同比增长"]),
    ("行业数据", ["产量", "销量", "出货", "同比", "环比", "库存", "价格",
                  "指数", "统计", "数据显示", "市场规模", "渗透率", "份额"]),
]
# 日常噪音事件（非行业重大事件），直接丢弃
EVENT_EXCLUDE = [
    # 例行公司行为
    "减持", "解禁", "限售", "质押", "异常波动", "龙虎榜", "涨停", "跌停",
    "大宗交易", "融资余额", "股东户数", "股份回购进展", "澄清", "股价", "异动",
    # 行情涨跌与资金面（非产业事件）
    "收涨", "收跌", "涨超", "跌超", "拉升", "大涨", "大跌", "涨幅", "跌幅",
    "概念股", "板块异动", "指数涨", "指数跌", "盘中", "收盘",
    "ETF", "指数", "资金监控", "主力资金", "净买入", "净卖出", "北向资金",
    "开盘", "高开", "低开", "飘红", "翻绿", "领涨", "领跌", "板块情绪",
    "附股", "机构热议", "浮出水面", "成色",
    # 资讯汇总类
    "要闻", "汇总", "一览", "盘点", "一文读懂", "你需要知道", "早知道",
    "早报", "晚报", "复盘", "收评", "午评", "早餐", "隔夜",
    # 与本板块三个行业无关的题材串入
    "卫星", "火箭", "航天", "宇航", "入轨", "发射", "脑机接口", "元宇宙", "白酒",
    "房地产", "特朗普", "白宫", "五角大楼",
]
# 券商 / 投行观点类快讯（分析师点评，不是产业事件）
BROKER_PREFIX = re.compile(
    r"^(中信证券|中金公司|国泰海通|华泰证券|招商证券|广发证券|中信建投|申万宏源|"
    r"兴业证券|东吴证券|天风证券|海通证券|国信证券|长江证券|国金证券|东方证券|"
    r"平安证券|中泰证券|国投证券|民生证券|开源证券|华创证券|方正证券|国元证券|"
    r"浙商证券|国海证券|光大证券|东兴证券|华西证券|中银证券|财通证券|"
    r"大摩|小摩|高盛|摩根士丹利|摩根大通|瑞银|花旗|野村|美银|巴克莱|麦格理)[：:]")
# 从标题兜底提取企业名时需要排除的描述性词汇（避免把"…量产元年来了"当成公司）
NAME_STOPWORDS = ["元年", "来了", "首个", "首届", "全球首", "量产", "突破", "落地",
                  "发布", "重磅", "最新", "今日", "独家", "独家丨", "注意", "突发"]

INDUSTRY_LABEL = {"semiconductor": "半导体", "ai": "AI", "robotics": "机器人"}


# ---------------------------------------------------------------- 工具
def http_json(url: str, referer: str, retries: int = 3, timeout: int = 30):
    last = None
    for i in range(retries):
        try:
            req = urllib.request.Request(url, headers={
                "User-Agent": UA, "Referer": referer,
                "Accept": "application/json, text/plain, */*",
                "Accept-Language": "zh-CN,zh;q=0.9",
            })
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return json.loads(r.read().decode("utf-8", "ignore"))
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(1.2 * (i + 1))
    raise RuntimeError("请求失败: %s -> %s" % (url[:90], last))


def hit_keywords(text: str, keywords) -> list:
    return [k for k in keywords if k.lower() in text.lower()]


def load_tracked_companies(page_path: str):
    """从页面的 COMPANIES 中提取已收录的上市公司（代码 -> 行业），用作归属锚点。"""
    code_map = {}
    if not os.path.exists(page_path):
        return code_map
    html = open(page_path, encoding="utf-8", errors="ignore").read()
    for m in re.finditer(
            r"name:'([^']+)',\s*code:'([^']+)',\s*industry:'(\w+)',\s*seg:'([\w-]+)'", html):
        name, code, industry, seg = m.group(1), m.group(2), m.group(3), m.group(4)
        mkt = code.split(".")[-1] if "." in code else ""
        num = code.split(".")[0]
        if not num.isdigit():
            continue
        prefix = {"SH": "1", "SZ": "0"}.get(mkt)
        if prefix:
            code_map[prefix + "." + num] = {"name": name, "industry": industry, "seg": seg}
    return code_map


def classify_industry(text: str, industry_name: str = "", anchors=None) -> str:
    """行业归属打分：强关键词 2 分 / 弱关键词 1 分 / 行业分类佐证 0~2 分 / 公司锚点 3 分。

    只保留得分 >= 2 且唯一的行业，避免「工程机械」「房地产」等被关键词连带误判。
    """
    scores = {}
    for ind in INDUSTRY_ORDER:
        s = 2 * len(hit_keywords(text, STRONG_KEYWORDS[ind]))
        s += len(hit_keywords(text, WEAK_KEYWORDS[ind]))
        rx = INDUSTRY_REGEX.get(ind)
        if rx and rx.search(text):
            s += 1
        if industry_name:
            s += NAME_BONUS.get(ind, {}).get(industry_name, 0)
        scores[ind] = s
    for a in (anchors or []):
        if a:
            scores[a["industry"]] = scores.get(a["industry"], 0) + 3
    best = max(scores.values())
    if best < 2:
        return ""
    for ind in INDUSTRY_ORDER:
        if scores.get(ind, 0) == best:
            return ind
    return ""


def classify_seg(text: str, industry: str) -> str:
    for seg, kws in SEG_RULES.get(industry, []):
        if hit_keywords(text, kws):
            return seg
    return ""


def classify_sub(text: str, seg: str):
    for name, kws in SUB_RULES.get(seg, []):
        if hit_keywords(text, kws):
            return name
    return None


def classify_report_type(title: str) -> str:
    for name, kws in REPORT_TYPE_RULES:
        if hit_keywords(title, kws):
            return name
    return "行业报告"


def classify_event_type(title: str, summary: str) -> str:
    text = title + " " + (summary or "")[:120]
    for name, kws in EVENT_RULES:
        if hit_keywords(text, kws):
            return name
    return ""


# ---------------------------------------------------------------- 抓取：研报
def fetch_reports(report_days: int, pages_max: int, code_map, verbose=True):
    end = datetime.now()
    begin = end - timedelta(days=report_days)
    bt, et = begin.strftime("%Y-%m-%d"), end.strftime("%Y-%m-%d")
    out, seen = [], set()
    for page in range(1, pages_max + 1):
        params = {
            "industryCode": "*", "pageSize": "100", "industry": "*", "rating": "*",
            "ratingChange": "*", "beginTime": bt, "endTime": et, "pageNo": str(page),
            "fields": "", "qType": "1", "orgCode": "", "code": "*", "rcode": "",
            "p": str(page), "pageNum": str(page), "pageNumber": str(page), "_": "1",
        }
        d = http_json(REPORT_API + "?" + urllib.parse.urlencode(params),
                      "https://data.eastmoney.com/report/")
        rows = d.get("data") or []
        if not rows:
            break
        stop = False
        for r in rows:
            info = r.get("infoCode") or ""
            if not info or info in seen:
                continue
            seen.add(info)
            date = (r.get("publishDate") or "")[:10]
            if date and date < bt:
                stop = True
                continue
            title = (r.get("title") or "").strip()
            if not title:
                continue
            ind = classify_industry(title, r.get("industryName") or "")
            if not ind:
                continue
            seg = classify_seg(title, ind)
            out.append({
                "date": date,
                "org": (r.get("orgSName") or "").strip(),
                "title": title,
                "industry": ind,
                "seg": seg,
                "sub": classify_sub(title, seg) if seg else None,
                "rtype": classify_report_type(title),
                "industryName": (r.get("industryName") or "").strip(),
                "researcher": (r.get("researcher") or "").strip(),
                "rating": (r.get("emRatingName") or "").strip(),
                "url": REPORT_PAGE % info,
            })
        if verbose:
            print("   研报第 %d 页：累计命中 %d 条" % (page, len(out)))
        if stop or len(rows) < 100:
            break
        time.sleep(0.35)
    out.sort(key=lambda x: x["date"], reverse=True)
    return out, bt, et


# ---------------------------------------------------------------- 抓取：快讯事件
def fetch_events(event_days: int, pages_max: int, code_map, verbose=True):
    cutoff = (datetime.now() - timedelta(days=event_days)).strftime("%Y-%m-%d")
    out, seen, seen_title, cur = [], set(), set(), ""
    for page in range(1, pages_max + 1):
        url = ("%s?client=web&biz=web_724&fastColumn=102&sortEnd=%s&pageSize=200&req_trace=1"
               % (FLASH_API, urllib.parse.quote(cur)))
        d = http_json(url, "https://kuaixun.eastmoney.com/")
        data = d.get("data") or {}
        rows = data.get("fastNewsList") or []
        if not rows:
            break
        for r in rows:
            code = str(r.get("code") or "")
            if not code or code in seen:
                continue
            seen.add(code)
            show = r.get("showTime") or ""
            date = show[:10]
            if date and date < cutoff:
                continue
            title = (r.get("title") or "").strip()
            summary = (r.get("summary") or "").strip()
            # 快讯摘要常以【标题】开头，与标题重复，去掉
            m0 = re.match(r"^【(.+?)】", summary)
            if m0 and m0.group(1)[:12] == title[:12]:
                summary = summary[m0.end():].strip()
            if not title:
                continue
            if hit_keywords(title, EVENT_EXCLUDE):
                continue
            # 以问句收尾的通常是分析/观点，而非具体事件
            if title.rstrip().endswith(("？", "?")):
                continue
            # 券商分析师点评，不是产业事件
            if BROKER_PREFIX.match(title):
                continue
            # 同一件事被多家转载时去重（按标题归一化）
            tkey = re.sub(r"[^\u4e00-\u9fa5A-Za-z0-9]", "", title)[:36]
            if tkey in seen_title:
                continue
            seen_title.add(tkey)
            anchors = [code_map.get(str(s)) for s in (r.get("stockList") or [])]
            anchors = [a for a in anchors if a]
            ind = classify_industry(title + " " + summary[:80], "", anchors)
            if not ind:
                continue
            etype = classify_event_type(title, summary)
            if not etype:
                continue
            seg = classify_seg(title, ind)
            names, seen_n = [], set()
            for a in anchors:
                if a["industry"] == ind and a["name"] not in seen_n:
                    seen_n.add(a["name"])
                    names.append(a["name"])
            if not names:
                m = re.match(r"^([\u4e00-\u9fa5A-Za-z0-9（）()·]{2,14})[：:]", title)
                if m and not hit_keywords(m.group(1), NAME_STOPWORDS):
                    names = [m.group(1)]
            out.append({
                "time": show,
                "date": date,
                "type": etype,
                "industry": ind,
                "seg": seg,
                "sub": classify_sub(title, seg) if seg else None,
                "title": title,
                "summary": summary[:180],
                "companies": names[:2],
                "url": FLASH_PAGE % code,
            })
        if verbose:
            print("   快讯第 %d 页：累计命中 %d 条（%s）"
                  % (page, len(out), (rows[-1].get("showTime") or "")[:16]))
        cur = data.get("sortEnd") or ""
        if not cur or (rows[-1].get("showTime") or "")[:10] < cutoff:
            break
        time.sleep(0.25)
    out.sort(key=lambda x: x["time"], reverse=True)
    return out, cutoff


# ---------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser(description="抓取行业研究报告与重大事件（半导体/AI/机器人）")
    ap.add_argument("--report-days", type=int, default=120, help="研报回溯天数，默认 120")
    ap.add_argument("--event-days", type=int, default=30, help="事件回溯天数，默认 30")
    ap.add_argument("--report-pages", type=int, default=60, help="研报最大翻页数")
    ap.add_argument("--event-pages", type=int, default=30, help="快讯最大翻页数")
    ap.add_argument("--report-cap", type=int, default=80, help="每行业最多保留研报数")
    ap.add_argument("--event-cap", type=int, default=60, help="每行业最多保留事件数")
    ap.add_argument("--out", default="data/industry_intel.json")
    ap.add_argument("--page", default="demo/index.html", help="用于提取已收录企业的页面")
    args = ap.parse_args()

    page_path = args.page if os.path.isabs(args.page) else os.path.join(ROOT, args.page)
    code_map = load_tracked_companies(page_path)
    print("已收录上市公司锚点：%d 个" % len(code_map))

    print("\n[1/2] 抓取行业研究报告（东方财富研报中心，行业研报）...")
    reports, rb, re_ = fetch_reports(args.report_days, args.report_pages, code_map)

    print("\n[2/2] 抓取重大事件（东方财富 7x24 快讯）...")
    events, ecut = fetch_events(args.event_days, args.event_pages, code_map)

    # 每行业按时间倒序截断，避免板块被单一行业刷屏
    def cap(items, key, limit):
        keep, cnt = [], {}
        for it in items:
            k = it[key]
            if cnt.get(k, 0) < limit:
                cnt[k] = cnt.get(k, 0) + 1
                keep.append(it)
        return keep

    raw_r, raw_e = len(reports), len(events)
    reports = cap(reports, "industry", args.report_cap)
    events = cap(events, "industry", args.event_cap)
    if len(reports) != raw_r or len(events) != raw_e:
        print("按行业截断：研报 %d -> %d 条，事件 %d -> %d 条"
              % (raw_r, len(reports), raw_e, len(events)))

    def stat(items, key):
        d = {}
        for it in items:
            d[it[key]] = d.get(it[key], 0) + 1
        return d

    payload = {
        "generatedAt": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "sources": {"reports": "东方财富研报中心", "events": "东方财富 7x24 快讯"},
        "reportRange": [rb, re_],
        "eventCutoff": ecut,
        "reportDays": args.report_days,
        "eventDays": args.event_days,
        "reports": reports,
        "events": events,
    }
    out_path = args.out if os.path.isabs(args.out) else os.path.join(ROOT, args.out)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, separators=(",", ":"))

    print("\n================ 汇总 ================")
    print("研报 %d 条 %s ~ %s" % (len(reports), rb, re_))
    for k, v in sorted(stat(reports, "industry").items(), key=lambda x: -x[1]):
        print("   %-14s %3d 条   类型 %s" % (INDUSTRY_LABEL[k], v, stat(
            [r for r in reports if r["industry"] == k], "rtype")))
    print("事件 %d 条（回溯至 %s）" % (len(events), ecut))
    for k, v in sorted(stat(events, "industry").items(), key=lambda x: -x[1]):
        print("   %-14s %3d 条   类型 %s" % (INDUSTRY_LABEL[k], v, stat(
            [e for e in events if e["industry"] == k], "type")))
    size = os.path.getsize(out_path)
    print("\n已写出 %s（%.1f KB）" % (out_path, size / 1024))


if __name__ == "__main__":
    main()
