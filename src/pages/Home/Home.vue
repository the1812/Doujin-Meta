<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'
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

const searchApi = useApi(async () => {
  if (!keyword.value) {
    return
  }
  searched.value = true
  searchResult.value = []
  void router.replace({ query: { keyword: keyword.value } })
  searchResult.value = await searchAlbums(keyword.value)
  const isFullMatch =
    searchResult.value.length === 1 && searchResult.value[0]?.name === keyword.value
  if (isFullMatch) {
    void router.push({ path: `/albums/${encodeURIComponent(keyword.value)}` })
  }
})

const reset = () => {
  searched.value = false
  searchResult.value = []
  keyword.value = ''
  void router.replace({ query: {} })
}

watch(
  () => route.query.keyword,
  newKeyword => {
    if (!newKeyword || Array.isArray(newKeyword) || keyword.value === newKeyword) {
      return
    }
    keyword.value = newKeyword
    void searchApi.sendRequest()
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
    void router.replace({ query: {} })
  },
)

const canSearch = computed(() => !searchApi.loading && Boolean(keyword))
</script>

<template>
  <div class="flex h-screen flex-col overflow-auto">
    <div v-if="!searched" class="my-auto flex -translate-y-[10vh] transform flex-col gap-4 px-4">
      <div class="w-full max-w-[600px] self-center">
        <ClsImage aspect-ratio="26.4%">
          <img src="/images/Logo.Text.svg" />
        </ClsImage>
      </div>
      <div class="flex items-stretch justify-center gap-3">
        <InputText
          v-model="keyword"
          type="text"
          size="large"
          class="min-w-0 max-w-[700px] flex-grow"
          :placeholder="t('search.placeholder')"
          @keydown.enter="searchApi.sendRequest"
        />
        <Button
          class="shrink-0"
          size="large"
          :title="t('search.buttonTitle')"
          :loading="searchApi.loading"
          icon="pi pi-search"
          :disabled="!canSearch"
          @click="searchApi.sendRequest"
        />
      </div>
    </div>
    <PageHeader
      v-if="searched"
      v-model="keyword"
      :busy="searchApi.loading"
      @home-navigate="reset"
      @search="searchApi.sendRequest"
    />
    <div v-if="searched" class="flex flex-col gap-1 px-3 pb-4 pt-2">
      <AlbumSearchItem v-for="item of searchResult" :key="item.id" :item="item" />
      <div v-if="searchApi.loaded && searchResult.length === 0" class="p-4 text-center">
        No result
      </div>
    </div>

    <Loading v-if="searchApi.loading" />
    <Error v-if="searchApi.error" @retry="searchApi.sendRequest" />
  </div>
</template>
