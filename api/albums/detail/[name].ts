import type { VercelRequest, VercelResponse } from '@vercel/node'
import { localJson } from 'touhou-tagger'
import {
  owner,
  repo,
  githubApi,
  inheritHeaders,
  githubHost,
  BlobResponse,
  findCover,
  branch,
  ContentsNode,
} from '../../../api-support/index.js'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const { name, normalize } = request.query
  if (!name) {
    response.status(400).json({
      message: 'name is required',
    })
    return
  }
  try {
    const encodedName = encodeURIComponent(name as string)
    const contentsApi = `${githubHost}/repos/${owner}/${repo}/contents/public/data/${encodedName}?ref=${branch}`
    const contentsResponse = await githubApi.get<ContentsNode[]>(contentsApi)
    inheritHeaders(contentsResponse, response)
    if (contentsResponse.status !== 200) {
      response.status(contentsResponse.status).end()
      return
    }
    const nodes = contentsResponse.data
    const metadataNode = nodes.find(it => it.name === 'metadata.json')
    if (!metadataNode) {
      response.status(404).json({
        message: 'metadata.json not found',
      })
      return
    }
    const { data: metadataTree } = await githubApi.get<BlobResponse>(metadataNode.git_url)
    const metadataJson = JSON.parse(Buffer.from(metadataTree.content, 'base64').toString('utf8'))
    const result = {
      name,
      coverUrl: `/data/${encodedName}/${findCover(nodes, it => it.name)}`,
      metadataUrl: `https://github.com/${owner}/${repo}/blob/${branch}/public/data/${encodedName}/metadata.json`,
      rawUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/public/data/${encodedName}/metadata.json`,
      metadata:
        normalize === 'false' ? metadataJson : await localJson.normalizeWithoutCover(metadataJson),
    }
    response.status(200).json(result)
  } catch (error) {
    console.error(error)
    response.status(500).end()
  }
}
