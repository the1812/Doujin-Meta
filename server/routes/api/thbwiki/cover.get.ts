import { defineHandler } from 'nitro'
import { getValidatedQuery } from 'nitro/h3'
import * as v from 'valibot'

import { getThbWikiMetadata } from '../../../thbwiki.js'

const querySchema = v.strictObject({
  album: v.pipe(v.string(), v.nonEmpty()),
})

export default defineHandler(async event => {
  const { album } = await getValidatedQuery(event, querySchema)
  const metadata = await getThbWikiMetadata(album, { downloadCover: true })
  const cover = metadata.find(({ coverImage }) => coverImage)?.coverImage
  if (!cover) {
    event.res.status = 404
    return { message: 'THBWiki album cover not found' }
  }
  const { default: imageType } = await import('image-type')
  const type = imageType(cover)
  if (type === null) {
    event.res.status = 415
    return { message: 'Unsupported THBWiki album cover format' }
  }
  event.res.headers.set('content-type', type.mime)
  return cover
})
