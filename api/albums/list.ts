import { db } from '../../api-support/database/db.js'
import { isLocal } from '../../api-support/database/checks.js'
import { generateMetadataUrls } from '../../api-support/helpers.js'

export async function GET() {
  if (!isLocal()) {
    return new Response(null, { status: 404 })
  }

  const results = await db
    .selectFrom('album')
    .innerJoin('album_circle', 'album.id', 'album_circle.album')
    .innerJoin('circle', 'album_circle.circle', 'circle.id')
    .groupBy('album.id')
    .selectAll('album')
    .select(eb => eb.fn.agg<string[]>('array_agg', ['circle.name']).as('albumArtists'))
    .orderBy('id')
    .execute()

  return Response.json(
    results.map(result => {
      return {
        id: result.id,
        album: result.name,
        albumOrder: result.order,
        albumArtists: result.albumArtists,
        genres: result.genres,
        year: result.year,
        ...generateMetadataUrls(result),
        extraData: result.extra_data,
      }
    }),
  )
}
