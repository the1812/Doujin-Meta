<script setup lang="ts">
import Button from 'primevue/button'
import CenterScreen from './CenterScreen.vue'

defineEmits<{
  (e: 'retry'): void
}>()
</script>
<template>
  <CenterScreen>
    <div class="flex flex-col items-center gap-4">
      <div class="text-lg">Failed to load.</div>
      <Button class="p-button-sm" icon="pi pi-refresh" label="Retry" @click="$emit('retry')" />
    </div>
  </CenterScreen>
</template>
