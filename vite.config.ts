import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import svgr from 'vite-plugin-svgr'

import manifest from './manifest.json'

export default defineConfig({
  plugins: [react(), crx({ manifest }), svgr()],
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
})
