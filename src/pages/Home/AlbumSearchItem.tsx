import { defineComponent, type PropType } from 'vue'
import { RouterLink } from 'vue-router'

import type { AlbumSummary } from '../../../shared/api'

export const AlbumSearchItem = defineComponent({
  name: 'AlbumSearchItem',
  props: {
    item: {
      type: Object as PropType<AlbumSummary>,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div class="flex justify-center">
        <RouterLink
          to={{ name: 'album', params: { id: props.item.id } }}
          class="flex max-w-[830px] flex-grow cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-gray-100"
        >
          <div class="flex h-10 w-10 items-center justify-center">
            {props.item.links.cover && (
              <img
                src={props.item.links.cover}
                class="w-10 shrink-0 overflow-hidden rounded-sm object-contain shadow-sm"
              />
            )}
          </div>
          <div class="flex-grow [&>b]:font-medium [&>b]:text-violet-500">{props.item.album}</div>
        </RouterLink>
      </div>
    )
  },
})
