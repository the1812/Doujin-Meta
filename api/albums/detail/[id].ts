import type { VercelRequest, VercelResponse } from '@vercel/node'
import { localJson } from 'touhou-tagger'
import {
  owner,
  repo,
  githubApi,
  TreeResponse,
  inheritHeaders,
  githubHost,
  GitTreeNode,
  BlobResponse,
} from '../../index.js'

const findCover = async (nodes: GitTreeNode[]) => {
  const allowedExtensions = ['.jpg', '.png']
  const result = nodes.find(it =>
    allowedExtensions.some(extension => it.path === `cover${extension}`),
  )
  if (!result) {
    return ''
  }
  const { data: coverData } = await githubApi.get<BlobResponse>(result.url)
  return coverData.content
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const { id, cover } = request.query
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
      cover: cover === 'true' ? await findCover(nodes) : '',
      metadata: await localJson.normalizeWithoutCover(metadataJson),
    }
    response.status(200).json(result)
  } catch (error) {
    response.status(500).end()
  }
}
