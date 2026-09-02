import { computed, defineComponent } from 'vue'

export const Icon = defineComponent({
  name: 'Icon',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const classTokens = computed(() => props.name.split(' ').map(it => `pi-${it}`))
    return () => <i class={['pi', classTokens.value]} />
  },
})
