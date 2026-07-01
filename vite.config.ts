import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/violet-violin-quest/' : '/',
  esbuild: {
    jsx: 'automatic',
  },
});
