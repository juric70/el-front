import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': { // Proxy samo API rute
        target: 'http://3.76.105.28',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
})
