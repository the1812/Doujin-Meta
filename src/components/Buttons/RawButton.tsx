import Button from 'primevue/button'
import { defineComponent } from 'vue'

import { useI18n } from '../../i18n'

export const RawButton = defineComponent({
  name: 'RawButton',
  props: {
    link: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    return () => (
      <a href={props.link} target="_blank" class="flex">
        <Button
          class={[
            'flex-grow !border-0 !bg-slate-800',
            'hover:!bg-slate-700 focus:!button-border-slate-800',
          ]}
          label=""
          size="large"
        >
          <div class="flex flex-grow items-center justify-center gap-2">
            <div class="flex items-center justify-center p-[3px]">
              <i class="pi pi-file !text-[18px]" />
            </div>
            <div class="font-semibold">{t('linkButtons.raw')}</div>
          </div>
        </Button>
      </a>
    )
  },
})
