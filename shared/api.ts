export interface AlbumExtraData extends Record<string, unknown> {
  links?: {
    bandcamp?: string
    dizzylab?: string
    thbWiki?: string
  }
}

export interface AlbumLinks {
  cover?: string
  metadata: string
  source: string
}

export interface AlbumSummary {
  id: string
  album: string
  albumOrder: string | null
  albumArtists: string[]
  genres: string[]
  year: string | null
  extraData: AlbumExtraData | null
  links: AlbumLinks
}

export interface AlbumTrack {
  title: string
  artists: string[]
  composers: string[]
  lyricists: string[]
  genres: string[]
  discNumber: string
  trackNumber: string
  comments: string | null
  lyric: string | null
  lyricLanguage: string | null
  bpm: string | null
  key: string | null
}

export interface AlbumDetail extends AlbumSummary {
  tracks: AlbumTrack[]
}

export interface AlbumSearchResponse {
  items: AlbumSummary[]
  total: number
  limit: number
  offset: number
}
