import Button from 'primevue/button'
import { defineComponent } from 'vue'

import GitHubIcon from '../../assets/gitHub.svg'
import { useI18n } from '../../i18n'

export const GitHubButton = defineComponent({
  name: 'GitHubButton',
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
            'flex-grow !border-0 !bg-github-black',
            'hover:!bg-github-black-light focus:!button-border-github-black',
          ]}
          label=""
          size="large"
        >
          <div class="flex flex-grow items-center justify-center gap-2">
            <img class="w-6" src={GitHubIcon} />
            <div class="font-semibold">{t('linkButtons.GitHub')}</div>
          </div>
        </Button>
      </a>
    )
  },
})
