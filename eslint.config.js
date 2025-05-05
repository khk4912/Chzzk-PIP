import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import neostandard from 'neostandard'
import autoImports from './.wxt/eslint-auto-imports.mjs'

export default tseslint.config(
  autoImports,
  ...neostandard({
    ignores: ['dist*', 'Cheese-PIP-*', 'public/**/*', 'packages/**/*'],
    filesTs: ['**/*.{ts,tsx}'],
    ts: true
  }),
  { ignores: ['dist*', 'Cheese-PIP-*', 'public/**/*', 'packages/**/*'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ]
    }
  }
)
