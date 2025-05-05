import { defineConfig } from 'wxt'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    description: "치지직에 녹화, 스크린샷 등 다양한 기능을 추가합니다.",
    action: {
      default_title: "Cheese-PIP"
    },
    permissions: ["storage", "downloads"],
    web_accessible_resources: [
      {
        resources: ["src/*", "ffmpeg/*", "pages/*", "monkeypatch/*"],
        matches: ["<all_urls>"]
      }
    ],
    content_security_policy: {
      extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';",
      sandbox: "sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';"
    },
    browser_specific_settings: {
      gecko: {
        id: 'chzzk_pip@kosame.dev'
      }
    }
  },

  vite: () =>
    ({
      plugins: [svgr()],
      css: {
        modules: {
          localsConvention: 'camelCase',
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        }
      },
      optimizeDeps: {
        exclude: ['@ffmpeg/ffmpeg']
      },
    }),

    imports: {
       eslintrc: {
        enabled: 9
       }  
    }  
})
