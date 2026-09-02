import type {
  AlbumDetail,
  AlbumExtraData,
  AlbumSearchResponse,
  AlbumSummary,
  AlbumTrack,
} from '../shared/api.js'

interface MetadataRow {
  title: string
  artists?: string[]
  composers?: string[]
  lyricists?: string[]
  genres?: string[]
  discNumber?: string
  trackNumber?: string
  comments?: string
  lyric?: string
  lyricLanguage?: string
  bpm?: string
  key?: string
  album?: string
  albumOrder?: string
  albumArtists?: string[]
  year?: string
  extraData?: AlbumExtraData
}

interface CatalogOptions {
  repositoryUrl: string
  repositoryBranch: string
}

export interface AlbumSource {
  id: string
  folderName: string
  coverFilename?: string
  rows: MetadataRow[]
}

export interface AlbumFilters {
  keyword?: string
  album?: string
  albumArtist?: string
  artist?: string
  limit: number
  offset: number
}

interface CatalogEntry {
  summary: AlbumSummary
  detail: AlbumDetail
  search: {
    album: string
    albumArtists: string[]
    artists: string[]
  }
}

const normalizeSearchValue = (value: string) => value.normalize('NFKC').toLowerCase()

const includes = (values: string[], keyword: string) =>
  values.some(value => value.includes(keyword))

const getKeywordRank = (search: CatalogEntry['search'], keyword: string) => {
  if (search.album === keyword) {
    return 0
  }
  if (search.album.startsWith(keyword)) {
    return 1
  }
  if (search.album.includes(keyword)) {
    return 2
  }
  if (includes(search.albumArtists, keyword)) {
    return 3
  }
  if (includes(search.artists, keyword)) {
    return 4
  }
  return undefined
}

const encodePathSegment = (value: string) => encodeURI(value).replaceAll('#', '%23')

const normalizeTracks = (rows: MetadataRow[], albumGenres: string[]): AlbumTrack[] => {
  let currentDisc = 1
  let currentTrack = 1

  return rows.map(row => {
    const explicitDisc = row.discNumber === undefined ? Number.NaN : Number.parseInt(row.discNumber)
    if (!Number.isNaN(explicitDisc) && explicitDisc !== currentDisc) {
      currentDisc = explicitDisc
      currentTrack = 1
    }

    const track = {
      title: row.title,
      artists: row.artists ?? row.composers ?? [],
      composers: row.composers ?? [],
      lyricists: row.lyricists ?? [],
      genres: row.genres ?? albumGenres,
      discNumber: row.discNumber ?? currentDisc.toString(),
      trackNumber: row.trackNumber ?? currentTrack.toString(),
      comments: row.comments ?? null,
      lyric: row.lyric ?? null,
      lyricLanguage: row.lyricLanguage ?? null,
      bpm: row.bpm ?? null,
      key: row.key ?? null,
    }
    currentTrack += 1
    return track
  })
}

const createAlbum = (source: AlbumSource, options: CatalogOptions): CatalogEntry => {
  const { id, folderName, coverFilename, rows } = source
  const firstRow = rows[0]
  if (firstRow === undefined) {
    throw new Error(`Album metadata is empty: ${folderName}`)
  }

  const encodedFolder = encodePathSegment(folderName)
  const albumGenres = firstRow.genres ?? []
  const tracks = normalizeTracks(rows, albumGenres)
  const summary: AlbumSummary = {
    id,
    album: firstRow.album ?? folderName,
    albumOrder: firstRow.albumOrder ?? null,
    albumArtists: firstRow.albumArtists ?? [],
    genres: albumGenres,
    year: firstRow.year ?? null,
    extraData: firstRow.extraData ?? null,
    links: {
      ...(coverFilename === undefined
        ? {}
        : { cover: `/data/${encodedFolder}/${encodePathSegment(coverFilename)}` }),
      metadata: `/data/${encodedFolder}/metadata.json`,
      source: `${options.repositoryUrl}/blob/${encodePathSegment(options.repositoryBranch)}/public/data/${encodedFolder}/metadata.json`,
    },
  }
  const detail: AlbumDetail = { ...summary, tracks }

  return {
    summary,
    detail,
    search: {
      album: normalizeSearchValue(detail.album),
      albumArtists: detail.albumArtists.map(normalizeSearchValue),
      artists: [...new Set(tracks.flatMap(track => track.artists))].map(normalizeSearchValue),
    },
  }
}

export class AlbumCatalog {
  readonly #entries: CatalogEntry[]
  readonly #entriesById: Map<string, CatalogEntry>

  private constructor(entries: CatalogEntry[]) {
    this.#entries = entries
    this.#entriesById = new Map()
    for (const entry of entries) {
      if (this.#entriesById.has(entry.detail.id)) {
        throw new Error(`Duplicate album ID: ${entry.detail.id}`)
      }
      this.#entriesById.set(entry.detail.id, entry)
    }
  }

  static fromSources(sources: AlbumSource[], options: CatalogOptions) {
    return new AlbumCatalog(sources.map(source => createAlbum(source, options)))
  }

  search(filters: AlbumFilters): AlbumSearchResponse {
    const keyword =
      filters.keyword === undefined ? undefined : normalizeSearchValue(filters.keyword)
    const album = filters.album === undefined ? undefined : normalizeSearchValue(filters.album)
    const albumArtist =
      filters.albumArtist === undefined ? undefined : normalizeSearchValue(filters.albumArtist)
    const artist = filters.artist === undefined ? undefined : normalizeSearchValue(filters.artist)

    const matches = this.#entries
      .flatMap(entry => {
        if (
          (album !== undefined && !entry.search.album.includes(album)) ||
          (albumArtist !== undefined && !includes(entry.search.albumArtists, albumArtist)) ||
          (artist !== undefined && !includes(entry.search.artists, artist))
        ) {
          return []
        }

        const rank = keyword === undefined ? 0 : getKeywordRank(entry.search, keyword)
        return rank === undefined ? [] : [{ entry, rank }]
      })
      .sort((a, b) => a.rank - b.rank)

    return {
      items: matches
        .slice(filters.offset, filters.offset + filters.limit)
        .map(({ entry }) => entry.summary),
      total: matches.length,
      limit: filters.limit,
      offset: filters.offset,
    }
  }

  get(id: string) {
    return this.#entriesById.get(id)?.detail
  }
}
