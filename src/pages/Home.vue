<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { computed } from 'vue'
import { searchAlbums } from '../api'
import { AlbumApiItem } from '../api/types'
import AlbumSearchItem from '../components/AlbumSearchItem.vue'

let busy = $ref(false)
let keyword = $ref('')
let searchResult = $ref([] as AlbumApiItem[])

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
      <AlbumSearchItem v-for="item of searchResult" :key="item.id" :item="item" />
    </div>
  </div>
</template>
