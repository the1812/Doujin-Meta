import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  owner,
  repo,
  githubApi,
  ContentsResponse,
  TreeResponse,
  inheritHeaders,
  githubHost,
} from '../../api-support/index.js'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    const publicTreeApi = `${githubHost}/repos/${owner}/${repo}/contents/public`
    const { data: publicContents } = await githubApi.get<ContentsResponse>(publicTreeApi)
    const dataUrl = publicContents.find(it => it.name === 'data')?.git_url
    if (!dataUrl) {
      response.status(404).json({
        message: 'public/data not found'
      })
    }
    const githubResponse = await githubApi.get<TreeResponse>(dataUrl)
    if (githubResponse.status !== 200) {
      response.status(githubResponse.status).end()
      return
    }
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
