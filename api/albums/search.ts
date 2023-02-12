import type { VercelRequest, VercelResponse } from '@vercel/node'
import Fuse from 'fuse.js'
import {
  owner,
  repo,
  githubApi,
  ContentsResponse,
  TreeResponse,
  inheritHeaders,
  githubHost,
  findCover,
} from '../index.js'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const { keyword } = request.query
  if (!keyword) {
    response.status(400).json({
      message: 'keyword is required',
    })
    return
  }
  if (Array.isArray(keyword)) {
    response.status(400).json({
      message: 'invalid keyword',
    })
    return
  }
  try {
    const publicTreeApi = `${githubHost}/repos/${owner}/${repo}/contents/public`
    const { data: publicContents } = await githubApi.get<ContentsResponse>(publicTreeApi)
    const dataUrl = publicContents.find(it => it.name === 'data')?.git_url
    if (!dataUrl) {
      response.status(404).json({
        message: 'public/data not found',
      })
    }
    const githubResponse = await githubApi.get<TreeResponse>(`${dataUrl}?recursive=true`)
    if (githubResponse.status !== 200) {
      response.status(githubResponse.status).end()
      return
    }
    inheritHeaders(githubResponse, response)
    const treeNodes = githubResponse.data.tree.filter(it => it.type === 'tree')
    const blobNodes = githubResponse.data.tree.filter(it => it.type === 'blob')
    const fuse = new Fuse(treeNodes, {
      keys: ['path'],
      threshold: 0.4,
    })
    const result = fuse.search(keyword)
    response.status(200).json(
      result.map(({ item }) => {
        const cover = findCover(blobNodes.filter(it => it.path.startsWith(item.path)))
        return {
          name: item.path,
          coverUrl: `/data/${cover}`,
          detailUrl: `/api/albums/detail/${item.sha}`,
          id: item.sha,
        }
      }),
    )
  } catch (error) {
    response.status(500).end()
  }
}
