<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { AlbumMetadata, Metadata } from 'touhou-tagger'
import Image from 'primevue/image'
import Chip from 'primevue/chip'
import { computed, reactive } from 'vue'
import { AlbumDetail } from '../../api/types'
import Icon from '../../components/Icon.vue'
import PrimaryChip from '../../components/PrimaryChip.vue'
import DetailRow from './DetailRow.vue'
import DetailHeader from './DetailHeader.vue'
import { MetadataSeparator } from '../../common'
import { getAlbumDetail, useApi } from '../../api'
import PageHeader from '../../components/PageHeader/PageHeader.vue'
import { usePageHeader } from '../../components/PageHeader'
import Loading from '../../components/Loading.vue'
import Error from '../../components/Error.vue'
import DizzylabButton from '../../components/Buttons/DizzylabButton.vue'
import ThbWikiButton from '../../components/Buttons/ThbWikiButton.vue'
import GitHubButton from '../../components/Buttons/GitHubButton.vue'
import MoreActionsButton from '../../components/Buttons/MoreActionsButton.vue'
import ClsImage from '../../components/ClsImage.vue'
import { useI18n } from '../../i18n'

const { homeNavigate, keyword, search } = usePageHeader()
const { params } = useRoute()
const { name } = params
const { t } = useI18n()

const albumDetail: AlbumDetail = reactive({
  coverUrl: '',
  name: '',
  metadataUrl: '',
  rawUrl: '',
  metadata: [],
})
const tracks = computed(() => albumDetail.metadata)
const albumMetadata = computed(() => tracks.value[0] as AlbumMetadata)
const albumGenres = computed(() => {
  const genresMap: Record<string, number> = {}
  tracks.value.forEach(track => {
    const key = track.genres?.join(MetadataSeparator)
    if (key === undefined) {
      return
    }
    if (genresMap[key] === undefined) {
      genresMap[key] = 1
      return
    }
    genresMap[key] += 1
  })
  return Object.entries(genresMap)
    .sort((a, b) => b[1] - a[1])
    .at(0)
    ?.at(0) as string | undefined
})
const links = computed(
  (): {
    dizzylab?: string
    thbWiki?: string
  } => albumMetadata.value.extraData?.links ?? {},
)

type TrackMetadata = Omit<Metadata, keyof Omit<AlbumMetadata, 'genres'>>
type DiscGroup = { discNumber: string; tracks: TrackMetadata[] }
const discGroups = computed(() => {
  const groups: DiscGroup[] = []
  tracks.value.forEach(track => {
    const discEntry = groups.find(it => it.discNumber === track.discNumber)
    if (!discEntry) {
      groups.push({ discNumber: track.discNumber, tracks: [track] })
    } else {
      discEntry.tracks.push(track)
    }
  })
  return groups
})

const detailApi = useApi(async () => {
  const detail = await getAlbumDetail(name as string)
  Object.assign(albumDetail, detail)
})
detailApi.sendRequest()

const showComposers = (track: TrackMetadata) => {
  if (!track.composers) {
    return false
  }
  const equal =
    track.composers.every(item => track.artists.includes(item)) &&
    track.artists.every(item => track.composers?.includes(item))
  return track.composers && !equal
}

const showGenres = (track: TrackMetadata) => {
  if (!track.genres) {
    return false
  }
  const isGenresEqual = (a: TrackMetadata, b: TrackMetadata) =>
    a.genres?.every((item, index) => item === b.genres?.[index])
  const firstTrack = tracks.value[0]
  const isFirstTrack = firstTrack === track
  const showFirstTrackGenres = !tracks.value
    .slice(1)
    .every(otherTrack => isGenresEqual(otherTrack, firstTrack))
  if (isFirstTrack) {
    return showFirstTrackGenres
  }
  const showTrackGenres = showFirstTrackGenres || !isGenresEqual(firstTrack, track)
  return showTrackGenres
}
</script>

