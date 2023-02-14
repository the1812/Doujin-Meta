<script setup lang="ts">
const { label, value } = defineProps<{ label: string; value: string; }>()

</script>

<template>
  <div class="flex bg-gray-100 text-sm">
    <div class="flex items-center py-1 px-3 justify-end w-[30%] shrink-0 font-medium">
      {{ label }}
    </div>
    <div class="flex items-center py-1 px-3 flex-grow font-medium">
      {{ value }}
    </div>
  </div>
</template>
