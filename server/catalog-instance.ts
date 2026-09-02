import { useRuntimeConfig } from 'nitro/runtime-config'

import albumSources from '#album-data'

import { AlbumCatalog } from './catalog.js'

interface RepositoryConfig {
  sourceRepositoryUrl: string
  sourceRepositoryBranch: string
}

let catalog: AlbumCatalog | undefined

export const useAlbumCatalog = () => {
  if (catalog === undefined) {
    const config = useRuntimeConfig() as RepositoryConfig
    catalog = AlbumCatalog.fromSources(albumSources, {
      repositoryUrl: config.sourceRepositoryUrl,
      repositoryBranch: config.sourceRepositoryBranch,
    })
  }
  return catalog
}
