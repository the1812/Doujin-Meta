import { defineHandler } from 'nitro'

export default defineHandler(event => {
  event.res.status = 404
  return { message: 'Not found' }
})
