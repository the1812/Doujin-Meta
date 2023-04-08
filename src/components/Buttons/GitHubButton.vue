<script setup lang="ts">
import Button from 'primevue/button'
import GitHubIcon from '../../assets/gitHub.svg'
import { useI18n } from '../../i18n'

const { link } = defineProps<{ link: string }>()
const { t } = useI18n()
</script>

<template>
  <a :href="link" target="_blank" class="flex">
    <Button
      :class="[
        '!bg-github-black !border-0 flex-grow',
        'hover:!bg-github-black-light focus:!button-border-github-black',
      ]"
      label=""
      size="large"
    >
      <div class="flex items-center gap-2 justify-center flex-grow">
        <img class="w-6" :src="GitHubIcon" />
        <div class="font-semibold">{{ t('linkButtons.GitHub') }}</div>
      </div>
    </Button>
  </a>
</template>
