import type { VercelRequest, VercelResponse } from '@vercel/node'
import Axios from 'axios'

export const owner = 'the1812'
export const repo = 'Doujin-Meta'
export const githubApi = Axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
    'X-GitHub-Api-Version': '2022-11-28',
  },
  responseType: 'json',
})

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
  html_url: string
  git_url: string
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

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  response.status(404).json({
    message: 'Not Found'
  });
}