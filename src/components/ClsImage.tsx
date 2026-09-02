import { defineComponent } from 'vue'

export const ClsImage = defineComponent({
  name: 'ClsImage',
  props: {
    aspectRatio: {
      type: String,
      required: true,
    },
  },
  emits: ['click'],
  setup(props, { emit, slots }) {
    return () => (
      <div
        class="relative"
        style={{ paddingTop: props.aspectRatio }}
        onClick={event => emit('click', event)}
      >
        <div class="absolute bottom-0 left-0 right-0 top-0">{slots.default?.()}</div>
      </div>
    )
  },
})
