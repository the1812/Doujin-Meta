import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import fmtConfig from '@the1812/oxc-config/oxfmt'
import lintConfig from '@the1812/oxc-config/oxlint'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { nitro } from 'nitro/vite'
import { defineConfig, lazyPlugins } from 'vite-plus'

import { albumData } from './vite/album-data.js'

const projectRoot = dirname(fileURLToPath(import.meta.url))
const dataRoot = resolve(projectRoot, 'public/data')

export default defineConfig(({ command }) => ({
  fmt: {
    ...fmtConfig,
    ignorePatterns: [...(fmtConfig.ignorePatterns ?? []), '.output/'],
  },
  lint: {
    extends: [lintConfig],
    categories: {
      correctness: 'off',
    },
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
    ignorePatterns: ['.output/', 'node_modules/', 'public/data/'],
    overrides: [
      {
        files: ['server/routes/**/*.ts'],
        rules: {
          'import/no-default-export': 'off',
        },
      },
    ],
  },
  plugins: lazyPlugins(() => [
    albumData(dataRoot),
    vueJsx(),
    nitro({
      compatibilityDate: '2026-09-02',
      serverDir: './server',
      renderer: {
        template: './index.html',
        static: true,
      },
      routeRules: {
        '/api/**': {
          cors: true,
          headers: {
            'access-control-allow-methods': 'GET, HEAD, OPTIONS',
            'cache-control': command === 'serve' ? 'no-store' : 'public, max-age=60',
          },
        },
        '/data/**': {
          headers: {
            'cache-control': 'public, max-age=3600',
          },
        },
      },
      runtimeConfig: {
        sourceRepositoryUrl: 'https://github.com/the1812/Doujin-Meta',
        sourceRepositoryBranch: 'main',
      },
    }),
  ]),
}))
