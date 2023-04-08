<script setup lang="ts">
const { aspectRatio } = defineProps<{
  aspectRatio: string
}>()
</script>
<template>
  <div class="relative" :style="{ paddingTop: aspectRatio }">
    <div class="absolute bottom-0 left-0 right-0 top-0">
      <slot></slot>
    </div>
  </div>
</template>
