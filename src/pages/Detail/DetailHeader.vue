<script setup lang="ts">
const { label, value } = defineProps<{ label: string; value: string }>()
</script>

<template>
  <div class="flex bg-gray-100 text-sm">
    <div
      class="flex w-[100px] shrink-0 items-center justify-end border-r border-solid border-gray-200 px-2 py-1 font-semibold"
    >
      {{ label }}
    </div>
    <div class="flex flex-grow items-center px-2 py-1 font-semibold">
      {{ value }}
    </div>
  </div>
</template>
