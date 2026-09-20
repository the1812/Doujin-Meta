import { defineHandler } from 'nitro'
import { getValidatedQuery } from 'nitro/h3'
import * as v from 'valibot'

import { getThbWikiMetadata, withoutCover } from '../../../thbwiki.js'

const querySchema = v.strictObject({
  album: v.pipe(v.string(), v.nonEmpty()),
})

export default defineHandler(async event => {
  const { album } = await getValidatedQuery(event, querySchema)
  const metadata = await getThbWikiMetadata(album, { downloadCover: false })
  return metadata.map(withoutCover)
})
