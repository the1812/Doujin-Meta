import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getApiHandler } from '../../../api-support/handlers/index.js'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const { name } = request.query
  if (!name) {
    response.status(400).json({
      message: 'name is required',
    })
    return
  }
  try {
    await getApiHandler(request, response).getAlbumDetail()
  } catch (error) {
    console.error(error)
    response.status(500).end()
  }
}
