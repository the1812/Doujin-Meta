import { RawBuilder, sql } from 'kysely'
import { db } from '../../api-support/database/db.js'
import { TrackArtistType } from '../../api-support/database/types.js'
import { checkMutationAllowed } from '../../api-support/database/checks.js'
import { generateMetadataUrls } from '../../api-support/helpers.js'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const id = url.pathname.match(/albums\/(.+)$/)?.[1]
  if (id === undefined) {
    return new Response(null, { status: 400 })
  }

  const result = await db
    .selectFrom('album')
    .where('album.id', '=', BigInt(id))
    .groupBy('album.id')
    .innerJoin('album_circle', 'album.id', 'album_circle.album')
    .innerJoin('circle', 'album_circle.circle', 'circle.id')
    .selectAll('album')
    .select(eb => eb.fn.agg<string[]>('array_agg', ['circle.name']).as('albumArtists'))
    .executeTakeFirst()

  if (result === undefined) {
    return new Response(null, { status: 404 })
  }

  const tracks = await db
    .selectFrom('track')
    .where('track.album', '=', BigInt(id))
    .groupBy('track.id')
    .innerJoin('track_artist', 'track.id', 'track_artist.track')
    .innerJoin('artist', 'track_artist.artist', 'artist.id')
    .selectAll('track')
    .select(({ eb }) => [
      eb.fn
        .jsonAgg<
          RawBuilder<{ name: string; artistType: TrackArtistType }>
        >(sql`jsonb_build_object('name', artist.name, 'artistType', track_artist.artist_type)`)
        .as('artists'),
    ])
    .orderBy(sql`track.track_number::INTEGER`)
    .execute()

  return Response.json({
    id: result.id,
    album: result.name,
    albumOrder: result.order,
    albumArtists: result.albumArtists,
    genres: result.genres,
    year: result.year,
    extraData: result.extra_data,
    ...generateMetadataUrls(result),
    tracks: tracks.map(track => {
      return {
        title: track.title,
        artists: track.artists
          .filter(it => it.artistType === TrackArtistType.Artist)
          .map(it => it.name),
        discNumber: track.disc_number,
        trackNumber: track.track_number,
        composers: track.artists
          .filter(it => it.artistType === TrackArtistType.Composer)
          .map(it => it.name),
        genres: track.genres,
        comments: track.comments,
        lyricLanguage: track.lyric_language,
        lyricists: track.artists
          .filter(it => it.artistType === TrackArtistType.Lyricist)
          .map(it => it.name),
      }
    }),
  })
}

export async function DELETE(request: Request) {
  if (!checkMutationAllowed()) {
    return new Response(null, { status: 404 })
  }

  const url = new URL(request.url)
  const id = url.pathname.match(/albums\/(.+)$/)?.[1]
  if (id === undefined) {
    return new Response(null, { status: 400 })
  }

  const result = await db.deleteFrom('album').where('album.id', '=', BigInt(id)).executeTakeFirst()
  if (result.numDeletedRows === 0n) {
    return new Response(null, { status: 404 })
  }
  return new Response(null, { status: 200 })
}
