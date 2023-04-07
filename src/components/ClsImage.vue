<script setup lang="ts">
const { aspectRatio } = defineProps<{
  aspectRatio: string
}>()

</script>
<template>
  <div class="relative" :style="{ paddingTop: aspectRatio }">
    <div class="absolute top-0 left-0 bottom-0 right-0">
      <slot />
    </div>
  </div>
</template>