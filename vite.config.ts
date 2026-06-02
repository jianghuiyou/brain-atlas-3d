import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/brain-atlas-3d/' : '/',
  plugins: [react()],
  // 解剖大脑 GLB 通过 ?inline 直接 base64 内联进 JS bundle，
  // 用户拿到 JS 即可加载模型，不再发起独立网络请求。
  assetsInclude: ['**/*.glb'],
  build: {
    // 只为这种内联资源放宽提示阈值，避免误报
    chunkSizeWarningLimit: 4096,
  },
})
