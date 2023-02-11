import { owner, repo, githubApi } from '.'
import { TreeResponse } from './types'

export const getAlbums = async () => {
  const mainTreeApi = `https://api.github.com/repos/${owner}/${repo}/git/trees/main`
  const { data: mainTree } = await githubApi.get<TreeResponse>(mainTreeApi)
  const publicFolder = mainTree.tree.find(it => it.path === 'public')
  const { data: dataFolder } = await githubApi.get<TreeResponse>(publicFolder.url)

  const { data: dataTree } = await githubApi.get<TreeResponse>(dataFolder.url)
  return dataTree.tree.map(node => {
    return {

    }
  })
}

// export class DoujinMeta extends MetadataSource {
//   private dataTree: Promise<TreeResponse>
//   private fuse: Promise<Fuse<GitTreeNode>>

//   private async getDataTree() {
//     const mainTreeApi = `https://api.github.com/repos/${owner}/${repo}/git/trees/main`
//     const { data: mainTree } = await githubApi.get<TreeResponse>(mainTreeApi)
//     const dataFolder = mainTree.tree.find(it => it.path === 'data')
//     if (!dataFolder) {
//       throw new Error('获取 data 文件夹失败')
//     }
//     const { data: dataTree } = await githubApi.get<TreeResponse>(dataFolder.url)
//     return dataTree
//   }

//   private init() {
//     this.dataTree = this.getDataTree()
//     this.fuse = this.dataTree.then(({ tree }) => new Fuse(tree, {
//       keys: ['path'],
//       threshold: 0.4,
//     }))
//   }

//   private checkInitStatus() {
//     if (!this.dataTree) {
//       this.init()
//     }
//   }

//   private async findCover(nodes: GitTreeNode[]) {
//     const allowedExtensions = ['.jpg', '.png']
//     const result = nodes.find(it => allowedExtensions.some(extension => it.path === `cover${extension}`))
//     if (!result) {
//       return undefined
//     }
//     const { data: coverData } = await githubApi.get<BlobResponse>(result.url)
//     return Buffer.from(coverData.content, 'base64')
//   }

//   async resolveAlbumName(albumName: string): Promise<string | string[]> {
//     this.checkInitStatus()
//     const fuse = await this.fuse
//     const result = fuse.search(albumName)
//     if (result.length === 1) {
//       return result[0].item.path
//     }
//     return result.map(it => it.item.path).slice(0, 20)
//   }

//   async getMetadata(albumName: string, cover?: Buffer): Promise<Metadata[]> {
//     this.checkInitStatus()
//     const { tree } = await this.dataTree
//     const node = tree.find(it => it.path === albumName)
//     if (!node) {
//       throw new Error(`data 目录中不存在 "${albumName}"`)
//     }
//     const { data: albumDetailTree } = await githubApi.get<TreeResponse>(node.url)
//     const coverBuffer = cover ?? await this.findCover(albumDetailTree.tree)
//     const metadataNode = albumDetailTree.tree.find(it => it.path === 'metadata.json')
//     if (!metadataNode) {
//       throw new Error(`${albumName} 元数据缺失`)
//     }
//     const { data: metadataTree } = await githubApi.get<BlobResponse>(metadataNode.url)
//     const metadataJson: Metadata[] = JSON.parse(Buffer.from(metadataTree.content, 'base64').toString('utf8'))
//     return localJson.normalize(metadataJson, coverBuffer)
//   }
// }
// export const doujinMeta = new DoujinMeta()
