import type { Metadata } from 'touhou-tagger'

export interface GitTreeNode {
  path: string
  mode: string
  type: string
  sha: string
  url: string
}
export interface TreeResponse {
  sha: string
  url: string
  tree: GitTreeNode[]
}
export interface ContentsNode {
  name: string
  path: string
  sha: string
  size: number
  url: string
  // eslint-disable-next-line @typescript-eslint/naming-convention
  html_url: string
  // eslint-disable-next-line @typescript-eslint/naming-convention
  git_url: string
  // eslint-disable-next-line @typescript-eslint/naming-convention
  download_url: string
  type: string
}
export type ContentsResponse = ContentsNode[]
export interface BlobResponse {
  sha: string
  url: string
  size: number
  content: string
  encoding: string
}
export interface AlbumApiItem {
  id: string
  name: string
  coverUrl: string
  detailUrl: string
  matches: [number, number][]
}
export interface AlbumDetail {
  name: string
  coverUrl: string
  metadataUrl: string
  rawUrl: string
  metadata: Metadata[]
}
