import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getApiHandler } from '../../api-support/handlers/index.js'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    await getApiHandler(request, response).listAlbums()
  } catch (error) {
    console.error(error)
    response.status(500).end()
  }
}
