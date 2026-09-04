import { computed, defineComponent } from 'vue'

import { SearchBar } from '../SearchBar'

export const PageHeader = defineComponent({
  name: 'PageHeader',
  props: {
    modelValue: String,
    busy: Boolean,
  },
  emits: ['homeNavigate', 'search', 'update:modelValue'],
  setup(props, { emit }) {
    const keyword = computed({
      get: () => props.modelValue ?? '',
      set: value => emit('update:modelValue', value),
    })
    const handleSearch = (value: string) => emit('search', value)

    return () => (
      <div
        class={[
          'sticky top-0 z-20 flex min-h-[80px] flex-col justify-center gap-4 bg-white p-4',
          'border-b border-zinc-100 shadow-[0_1px_2px_0_rgb(0_0_0_/_3%)]',
        ]}
      >
        <SearchBar
          v-model={keyword.value}
          busy={props.busy}
          logoClickable
          onLogoClick={() => emit('homeNavigate')}
          onSearch={handleSearch}
        />
      </div>
    )
  },
})
