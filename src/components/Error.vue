<script setup lang="ts">
import Button from 'primevue/button'
import CenterScreen from './CenterScreen.vue'
import { useI18n } from '../i18n'

defineEmits<{
  (e: 'retry'): void
}>()

const { t } = useI18n()
</script>
<template>
  <CenterScreen>
    <div class="flex flex-col items-center gap-4">
      <i class="pi pi-exclamation-circle !text-4xl"></i>
      <div class="text-lg">{{ t('loadFailed.description') }}</div>
      <Button icon="pi pi-refresh" :label="t('loadFailed.retry')" @click="$emit('retry')" />
    </div>
  </CenterScreen>
</template>
