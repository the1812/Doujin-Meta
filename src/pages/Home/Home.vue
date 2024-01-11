<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useRoute, useRouter } from 'vue-router'
import { watch, ref, computed } from 'vue'
import { searchAlbums, useApi } from '../../api'
import { AlbumApiItem } from '../../api/types'
import AlbumSearchItem from './AlbumSearchItem.vue'
import PageHeader from '../../components/PageHeader/PageHeader.vue'
import Loading from '../../components/Loading.vue'
import Error from '../../components/Error.vue'
import { useI18n } from '../../i18n'
import ClsImage from '../../components/ClsImage.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const searched = ref(false)
const keyword = ref('')
const searchResult = ref([] as AlbumApiItem[])

const api = useApi(async () => {
  if (!keyword.value) {
    return
  }
  searched.value = true
  searchResult.value = []
  const query = { keyword: keyword.value }
  router.replace({ query })
  searchResult.value = await searchAlbums(keyword.value)
  const isFullMatch =
    searchResult.value.length === 1 && searchResult.value[0].name === keyword.value
  if (isFullMatch) {
    router.push({ path: `/albums/${encodeURIComponent(keyword.value)}` })
  }
})
const handleSearch = () => api.sendRequest()

const reset = () => {
  searched.value = false
  searchResult.value = []
  keyword.value = ''
  router.replace({ query: {} })
}

watch(
  () => route.query.keyword,
  newKeyword => {
    if (!newKeyword || Array.isArray(newKeyword) || keyword.value === newKeyword) {
      return
    }
    keyword.value = newKeyword
    handleSearch()
  },
  {
    immediate: true,
  },
)

watch(
  () => route.query.home,
  home => {
    if (!home) {
      return
    }
    reset()
    router.replace({ query: {} })
  },
)

const canSearch = computed(() => !api.loading && Boolean(keyword))
</script>

<template>
  <div class="flex h-screen flex-col overflow-auto">
    <div v-if="!searched" class="my-auto flex -translate-y-[10vh] transform flex-col gap-4 px-4">
      <div class="w-full max-w-[600px] self-center">
        <ClsImage aspect-ratio="26.4%">
          <img src="/images/Logo.Text.svg" />
        </ClsImage>
      </div>
      <div class="flex items-center justify-center gap-3">
        <InputText
          v-model="keyword"
          type="text"
          class="min-w-0 max-w-[700px] flex-grow"
          :placeholder="t('search.placeholder')"
          @keydown.enter="handleSearch"
        />
        <Button
          class="shrink-0"
          :title="t('search.buttonTitle')"
          :loading="api.loading"
          icon="pi pi-search"
          :disabled="!canSearch"
          @click="handleSearch"
        />
      </div>
    </div>
    <PageHeader
      v-if="searched"
      v-model="keyword"
      :busy="api.loading"
      @home-navigate="reset"
      @search="handleSearch"
    />
    <div v-if="searched" class="flex flex-col gap-1 px-3 pb-4 pt-2">
      <AlbumSearchItem v-for="item of searchResult" :key="item.id" :item="item" />
      <div v-if="api.loaded && searchResult.length === 0" class="p-4 text-center">No result</div>
    </div>

    <Loading v-if="api.loading" />
    <Error v-if="api.error" @retry="handleSearch" />
  </div>
</template>
