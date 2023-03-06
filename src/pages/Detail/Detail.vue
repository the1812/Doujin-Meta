<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { AlbumMetadata, Metadata } from 'touhou-tagger'
import { AlbumDetail } from '../../api/types'
import Icon from '../../components/Icon.vue'
import Image from 'primevue/image'
import Chip from 'primevue/chip'
import PrimaryChip from '../../components/PrimaryChip.vue'
import DetailRow from './DetailRow.vue'
import DetailHeader from './DetailHeader.vue'
import { MetadataSeparator } from '../../common'
import { reactive } from 'vue'
import { getAlbumDetail, useApi } from '../../api'
import PageHeader from '../../components/PageHeader/PageHeader.vue'
import { usePageHeader } from '../../components/PageHeader'
import DizzylabIcon from '../../assets/dizzylab.svg'
import THBWikiIcon from '../../assets/thbWiki.png'
import LinkChip from '../../components/LinkChip.vue'
import Loading from '../../components/Loading.vue'
import Error from '../../components/Error.vue'

const { homeNavigate, keyword, search } = usePageHeader()
const { params } = useRoute()
const { name, id } = params

const albumDetail: AlbumDetail = reactive({
  id: '',
  coverUrl: '',
  name: '',
  metadata: []
})
const tracks = $computed(() => albumDetail.metadata)
const albumMetadata: AlbumMetadata = $computed(() => tracks[0])
const links = $computed((): {
  dizzylab?: string
  thbWiki?: string
} => albumMetadata.extraData?.links ?? {})

type TrackMetadata = Omit<Metadata, keyof AlbumMetadata>
type DiscGroup = { discNumber: string; tracks: TrackMetadata[] }
const discGroups: DiscGroup[] = $computed(() => {
  const groups: DiscGroup[] = []
  tracks.forEach(track => {
    const discEntry = groups.find(it => it.discNumber === track.discNumber)
    if (!discEntry) {
      groups.push({ discNumber: track.discNumber, tracks: [track] })
    } else {
      discEntry.tracks.push(track)
    }
  })
  return groups
})

const { loading, error, loaded, sendRequest } = $(useApi(async () => {
  const detail = await getAlbumDetail(name as string, id as string)
  Object.assign(albumDetail, detail)
}))
sendRequest()

const showComposers = (track: TrackMetadata) => {
  if (!track.composers) {
    return false
  }
  const equal = track.composers.every(item => track.artists.includes(item))
    && track.artists.every(item => track.composers.includes(item))
  return track.composers && !equal
}

</script>

<template>
  <div class="h-screen flex flex-col overflow-auto">
    <PageHeader v-model="keyword" @home-navigate="homeNavigate" @search="search" />

    <div class="flex flex-grow flex-col xl:flex-row xl:justify-center items-center xl:items-start p-6 gap-6">
      <template v-if="loaded">
        <div class="flex flex-col gap-6 xl:justify-center xl:sticky xl:top-[calc(80px+1.5rem)]">
          <Image class="rounded-lg overflow-hidden z-10 shadow-border-[2px] self-center"
            image-class="w-[90vw] max-w-[400px] object-contain" preview :src="albumDetail.coverUrl">
            <template #indicator>
              <Icon name="search-plus" />
            </template>
          </Image>
          <div v-if="albumMetadata" class="flex flex-col items-center gap-2 max-w-[400px]">
            <div class="font-medium text-xl text-center">{{ albumMetadata.album }}</div>
            <div class="text-gray-500 text mb-2">
              <span>{{ albumMetadata.albumArtists?.join(MetadataSeparator) }}</span>
              <span v-if="albumMetadata.year"> · {{ albumMetadata.year }}</span>
            </div>

            <div v-if="albumMetadata.albumOrder || Object.values(links).length > 0"
              class="flex items-center justify-center flex-wrap gap-2">
              <PrimaryChip v-if="albumMetadata.albumOrder">
                <Icon name="tag" class="!text-[12px] mr-1" />
                <span class="text-sm my-1">{{ albumMetadata.albumOrder }}</span>
              </PrimaryChip>
              <LinkChip v-if="links.dizzylab" :href="`https://www.dizzylab.net/d/${links.dizzylab}`"
                title="View on dizzylab" :src="DizzylabIcon" />
              <LinkChip v-if="links.thbWiki" :href="`https://thwiki.cc/${links.thbWiki}`" title="View on THBWiki"
                :src="THBWikiIcon" />
            </div>
            <div class="flex items-center justify-center flex-wrap gap-2" v-if="albumMetadata.genres">
              <Chip v-for="genre of albumMetadata.genres" :key="genre">
                <span class="text-sm my-1">{{ genre }}</span>
              </Chip>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3 xl:items-center">
          <div v-for="group of discGroups" :key="group.discNumber" class="flex flex-col gap-2">
            <div v-if="discGroups.length > 1" class="text-sm text-gray-500">Disc {{ group.discNumber }}</div>
            <div v-for="track of group.tracks" :key="`${track.discNumber}/${track.trackNumber}`" :class="[
              'w-[90vw] md:max-w-[600px]',
              'flex flex-col rounded-md border border-solid border-gray-200 overflow-hidden',
              '[&>:not(:last-child)]:border-b [&>:not(:last-child)]:border-solid [&>:not(:last-child)]:border-gray-200',
            ]">
              <DetailHeader :label="`#${track.trackNumber}`" :value="track.title" />
              <DetailRow label="Artists" :value="track.artists.join(MetadataSeparator)" />
              <DetailRow v-if="showComposers(track)" label="Composers"
                :value="track.composers.join(MetadataSeparator)" />
              <DetailRow v-if="track.comments" label="Comments" :value="track.comments" />
            </div>
          </div>
        </div>
      </template>
    </div>

    <Loading v-if="loading" />
    <Error v-if="error" @retry="sendRequest" />
  </div>
</template>
