<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { AlbumMetadata, Metadata } from 'touhou-tagger'
import { AlbumDetail } from '../api/types'
import Icon from '../components/Icon.vue'
import Image from 'primevue/image'
import Chip from 'primevue/chip'
import PrimaryChip from '../components/PrimaryChip.vue'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import DetailRow from '../components/DetailRow.vue'
import DetailHeader from '../components/DetailHeader.vue'
import { MetadataSeparator } from '../common'
import { reactive } from 'vue'
import { getAlbumDetail, useApi } from '../api'
import PageHeader from '../components/PageHeader/PageHeader.vue'
import { usePageHeader } from '../components/PageHeader'
import CenterScreen from '../components/CenterScreen.vue'

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

const { loading, error, loaded, reload } = $(useApi(() => getAlbumDetail(name as string, id as string).then(detail => {
  Object.assign(albumDetail, detail)
})))

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

    <div
      class="flex flex-grow flex-col xl:flex-row xl:justify-center items-center xl:items-start p-6 gap-6">
      <CenterScreen v-if="loading">
        <ProgressSpinner class="!w-8 !h-8" stroke-width="8" />
      </CenterScreen>
      <CenterScreen v-if="error">
        <div class="text-lg">Failed to load.</div>
        <Button class="p-button-sm" icon="pi pi-refresh" @click="reload" label="Retry"></Button>
      </CenterScreen>

      <template v-if="loaded">
        <div class="flex flex-col gap-6 xl:justify-center">
          <Image class="rounded-lg overflow-hidden z-10 shadow-border-[2px] self-center"
            image-class="w-[90vw] max-w-[400px] object-contain" preview :src="albumDetail.coverUrl">
            <template #indicator>
              <Icon name="search-plus" />
            </template>
          </Image>
          <div v-if="albumMetadata" class="flex flex-col items-center gap-2">
            <div class="font-medium text-xl text-center">{{ albumMetadata.album }}</div>
            <div class="text-gray-500 text">
              <span>{{ albumMetadata.albumArtists?.join(MetadataSeparator) }}</span>
              <span v-if="albumMetadata.year"> · {{ albumMetadata.year }}</span>
            </div>
            <div class="flex items-center justify-center flex-wrap gap-2 mt-2" v-if="albumMetadata.genres">
              <PrimaryChip v-if="albumMetadata.albumOrder">
                <Icon name="tag" class="!text-[12px] mr-1" />
                <span class="text-sm my-1">{{ albumMetadata.albumOrder }}</span>
              </PrimaryChip>
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
  </div>
</template>
