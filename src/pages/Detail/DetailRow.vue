<script setup lang="ts">
defineProps<{ label: string; value: string }>()
</script>

<template>
  <div class="flex text-sm">
    <div
      class="flex w-[100px] shrink-0 items-center justify-end border-r border-solid border-gray-200 bg-gray-100 px-2 py-1"
    >
      {{ label }}
    </div>
    <div class="flex flex-grow items-center px-2 py-1">
      {{ value }}
    </div>
  </div>
</template>
