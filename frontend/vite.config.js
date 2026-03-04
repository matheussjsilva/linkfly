import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/shorten': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Regex matcher for nanoid(6) exactly. Any 6-char path goes to Express for redirection.
      '^/[A-Za-z0-9_-]{6}$': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
