import type { VercelRequest, VercelResponse } from '@vercel/node'
import { githubApi, TreeResponse, inheritHeaders, getDataFolder } from '../../api-support/index.js'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    const dataUrl = await getDataFolder()
    if (!dataUrl) {
      response.status(404).json({
        message: 'public/data not found',
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
