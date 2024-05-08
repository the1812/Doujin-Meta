import { Metadata, localJson } from 'touhou-tagger'
import { join } from 'path'
import { existsSync } from 'fs'
import { readFile, readdir } from 'fs/promises'
import Fuse from 'fuse.js'
import { ApiHandler } from './base.js'
import { findCover } from '../index.js'

export class LocalApiHandler extends ApiHandler {
  private static getPublicDataPath(...path: string[]) {
    return join('./public/data', ...path)
  }
  async getAlbumDetail() {
    const { name, normalize } = this.request.query
    const encodedName = encodeURIComponent(name as string)
    const metadataPath = LocalApiHandler.getPublicDataPath(
      decodeURI(name as string),
      'metadata.json',
    )
    if (!existsSync(metadataPath)) {
      this.response.status(404).json({
        message: 'metadata.json not found',
      })
      return
    }
    const metadataJson: Metadata[] = JSON.parse(await readFile(metadataPath, { encoding: 'utf-8' }))
    const nodes = await readdir(LocalApiHandler.getPublicDataPath(name as string))
    const result = {
      name,
      coverUrl: `/data/${encodeURI(name as string)}/${findCover(nodes, it => it)}`,
      metadataUrl: `https://github.com/${this.owner}/${this.repo}/blob/${this.branch}/public/data/${encodedName}/metadata.json`,
      rawUrl: `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/public/data/${encodedName}/metadata.json`,
      metadata:
        normalize === 'false' ? metadataJson : await localJson.normalizeWithoutCover(metadataJson),
    }
    this.response.status(200).json(result)
  }
  async listAlbums() {
    const albums = await readdir(LocalApiHandler.getPublicDataPath())
    this.response.status(200).json(
      albums.map(item => {
        return {
          name: item,
          id: item,
        }
      }),
    )
  }
  async searchAlbums() {
    const { keyword } = this.request.query
    const albums = await readdir(LocalApiHandler.getPublicDataPath())
    const fuse = new Fuse(albums, {
      threshold: 0.4,
      includeMatches: true,
    })
    const result = fuse.search(keyword as string)
    const json = await Promise.all(
      result.map(async ({ item, matches }) => {
        const nodes = await readdir(LocalApiHandler.getPublicDataPath(item))
        const cover = findCover(nodes, it => it)
        return {
          id: item,
          name: item,
          coverUrl: `/data/${encodeURI(item)}/${cover}`,
          detailUrl: `/api/albums/detail/${encodeURIComponent(item)}`,
          matches: matches?.flatMap(it => it.indices),
        }
      }),
    )
    this.response.status(200).json(json)
  }
}
