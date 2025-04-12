import { db } from '../../api-support/database/db.js'
import { isLocal } from '../../api-support/database/checks.js'
import { Metadata, localJson } from 'touhou-tagger'
import { TrackArtistType } from '../../api-support/database/types.js'

const getAlbumData = (metadata: Metadata, staticPath: string, coverFilename: string) => {
  return {
    name: metadata.album,
    order: metadata.albumOrder,
    static_path: staticPath,
    cover_filename: coverFilename,
    year: metadata.year,
    genres: metadata.genres ?? [],
    extra_data: metadata.extraData === undefined ? undefined : JSON.stringify(metadata.extraData),
  }
}
const getTrackData = (metadata: Metadata, albumId: bigint) => {
  return {
    album: albumId,
    title: metadata.title,
    track_number: metadata.trackNumber,
    disc_number: metadata.discNumber,
    genres: metadata.genres ?? [],
    comments: metadata.comments,
    lyric: metadata.lyric,
    lyric_language: metadata.lyricLanguage,
  }
}

export async function POST(request: Request) {
  if (!isLocal()) {
    return new Response(null, { status: 404 })
  }
  const payload = (await request.json()) as {
    readonly id?: bigint
    readonly metadata: Metadata[]
    readonly coverFilename: string
    readonly staticPath: string
  }
  const rows = await localJson.normalizeWithoutCover(payload.metadata)
  const firstRow = rows.at(0)
  if (firstRow === undefined) {
    return new Response(null, { status: 400 })
  }

  const isUpdateMode = payload.id !== undefined

  const result = await db.transaction().execute(async transaction => {
    const albumData = getAlbumData(firstRow, payload.staticPath, payload.coverFilename)
    const album = await (() => {
      if (isUpdateMode) {
        return transaction
          .updateTable('album')
          .set(albumData)
          .where('id', '=', payload.id)
          .returning('id')
          .executeTakeFirstOrThrow()
      }
      return transaction
        .insertInto('album')
        .values(albumData)
        .returning('id')
        .executeTakeFirstOrThrow()
    })()

    const albumArtists = firstRow.albumArtists ?? []
    const circles = await transaction
      .insertInto('circle')
      .values(
        albumArtists.map(circle => {
          return {
            name: circle,
          }
        }),
      )
      .onConflict(oc => oc.column('name').doUpdateSet({ name: eb => eb.ref('excluded.name') }))
      .returning('id')
      .execute()

    await transaction
      .insertInto('album_circle')
      .values(
        circles.map(circle => {
          return {
            album: album.id,
            circle: circle.id,
          }
        }),
      )
      .onConflict(oc => oc.columns(['album', 'circle']).doNothing())
      .execute()

    const artistsData = [
      ...new Set(
        rows.flatMap(track =>
          track.artists.concat(track.composers ?? []).concat(track.lyricists ?? []),
        ),
      ),
    ].map(artist => {
      return {
        name: artist,
      }
    })
    const artists = await transaction
      .insertInto('artist')
      .values(artistsData)
      .onConflict(oc => oc.column('name').doUpdateSet({ name: eb => eb.ref('excluded.name') }))
      .returning(['id', 'name'])
      .execute()

    if (isUpdateMode) {
      await transaction.deleteFrom('track').where('track.album', '=', album.id).execute()
    }

    for (const row of rows) {
      const trackData = getTrackData(row, album.id)
      await transaction
        .with('new_track', transactionDb => {
          return transactionDb.insertInto('track').values(trackData).returning('id')
        })
        .with('new_track_artist', transactionDb => {
          const trackId = transactionDb.selectFrom('new_track').select('id')

          const getArtistId = (name: string) => {
            const artistId = artists.find(a => a.name === name)?.id
            if (artistId === undefined) {
              throw new Error(`artist "${name}" not found`)
            }
            return artistId
          }

          const artistsRelations = [
            ...row.artists.map(name => {
              return {
                track: trackId,
                artist: getArtistId(name),
                artist_type: TrackArtistType.Artist,
              }
            }),
            ...(row.composers?.map(name => {
              return {
                track: trackId,
                artist: getArtistId(name),
                artist_type: TrackArtistType.Composer,
              }
            }) ?? []),
            ...(row.lyricists?.map(name => {
              return {
                track: trackId,
                artist: getArtistId(name),
                artist_type: TrackArtistType.Lyricist,
              }
            }) ?? []),
          ]

          return transactionDb.insertInto('track_artist').values(artistsRelations)
        })
        .selectFrom('new_track')
        .select('id')
        .execute()
    }

    return album
  })
  return Response.json(result)
}
