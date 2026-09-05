import { readdirSync, readFileSync } from 'node:fs'
import { isAbsolute, relative, resolve, sep } from 'node:path'

import { localJson, type Metadata } from 'touhou-tagger'
import * as v from 'valibot'
import type { Plugin } from 'vite-plus'

const albumDataId = '#album-data'
const resolvedAlbumDataId = '\0doujin-meta:album-data'
const albumManifestSchema = v.strictObject({
  id: v.pipe(v.string(), v.regex(/^[0-7][0-9a-hjkmnp-tv-z]{25}$/u)),
})

const isInDirectory = (directory: string, file: string) => {
  const path = relative(directory, file)
  return path !== '..' && !path.startsWith(`..${sep}`) && !isAbsolute(path)
}

const buildAlbumDataModule = async (dataRoot: string, watchFile: (file: string) => void) => {
  const albums = await Promise.all(
    readdirSync(dataRoot, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(async entry => {
        const albumRoot = resolve(dataRoot, entry.name)
        const manifestPath = resolve(albumRoot, 'album.json')
        const metadataPath = resolve(albumRoot, 'metadata.json')
        watchFile(manifestPath)
        watchFile(metadataPath)

        const coverFilename = readdirSync(albumRoot).find(filename => /^cover\./iu.test(filename))
        if (coverFilename !== undefined) {
          watchFile(resolve(albumRoot, coverFilename))
        }
        const manifest = v.parse(
          albumManifestSchema,
          JSON.parse(readFileSync(manifestPath, 'utf8')),
        )
        return {
          id: manifest.id,
          folderName: entry.name,
          coverFilename,
          rows: await localJson.normalizeWithoutCover(
            JSON.parse(readFileSync(metadataPath, 'utf8')) as Metadata[],
          ),
        }
      }),
  )
  albums.sort((a, b) => a.folderName.localeCompare(b.folderName))

  return `export default ${JSON.stringify(albums)}`
}

export const albumData = (dataRoot: string): Plugin => ({
  name: 'doujin-meta:album-data',
  enforce: 'pre',
  resolveId(id) {
    if (id === albumDataId) {
      return resolvedAlbumDataId
    }
  },
  load(id) {
    if (id === resolvedAlbumDataId) {
      return buildAlbumDataModule(dataRoot, file => this.addWatchFile(file))
    }
  },
  hotUpdate({ file }) {
    if (!isInDirectory(dataRoot, file)) {
      return
    }
    const albumDataModule = this.environment.moduleGraph.getModuleById(resolvedAlbumDataId)
    return albumDataModule === undefined ? [] : [albumDataModule]
  },
})
