import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  owner,
  repo,
  githubApi,
  ContentsResponse,
  TreeResponse,
  inheritHeaders,
  githubHost,
} from '../index.js'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    const publicTreeApi = `${githubHost}/repos/${owner}/${repo}/contents/public`
    const { data: publicContents } = await githubApi.get<ContentsResponse>(publicTreeApi)
    const dataUrl = publicContents.find(it => it.name === 'data')?.git_url
    if (!dataUrl) {
      throw new Error('获取 public/data 文件夹失败')
    }
    const githubResponse = await githubApi.get<TreeResponse>(dataUrl)
    inheritHeaders(githubResponse, response)
      .status(200)
      .json(
        githubResponse.data.tree.map(item => {
          return {
            name: item.path,
            id: item.sha,
          }
        }),
      )
  } catch (error) {
    response.status(500).end()
  }
}
