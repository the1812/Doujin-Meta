import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { nitro } from 'nitro/vite'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = dirname(fileURLToPath(import.meta.url))
const dataRoot = resolve(projectRoot, 'public/data')

const buildAlbumDataModule = () => {
  const albums = readdirSync(dataRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => {
      const albumRoot = resolve(dataRoot, entry.name)
      const coverFilename = readdirSync(albumRoot).find(filename => /^cover\./iu.test(filename))
      if (coverFilename === undefined) {
        throw new Error(`Album cover is missing: ${entry.name}`)
      }
      return {
        folderName: entry.name,
        coverFilename,
        rows: JSON.parse(readFileSync(resolve(albumRoot, 'metadata.json'), 'utf8')) as unknown,
      }
    })
    .sort((a, b) => a.folderName.localeCompare(b.folderName))

  return `export default ${JSON.stringify(albums)}`
}

export default defineConfig({
  plugins: [
    vue(),
    VueI18nPlugin({
      include: resolve(projectRoot, 'src/i18n/locales/**'),
    }),
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
  ],
})
