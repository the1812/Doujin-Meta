import { defineHandler } from 'nitro'
import { getValidatedRouterParams } from 'nitro/h3'
import * as v from 'valibot'

import { useAlbumCatalog } from '../../../catalog-instance.js'

const albumParamsSchema = v.strictObject({
  id: v.pipe(v.string(), v.nonEmpty()),
})

export default defineHandler(async event => {
  const { id } = await getValidatedRouterParams(event, albumParamsSchema, { decode: true })
  const album = useAlbumCatalog().get(id)
  if (album === undefined) {
    event.res.status = 404
    return { message: 'Album not found' }
  }
  return album
})
