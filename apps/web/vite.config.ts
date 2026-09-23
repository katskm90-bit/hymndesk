import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Phase 2 note: When this app is ready to replace the root index.html,
// configure vite-plugin-pwa here and set up the CI build → gh-pages deploy.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
