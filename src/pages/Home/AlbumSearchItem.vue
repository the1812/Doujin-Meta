<script setup lang="ts">
import { AlbumApiItem } from '../../api/types'

const { item } = defineProps<{ item: AlbumApiItem }>()

type TitleSlice = {
  text: string
  isHighlight: boolean
  index: number
}
const titleSlices = (() => {
  const result: TitleSlice[] = []
  let currentIndex = 0
  for (const [start, end] of item.matches) {
    result.push({
      text: item.name.substring(currentIndex, start),
      isHighlight: false,
      index: currentIndex,
    })
    result.push({
      text: item.name.substring(start, end + 1),
      isHighlight: true,
      index: start,
    })
    currentIndex = end + 1
  }
  result.push({
    text: item.name.substring(currentIndex),
    isHighlight: false,
    index: currentIndex,
  })
  return result.filter(it => it.text)
})()

console.log(titleSlices)

</script>

<template>
  <div class="flex justify-center">
    <RouterLink :to="`/albums/${encodeURIComponent(item.name)}/${item.id}`"
      class="flex flex-grow items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded-md max-w-[830px]">
      <img :src="item.coverUrl"
        class="w-10 shadow-border-[1px] object-contain rounded-sm overflow-hidden shrink-0" />
      <div class="flex-grow">
        <span v-for="slice of titleSlices" :key="slice.index" :class="{ 'text-violet-500': slice.isHighlight }">
          {{ slice.text }}
        </span>
      </div>
    </RouterLink>
  </div>
</template>
