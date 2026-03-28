import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { SECURITY_HEADERS } from './config/securityHeaders'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    headers: SECURITY_HEADERS,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    exclude: ['e2e/**', 'playwright.config.js', 'node_modules/**'],
  },
})
