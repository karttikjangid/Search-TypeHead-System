import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/suggest': 'http://localhost:8000',
      '/search': 'http://localhost:8000',
      '/trending': 'http://localhost:8000',
      '/cache': 'http://localhost:8000',
      '/batch': 'http://localhost:8000',
    },
  },
})
