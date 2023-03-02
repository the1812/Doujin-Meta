import type { VercelRequest, VercelResponse } from '@vercel/node'
import { localJson } from 'touhou-tagger'
import {
  owner,
  repo,
  githubApi,
  TreeResponse,
  inheritHeaders,
  githubHost,
  BlobResponse,
  findCover,
} from '../../../../api-support/index.js'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const { name, id, normalize } = request.query
  if (!name) {
    response.status(400).json({
      message: 'name is required',
    })
    return
  }
  if (!id) {
    response.status(400).json({
      message: 'id is required',
    })
    return
  }
  try {
    const treeApi = `${githubHost}/repos/${owner}/${repo}/git/trees/${id}`
    const treeResponse = await githubApi.get<TreeResponse>(treeApi)
    inheritHeaders(treeResponse, response)
    if (treeResponse.status !== 200) {
      response.status(treeResponse.status).end()
      return
    }
    const nodes = treeResponse.data.tree
    const metadataNode = nodes.find(it => it.path === 'metadata.json')
    if (!metadataNode) {
      response.status(404).json({
        message: 'metadata.json not found',
      })
      return
    }
    const { data: metadataTree } = await githubApi.get<BlobResponse>(metadataNode.url)
    const metadataJson = JSON.parse(Buffer.from(metadataTree.content, 'base64').toString('utf8'))
    const result = {
      id,
      name,
      coverUrl: `/data/${name}/${findCover(nodes)}`,
      metadata:
        normalize === 'false' ? metadataJson : await localJson.normalizeWithoutCover(metadataJson),
    }
    response.status(200).json(result)
  } catch (error) {
    response.status(500).end()
  }
}
