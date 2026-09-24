import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Netlify serves the build from the domain root, so assets are requested with
  // absolute paths. Relative paths would break when Netlify's SPA fallback
  // returns index.html for a nested URL such as /foo/bar.
  base: '/',
});
