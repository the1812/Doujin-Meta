import Button from 'primevue/button'
import { defineComponent } from 'vue'

import { useI18n } from '../i18n'
import { CenterScreen } from './CenterScreen'

export const LoadError = defineComponent({
  name: 'LoadError',
  emits: {
    retry: () => true,
  },
  setup(_, { emit }) {
    const { t } = useI18n()
    return () => (
      <CenterScreen>
        <div class="flex flex-col items-center gap-4">
          <i class="pi pi-exclamation-circle !text-4xl" />
          <div class="text-lg">{t('loadFailed.description')}</div>
          <Button
            icon="pi pi-refresh"
            label={t('loadFailed.retry')}
            onClick={() => emit('retry')}
          />
        </div>
      </CenterScreen>
    )
  },
})
