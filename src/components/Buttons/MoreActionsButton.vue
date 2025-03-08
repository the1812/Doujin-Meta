<script setup lang="ts">
import Button from 'primevue/button'
import Menu, { MenuMethods } from 'primevue/menu'
import { ref } from 'vue'
import { useI18n } from '../../i18n'

const props = defineProps<{ rawLink: string }>()

const { t } = useI18n()
const menu = ref<MenuMethods>()
const menuItems = [
  {
    label: t('linkButtons.raw'),
    icon: 'pi pi-file',
    url: props.rawLink,
    target: '_blank',
  },
]
</script>

<template>
  <Button
    :class="[
      'flex-grow !border-0 !bg-github-black',
      'hover:!bg-github-black-light focus:!button-border-github-black',
    ]"
    label=""
    size="large"
    icon="pi pi-ellipsis-h"
    @click="menu?.toggle($event)"
  />
  <Menu id="more-actions-menu" ref="menu" :model="menuItems" popup />
</template>
