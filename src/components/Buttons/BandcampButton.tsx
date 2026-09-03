import Button from 'primevue/button'
import { defineComponent } from 'vue'

import BandcampIcon from '../../assets/bandcamp.svg'
import { useI18n } from '../../i18n'

export const BandcampButton = defineComponent({
  name: 'BandcampButton',
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
            'flex-grow justify-center !border-0 !bg-bandcamp-blue',
            'hover:!bg-bandcamp-blue-light focus:!button-border-bandcamp-blue',
          ]}
          label=""
          size="large"
        >
          <div class="flex items-center gap-2">
            <img class="w-6" src={BandcampIcon} />
            <div class="font-semibold">{t('linkButtons.bandcamp')}</div>
          </div>
        </Button>
      </a>
    )
  },
})
