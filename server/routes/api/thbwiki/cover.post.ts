import { defineHandler } from 'nitro'

import { getThbWikiMetadataFromHtml } from '../../../thbwiki.js'

export default defineHandler(async event => {
  const html = await event.req.text()
  if (!html.trim()) {
    event.res.status = 400
    return { message: 'THBWiki HTML body is required' }
  }
  const metadata = await getThbWikiMetadataFromHtml(html, { downloadCover: true })
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
