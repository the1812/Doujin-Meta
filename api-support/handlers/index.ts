import type { VercelRequest, VercelResponse } from '@vercel/node'
import { isDevelopment } from '../index.js'
import { LocalApiHandler } from './local.js'
import { GitHubApiHandler } from './github.js'

export const getApiHandler = (request: VercelRequest, response: VercelResponse) => {
  if (isDevelopment) {
    return new LocalApiHandler(request, response)
  }
  return new GitHubApiHandler(request, response)
}
