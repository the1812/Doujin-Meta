import { defineHandler } from 'nitro'

export default defineHandler(event => {
  if (event.req.method === 'OPTIONS') {
    event.res.status = 204
    return null
  }
  event.res.status = 404
  return { message: 'Not found' }
})
