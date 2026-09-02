import { defineComponent, Teleport } from 'vue'

export const CenterScreen = defineComponent({
  name: 'CenterScreen',
  setup(_, { slots }) {
    return () => (
      <Teleport to="body">
        <div class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          {slots.default?.()}
        </div>
      </Teleport>
    )
  },
})
