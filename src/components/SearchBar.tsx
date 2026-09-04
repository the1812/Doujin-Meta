import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { computed, defineComponent } from 'vue'

import { useI18n } from '../i18n'

export const SearchBar = defineComponent({
  name: 'SearchBar',
  props: {
    modelValue: String,
    busy: Boolean,
    logoClickable: Boolean,
  },
  emits: ['logoClick', 'search', 'update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const keyword = computed({
      get: () => props.modelValue ?? '',
      set: value => emit('update:modelValue', value),
    })
    const search = () => emit('search', keyword.value)

    return () => (
      <div class="flex w-full items-center justify-center gap-3">
        {props.logoClickable ? (
          <button
            type="button"
            class="h-12 w-12 shrink-0"
            aria-label="Doujin Meta"
            onClick={() => emit('logoClick')}
          >
            <img src="/images/Logo.svg" alt="" />
          </button>
        ) : (
          <img class="h-12 w-12 shrink-0" src="/images/Logo.svg" alt="" />
        )}
        <InputText
          v-model={keyword.value}
          type="text"
          class="h-12 min-w-0 max-w-[700px] flex-grow"
          placeholder={t('search.placeholder')}
          onKeydown={event => {
            if (event.key === 'Enter') {
              search()
            }
          }}
        />
        <Button
          class="!h-12 !w-12 shrink-0 !p-0"
          title={t('search.buttonTitle')}
          loading={props.busy}
          icon="pi pi-search"
          disabled={props.busy || !keyword.value}
          onClick={search}
        />
      </div>
    )
  },
})
