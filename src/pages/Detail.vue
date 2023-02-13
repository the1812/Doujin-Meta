<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { AlbumMetadata } from 'touhou-tagger'
import DetailRow from '../components/DetailRow.vue'
import { MetadataSeparator } from '../common'

const { params } = useRoute()
const albumDetail = {"coverUrl":"cover.png","metadata":[{"title":"Tokyo Ranger","composers":["cnsuslik"],"album":"紫羅蘭騎士團 VOL.1","albumOrder":"MTLR-009","albumArtists":["Matthiola Records"],"year":"2019","artists":["cnsuslik"],"discNumber":"1","trackNumber":"1"},{"title":"Knight in Your Nightmares","composers":["Hazecat"],"artists":["Hazecat"],"discNumber":"1","trackNumber":"2","album":"紫羅蘭騎士團 VOL.1","albumOrder":"MTLR-009","albumArtists":["Matthiola Records"],"year":"2019"},{"title":"Cosmic Edge","composers":["Reguluz"],"artists":["Reguluz"],"discNumber":"1","trackNumber":"3","album":"紫羅蘭騎士團 VOL.1","albumOrder":"MTLR-009","albumArtists":["Matthiola Records"],"year":"2019"},{"title":"The Explorer","composers":["Supa7onyz"],"artists":["Supa7onyz"],"discNumber":"1","trackNumber":"4","album":"紫羅蘭騎士團 VOL.1","albumOrder":"MTLR-009","albumArtists":["Matthiola Records"],"year":"2019"},{"title":"Hidden Blade","composers":["Joulez"],"artists":["Joulez"],"discNumber":"1","trackNumber":"5","album":"紫羅蘭騎士團 VOL.1","albumOrder":"MTLR-009","albumArtists":["Matthiola Records"],"year":"2019"},{"title":"Press F to Fuck","composers":["Mrskey"],"artists":["Mrskey"],"discNumber":"1","trackNumber":"6","album":"紫羅蘭騎士團 VOL.1","albumOrder":"MTLR-009","albumArtists":["Matthiola Records"],"year":"2019"},{"title":"Crystalized Teardrops","composers":["BlueWind"],"artists":["BlueWind"],"discNumber":"1","trackNumber":"7","album":"紫羅蘭騎士團 VOL.1","albumOrder":"MTLR-009","albumArtists":["Matthiola Records"],"year":"2019"},{"title":"Future Flight","composers":["Behold"],"artists":["Behold"],"discNumber":"1","trackNumber":"8","album":"紫羅蘭騎士團 VOL.1","albumOrder":"MTLR-009","albumArtists":["Matthiola Records"],"year":"2019"}]}

const [firstTrack] = albumDetail.metadata
const albumMetadata: AlbumMetadata = firstTrack

</script>

<template>
  <div class="h-screen flex flex-col py-4 gap-4">
    <div class="flex flex-col w-[800px] rounded-md border border-solid border-gray-200">
      <DetailRow label="Album Name" :value="albumMetadata.album" />
      <DetailRow label="Circle" :value="albumMetadata.albumArtists?.join(MetadataSeparator)" />
    </div>
  </div>
</template>
