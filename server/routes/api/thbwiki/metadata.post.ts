import { defineHandler } from 'nitro'

import { getThbWikiMetadataFromHtml, withoutCover } from '../../../thbwiki.js'

export default defineHandler(async event => {
  const html = await event.req.text()
  if (!html.trim()) {
    event.res.status = 400
    return { message: 'THBWiki HTML body is required' }
  }
  const metadata = await getThbWikiMetadataFromHtml(html, { downloadCover: false })
  return metadata.map(withoutCover)
})
