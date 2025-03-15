import { AlbumTable } from './database/types.js'
import childProcess from 'child_process'

export const generateMetadataUrls = (
  albumDetail: Pick<AlbumTable, 'cover_filename' | 'static_path'>,
) => {
  const githubOwner = process.env.GITHUB_OWNER
  const githubRepo = process.env.GITHUB_REPO
  const gitBranch = (() => {
    if (process.env.VERCEL_GIT_COMMIT_REF) {
      return process.env.VERCEL_GIT_COMMIT_REF
    }
    return childProcess.execSync('git branch --show').toString().trim() || 'main'
  })()

  if (!githubOwner || !githubRepo) {
    throw new Error('github info not found')
  }

  return {
    coverUrl: `${albumDetail.static_path}/${albumDetail.cover_filename}`,
    metadataUrl: `https://github.com/${githubOwner}/${githubRepo}/blob/${gitBranch}/public${albumDetail.static_path}/metadata.json`,
    rawUrl: `https://raw.githubusercontent.com/${githubOwner}/${githubRepo}/refs/heads/${gitBranch}/public${albumDetail.static_path}/metadata.json`,
  }
}
