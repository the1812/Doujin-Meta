<script setup lang="ts">
const { label, value } = defineProps<{ label: string; value: string }>()

</script>

<template>
  <div class="flex text-sm">
    <div class="flex items-center py-1 px-3 justify-end w-[30%] shrink-0 bg-gray-100">
      {{ label }}
    </div>
    <div class="flex items-center py-1 px-3 flex-grow">
      {{ value }}
    </div>
  </div>
</template>
