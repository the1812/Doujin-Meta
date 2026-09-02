import Chip from 'primevue/chip'
import { defineComponent } from 'vue'

export const PrimaryChip = defineComponent({
  name: 'PrimaryChip',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => (
      <Chip class="!bg-indigo-600 !text-slate-50" {...attrs}>
        {slots.default?.()}
      </Chip>
    )
  },
})
