<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Image from 'primevue/image'
import { useRoute } from 'vue-router'
import { searchAlbums } from '../../api'
import { AlbumApiItem } from '../../api/types'
import AlbumSearchItem from './AlbumSearchItem.vue'
import PageHeader from '../../components/PageHeader/PageHeader.vue'
import { watch } from 'vue'

const route = useRoute()
const defaultKeyword = (() => {
  const { query } = route
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
    searchResult = []
    // await new Promise(r => setTimeout(r, 1000))
    searchResult = await searchAlbums(keyword)
    searched = true
  } finally {
    busy = false
  }
}
const reset = () => {
  searchResult = []
  keyword = ''
  searched = false
}

watch(
  () => route.query.keyword,
  (newKeyword: string) => {
    if (!newKeyword || keyword === newKeyword) {
      return
    }
    keyword = newKeyword
    handleSearch()
  }
)

const canSearch = $computed(() => !busy && Boolean(keyword))

</script>

<template>
  <div class="h-screen flex flex-col overflow-auto">
    <div v-if="!searched" class="flex flex-col gap-4 my-auto transform -translate-y-[15vh]">
      <div class="self-center">
        <Image src="/images/Logo.Text.svg" image-class="w-screen max-w-[600px]" />
      </div>
      <div class="flex items-center justify-center gap-3">
        <InputText type="text" class="flex-grow min-w-0 max-w-[700px]" v-model="keyword" @keydown.enter="handleSearch"
          placeholder="Album name" />
        <Button class="shrink-0" :loading="busy" icon="pi pi-search" :disabled="!canSearch" @click="handleSearch"
          label="Search" />
      </div>
    </div>
    <PageHeader v-if="searched" @home-navigate="reset" @search="handleSearch" v-model="keyword" :busy="busy" />
    <div v-if="searched" class="flex flex-col gap-1 pb-4 pt-2 px-3">
      <AlbumSearchItem v-for="item of searchResult" :key="item.id" :item="item" />
    </div>
  </div>
</template>
