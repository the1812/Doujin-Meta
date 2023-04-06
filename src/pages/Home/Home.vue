<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useRoute, useRouter } from 'vue-router'
import { searchAlbums, useApi } from '../../api'
import { AlbumApiItem } from '../../api/types'
import AlbumSearchItem from './AlbumSearchItem.vue'
import PageHeader from '../../components/PageHeader/PageHeader.vue'
import { watch } from 'vue'
import Loading from '../../components/Loading.vue'
import Error from '../../components/Error.vue'
import { useI18n } from '../../i18n'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

let searched = $ref(false)
let keyword = $ref('')
let searchResult = $ref([] as AlbumApiItem[])

const { loading, error, loaded, sendRequest: handleSearch } = $(useApi(async () => {
  if (!keyword) {
    return
  }
  searched = true
  searchResult = []
  const query = { keyword }
  router.replace({ query })
  searchResult = await searchAlbums(keyword)
  const isFullMatch = searchResult.length === 1 && searchResult[0].name === keyword
  if (isFullMatch) {
    router.push({ path: `/albums/${encodeURIComponent(keyword)}` })
  }
}))

const reset = () => {
  searched = false
  searchResult = []
  keyword = ''
  router.replace({ query: {} })
}

watch(
  () => route.query.keyword,
  (newKeyword: string) => {
    if (!newKeyword || keyword === newKeyword) {
      return
    }
    keyword = newKeyword
    handleSearch()
  },
  {
    immediate: true,
  }
)

watch(
  () => route.query.home,
  (home: string) => {
    if (!home) {
      return
    }
    reset()
    router.replace({ query: {} })
  }
)

const canSearch = $computed(() => !loading && Boolean(keyword))

</script>

<template>
  <div class="h-screen flex flex-col overflow-auto">
    <div v-if="!searched" class="flex flex-col gap-4 px-4 my-auto transform -translate-y-[10vh]">
      <div class="self-center">
        <img src="/images/Logo.Text.svg" height="160" class="w-screen max-h-[160px]" />
      </div>
      <div class="flex items-center justify-center gap-3">
        <InputText type="text" class="flex-grow min-w-0 max-w-[700px]" v-model="keyword" @keydown.enter="handleSearch"
          :placeholder="t('search.placeholder')" />
        <Button class="shrink-0" :title="t('search.buttonTitle')" :loading="loading" icon="pi pi-search"
          :disabled="!canSearch" @click="handleSearch" />
      </div>
    </div>
    <PageHeader v-if="searched" @home-navigate="reset" @search="handleSearch" v-model="keyword" :busy="loading" />
    <div v-if="searched" class="flex flex-col gap-1 pb-4 pt-2 px-3">
      <AlbumSearchItem v-for="item of searchResult" :key="item.id" :item="item" />
      <div v-if="loaded && searchResult.length === 0" class="text-center p-4">No result</div>
    </div>

    <Loading v-if="loading" />
    <Error v-if="error" @retry="handleSearch" />
  </div>
</template>
