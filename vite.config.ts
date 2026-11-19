import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 有新版本时自动接管，避免 GitHub Pages 上缓存头不可控导致长期停留在旧版
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png'],
      manifest: {
        name: '涛哥投研工作室',
        short_name: '投研',
        description: '半导体、AI、机器人行业研究与行情监控',
        lang: 'zh-CN',
        theme_color: '#1e3a8a',
        background_color: '#f9fafb',
        display: 'standalone',
        orientation: 'portrait',
        // 部署在 GitHub Pages 子路径下，scope 与 start_url 必须带上 base
        scope: '/stock-monitor/',
        start_url: '/stock-monitor/#/stocks',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
        // 单页应用未做代码分割，主 bundle 约 2.7MB，需放宽预缓存上限
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        // 使用 HashRouter，站点只有入口 HTML 一个路由，无需 SPA 回退
        navigateFallback: null,
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
      },
      devOptions: { enabled: false },
    }),
  ],
  // GitHub Pages 部署时需要设置 base
  base: '/stock-monitor/',
})
