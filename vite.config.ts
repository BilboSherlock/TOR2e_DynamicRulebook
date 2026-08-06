import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import compressPlugin from 'vite-plugin-compress';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(() => {
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
  const basePath = repo ? // : '/';
  return {
    base: basePath,
    plugins: [react(), tailwindcss(), compressPlugin({ verbose: true }), visualizer({ filename: 'stats.html', open: false })],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 800,
      sourcemap: false,
      minify: 'esbuild',
      rollupOptions: {
        sourcemap: false,
        minify: 'esbuild',
        rollupOptions: {
          output: {
            manualChunks: {
              react: ['react', 'react-dom'],
              markdown: ['react-markdown', 'rehype-raw', 'remark-gfm'],
              motion: ['motion'],
              vendor: ['@google/genai', '@tailwindcss/vite']
            }
          }
        }
      }
    }
  };
});
