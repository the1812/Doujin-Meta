<script setup lang="ts">
import Button from 'primevue/button'
import GitHubIcon from '../../assets/gitHub.svg'

const { link } = defineProps<{ link: string }>()

</script>

<template>
  <a :href="link" target="_blank" class="flex">
    <Button :class="[
      '!bg-github-black !border-0 flex-grow',
      'hover:!bg-github-black-light focus:!button-border-github-black'
    ]" label="" size="large" >
    <div class="flex items-center gap-2 justify-center flex-grow">
      <img class="w-6" :src="GitHubIcon" />
      <div class="text-4 font-medium">View Source</div>
    </div>
  </Button>
  </a>
</template>
