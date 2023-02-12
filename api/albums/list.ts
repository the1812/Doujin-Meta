import type { VercelRequest, VercelResponse } from '@vercel/node'
import { owner, repo, githubApi, ContentsResponse, TreeResponse } from '../index'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    const publicTreeApi = `/repos/${owner}/${repo}/contents/public`
    const { data: publicContents } = await githubApi.get<ContentsResponse>(publicTreeApi)
    const dataUrl = publicContents.find(it => it.name === 'data')?.git_url
    if (!dataUrl) {
      throw new Error('获取 public/data 文件夹失败')
    }
    const { data: dataTree } = await githubApi.get<TreeResponse>(dataUrl, { baseURL: '' })
    response.status(200).json(dataTree.tree)
  } catch (error) {
    response.status(500).json({
      message: 'GitHub API failed',
    })
  }
}
