<script setup lang="ts">
import { useRoute } from 'vue-router'
import { AlbumDetail } from '../api/types'
import Icon from '../components/Icon.vue'
import Image from 'primevue/image'
import Chip from 'primevue/Chip'
import PrimaryChip from '../components/PrimaryChip.vue'
import type { AlbumMetadata, Metadata } from 'touhou-tagger'
import DetailRow from '../components/DetailRow.vue'
import DetailHeader from '../components/DetailHeader.vue'
import { MetadataSeparator } from '../common'

const { params } = useRoute()
const albumDetail: AlbumDetail = { "id": "14ee33d8a45ffbae36b594b9c5c4544233c6cd98", "name": "Silent Xosmos vol.5 -Harder, Faster, FasteR & FASTER-", "coverUrl": "/data/Silent Xosmos vol.5 -Harder, Faster, FasteR & FASTER-/cover.jpg", "metadata": [{ "title": "Harder, Faster, FasteR & FASTER", "artists": ["Broken Nerdz", "Irish Kappa"], "composers": ["Broken Nerdz"], "comments": "Normal1zer", "album": "Silent Xosmos vol.5 -Harder, Faster, FasteR & FASTER-", "albumOrder": "SLXD-007", "albumArtists": ["Silent Xords"], "genres": ["Hardcore"], "year": "2022", "discNumber": "1", "trackNumber": "1" }, { "title": "皆んな来る宜し ~Welcome to Schizophrenia~", "artists": ["二重死後磁場", "ONANi"], "composers": ["二重死後磁場"], "comments": "Joulez & NANO-FXXKYIG", "discNumber": "1", "trackNumber": "2", "album": "Silent Xosmos vol.5 -Harder, Faster, FasteR & FASTER-", "albumOrder": "SLXD-007", "albumArtists": ["Silent Xords"], "genres": ["Hardcore"], "year": "2022" }, { "title": "Memories Lookback", "composers": ["system 【Σ】"], "artists": ["system 【Σ】"], "discNumber": "1", "trackNumber": "3", "album": "Silent Xosmos vol.5 -Harder, Faster, FasteR & FASTER-", "albumOrder": "SLXD-007", "albumArtists": ["Silent Xords"], "genres": ["Hardcore"], "year": "2022" }, { "title": "I'm The Lowest xxxx", "composers": ["Axya"], "artists": ["Axya"], "discNumber": "1", "trackNumber": "4", "album": "Silent Xosmos vol.5 -Harder, Faster, FasteR & FASTER-", "albumOrder": "SLXD-007", "albumArtists": ["Silent Xords"], "genres": ["Hardcore"], "year": "2022" }, { "title": "Blissful Weeper", "composers": ["Cabälaa", "Vcoreibez"], "artists": ["Cabälaa", "Vcoreibez"], "discNumber": "1", "trackNumber": "5", "album": "Silent Xosmos vol.5 -Harder, Faster, FasteR & FASTER-", "albumOrder": "SLXD-007", "albumArtists": ["Silent Xords"], "genres": ["Hardcore"], "year": "2022" }, { "title": "Alive", "composers": ["The Operation"], "comments": "Black201", "artists": ["The Operation"], "discNumber": "1", "trackNumber": "6", "album": "Silent Xosmos vol.5 -Harder, Faster, FasteR & FASTER-", "albumOrder": "SLXD-007", "albumArtists": ["Silent Xords"], "genres": ["Hardcore"], "year": "2022" }, { "title": "Amnesiac Criminals", "composers": ["KzCraziL", "Vcoreibez"], "artists": ["KzCraziL", "Vcoreibez"], "discNumber": "1", "trackNumber": "7", "album": "Silent Xosmos vol.5 -Harder, Faster, FasteR & FASTER-", "albumOrder": "SLXD-007", "albumArtists": ["Silent Xords"], "genres": ["Hardcore"], "year": "2022" }, { "title": "Quietus", "composers": ["Kana.OtonaC"], "comments": "LUNARiUM", "artists": ["Kana.OtonaC"], "discNumber": "1", "trackNumber": "8", "album": "Silent Xosmos vol.5 -Harder, Faster, FasteR & FASTER-", "albumOrder": "SLXD-007", "albumArtists": ["Silent Xords"], "genres": ["Hardcore"], "year": "2022" }, { "title": "Degenerate in the Sun, Sublimate in the Rain", "composers": ["EuphoriA"], "discNumber": "2", "artists": ["EuphoriA"], "trackNumber": "1", "album": "Silent Xosmos vol.5 -Harder, Faster, FasteR & FASTER-", "albumOrder": "SLXD-007", "albumArtists": ["Silent Xords"], "genres": ["Hardcore"], "year": "2022" }, { "title": "DUST IS THE Spire", "composers": ["望月 真白"], "artists": ["望月 真白"], "discNumber": "2", "trackNumber": "2", "album": "Silent Xosmos vol.5 -Harder, Faster, FasteR & FASTER-", "albumOrder": "SLXD-007", "albumArtists": ["Silent Xords"], "genres": ["Hardcore"], "year": "2022" }, { "title": "Singularity", "composers": ["Laxeno57"], "artists": ["Laxeno57"], "discNumber": "2", "trackNumber": "3", "album": "Silent Xosmos vol.5 -Harder, Faster, FasteR & FASTER-", "albumOrder": "SLXD-007", "albumArtists": ["Silent Xords"], "genres": ["Hardcore"], "year": "2022" }, { "title": "Thriftin'", "composers": ["BlueWind"], "artists": ["BlueWind"], "discNumber": "2", "trackNumber": "4", "album": "Silent Xosmos vol.5 -Harder, Faster, FasteR & FASTER-", "albumOrder": "SLXD-007", "albumArtists": ["Silent Xords"], "genres": ["Hardcore"], "year": "2022" }, { "title": "SLOWKORE 4 ADULTZ", "composers": ["Thy Rapid Blue Vixen"], "artists": ["Thy Rapid Blue Vixen"], "discNumber": "2", "trackNumber": "5", "album": "Silent Xosmos vol.5 -Harder, Faster, FasteR & FASTER-", "albumOrder": "SLXD-007", "albumArtists": ["Silent Xords"], "genres": ["Hardcore"], "year": "2022" }, { "title": "Asche", "composers": ["Nirotiy"], "artists": ["Nirotiy"], "discNumber": "2", "trackNumber": "6", "album": "Silent Xosmos vol.5 -Harder, Faster, FasteR & FASTER-", "albumOrder": "SLXD-007", "albumArtists": ["Silent Xords"], "genres": ["Hardcore"], "year": "2022" }, { "title": "IDONTUNDERSTAND.", "composers": ["Broken Nerdz"], "comments": "Normal1zer", "artists": ["Broken Nerdz"], "discNumber": "2", "trackNumber": "7", "album": "Silent Xosmos vol.5 -Harder, Faster, FasteR & FASTER-", "albumOrder": "SLXD-007", "albumArtists": ["Silent Xords"], "genres": ["Hardcore"], "year": "2022" }] }

