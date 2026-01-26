import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
  },
  // Use relative asset paths so the build works on both:
  // - https://<user>.github.io/<repo>/ (project pages)
  // - https://yourtj.de (custom domain)
  base: './',
})
