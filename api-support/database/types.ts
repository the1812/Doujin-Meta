import { Generated, JSONColumnType } from 'kysely'

export interface AlbumTable {
  id: Generated<bigint>
  name: string
  order: string
  genres: string[]
  year: string | null
  cover_url: string | null
  extra_data: JSONColumnType<Record<string, unknown>> | null
}

export interface TrackTable {
  id: Generated<bigint>
  album: bigint
  title: string
  disc_number: string
  track_number: string
  genres: string[]
  comments: string | null
  lyric_language: string | null
  lyric: string | null
}

export interface ArtistTable {
  id: Generated<bigint>
  name: string
  alias_of: bigint | null
}

export interface CircleTable {
  id: Generated<bigint>
  name: string
}

export interface AlbumCircleTable {
  album: bigint
  circle: bigint
}

export enum TrackArtistType {
  Artist = 'artist',
  Composer = 'composer',
  Lyricist = 'lyricist',
}

export interface TrackArtistTable {
  track: bigint
  artist: bigint
  artist_type: `${TrackArtistType}`
}

export interface Database {
  album: AlbumTable
  circle: CircleTable
  album_circle: AlbumCircleTable
  track: TrackTable
  artist: ArtistTable
  track_artist: TrackArtistTable
}