<template>
  <div class="flex h-screen flex-col overflow-auto">
    <PageHeader v-model="keyword" @home-navigate="homeNavigate" @search="search" />

    <div
      class="flex flex-grow flex-col items-center gap-6 p-6 xl:flex-row xl:items-start xl:justify-center"
    >
      <template v-if="detailApi.loaded">
        <div class="flex flex-col gap-6 xl:sticky xl:top-[calc(80px+1.5rem)] xl:justify-center">
          <ClsImage aspect-ratio="100%" class="w-[90vw] max-w-[400px]">
            <Image
              class="z-10 self-center overflow-hidden rounded-lg shadow-border-[2px]"
              image-class="object-contain"
              preview
              :src="albumDetail.coverUrl"
            >
              <template #indicator>
                <Icon name="search-plus" />
              </template>
            </Image>
          </ClsImage>
          <div v-if="albumMetadata" class="flex max-w-[400px] flex-col items-center gap-2">
            <div class="text-center text-xl font-semibold">{{ albumMetadata.album }}</div>
            <div class="text mb-2 text-center text-gray-500">
              <span>{{ albumMetadata.albumArtists?.join(MetadataSeparator) }}</span>
              <span v-if="albumMetadata.year"> · {{ albumMetadata.year }}</span>
            </div>

            <PrimaryChip v-if="albumMetadata.albumOrder">
              <Icon name="tag" class="mr-1 !text-[12px]" />
              <span class="my-1 text-sm">{{ albumMetadata.albumOrder }}</span>
            </PrimaryChip>
            <div
              v-if="albumMetadata.genres"
              class="flex flex-wrap items-center justify-center gap-2"
            >
              <Chip>
                <span class="my-1 text-sm">{{ albumGenres }}</span>
              </Chip>
            </div>
            <div class="mt-8 flex flex-col gap-2">
              <DizzylabButton v-if="links.dizzylab" :id="links.dizzylab" />
              <ThbWikiButton v-if="links.thbWiki" :id="links.thbWiki" />
              <div class="flex gap-2">
                <GitHubButton
                  v-if="albumDetail.metadataUrl"
                  class="flex-grow"
                  :link="albumDetail.metadataUrl"
                />
                <MoreActionsButton :raw-link="albumDetail.rawUrl" />
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3 xl:items-center">
          <div v-for="group of discGroups" :key="group.discNumber" class="flex flex-col gap-2">
            <div v-if="discGroups.length > 1" class="text-sm text-gray-500">
              Disc {{ group.discNumber }}
            </div>
            <div
              v-for="track of group.tracks"
              :key="`${track.discNumber}/${track.trackNumber}`"
              :class="[
                'w-[90vw] md:max-w-[600px]',
                'flex flex-col overflow-hidden rounded-md border border-solid border-gray-200',
                '[&>:not(:last-child)]:border-b [&>:not(:last-child)]:border-solid [&>:not(:last-child)]:border-gray-200',
              ]"
            >
              <DetailHeader :label="`#${track.trackNumber}`" :value="track.title" />
              <DetailRow
                :label="t('detail.label.artists')"
                :value="track.artists.join(MetadataSeparator)"
              />
              <DetailRow
                v-if="showComposers(track)"
                :label="t('detail.label.composers')"
                :value="track.composers?.join(MetadataSeparator) ?? ''"
              />
              <DetailRow
                v-if="showGenres(track)"
                :label="t('detail.label.genres')"
                :value="track.genres?.join(MetadataSeparator) ?? ''"
              />
              <DetailRow
                v-if="track.comments"
                :label="t('detail.label.comments')"
                :value="track.comments"
              />
            </div>
          </div>
        </div>
      </template>
    </div>

    <Loading v-if="detailApi.loading" />
    <Error v-if="detailApi.error" @retry="detailApi.sendRequest" />
  </div>
</template>
