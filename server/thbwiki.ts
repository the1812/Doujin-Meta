import { useRuntimeConfig } from 'nitro/runtime-config'
import {
  ThbWiki,
  type Metadata,
  type MetadataConfig,
  type MetadataFetchOptions,
} from 'touhou-tagger'
import touhouTaggerPackage from 'touhou-tagger/package.json' with { type: 'json' }

const thbWikiConfig: MetadataConfig = {
  commentLanguage: 'zho',
  coverCompressSize: 0,
  coverCompressResolution: 0,
  separator: ' / ',
  timeout: 30,
  retry: 1,
}

interface RuntimeConfig {
  doujinMetaCommit: string
}

const doujinMetaUserAgent = (commit: string) =>
  `doujin-meta/${commit} (https://github.com/the1812/Doujin-Meta) touhou-tagger/${touhouTaggerPackage.version}`

const getThbWiki = () => {
  const source = new ThbWiki()
  const { doujinMetaCommit } = useRuntimeConfig() as RuntimeConfig
  source.config = {
    ...thbWikiConfig,
    userAgent: doujinMetaUserAgent(doujinMetaCommit),
  }
  return source
}

export const getThbWikiMetadata = async (album: string, options: MetadataFetchOptions = {}) => {
  const source = getThbWiki()
  return source.getMetadata(album, options)
}

export const getThbWikiMetadataFromHtml = async (
  html: string,
  options: MetadataFetchOptions = {},
) => {
  const source = getThbWiki()
  return source.getMetadataFromHtml(html, options)
}

export const withoutCover = ({ coverImage: _coverImage, ...metadata }: Metadata) => metadata
