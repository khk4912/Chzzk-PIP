import { defineConfig } from 'vite'
import { resolve } from 'path'

import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import svgr from 'vite-plugin-svgr'

import manifest from './manifest.firefox.json'

// not dist, dist-firefox
export default defineConfig({
  plugins: [react(), crx({ manifest, browser: 'firefox' }), svgr()],
  root: resolve(__dirname, ''),
  build: {
    outDir: resolve(__dirname, 'dist-firefox'),
    rollupOptions: {
      input: {
        record: resolve(__dirname, 'pages/record_result/index.html'),
          }, 
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg']
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
})
