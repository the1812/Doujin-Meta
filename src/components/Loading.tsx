import ProgressSpinner from 'primevue/progressspinner'
import { defineComponent } from 'vue'

import { CenterScreen } from './CenterScreen'

export const Loading = defineComponent({
  name: 'Loading',
  setup() {
    return () => (
      <CenterScreen>
        <ProgressSpinner class="!h-8 !w-8" strokeWidth="8" />
      </CenterScreen>
    )
  },
})
