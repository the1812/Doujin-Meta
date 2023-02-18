<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Image from 'primevue/image'
import { useRoute } from 'vue-router'
import { searchAlbums } from '../api'
import { AlbumApiItem } from '../api/types'
import AlbumSearchItem from '../components/AlbumSearchItem.vue'

const { query } = useRoute()
const defaultKeyword = (() => {
  if (query.keyword) {
    return query.keyword.toString()
  }
  return ''
})()

let searched = $ref(false)
let busy = $ref(false)
let keyword = $ref(defaultKeyword)
let searchResult = $ref([] as AlbumApiItem[])

const handleSearch = async () => {
  try {
    busy = true
    // await new Promise(r => setTimeout(r, 1000))
    searchResult = await searchAlbums(keyword)
    searched = true
  } finally {
    busy = false
  }
}
const canSearch = $computed(() => !busy && Boolean(keyword))

</script>

<template>
  <div class="h-screen flex flex-col pt-4 px-4 gap-4">
    <div class="flex flex-col gap-4 my-auto">
      <div class="self-center">
        <Image src="/images/Logo.Text.svg" image-class="w-screen max-w-[600px]" />
      </div>
      <div class="flex items-center justify-center gap-3">
        <InputText type="text" class="flex-grow min-w-0 max-w-[700px]" v-model="keyword" @keydown.enter="handleSearch" placeholder="Album name" />
        <Button class="shrink-0" :loading="busy" icon="pi pi-search" :disabled="!canSearch" @click="handleSearch" label="Search" />
      </div>
    </div>
    <div v-if="searched" class="h-0 w-full flex-grow overflow-auto flex flex-col gap-1 self-center max-w-[800px]">
      <RouterLink v-for="item of searchResult" :key="item.id" :to="`/albums/${item.name}/${item.id}`">
        <AlbumSearchItem :item="item" />
      </RouterLink>
    </div>
  </div>
</template>
