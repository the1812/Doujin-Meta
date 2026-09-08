import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import { defineComponent, ref, watch } from 'vue'

import type { AlbumSummary, HomeAlbums } from '../../../shared/api'
import { getHomeAlbums, useApi } from '../../api'
import { useI18n } from '../../i18n'
import { AlbumCard } from './AlbumCard'

export const AlbumDiscovery = defineComponent({
  name: 'AlbumDiscovery',
  props: {
    active: Boolean,
  },
  setup(props) {
    const { t } = useI18n()
    const albums = ref<HomeAlbums>()
    const homeApi = useApi(async () => {
      albums.value = await getHomeAlbums()
    })
    const refresh = () => void homeApi.sendRequest()

    watch(
      () => props.active,
      active => {
        if (active && !albums.value && !homeApi.loading) {
          refresh()
        }
      },
      { immediate: true },
    )

    const renderAlbums = (items: AlbumSummary[] | undefined) => (
      <div class="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 sm:gap-x-6">
        {items
          ? items.map(album => <AlbumCard key={album.id} album={album} />)
          : Array.from({ length: 8 }, (_, index) => (
              <div key={index}>
                <Skeleton class="aspect-square !h-auto !rounded-md" />
                <Skeleton class="mt-3 !rounded-none" width="85%" height="1rem" />
                <Skeleton class="mt-2 !rounded-none" width="55%" height="0.75rem" />
              </div>
            ))}
      </div>
    )

    return () =>
      props.active && (
        <div class="mx-auto w-full max-w-[886px] px-4 pb-12 sm:px-6 2xl:max-w-[1772px]">
          {homeApi.error && (
            <div
              role="alert"
              class="mb-6 flex items-center justify-center gap-3 text-sm text-gray-500"
            >
              <span>{t('loadFailed.description')}</span>
              <Button text size="small" label={t('loadFailed.retry')} onClick={refresh} />
            </div>
          )}
          {(albums.value || homeApi.loading) && (
            <div class="grid grid-cols-1 gap-x-12 gap-y-10 2xl:grid-cols-2">
              <section
                class="min-w-0"
                aria-labelledby="recent-albums"
                aria-busy={homeApi.loading && !albums.value}
              >
                <h2 id="recent-albums" class="mb-5 flex h-[30px] items-center text-lg font-medium">
                  {t('home.recent')}
                </h2>
                {renderAlbums(albums.value?.recent)}
              </section>
              <section class="min-w-0" aria-labelledby="random-albums" aria-busy={homeApi.loading}>
                <div class="mb-5 flex h-[30px] items-center justify-between gap-4">
                  <h2 id="random-albums" class="text-lg font-medium">
                    {t('home.random')}
                  </h2>
                  <Button
                    text
                    size="small"
                    icon="pi pi-refresh"
                    label={t('home.shuffle')}
                    class="!py-1 !leading-5"
                    loading={homeApi.loading}
                    disabled={!albums.value || homeApi.loading}
                    onClick={refresh}
                  />
                </div>
                {renderAlbums(albums.value?.random)}
              </section>
            </div>
          )}
        </div>
      )
  },
})
