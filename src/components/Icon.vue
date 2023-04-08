<script setup lang="ts">
const { name } = defineProps<{ name: string }>()

const classTokens = name.split(' ').map(it => `pi-${it}`)
</script>

<template>
  <i class="pi" :class="classTokens"></i>
</template>
