import { Chip } from 'primevue'
import { computed, defineComponent, type PropType } from 'vue'
import { RouterLink } from 'vue-router'

import type { AlbumSearchItem as AlbumSearchItemData } from '../../../shared/api'
import { MetadataSeparator } from '../../common'
import { useI18n } from '../../i18n'

const getHighlightedSlices = (value: string, matches: [number, number][]) => {
  const slices: { text: string; highlighted: boolean }[] = []
  let currentIndex = 0
  for (const [start, end] of matches) {
    slices.push({ text: value.slice(currentIndex, start), highlighted: false })
    slices.push({ text: value.slice(start, end), highlighted: true })
    currentIndex = end
  }
  slices.push({ text: value.slice(currentIndex), highlighted: false })
  return slices.filter(slice => slice.text)
}

const renderSlices = (slices: ReturnType<typeof getHighlightedSlices>) =>
  slices.map(slice => (slice.highlighted ? <b>{slice.text}</b> : slice.text))

const renderFlexibleSlices = (slices: ReturnType<typeof getHighlightedSlices>) =>
  slices.map(slice =>
    slice.highlighted ? (
      <b class="shrink-0">{slice.text}</b>
    ) : (
      <span class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{slice.text}</span>
    ),
  )

export const AlbumSearchItem = defineComponent({
  name: 'AlbumSearchItem',
  props: {
    item: {
      type: Object as PropType<AlbumSearchItemData>,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const titleSlices = computed(() =>
      getHighlightedSlices(props.item.album, props.item.albumMatches),
    )
    const albumArtistSlices = computed(() =>
      props.item.albumArtists.map((albumArtist, index) =>
        getHighlightedSlices(albumArtist, props.item.albumArtistMatches[index] ?? []),
      ),
    )
    const matchedFieldSlices = computed(() => {
      const matchedField = props.item.matchedField
      return matchedField === undefined
        ? []
        : getHighlightedSlices(matchedField.value, matchedField.matches)
    })

    return () => (
      <div class="flex justify-center">
        <RouterLink
          to={{ name: 'album', params: { id: props.item.id } }}
          class="flex max-w-[838px] flex-grow cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-gray-50"
        >
          <div class="flex h-12 w-12 shrink-0 items-center justify-center">
            {props.item.links.cover && (
              <img
                src={props.item.links.cover}
                class="h-12 w-12 overflow-hidden rounded-sm object-contain shadow-sm"
              />
            )}
          </div>
          <div class="min-w-0 flex-grow [&_b]:font-medium [&_b]:text-violet-500">
            <div>{renderSlices(titleSlices.value)}</div>
            {albumArtistSlices.value.length > 0 && (
              <div class="mt-0.5 text-xs text-gray-500">
                {albumArtistSlices.value.map((slices, index) => (
                  <span>
                    {index > 0 && MetadataSeparator}
                    {renderSlices(slices)}
                  </span>
                ))}
              </div>
            )}
          </div>
          {props.item.matchedField && (
            <Chip class="ml-auto max-w-[50%] shrink-0 !gap-0 !bg-gray-100 !py-2 !text-sm [&_b]:font-semibold [&_b]:text-violet-500">
              <span class="flex min-w-0 items-baseline overflow-hidden whitespace-nowrap">
                <span class="shrink-0">
                  {t(`search.matchField.${props.item.matchedField.field}`)}:{' '}
                </span>
                {renderFlexibleSlices(matchedFieldSlices.value)}
              </span>
            </Chip>
          )}
        </RouterLink>
      </div>
    )
  },
})
