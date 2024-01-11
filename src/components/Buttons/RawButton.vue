<script setup lang="ts">
import Button from 'primevue/button'
import { useI18n } from '../../i18n'

defineProps<{ link: string }>()
const { t } = useI18n()
</script>

<template>
  <a :href="link" target="_blank" class="flex">
    <Button
      :class="[
        'flex-grow !border-0 !bg-slate-800',
        'hover:!bg-slate-700 focus:!button-border-slate-800',
      ]"
      label=""
      size="large"
    >
      <div class="flex flex-grow items-center justify-center gap-2">
        <div class="flex items-center justify-center p-[3px]">
          <i class="pi pi-file !text-[18px]"></i>
        </div>
        <div class="font-semibold">{{ t('linkButtons.raw') }}</div>
      </div>
    </Button>
  </a>
</template>
