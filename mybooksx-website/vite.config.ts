import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { mybooksApiPlugin } from './src/server/viteApiPlugin.ts';

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    command === 'serve' ? mybooksApiPlugin() : undefined
  ].filter(Boolean),
}));
