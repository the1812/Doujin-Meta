import { localJson } from 'touhou-tagger'
import Axios, { AxiosResponse } from 'axios'
import Fuse from 'fuse.js'
import { ApiHandler } from './base.js'
import { findCover } from '../index.js'
import { BlobResponse, ContentsNode, ContentsResponse, TreeResponse } from '../types'

export class GitHubApiHandler extends ApiHandler {
  private githubHost = 'https://api.github.com'
  private githubApi = Axios.create({
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
    responseType: 'json',
  })

  private async getDataFolder() {
    const ref = this.branch
    console.log('current ref:', ref)
    const publicTreeApi = `${this.githubHost}/repos/${this.owner}/${this.repo}/contents/public?ref=${ref}`
    const { data: publicContents } = await this.githubApi.get<ContentsResponse>(publicTreeApi)
    const dataUrl = publicContents.find(it => it.name === 'data')?.git_url
    return dataUrl
  }
  private inheritHeaders(githubResponse: AxiosResponse) {
    Object.entries(githubResponse.headers).forEach(([key, value]) => {
      if (key.toLowerCase().startsWith('x-') && !this.response.hasHeader(key)) {
        this.response.setHeader(key, value)
      }
    })
  }

  async getAlbumDetail() {
    const { name, normalize } = this.request.query
    const encodedName = encodeURIComponent(name as string)
    const contentsApi = `${this.githubHost}/repos/${this.owner}/${this.repo}/contents/public/data/${encodedName}?ref=${this.branch}`
    const contentsResponse = await this.githubApi.get<ContentsNode[]>(contentsApi)
    this.inheritHeaders(contentsResponse)
    if (contentsResponse.status !== 200) {
      this.response.status(contentsResponse.status).end()
      return
    }
    const nodes = contentsResponse.data
    const metadataNode = nodes.find(it => it.name === 'metadata.json')
    if (!metadataNode) {
      this.response.status(404).json({
        message: 'metadata.json not found',
      })
      return
    }
    const { data: metadataTree } = await this.githubApi.get<BlobResponse>(metadataNode.git_url)
    const metadataJson = JSON.parse(Buffer.from(metadataTree.content, 'base64').toString('utf8'))
    const result = {
      name,
      coverUrl: `/data/${encodeURI(name as string)}/${findCover(nodes, it => it.name)}`,
      metadataUrl: `https://github.com/${this.owner}/${this.repo}/blob/${this.branch}/public/data/${encodedName}/metadata.json`,
      rawUrl: `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/public/data/${encodedName}/metadata.json`,
      metadata:
        normalize === 'false' ? metadataJson : await localJson.normalizeWithoutCover(metadataJson),
    }
    this.response.status(200).json(result)
  }
  async listAlbums() {
    const dataUrl = await this.getDataFolder()
    if (!dataUrl) {
      this.response.status(404).json({
        message: 'public/data not found',
      })
      return
    }
    const githubResponse = await this.githubApi.get<TreeResponse>(dataUrl)
    if (githubResponse.status !== 200) {
      this.response.status(githubResponse.status).end()
      return
    }
    this.inheritHeaders(githubResponse)
    this.response.status(200).json(
      githubResponse.data.tree.map(item => {
        return {
          name: item.path,
          id: item.sha,
        }
      }),
    )
  }
  async searchAlbums() {
    const { keyword } = this.request.query
    const dataUrl = await this.getDataFolder()
    if (!dataUrl) {
      this.response.status(404).json({
        message: 'public/data not found',
      })
      return
    }
    const githubResponse = await this.githubApi.get<TreeResponse>(`${dataUrl}?recursive=true`)
    if (githubResponse.status !== 200) {
      this.response.status(githubResponse.status).end()
      return
    }
    this.inheritHeaders(githubResponse)
    const treeNodes = githubResponse.data.tree.filter(it => it.type === 'tree')
    const blobNodes = githubResponse.data.tree.filter(it => it.type === 'blob')
    const fuse = new Fuse(treeNodes, {
      keys: ['path'],
      threshold: 0.4,
      includeMatches: true,
    })
    const result = fuse.search(keyword as string)
    this.response.status(200).json(
      result.map(({ item, matches }) => {
        const cover = findCover(
          blobNodes.filter(it => it.path.startsWith(`${item.path}/`)),
          it => it.path,
        )
        return {
          id: item.sha,
          name: item.path,
          coverUrl: `/data/${encodeURI(item.path)}/${cover}`,
          detailUrl: `/api/albums/detail/${encodeURIComponent(item.path)}`,
          matches: matches?.flatMap(it => it.indices),
        }
      }),
    )
  }
}
