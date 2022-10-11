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
export interface BlobResponse {
  sha: string
  url: string
  size: number
  content: string
  encoding: string
}
