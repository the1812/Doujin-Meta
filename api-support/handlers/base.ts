import type { VercelRequest, VercelResponse } from '@vercel/node'
import childProcess from 'child_process'

export abstract class ApiHandler {
  protected owner = 'the1812'
  protected repo = 'Doujin-Meta'
  protected branch = (() => {
    if (process.env.VERCEL_GIT_COMMIT_REF) {
      return process.env.VERCEL_GIT_COMMIT_REF
    }
    return childProcess.execSync('git branch --show').toString().trim() || 'main'
  })()

  constructor(
    protected request: VercelRequest,
    protected response: VercelResponse,
  ) {}
  abstract getAlbumDetail(): Promise<void>
  abstract listAlbums(): Promise<void>
  abstract searchAlbums(): Promise<void>
}
