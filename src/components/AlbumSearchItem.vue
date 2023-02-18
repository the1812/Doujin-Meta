<script setup lang="ts">
import { AlbumApiItem } from '../api/types'
import Image from 'primevue/image'

const { item } = defineProps<{ item: AlbumApiItem }>()
</script>

<template>
  <div class="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded-md">
    <Image :src="item.coverUrl" class="w-8 h-8 bg-gray-200 object-contain rounded-sm overflow-hidden" />
    <div class="w-0 flex-grow truncate">
      {{ item.name }}
    </div>
  </div>
</template>
