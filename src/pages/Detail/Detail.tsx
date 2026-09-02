import Chip from 'primevue/chip'
import Image from 'primevue/image'
import { computed, defineComponent, reactive } from 'vue'
import { useRoute } from 'vue-router'

import type { AlbumDetail, AlbumTrack } from '../../../shared/api'
import { getAlbumDetail, useApi } from '../../api'
import { MetadataSeparator } from '../../common'
import { DizzylabButton } from '../../components/Buttons/DizzylabButton'
import { GitHubButton } from '../../components/Buttons/GitHubButton'
import { MoreActionsButton } from '../../components/Buttons/MoreActionsButton'
import { ThbWikiButton } from '../../components/Buttons/ThbWikiButton'
import { ClsImage } from '../../components/ClsImage'
import { LoadError } from '../../components/Error'
import { Icon } from '../../components/Icon'
import { Loading } from '../../components/Loading'
import { usePageHeader } from '../../components/PageHeader'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { PrimaryChip } from '../../components/PrimaryChip'
import { useI18n } from '../../i18n'
import { DetailHeader } from './DetailHeader'
import { DetailRow } from './DetailRow'

type DiscGroup = { discNumber: string; tracks: AlbumTrack[] }

export const Detail = defineComponent({
  name: 'Detail',
  setup() {
    const { homeNavigate, keyword, search } = usePageHeader()
    const { params } = useRoute()
    const { t } = useI18n()

    const albumDetail: AlbumDetail = reactive({
      id: '',
      album: '',
      albumOrder: '',
      albumArtists: [],
      genres: [],
      year: null,
      links: {
        cover: '',
        metadata: '',
        source: '',
      },
      extraData: null,
      tracks: [],
    })

    const tracks = computed(() => albumDetail.tracks)
    const albumGenres = computed(() => {
      const genresMap: Record<string, number> = {}
      for (const track of tracks.value) {
        const key = track.genres.join(MetadataSeparator)
        genresMap[key] = (genresMap[key] ?? 0) + 1
      }
      return Object.entries(genresMap)
        .sort((a, b) => b[1] - a[1])
        .at(0)
        ?.at(0)
    })
    const links = computed(() => albumDetail.extraData?.links ?? {})
    const discGroups = computed(() => {
      const groups: DiscGroup[] = []
      for (const track of tracks.value) {
        const discEntry = groups.find(it => it.discNumber === track.discNumber)
        if (discEntry) {
          discEntry.tracks.push(track)
        } else {
          groups.push({ discNumber: track.discNumber, tracks: [track] })
        }
      }
      return groups
    })

    const detailApi = useApi(async () => {
      const detail = await getAlbumDetail(params.id as string)
      Object.assign(albumDetail, detail)
    })
    void detailApi.sendRequest()

    const showArtists = (track: AlbumTrack) => track.artists.length > 0

    const showComposers = (track: AlbumTrack) => {
      if (track.composers.length === 0) {
        return false
      }
      const matchesArtists =
        track.composers.every(item => track.artists.includes(item)) &&
        track.artists.every(item => track.composers.includes(item))
      return !matchesArtists
    }

    const showGenres = (track: AlbumTrack) => {
      const genresMatch = (a: AlbumTrack | undefined, b: AlbumTrack | undefined) =>
        a?.genres.every((item, index) => item === b?.genres[index])
      const firstTrack = tracks.value[0]
      const showFirstTrackGenres = !tracks.value
        .slice(1)
        .every(otherTrack => genresMatch(otherTrack, firstTrack))
      if (firstTrack === track) {
        return showFirstTrackGenres
      }
      return showFirstTrackGenres || !genresMatch(firstTrack, track)
    }

    const sendDetailRequest = () => void detailApi.sendRequest()

    return () => (
      <div class="flex h-screen flex-col overflow-auto">
        <PageHeader v-model={keyword.value} onHomeNavigate={homeNavigate} onSearch={search} />

        <div class="flex flex-grow flex-col items-center gap-6 p-6 xl:flex-row xl:items-start xl:justify-center">
          {detailApi.loaded && (
            <>
              <div class="flex flex-col gap-6 xl:sticky xl:top-[calc(80px+1.5rem)] xl:justify-center">
                <ClsImage aspectRatio="100%" class="w-[90vw] max-w-[400px]">
                  <Image
                    class="z-10 self-center overflow-hidden rounded-lg shadow-border-[2px]"
                    imageClass="object-contain"
                    preview
                    src={albumDetail.links.cover}
                    v-slots={{ previewicon: () => <Icon name="search-plus" /> }}
                  />
                </ClsImage>
                <div class="flex max-w-[400px] flex-col items-center gap-2">
                  <div class="text-center text-xl font-semibold">{albumDetail.album}</div>
                  <div class="text mb-2 text-center text-gray-500">
                    <span>{albumDetail.albumArtists.join(MetadataSeparator)}</span>
                    {albumDetail.year && <span> · {albumDetail.year}</span>}
                  </div>

                  {albumDetail.albumOrder && (
                    <PrimaryChip class="!py-2">
                      <Icon name="tag" class="!text-[12px]" />
                      <span class="text-sm">{albumDetail.albumOrder}</span>
                    </PrimaryChip>
                  )}
                  {albumGenres.value !== undefined && (
                    <div class="flex flex-wrap items-center justify-center gap-2">
                      <Chip class="!py-2">
                        <span class="text-sm">{albumGenres.value}</span>
                      </Chip>
                    </div>
                  )}
                  <div class="mt-8 flex flex-col gap-2">
                    {links.value.dizzylab && <DizzylabButton id={links.value.dizzylab} />}
                    {links.value.thbWiki && <ThbWikiButton id={links.value.thbWiki} />}
                    <div class="flex gap-2">
                      {albumDetail.links.source && (
                        <GitHubButton class="flex-grow" link={albumDetail.links.source} />
                      )}
                      <MoreActionsButton rawLink={albumDetail.links.metadata} />
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-3 xl:items-center">
                {discGroups.value.map(group => (
                  <div key={group.discNumber} class="flex flex-col gap-2">
                    {discGroups.value.length > 1 && (
                      <div class="text-sm text-gray-500">Disc {group.discNumber}</div>
                    )}
                    {group.tracks.map(track => (
                      <div
                        key={`${track.discNumber}/${track.trackNumber}`}
                        class={[
                          'w-[90vw] md:max-w-[600px]',
                          'flex flex-col overflow-hidden rounded-md border border-solid border-gray-200',
                          '[&>:not(:last-child)]:border-b [&>:not(:last-child)]:border-solid [&>:not(:last-child)]:border-gray-200',
                        ]}
                      >
                        <DetailHeader label={`#${track.trackNumber}`} value={track.title} />
                        {showArtists(track) && (
                          <DetailRow
                            label={t('detail.label.artists')}
                            value={track.artists.join(MetadataSeparator)}
                          />
                        )}
                        {showComposers(track) && (
                          <DetailRow
                            label={t('detail.label.composers')}
                            value={track.composers.join(MetadataSeparator)}
                          />
                        )}
                        {showGenres(track) && (
                          <DetailRow
                            label={t('detail.label.genres')}
                            value={track.genres.join(MetadataSeparator)}
                          />
                        )}
                        {track.comments && (
                          <DetailRow label={t('detail.label.comments')} value={track.comments} />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {detailApi.loading && <Loading />}
        {detailApi.error && <LoadError onRetry={sendDetailRequest} />}
      </div>
    )
  },
})
