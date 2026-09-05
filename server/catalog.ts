import type {
  AlbumDetail,
  AlbumExtraData,
  AlbumSearchItem,
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
    lyricists: string[]
    comments: string[]
  }
}

const normalizeSearchValue = (value: string) => value.normalize('NFKC').toLowerCase()

const getOriginalRange = (value: string, start: number, end: number): [number, number] => {
  const boundaries = [
    0,
    ...Array.from(
      new Intl.Segmenter().segment(value),
      ({ index, segment }) => index + segment.length,
    ),
  ]
  const normalizedOffsets = boundaries.map(
    index => normalizeSearchValue(value.slice(0, index)).length,
  )
  const originalStart = boundaries[normalizedOffsets.findLastIndex(offset => offset <= start)] ?? 0
  const originalEndIndex = normalizedOffsets.findIndex(offset => offset >= end)
  const originalEnd = boundaries[originalEndIndex] ?? value.length
  return [originalStart, originalEnd]
}

const getMatches = (value: string, normalizedValue: string, keyword: string) => {
  const matches: [number, number][] = []
  let start = normalizedValue.indexOf(keyword)
  while (start !== -1 && keyword.length > 0) {
    const end = start + keyword.length
    matches.push(getOriginalRange(value, start, end))
    start = normalizedValue.indexOf(keyword, end)
  }
  return matches
}

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
  if (includes(search.lyricists, keyword)) {
    return 5
  }
  if (includes(search.comments, keyword)) {
    return 6
  }
  return undefined
}

const getMatchedField = (entry: CatalogEntry, keyword: string): AlbumSearchItem['matchedField'] => {
  const fields = [
    { field: 'artist' as const, values: entry.detail.tracks.flatMap(track => track.artists) },
    { field: 'lyricist' as const, values: entry.detail.tracks.flatMap(track => track.lyricists) },
    {
      field: 'comment' as const,
      values: entry.detail.tracks.flatMap(track => track.comments ?? []),
    },
  ]

  for (const { field, values } of fields) {
    const value = [...new Set(values)].find(sourceValue =>
      normalizeSearchValue(sourceValue).includes(keyword),
    )
    if (value !== undefined) {
      return {
        field,
        value,
        matches: getMatches(value, normalizeSearchValue(value), keyword),
      }
    }
  }
  return undefined
}

const encodePathSegment = (value: string) => encodeURI(value).replaceAll('#', '%23')

const createTracks = (rows: MetadataRow[], albumGenres: string[]): AlbumTrack[] =>
  rows.map(row => ({
    title: row.title,
    artists: row.artists ?? [],
    composers: row.composers ?? [],
    lyricists: row.lyricists ?? [],
    genres: row.genres ?? albumGenres,
    discNumber: row.discNumber ?? '',
    trackNumber: row.trackNumber ?? '',
    comments: row.comments ?? null,
    lyric: row.lyric ?? null,
    lyricLanguage: row.lyricLanguage ?? null,
    bpm: row.bpm ?? null,
    key: row.key ?? null,
  }))

const createAlbum = (source: AlbumSource, options: CatalogOptions): CatalogEntry => {
  const { id, folderName, coverFilename, rows } = source
  const firstRow = rows[0]
  if (firstRow === undefined) {
    throw new Error(`Album metadata is empty: ${folderName}`)
  }

  const encodedFolder = encodePathSegment(folderName)
  const albumGenres = firstRow.genres ?? []
  const tracks = createTracks(rows, albumGenres)
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
      lyricists: [...new Set(tracks.flatMap(track => track.lyricists))].map(normalizeSearchValue),
      comments: [...new Set(tracks.flatMap(track => track.comments ?? []))].map(
        normalizeSearchValue,
      ),
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
      items: matches.slice(filters.offset, filters.offset + filters.limit).map(({ entry }) => ({
        ...entry.summary,
        albumMatches:
          keyword === undefined ? [] : getMatches(entry.summary.album, entry.search.album, keyword),
        albumArtistMatches: entry.summary.albumArtists.map((sourceAlbumArtist, index) =>
          keyword === undefined
            ? []
            : getMatches(sourceAlbumArtist, entry.search.albumArtists[index] ?? '', keyword),
        ),
        ...(keyword === undefined ||
        entry.search.album.includes(keyword) ||
        includes(entry.search.albumArtists, keyword)
          ? {}
          : { matchedField: getMatchedField(entry, keyword) }),
      })),
      total: matches.length,
      limit: filters.limit,
      offset: filters.offset,
    }
  }

  get(id: string) {
    return this.#entriesById.get(id)?.detail
  }
}
