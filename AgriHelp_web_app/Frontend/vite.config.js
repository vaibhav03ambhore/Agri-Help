import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // target: 'https://agri-help-backend.onrender.com',
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/warmup': {
        target: 'https://agri-help-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})