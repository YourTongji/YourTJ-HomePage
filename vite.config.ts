import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative asset paths so the build works on both:
  // - https://<user>.github.io/<repo>/ (project pages)
  // - https://yourtj.de (custom domain)
  base: './',
});
