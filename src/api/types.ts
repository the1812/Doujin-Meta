export interface AlbumExtraData {
  links?: {
    dizzylab?: string
    thbWiki?: string
  }
}

export interface AlbumItem {
  id: string
  album: string
  albumOrder: string
  albumArtists: string[]
  genres: string[]
  year: string | null
  coverUrl: string
  metadataUrl: string
  rawUrl: string
  extraData?: AlbumExtraData
}

export interface AlbumTrackItem {
  title: string
  artists: string[]
  discNumber: string
  trackNumber: string
  genres: string[]
  composers: string[]
  comments: string | null
  lyricLanguage: string | null
  lyricists: string[]
}

export interface AlbumDetail extends AlbumItem {
  tracks: AlbumTrackItem[]
}
