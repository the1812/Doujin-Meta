<script setup lang="ts">
import Button from 'primevue/button'
import THBWikiIcon from '../../assets/thbWiki.png'
import { useI18n } from '../../i18n'

const { id } = defineProps<{ id: string }>()
const { t } = useI18n()

</script>

<template>
  <a :href="`https://thwiki.cc/${id}`" target="_blank" class="relative flex">
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
        <div class="flex items-center gap-2 justify-center flex-grow">
          <img class="w-6" :src="THBWikiIcon" />
          <div class="font-semibold">{{ t('linkButtons.THBWiki') }}</div>
        </div>
      </Button>
    </div>
  </a>
</template>
