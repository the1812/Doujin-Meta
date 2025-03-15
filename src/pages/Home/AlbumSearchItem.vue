<script setup lang="ts">
import { AlbumItem } from '../../api/types'

defineProps<{ item: AlbumItem }>()
</script>

<template>
  <div class="flex justify-center">
    <RouterLink
      :to="`/albums/${item.id}`"
      class="flex max-w-[830px] flex-grow cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-gray-100"
    >
      <div class="flex h-10 w-10 items-center justify-center">
        <img
          :src="item.coverUrl"
          class="w-10 shrink-0 overflow-hidden rounded-sm object-contain shadow-sm"
        />
      </div>
      <div class="flex-grow">
        <!-- <span
          v-for="slice of titleSlices"
          :key="slice.index"
          :class="{ 'text-violet-500': slice.isHighlight }"
        >
          {{ slice.text }}
        </span> -->
        {{ item.album }}
      </div>
    </RouterLink>
  </div>
</template>
