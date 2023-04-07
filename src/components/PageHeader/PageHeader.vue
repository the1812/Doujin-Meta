<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useI18n } from '../../i18n'
import ClsImage from '../ClsImage.vue'

const { modelValue, busy } = defineProps<{
  modelValue?: string
  busy?: boolean
}>()
const emit = defineEmits<{
  (e: 'homeNavigate'): void
  (e: 'search', keyword: string): void
  (e: 'update:modelValue', value: string): void
}>()

const { t } = useI18n()
const keyword = $computed({
  get() {
    return modelValue
  },
  set(value: string) {
    emit('update:modelValue', value)
  }
})
const handleSearch = async () => {
  emit('search', keyword)
}

</script>

<template>
  <div :class="[
    'flex flex-col justify-center gap-4 p-4 bg-white sticky top-0 z-20 min-h-[80px]',
    'border-b border-[#d4d4d8] shadow-[0_1px_2px_0_rgb(0_0_0_/_5%)]',
  ]">
    <div class="flex items-center justify-center gap-3">
      <div class="w-10 h-10">
        <ClsImage aspect-ratio="100%" class="cursor-pointer" @click="emit('homeNavigate')">
          <img src="/images/Logo.svg" />
        </ClsImage>
      </div>
      <InputText type="text" class="p-inputtext-sm flex-grow min-w-0 max-w-[700px]" v-model="keyword"
        @keydown.enter="handleSearch" :placeholder="t('search.placeholder')" />
      <Button class="shrink-0 p-button-sm" :loading="busy" icon="pi pi-search" :disabled="!keyword" @click="handleSearch"
        :title="t('search.buttonTitle')" />
    </div>
  </div>
</template>