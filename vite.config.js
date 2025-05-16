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
  //allen
  build: {
    assetsInlineLimit: 0,  // 禁止 Base64 轉換
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    // host: '0.0.0.0',
    // port: 5173,
    // strictPort: true,
    // historyApiFallback: true,
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


