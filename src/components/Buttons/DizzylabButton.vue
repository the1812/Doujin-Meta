<script setup lang="ts">
import Button from 'primevue/button'
import DizzylabIcon from '../../assets/dizzylab.svg'

const { id } = defineProps<{ id: string }>()

</script>

<template>
  <a :href="`https://www.dizzylab.net/d/${id}`" target="_blank" class="flex">
    <Button :class="[
      '!bg-dizzylab-orange !border-0 flex-grow justify-center',
      'hover:!bg-dizzylab-orange-light focus:!button-border-dizzylab-orange'
    ]" label="" size="large" >
    <div class="flex items-center gap-2">
      <img class="w-6" :src="DizzylabIcon" />
      <div class="font-semibold">View on dizzylab</div>
    </div>
  </Button>
  </a>
</template>