const tracks = albumDetail.metadata
const [firstTrack] = tracks
const albumMetadata: AlbumMetadata = firstTrack
type TrackMetadata = Omit<Metadata, keyof AlbumMetadata>
const discGroups: { discNumber: string; tracks: TrackMetadata[] }[] = []
tracks.forEach(track => {
  const discEntry = discGroups.find(it => it.discNumber === track.discNumber)
  if (!discEntry) {
    discGroups.push({ discNumber: track.discNumber, tracks: [track] })
  } else {
    discEntry.tracks.push(track)
  }
})

const showComposers = (track: TrackMetadata) => {
  const equal = track.composers.every(item => track.artists.includes(item))
    && track.artists.every(item => track.composers.includes(item))
  return track.composers && !equal
}


</script>

<template>
  <div class="min-h-screen flex flex-col items-center p-4 gap-6">
    <Image class="rounded-lg overflow-hidden z-10" image-class="w-[90vw] object-contain"
      :src="albumDetail.coverUrl" />
    <div class="flex flex-col items-center gap-2">
      <div class="font-medium text-xl text-center">{{ albumMetadata.album }}</div>
      <div class="text-gray-500 text">
        <span>{{ albumMetadata.albumArtists?.join(MetadataSeparator) }}</span>
        <span v-if="albumMetadata.year"> · {{ albumMetadata.year }}</span>
      </div>
      <div class="flex items-center flex-wrap gap-3" v-if="albumMetadata.genres">
        <PrimaryChip v-if="albumMetadata.albumOrder">
          <Icon name="tag" class="!text-[12px] mr-1" />
          <span class="text-sm my-1">{{ albumMetadata.albumOrder }}</span>
        </PrimaryChip>
        <Chip v-for="genre of albumMetadata.genres" :key="genre">
          <span class="text-sm my-1">{{ genre }}</span>
        </Chip>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <div v-for="group of discGroups" :key="group.discNumber" class="flex flex-col gap-2">
        <div v-if="discGroups.length > 1" class="text-sm text-gray-500">Disc {{ group.discNumber }}</div>
        <div v-for="track of group.tracks" :key="`${track.discNumber}/${track.trackNumber}`"
          :class="[
            'flex flex-col w-[90vw] rounded-md border border-solid border-gray-200 overflow-hidden',
            '[&>:not(:last-child)]:border-b [&>:not(:last-child)]:border-solid [&>:not(:last-child)]:border-gray-200',
          ]">
          <DetailHeader :label="`#${track.trackNumber}`" :value="track.title" />
          <DetailRow label="Artists" :value="track.artists.join(MetadataSeparator)" />
          <DetailRow v-if="showComposers(track)" label="Composers" :value="track.composers.join(MetadataSeparator)" />
          <DetailRow v-if="track.comments" label="Comments" :value="track.comments" />
        </div>
      </div>
    </div>
  </div>
</template>
