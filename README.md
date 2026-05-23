# 股票监测系统

一个用于监测关注股票的 Web 应用，按行业分类展示股票表现。

## 功能特性

- 行业概览：查看各行业整体表现，包括平均涨跌幅、涨跌数量
- 热门涨跌：不同周期（1日、5日、10日、20日）涨跌幅排行榜
- 股票详情：个股基本信息、历史行情走势图和估值指标
- 响应式设计：支持桌面和移动设备

## 技术栈

- React 18 + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL)
- Recharts (图表库)
- React Router (路由)
- Lucide React (图标)

## 数据库表结构

### watchlist（关注股票列表）
- id: 主键
- stock_name: 股票名称
- stock_code: 股票代码（唯一）
- industry1: 一级行业
- industry2: 二级行业
- market: 市场
- created_at, updated_at: 时间戳

### daily_quotes（日行情数据）
- id: 主键
- stock_code: 股票代码
- trade_date: 交易日期
- open_price, close_price, high_price, low_price: 价格数据
- volume, amount: 成交量、成交额
- pct_change: 当日涨跌幅
- pct_change_5d/10d/20d/30d/60d: 多周期涨跌幅
- turnover_rate: 换手率

### daily_valuations（日估值数据）
- id: 主键
- stock_code: 股票代码
- trade_date: 交易日期
- pe_ttm, pe_static: 市盈率
- pb: 市净率
- psr: 市销率
- total_market_cap, circulating_market_cap: 总市值、流通市值

## 开始使用

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填入你的 Supabase 配置：

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 配置 Supabase 权限

确保你的 Supabase 数据库表有正确的权限设置，允许公开读取：

```sql
-- 为所有表启用行级安全性
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_valuations ENABLE ROW LEVEL SECURITY;

-- 创建允许公开读取的策略
CREATE POLICY "Enable read access for all users" ON watchlist
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON daily_quotes
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON daily_valuations
    FOR SELECT USING (true);

-- 授予 anon 角色权限
GRANT SELECT ON watchlist TO anon;
GRANT SELECT ON daily_quotes TO anon;
GRANT SELECT ON daily_valuations TO anon;
```

### 4. 运行开发服务器

```bash
npm run dev
```

### 5. 构建生产版本

```bash
npm run build
```

## 部署到 GitHub Pages

### 方法一：使用 gh-pages 包

1. 安装 gh-pages：
```bash
npm install -D gh-pages
```

2. 在 `package.json` 中添加：
```json
{
  "homepage": "https://your-username.github.io/repo-name",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. 部署：
```bash
npm run deploy
```

### 方法二：手动部署

1. 构建项目：`npm run build`
2. 推送到 GitHub
3. 在仓库设置中配置 GitHub Pages：
   - Source: Deploy from a branch
   - Branch: gh-pages (如果使用方法一) 或 main 分支的 /dist 目录

### 注意事项

- GitHub Pages 只支持静态网站，所有数据通过 Supabase 客户端获取
- 确保 Supabase URL 和 Anon Key 在 `.env` 文件中正确配置
- 如需使用自定义域名，可在 GitHub Pages 设置中配置

## 项目结构

```
stock-monitor/
├── src/
│   ├── components/       # 组件
│   │   ├── Header.tsx
│   │   ├── IndustryCard.tsx
│   │   ├── StockTable.tsx
│   │   └── PriceChart.tsx
│   ├── pages/           # 页面
│   │   ├── Home.tsx
│   │   ├── IndustryDetail.tsx
│   │   └── StockDetail.tsx
│   ├── hooks/           # 自定义 Hooks
│   │   ├── useStockData.ts
│   │   └── useIndustryData.ts
│   ├── utils/           # 工具函数
│   │   ├── supabase.ts
│   │   └── formatters.ts
│   ├── types/           # TypeScript 类型
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .trae/documents/     # 项目文档
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```
