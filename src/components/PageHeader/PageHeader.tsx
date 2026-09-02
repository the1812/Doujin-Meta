import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { computed, defineComponent } from 'vue'

import { useI18n } from '../../i18n'
import { ClsImage } from '../ClsImage'

export const PageHeader = defineComponent({
  name: 'PageHeader',
  props: {
    modelValue: String,
    busy: Boolean,
  },
  emits: ['homeNavigate', 'search', 'update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const keyword = computed({
      get: () => props.modelValue ?? '',
      set: value => emit('update:modelValue', value),
    })
    const handleSearch = () => emit('search', keyword.value)
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleSearch()
      }
    }

    return () => (
      <div
        class={[
          'sticky top-0 z-20 flex min-h-[80px] flex-col justify-center gap-4 bg-white p-4',
          'border-b border-[#d4d4d8] shadow-[0_1px_2px_0_rgb(0_0_0_/_5%)]',
        ]}
      >
        <div class="flex items-stretch justify-center gap-3">
          <div class="h-10 w-10 self-center">
            <ClsImage
              aspectRatio="100%"
              class="cursor-pointer"
              onClick={() => emit('homeNavigate')}
            >
              <img src="/images/Logo.svg" />
            </ClsImage>
          </div>
          <InputText
            v-model={keyword.value}
            type="text"
            size="small"
            class="min-w-0 max-w-[700px] flex-grow"
            placeholder={t('search.placeholder')}
            onKeydown={handleKeydown}
          />
          <Button
            class="shrink-0"
            loading={props.busy}
            icon="pi pi-search"
            disabled={!keyword.value}
            title={t('search.buttonTitle')}
            onClick={handleSearch}
          />
        </div>
      </div>
    )
  },
})
