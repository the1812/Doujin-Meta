<script setup lang="ts">
defineProps<{ src: string }>()
</script>
<template>
  <a target="_blank" class="h-7 w-7 rounded-full overflow-hidden group">
    <img :src="src" class="transform transition-transform group-hover:scale-[1.1]" />
  </a>
</template>
