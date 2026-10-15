---
name: research-note
description: 把文章、研报、新闻的观点与趋势提炼成结构化笔记，写入研究笔记库（Supabase research_notes 表），并自动关联研究池内的企业。当用户说「记录到我的研究笔记」「总结这篇文章的观点」「提炼一下记到笔记里」「把这篇研报沉淀一下」，或给出文章链接/正文要求提炼观点并归档时使用。
---

# 研究笔记 · 从文章提炼观点入库

把一篇外部内容（公众号文章、券商研报、新闻、访谈）**提炼成有观点的结构化笔记**，落库到研究工作台的「研究笔记」（Supabase `research_notes` 表），并关联到研究池内的相关企业。

## 何时使用

- 用户给出文章链接或正文，要求「总结/提炼观点并记录到研究笔记」
- 用户想把碎片信息沉淀成可检索、可在企业详情页看到的研究资产
- 用户说「记一下这个观点」「这篇文章很有价值，存到笔记」

**不适用**：把整篇原文复制粘贴归档（那是 `kind='资料'` 的极端情况，仍建议提炼）；写入企业研究条目（那是改 `data.ts`）。

## 工作流

### 第 1 步：拿到全文

- 链接 → 用 WebFetch 抓取，**要求保留原文的表述、数据、公司名、机构观点**，不要只取摘要。
- 用户直接贴正文 → 直接用。
- 微信 `mp.weixin.qq.com` 链接可直接抓取正文。

### 第 2 步：提炼（核心，不要跳过）

**不要复述原文。** 要输出「提炼后的判断」。一篇内容通常沉淀 2–4 个要点。

正文推荐结构（按内容取舍，不必全用）：

```
【趋势/判断一】一句话结论
2-4 句支撑：关键数据、技术判断、机构观点（注明是谁说的）

【趋势/判断二】一句话结论
……

【事实时间线】把散落的动作按日期排成一条线（若原文有多个时点事件）
· MM-DD 主体 动作 + 关键数字

【落库对照】研究池内可直接跟踪的标的
· 企业名（研究池内名字）—— 与本文的关系、当前轮次/进展

【来源】媒体/机构《标题》，日期，作者
URL
```

提炼要求：
- **数字必须保留原文口径**（金额、份额、增速、日期），不要四舍五入或改写。
- **判断要标明归属**——「东兴证券研报判断：…」比直接陈述可信。
- 可以补一层**自己的归纳**（如「设备企业正从单点供应走向成套平台化」），但要用 `>>` 或「提炼逻辑」显式区分，不与原文字句混淆。
- **不确定的不写**。原文没说的不要补。

### 第 3 步：确定归属与关联企业

- 判定 `industry` / `seg` / `sub` → 查 `references/taxonomy.md` 的对照表，**照抄，不臆造**。
- 挑出文中涉及的、**研究池内已存在**的企业作为 `companies`。
  → 先在项目里搜索确认：`"name": "企业名"`（主要看 `src/research/data.ts`）。
  → 池外企业**不要硬填**；如确值得长期跟踪，先提示用户「是否纳入研究池」。
- `tags` 2–6 个短词，优先复用 `taxonomy.md` 里已列出的标签以形成聚合。

### 第 4 步：写入

把笔记写成 JSON 再喂给脚本：

```json
{
  "title": "标题（<= 40 字，抓要点，不要用「关于…的思考」这类空标题）",
  "body": "按第 2 步结构组织，支持多段与缩进",
  "kind": "观点",
  "industry": "semiconductor",
  "seg": "equipment",
  "sub": "先进封装设备",
  "companies": ["芯慧联芯", "青禾晶元"],
  "tags": ["混合键合", "先进封装", "设备平台化"],
  "occurred_at": "2026-10-15",
  "source": "文章 URL"
}
```

```bash
# <SKILL_DIR> = 本 skill 所在目录
#   全局安装：~/.codebuddy/skills/research-note
#   项目内副本：<项目>/.codebuddy/skills/research-note
node <SKILL_DIR>/scripts/write_note.mjs /tmp/note.json \
  --data-ts /workspace/stock-monitor/src/research/data.ts \
  --sql-dir /workspace/stock-monitor/supabase
```

脚本自动完成：字段校验 → 企业名校验（不在池内会直接报错）→ 算 hash 查重（同内容不重复入库）→ 写库 → 可选生成幂等 SQL 备档。

先跑 `--dry-run` 看一眼再正式写入。

**凭据**：脚本内**不硬编码任何密钥**，按优先级读取——① 环境变量 `RESEARCH_SUPABASE_URL` / `RESEARCH_SUPABASE_KEY`；② `--env <path>` 指定的 env 文件；③ 项目 `.env.local` / `.env` 中的 `SUPABASE_URL`、`SUPABASE_PUBLISHABLE_KEY`（或 `VITE_` 前缀同名项）。缺配置时会报错并给出提示，不会静默失败。

### 第 5 步：验证（必须做）

1. 脚本输出的 `id` 与「写入成功」即已入库。
2. **在页面上确认可见**：该笔记会出现在 `companies` 中任一企业的详情页「研究笔记」卡片。
   - 起 dev server：`cd /workspace/stock-monitor && npx vite --port 5177 --strictPort`（注意 `.env.local` 需含 `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`，用后还原）。
   - 详情页地址：`http://localhost:5177/stock-monitor/#/research/company/<encodeURIComponent(企业名)>`
   - 检查点：笔记**标题/正文**出现、`kind` 徽章、关联企业标签、`#标签`、日期。
   - 对照组：挑一家**未被关联**的企业，确认不显示（验证关联逻辑正确）。
3. 用 PowerShell/Playwright 抽查时，**同时记录 console error 数**，应为 0。
4. 用后停服、还原 `.env.local`（`grep -c VITE_ .env.local` 应为 0）。

### 第 6 步（可选）：留档

若项目有 `supabase/` 目录，保留 `--sql-dir` 生成的 `note_YYYY-MM-DD_<hash8>.sql` 备档，并按项目惯例提交。

## 数据表口径（校对用）

`research_notes`：`id / hash / kind / title / body / source / industry / seg / sub / companies / tags / occurred_at / file_path / created_at / updated_at`

- `companies` 与 `tags` 存 **JSON 数组字符串**（如 `["A","B"]`）。
- `hash = sha1(title + "\n" + body)`，与前端 `src/research/notes.ts` 的 `noteHash` 一致 —— 脚本已内置，勿手算。
- 前端卡片渲染的是 `body || title`，**标题不会单独显示**，所以正文首行要能独立表意。

## 硬性约束

1. **绝不编造**：原文没有的数据、金额、机构、时间点一律不写。
2. **企业名必须先校验**，不得凭印象填写（脚本会拦，但别指望它兜底）。
3. **`seg` / `sub` 照抄 `taxonomy.md`**，不新造节点名。
4. **标题 ≤ 40 字**（超了脚本报错）。
5. **`occurred_at` 填内容日期而非今天**。
6. 一条笔记只讲一件事；跨主题请拆成多条，各自独立可检索。
