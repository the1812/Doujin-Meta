<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { computed, inject, Ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { searchAlbums } from '../api'
import { AlbumApiItem } from '../api/types'
import AlbumSearchItem from '../components/AlbumSearchItem.vue'

const { query } = useRoute()
let injectKeyword = $(inject<Ref<string>>('keyword'))
const defaultKeyword = (() => {
  if (query.keyword) {
    return query.keyword.toString()
  }
  if (injectKeyword) {
    return injectKeyword
  }
  return ''
})()

let busy = $ref(false)
let keyword = $ref(defaultKeyword)
let searchResult = $ref([] as AlbumApiItem[])

watchEffect(() => {
  injectKeyword = keyword
})

const handleSearch = async () => {
  try {
    busy = true
    // await new Promise(r => setTimeout(r, 1000))
    searchResult = await searchAlbums(keyword)
  } finally {
    busy = false
  }
}
const canSearch = computed(() => !busy && Boolean(keyword))

</script>

<template>
  <div class="h-screen flex flex-col pt-4 px-4 gap-4">
    <div class="flex flex-col gap-4 my-auto">
      <div class="text-2xl font-medium self-center">Doujin Meta</div>
      <div class="flex items-center justify-center gap-3">
        <InputText type="text" class="flex-grow max-w-screen-md" v-model="keyword" placeholder="Album name" />
        <Button :loading="busy" icon="pi pi-search" :disabled="!canSearch" @click="handleSearch" label="Search" />
      </div>
    </div>
    <div class="h-0 flex-grow overflow-auto self-stretch flex flex-col gap-1">
      <RouterLink v-for="item of searchResult" :key="item.id" :to="`/albums/${item.name}/${item.id}`">
        <AlbumSearchItem :item="item" />
      </RouterLink>
    </div>
  </div>
</template>
