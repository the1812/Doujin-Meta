import { computed, defineComponent, type PropType } from 'vue'
import { RouterLink } from 'vue-router'

import type { AlbumSearchItem as AlbumSearchItemData } from '../../../shared/api'

export const AlbumSearchItem = defineComponent({
  name: 'AlbumSearchItem',
  props: {
    item: {
      type: Object as PropType<AlbumSearchItemData>,
      required: true,
    },
  },
  setup(props) {
    const titleSlices = computed(() => {
      const slices: { text: string; highlighted: boolean }[] = []
      let currentIndex = 0
      for (const [start, end] of props.item.albumMatches) {
        slices.push({ text: props.item.album.slice(currentIndex, start), highlighted: false })
        slices.push({ text: props.item.album.slice(start, end), highlighted: true })
        currentIndex = end
      }
      slices.push({ text: props.item.album.slice(currentIndex), highlighted: false })
      return slices.filter(slice => slice.text)
    })

    return () => (
      <div class="flex justify-center">
        <RouterLink
          to={{ name: 'album', params: { id: props.item.id } }}
          class="flex max-w-[830px] flex-grow cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-gray-50"
        >
          <div class="flex h-10 w-10 items-center justify-center">
            {props.item.links.cover && (
              <img
                src={props.item.links.cover}
                class="w-10 shrink-0 overflow-hidden rounded-sm object-contain shadow-sm"
              />
            )}
          </div>
          <div class="flex-grow [&>b]:font-medium [&>b]:text-violet-500">
            {titleSlices.value.map(slice => (slice.highlighted ? <b>{slice.text}</b> : slice.text))}
          </div>
        </RouterLink>
      </div>
    )
  },
})
