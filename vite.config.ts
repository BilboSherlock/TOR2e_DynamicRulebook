import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import compressPlugin from 'vite-plugin-compress'; // gzip & brotli
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(() => {
  return {
    base: '/<repo-name>/',
    plugins: [react(), tailwindcss(), compressPlugin({ verbose: true })],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
    assetsInlineLimit: 4096, // inline assets <=4KB
    chunkSizeWarningLimit: 800, // higher limit to avoid warnings after chunking
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
    },
    plugins: [visualizer({ filename: 'stats.html', open: false })]
  };
});
