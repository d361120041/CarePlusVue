import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
//yuuhou
 optimizeDeps: {
    include: ['recharts'],  // ✅ 確保 Vite 正確處理 Recharts
  },
//yuuhou
  server: {
    proxy: {
      '/patient': {
        target: 'http://localhost:8082', 
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/patient/, '/patient'),
      },
    },
    allowedHosts: ['4226-1-160-3-119.ngrok-free.app'],  // ngrok
  },
})


