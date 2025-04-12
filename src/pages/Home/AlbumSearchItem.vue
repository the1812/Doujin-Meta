<script setup lang="ts">
import { AlbumSearchItem } from '../../api/types'

defineProps<{ item: AlbumSearchItem }>()
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
      <div class="flex-grow [&>b]:font-medium [&>b]:text-violet-500">
        {{ item.album }}
      </div>
    </RouterLink>
  </div>
</template>
