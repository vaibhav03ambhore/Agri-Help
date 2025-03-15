import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/warmup': {
        target: 'https://agri-help-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'https://agri-help-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})