import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getApiHandler } from '../../../api-support/handlers/index.js'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const { keyword } = request.query
  if (!keyword) {
    response.status(400).json({
      message: 'keyword is required',
    })
    return
  }
  if (Array.isArray(keyword)) {
    response.status(400).json({
      message: 'invalid keyword',
    })
    return
  }
  try {
    await getApiHandler(request, response).searchAlbums()
  } catch (error) {
    console.error(error)
    response.status(500).end()
  }
}
