<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { computed } from 'vue'
import { searchAlbums } from '../api'
import { AlbumApiItem } from '../api/types'
import AlbumSearchItem from '../components/AlbumSearchItem.vue'
import Icon from '../components/Icon.vue'

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
  <div class="h-screen flex flex-col items-center py-4 gap-4 max-w-[1400px]">
    <div class="flex flex-col items-center gap-4 my-auto">
      <div class="text-2xl font-medium">Doujin Meta</div>
      <div class="flex items-center gap-3">
        <span class="p-input-icon-left">
          <Icon name="angle-right" />
          <InputText type="text" class="flex-grow" v-model="keyword" placeholder="Album name" />
        </span>
        <Button :loading="busy" :disabled="!canSearch" @click="handleSearch" label="Search" />
      </div>
    </div>
    <div class="h-0 flex-grow overflow-auto self-stretch flex flex-col gap-1">
      <AlbumSearchItem v-for="item of searchResult" :key="item.id" :item="item" />
    </div>
  </div>
</template>
