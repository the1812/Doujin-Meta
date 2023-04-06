<script setup lang="ts">
import Button from 'primevue/button'

const { link } = defineProps<{ link: string; }>()

</script>

<template>
  <a :href="link" target="_blank" class="flex">
    <Button :class="[
      '!bg-slate-800 !border-0 flex-grow',
      'hover:!bg-slate-700 focus:!button-border-slate-800'
    ]" label="" size="large" >
    <div class="flex items-center gap-2 justify-center flex-grow">
      <i class="!text-[18px] pi pi-file" />
      <div class="font-semibold">View Raw</div>
    </div>
  </Button>
  </a>
</template>
