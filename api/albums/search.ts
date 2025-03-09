import { db } from '../../api-support/database/db.js'

export async function GET(request: Request) {
  const urlParams = new URL(request.url).searchParams
  const keyword = urlParams.get('keyword')
  if (keyword === null) {
    return new Response(null, { status: 400 })
  }

  const results = await db
    .selectFrom('album')
    .where('album.name', 'ilike', `%${keyword}%`)
    .limit(20)
    .innerJoin('album_circle', 'album.id', 'album_circle.album')
    .innerJoin('circle', 'album_circle.circle', 'circle.id')
    .groupBy('album.id')
    .selectAll('album')
    .select(eb => eb.fn.agg<string[]>('array_agg', ['circle.name']).as('albumArtists'))
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
        coverUrl: result.cover_url,
        extraData: result.extra_data,
      }
    }),
  )
}
