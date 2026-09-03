import Button from 'primevue/button'
import Menu, { type MenuMethods, type MenuProps } from 'primevue/menu'
import { defineComponent, type DefineComponent, useTemplateRef } from 'vue'

import { useI18n } from '../../i18n'

const RefableMenu = Menu as unknown as DefineComponent<MenuProps & { ref?: string }>

export const MoreActionsButton = defineComponent({
  name: 'MoreActionsButton',
  props: {
    rawLink: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const menu = useTemplateRef<MenuMethods>('menu')
    const menuItems = [
      {
        label: t('linkButtons.raw'),
        icon: 'pi pi-file',
        url: props.rawLink,
        target: '_blank',
      },
    ]
    return () => (
      <>
        <Button
          class={[
            '!border-0 !bg-github-black',
            'hover:!bg-github-black-light focus:!button-border-github-black',
          ]}
          label=""
          size="large"
          icon="pi pi-ellipsis-h"
          onClick={event => menu.value?.toggle(event)}
        />
        <RefableMenu ref="menu" model={menuItems} popup />
      </>
    )
  },
})
