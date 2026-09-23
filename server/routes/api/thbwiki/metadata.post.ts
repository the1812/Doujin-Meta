import { defineHandler } from 'nitro'
import { getValidatedQuery } from 'nitro/h3'
import * as v from 'valibot'

import { formatThbWikiMetadata, getThbWikiMetadataFromHtml } from '../../../thbwiki.js'

const querySchema = v.strictObject({
  simplify: v.optional(v.pipe(v.string(), v.parseBoolean({ truthy: ['1'], falsy: ['0'] })), '1'),
})

export default defineHandler(async event => {
  const { simplify } = await getValidatedQuery(event, querySchema)
  const html = await event.req.text()
  if (!html.trim()) {
    event.res.status = 400
    return { message: 'THBWiki HTML body is required' }
  }
  const metadata = await getThbWikiMetadataFromHtml(html, { downloadCover: false })
  return formatThbWikiMetadata(metadata, simplify)
})
