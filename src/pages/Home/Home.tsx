import { defineComponent, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { AlbumSearchItem as AlbumSearchItemData } from '../../../shared/api'
import { searchAlbums, useApi } from '../../api'
import { LoadError } from '../../components/Error'
import { Loading } from '../../components/Loading'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { SearchBar } from '../../components/SearchBar'
import { useI18n } from '../../i18n'
import { AlbumSearchItem } from './AlbumSearchItem'

export const Home = defineComponent({
  name: 'Home',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()
    const searched = ref(false)
    const keyword = ref('')
    const searchResult = ref<AlbumSearchItemData[]>([])

    const searchApi = useApi(async () => {
      if (!keyword.value) {
        return
      }
      searched.value = true
      searchResult.value = []
      void router.replace({ query: { keyword: keyword.value } })
      searchResult.value = await searchAlbums(keyword.value)
      const firstResult = searchResult.value[0]
      const isFullMatch =
        searchResult.value.length === 1 &&
        firstResult !== undefined &&
        firstResult.album === keyword.value
      if (isFullMatch) {
        void router.push({ path: `/albums/${firstResult.id}` })
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
      { immediate: true },
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

    const sendSearchRequest = () => void searchApi.sendRequest()

    return () => (
      <div class="flex h-screen flex-col overflow-auto">
        {!searched.value && (
          <div class="my-auto flex transform px-4">
            <SearchBar
              v-model={keyword.value}
              busy={searchApi.loading}
              onSearch={sendSearchRequest}
            />
          </div>
        )}
        {searched.value && (
          <PageHeader
            v-model={keyword.value}
            busy={searchApi.loading}
            onHomeNavigate={reset}
            onSearch={sendSearchRequest}
          />
        )}
        {searched.value && (
          <div class="flex flex-col gap-1 px-3 pb-4 pt-2">
            {searchResult.value.map(item => (
              <AlbumSearchItem key={item.id} item={item} />
            ))}
            {searchApi.loaded && searchResult.value.length === 0 && (
              <div class="p-4 text-center">{t('search.noResult')}</div>
            )}
          </div>
        )}

        {searchApi.loading && <Loading />}
        {searchApi.error && <LoadError onRetry={sendSearchRequest} />}
      </div>
    )
  },
})
