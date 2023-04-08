<script setup lang="ts">
import Chip from 'primevue/chip'
</script>
<template>
  <Chip class="!bg-indigo-600 !text-slate-50" v-bind="$attrs">
    <slot></slot>
  </Chip>
</template>
