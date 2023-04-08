import type { VercelRequest, VercelResponse } from '@vercel/node'
import Fuse from 'fuse.js'
import {
  githubApi,
  TreeResponse,
  inheritHeaders,
  findCover,
  getDataFolder,
} from '../../../api-support/index.js'

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
    const dataUrl = await getDataFolder()
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
      includeMatches: true,
    })
    const result = fuse.search(keyword)
    response.status(200).json(
      result.map(({ item, matches }) => {
        const cover = findCover(
          blobNodes.filter(it => it.path.startsWith(`${item.path}/`)),
          it => it.path,
        )
        return {
          id: item.sha,
          name: item.path,
          coverUrl: `/data/${encodeURIComponent(item.path)}/${cover}`,
          detailUrl: `/api/albums/detail/${encodeURIComponent(item.path)}`,
          matches: matches?.flatMap(it => it.indices),
        }
      }),
    )
  } catch (error) {
    console.error(error)
    response.status(500).end()
  }
}
