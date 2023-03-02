import type { Metadata } from 'touhou-tagger'

export interface AlbumApiItem {
  id: string
  name: string
  coverUrl: string
  detailUrl: string
  matches: [number, number][]
}
export interface AlbumDetail {
  id: string
  name: string
  coverUrl: string
  metadata: Metadata[]
}
