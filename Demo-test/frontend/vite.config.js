// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // 1. path 모듈 임포트

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 2. "@" 기호를 "src" 폴더 경로로 매핑
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
    },
  },
})