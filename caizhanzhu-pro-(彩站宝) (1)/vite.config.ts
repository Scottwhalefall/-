import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    // Important: Use relative base path for GitHub Pages compatibility
    base: './', 
    define: {
      // Polyfill process.env.API_KEY so the existing service code works without changes
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  }
})