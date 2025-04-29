import { defineConfig } from 'vite'
import { resolve } from 'path'

import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import svgr from 'vite-plugin-svgr'
import { rmDotVite } from './custom-plugins'

import manifest from './manifest.firefox.json'
import zipPack from 'vite-plugin-zip-pack'

const isWatch = process.argv.includes('--watch')

export default defineConfig({
  plugins: [react(), crx({ manifest, browser: 'firefox' }), svgr(), rmDotVite({ firefox: true }),
    isWatch
      ? null
      : zipPack(
        {
          outDir: 'packages',
          inDir: 'dist-firefox',
          outFileName: `${manifest.name.replaceAll(' ', '-')}-v${manifest.version}-Firefox.zip`,
        }

      )],
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
