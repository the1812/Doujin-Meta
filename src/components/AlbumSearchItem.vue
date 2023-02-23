<script setup lang="ts">
import { AlbumApiItem } from '../api/types'

const { item } = defineProps<{ item: AlbumApiItem }>()
</script>

<template>
  <div class="flex justify-center">
    <RouterLink :to="`/albums/${encodeURIComponent(item.name)}/${item.id}`"
      class="flex flex-grow items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded-md max-w-[820px]">
      <img :src="encodeURIComponent(item.coverUrl)"
        class="w-8 h-8 shadow-border-[1px] object-contain rounded-sm overflow-hidden shrink-0" />
      <div class="flex-grow">
        {{ item.name }}
      </div>
    </RouterLink>
  </div>
</template>
