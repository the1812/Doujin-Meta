<script setup lang="ts">
import Button from 'primevue/button'
import THBWikiIcon from '../../assets/thbWiki.png'

const { id } = defineProps<{ id: string }>()

</script>

<template>
  <a :href="`https://www.dizzylab.net/d/${id}`" target="_blank" class="relative flex">
    <div class="relative group flex-grow">
      <div :class="[
        'pointer-events-none opacity-0 group-focus-within:opacity-100',
        'absolute h-[calc(100%+8px)] w-[calc(100%+8px)] -left-1 -top-1 rounded-[10px]',
        'bg-gradient-to-br from-thb-wiki-orange to-thb-wiki-pink',
      ]"></div>
      <div :class="[
        'pointer-events-none opacity-0 group-focus-within:opacity-100',
        'absolute h-[calc(100%+4px)] w-[calc(100%+4px)] -left-[2px] -top-[2px] rounded-[8px]',
        'bg-white',
      ]"></div>
      <Button :class="[
        '!bg-gradient-to-br from-thb-wiki-orange to-thb-wiki-pink !border-transparent !border-0',
        'focus:!shadow-none',
        'hover:from-thb-wiki-orange-light hover:to-thb-wiki-pink-light',
      ]" label="" size="large">
        <div class="flex items-center gap-2">
          <img class="w-6" :src="THBWikiIcon" />
          <div class="text-4 font-medium">View on THBWiki</div>
        </div>
      </Button>
    </div>
  </a>
</template>
