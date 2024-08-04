import { defineConfig } from 'vite'
import {resolve} from 'path'

import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import svgr from 'vite-plugin-svgr'

import manifest from './manifest.json'

export default defineConfig({
  plugins: [react(), crx({ manifest }), svgr()],
  root: resolve(__dirname, ''),
  build: {
    rollupOptions: {
      input: {
        record: resolve(__dirname, 'pages/record_result/index.html'),
      }
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },
  optimizeDeps:{
    exclude:['@ffmpeg/ffmpeg']
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
})
