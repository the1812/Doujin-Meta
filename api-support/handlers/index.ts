import type { VercelRequest, VercelResponse } from '@vercel/node'
import { useLocalApiHandler } from '../index.js'
import { LocalApiHandler } from './local.js'
import { GitHubApiHandler } from './github.js'

export const getApiHandler = (request: VercelRequest, response: VercelResponse) => {
  if (useLocalApiHandler) {
    return new LocalApiHandler(request, response)
  }
  return new GitHubApiHandler(request, response)
}
