<script setup lang="ts">
const props = defineProps<{ name: string }>()

const classTokens = props.name.split(' ').map(it => `pi-${it}`)
</script>

<template>
  <i class="pi" :class="classTokens"></i>
</template>
