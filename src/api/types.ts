export interface AlbumApiItem {
  id: string
  name: string
}
export interface AlbumSearchResult extends AlbumApiItem {
  coverUrl: string
  metadataUrl: string
}
