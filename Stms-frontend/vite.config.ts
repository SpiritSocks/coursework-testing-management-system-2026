import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Запросы на /api уходят на ASP.NET Core бэкенд, поэтому CORS не нужен
    proxy: {
      '/api': 'http://localhost:5221',
    },
  },
})
