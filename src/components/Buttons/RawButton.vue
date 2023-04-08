<script setup lang="ts">
import Button from 'primevue/button'
import { useI18n } from '../../i18n'

const { link } = defineProps<{ link: string }>()
const { t } = useI18n()
</script>

<template>
  <a :href="link" target="_blank" class="flex">
    <Button
      :class="[
        '!bg-slate-800 !border-0 flex-grow',
        'hover:!bg-slate-700 focus:!button-border-slate-800',
      ]"
      label=""
      size="large"
    >
      <div class="flex items-center gap-2 justify-center flex-grow">
        <div class="flex items-center justify-center p-[3px]">
          <i class="!text-[18px] pi pi-file"></i>
        </div>
        <div class="font-semibold">{{ t('linkButtons.raw') }}</div>
      </div>
    </Button>
  </a>
</template>
