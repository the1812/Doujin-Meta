<script setup lang="ts">
import { AlbumApiItem } from '../../api/types'

const props = defineProps<{ item: AlbumApiItem }>()

type TitleSlice = {
  text: string
  isHighlight: boolean
  index: number
}
const titleSlices = (() => {
  const result: TitleSlice[] = []
  let currentIndex = 0
  for (const [start, end] of props.item.matches) {
    result.push({
      text: props.item.name.substring(currentIndex, start),
      isHighlight: false,
      index: currentIndex,
    })
    result.push({
      text: props.item.name.substring(start, end + 1),
      isHighlight: true,
      index: start,
    })
    currentIndex = end + 1
  }
  result.push({
    text: props.item.name.substring(currentIndex),
    isHighlight: false,
    index: currentIndex,
  })
  return result.filter(it => it.text)
})()
</script>

<template>
  <div class="flex justify-center">
    <RouterLink
      :to="`/albums/${encodeURIComponent(item.name)}`"
      class="flex max-w-[830px] flex-grow cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-gray-100"
    >
      <div class="flex h-10 w-10 items-center justify-center">
        <img
          :src="item.coverUrl"
          class="w-10 shrink-0 overflow-hidden rounded-sm object-contain shadow-sm"
        />
      </div>
      <div class="flex-grow">
        <span
          v-for="slice of titleSlices"
          :key="slice.index"
          :class="{ 'text-violet-500': slice.isHighlight }"
        >
          {{ slice.text }}
        </span>
      </div>
    </RouterLink>
  </div>
</template>
