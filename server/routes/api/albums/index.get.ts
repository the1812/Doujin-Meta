import { defineHandler } from 'nitro'
import { getValidatedQuery } from 'nitro/h3'
import * as v from 'valibot'

import { useAlbumCatalog } from '../../../catalog-instance.js'

const integerParam = v.pipe(v.string(), v.regex(/^\d+$/u), v.transform(Number), v.integer())

const albumQuerySchema = v.strictObject({
  q: v.optional(v.string()),
  album: v.optional(v.string()),
  albumArtist: v.optional(v.string()),
  artist: v.optional(v.string()),
  limit: v.optional(v.pipe(integerParam, v.minValue(1), v.maxValue(100)), '20'),
  offset: v.optional(v.pipe(integerParam, v.minValue(0), v.maxValue(Number.MAX_SAFE_INTEGER)), '0'),
})

export default defineHandler(async event => {
  const query = await getValidatedQuery(event, albumQuerySchema)

  return useAlbumCatalog().search({
    query: query.q,
    album: query.album,
    albumArtist: query.albumArtist,
    artist: query.artist,
    limit: query.limit,
    offset: query.offset,
  })
})
