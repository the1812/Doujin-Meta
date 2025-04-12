import { sql } from 'kysely'
import { db } from '../../api-support/database/db.js'
import { generateMetadataUrls } from '../../api-support/helpers.js'

export async function GET(request: Request) {
  const urlParams = new URL(request.url).searchParams
  const keyword = urlParams.get('keyword')
  if (keyword === null) {
    return new Response(null, { status: 400 })
  }

  const results = await db
    .selectFrom('album')
    .where(eb =>
      eb.or([sql<boolean>`album.name % ${keyword}`, eb('album.name', 'ilike', `%${keyword}%`)]),
    )
    .limit(20)
    .innerJoin('album_circle', 'album.id', 'album_circle.album')
    .innerJoin('circle', 'album_circle.circle', 'circle.id')
    .groupBy('album.id')
    .selectAll('album')
    .select(eb => eb.fn.agg<string[]>('array_agg', ['circle.name']).as('album_artists'))
    .execute()

  return Response.json(
    results.map(result => {
      return {
        id: result.id,
        album: result.name,
        albumOrder: result.order,
        albumArtists: result.album_artists,
        genres: result.genres,
        year: result.year,
        ...generateMetadataUrls(result),
        extraData: result.extra_data,
      }
    }),
  )
}
