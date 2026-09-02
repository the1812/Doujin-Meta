import Button from 'primevue/button'
import { defineComponent } from 'vue'

import DizzylabIcon from '../../assets/dizzylab.svg'
import { useI18n } from '../../i18n'

export const DizzylabButton = defineComponent({
  name: 'DizzylabButton',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    return () => (
      <a href={`https://www.dizzylab.net/d/${props.id}`} target="_blank" class="flex">
        <Button
          class={[
            'flex-grow justify-center !border-0 !bg-dizzylab-orange',
            'hover:!bg-dizzylab-orange-light focus:!button-border-dizzylab-orange',
          ]}
          label=""
          size="large"
        >
          <div class="flex items-center gap-2">
            <img class="w-6" src={DizzylabIcon} />
            <div class="font-semibold">{t('linkButtons.dizzylab')}</div>
          </div>
        </Button>
      </a>
    )
  },
})
