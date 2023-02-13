import type { Metadata } from 'touhou-tagger'

export interface AlbumApiItem {
  id: string
  coverUrl: string
  name: string
  detailUrl: string
}
export interface AlbumDetail {
  id: string
  name: string
  coverUrl: string
  metadata: Metadata[]
}
