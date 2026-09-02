import { readdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import fmtConfig from '@the1812/oxc-config/oxfmt'
import lintConfig from '@the1812/oxc-config/oxlint'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { nitro } from 'nitro/vite'
import * as v from 'valibot'
import { defineConfig, lazyPlugins } from 'vite-plus'

const projectRoot = dirname(fileURLToPath(import.meta.url))
const dataRoot = resolve(projectRoot, 'public/data')
const albumManifestSchema = v.strictObject({
  id: v.pipe(v.string(), v.regex(/^[0-7][0-9a-hjkmnp-tv-z]{25}$/u)),
})

const buildAlbumDataModule = () => {
  const albums = readdirSync(dataRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => {
      const albumRoot = resolve(dataRoot, entry.name)
      const coverFilename = readdirSync(albumRoot).find(filename => /^cover\./iu.test(filename))
      const manifest = v.parse(
        albumManifestSchema,
        JSON.parse(readFileSync(resolve(albumRoot, 'album.json'), 'utf8')),
      )
      return {
        id: manifest.id,
        folderName: entry.name,
        coverFilename,
        rows: JSON.parse(readFileSync(resolve(albumRoot, 'metadata.json'), 'utf8')) as unknown,
      }
    })
    .sort((a, b) => a.folderName.localeCompare(b.folderName))

  return `export default ${JSON.stringify(albums)}`
}

export default defineConfig({
  fmt: {
    ...fmtConfig,
    ignorePatterns: [...(fmtConfig.ignorePatterns ?? []), '.output/', 'public/data/'],
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
            'cache-control': 'public, max-age=60',
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
      virtual: {
        '#album-data': buildAlbumDataModule,
      },
      devServer: {
        watch: ['public/data'],
      },
    }),
  ]),
})
