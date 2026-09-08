import Tooltip from 'primevue/tooltip'
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  withDirectives,
  type PropType,
} from 'vue'
import { RouterLink } from 'vue-router'

import type { AlbumSummary } from '../../../shared/api'
import { MetadataSeparator } from '../../common'

export const AlbumCard = defineComponent({
  name: 'AlbumCard',
  props: {
    album: { type: Object as PropType<AlbumSummary>, required: true },
  },
  setup(props) {
    const title = ref<HTMLElement>()
    const truncated = ref(false)
    const observer = new ResizeObserver(() => {
      const element = title.value as HTMLElement
      truncated.value = element.scrollWidth > element.clientWidth
    })
    onMounted(() => observer.observe(title.value as HTMLElement))
    onBeforeUnmount(() => observer.disconnect())

    return () => (
      <RouterLink
        to={{ name: 'album', params: { id: props.album.id } }}
        class="group min-w-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 rounded-md focus-visible:outline-violet-500"
      >
        <div class="flex aspect-square items-center justify-center">
          {props.album.links.cover ? (
            <img
              src={props.album.links.cover}
              alt=""
              loading="lazy"
              class="h-auto max-h-full w-auto max-w-full rounded-md"
            />
          ) : (
            <i class="pi pi-image !text-3xl text-gray-300" aria-hidden="true" />
          )}
        </div>
        {withDirectives(
          <div
            ref={title}
            class="mt-3 truncate text-sm font-medium leading-5 group-hover:text-violet-600"
          >
            {props.album.album}
          </div>,
          [
            [
              Tooltip,
              {
                value: props.album.album,
                disabled: !truncated.value,
                class:
                  'text-sm leading-5 !max-w-80 [&.p-tooltip-top]:-translate-y-2 [&.p-tooltip-bottom]:translate-y-2',
                pt: { text: { class: '!px-2 !py-1' } },
              },
              undefined,
              { top: true },
            ],
          ],
        )}
        <div
          class="mt-1 truncate text-xs leading-5 text-gray-500"
          title={props.album.albumArtists.join(MetadataSeparator)}
        >
          {props.album.albumArtists.join(MetadataSeparator)}
        </div>
      </RouterLink>
    )
  },
})
