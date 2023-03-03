<script setup lang="ts">
import CenterScreen from './CenterScreen.vue'

defineEmits<{
  (e: 'retry'): void
}>()
</script>
<template>

  <CenterScreen>
    <div class="flex flex-col items-center gap-4">
      <div class="text-lg">Failed to load.</div>
      <Button class="p-button-sm" icon="pi pi-refresh" @click="$emit('retry')" label="Retry"></Button>
    </div>
  </CenterScreen>
</template>