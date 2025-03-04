<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useI18n } from '../../i18n'
import ClsImage from '../ClsImage.vue'

const props = defineProps<{
  modelValue?: string
  busy?: boolean
}>()
const emit = defineEmits<{
  (e: 'homeNavigate'): void
  (e: 'search', keyword: string): void
  (e: 'update:modelValue', value: string): void
}>()

const { t } = useI18n()
const keyword = computed({
  get() {
    return props.modelValue ?? ''
  },
  set(value: string) {
    emit('update:modelValue', value)
  },
})
const handleSearch = () => {
  emit('search', keyword.value)
}
</script>

<template>
  <div
    :class="[
      'sticky top-0 z-20 flex min-h-[80px] flex-col justify-center gap-4 bg-white p-4',
      'border-b border-[#d4d4d8] shadow-[0_1px_2px_0_rgb(0_0_0_/_5%)]',
    ]"
  >
    <div class="flex items-center justify-center gap-3">
      <div class="h-10 w-10">
        <ClsImage aspect-ratio="100%" class="cursor-pointer" @click="emit('homeNavigate')">
          <img src="/images/Logo.svg" />
        </ClsImage>
      </div>
      <InputText
        v-model="keyword"
        type="text"
        class="p-inputtext-sm min-w-0 max-w-[700px] flex-grow"
        :placeholder="t('search.placeholder')"
        @keydown.enter="handleSearch"
      />
      <Button
        class="p-button-sm shrink-0"
        :loading="busy"
        icon="pi pi-search"
        :disabled="!keyword"
        :title="t('search.buttonTitle')"
        @click="handleSearch"
      />
    </div>
  </div>
</template>
