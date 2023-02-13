<script setup lang="ts">
const { label, value } = defineProps<{ label: string; value: string }>()

</script>

<template>
  <div class="flex">
    <div class="flex items-center py-1 px-3 justify-center w-1/4 font-medium bg-gray-100">
      {{ label }}
    </div>
    <div class="flex items-center py-1 px-3 flex-grow">
      {{ value }}
    </div>
  </div>
</template>
