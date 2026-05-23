# GitHub Pages 部署指南

## 前置要求

## 1. 安装必要工具

### 安装 Git
下载并安装 Git：https://git-scm.com/download/win

### 安装 Node.js
下载并安装 Node.js LTS：https://nodejs.org/

安装完成后重启终端，验证安装：

```bash
git --version
node --version
npm --version
```

## 2. 准备 GitHub 仓库

### 在 GitHub 创建新仓库

1. 访问 https://github.com/new
2. 仓库名称：`stock-monitor`（或你喜欢的名字）
3. 选择 Public 或 Private（Public 推荐）
4. 不要勾选 "Initialize this repository"
5. 点击 "Create repository"

## 3. 初始化 Git 仓库

在项目目录 `d:\xiahaitao\projects\stock-monitor` 执行：

```bash
# 初始化 Git
git init

# 添加所有文件
git add .

# 首次提交
git commit -m "Initial commit: Stock monitor application"

# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/stock-monitor.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

## 4. 配置 Vite（重要）

修改 `vite.config.ts` 中的 base 路径：

```typescript
export default defineConfig({
  plugins: [react()],
  // 替换为你的仓库名！
  base: '/stock-monitor/',
})
```

同样更新 `package.json` 中的 homepage：

```json
{
  "name": "stock-monitor",
  "homepage": "https://YOUR_USERNAME.github.io/stock-monitor",
  ...
}
```

## 5. 安装依赖并部署

```bash
# 安装依赖
npm install

# 部署到 GitHub Pages
npm run deploy
```

## 6. 启用 GitHub Pages

1. 访问你的 GitHub 仓库
2. 点击 "Settings"
3. 点击左侧菜单 "Pages"
4. 在 "Build and deployment" 下：
   - Source: Deploy from a branch
   - Branch: 选择 `gh-pages` 分支
   - 点击 "Save"

## 7. 访问你的网站

几分钟后，你的网站将可在以下地址访问：

```
https://YOUR_USERNAME.github.io/stock-monitor
```

## 常见问题

### 页面显示 404
- 确保 `vite.config.ts` 中的 `base` 设置正确
- 确保仓库名匹配

### 样式不显示
- 检查 `base` 配置
- 重新运行 `npm run deploy`

### 后续更新

每次修改代码后：

```bash
git add .
git commit -m "Update: your update description"
git push
npm run deploy
```
