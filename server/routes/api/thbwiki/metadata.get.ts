import { defineHandler } from 'nitro'
import { getValidatedQuery } from 'nitro/h3'
import * as v from 'valibot'

import { formatThbWikiMetadata, getThbWikiMetadata } from '../../../thbwiki.js'

const querySchema = v.strictObject({
  album: v.pipe(v.string(), v.nonEmpty()),
  simplify: v.optional(v.pipe(v.string(), v.parseBoolean({ truthy: ['1'], falsy: ['0'] })), '1'),
})

export default defineHandler(async event => {
  const { album, simplify } = await getValidatedQuery(event, querySchema)
  const metadata = await getThbWikiMetadata(album, { downloadCover: false })
  return formatThbWikiMetadata(metadata, simplify)
})
