import { createApp } from 'vue'
import './style.css'
import PrimeVue from 'primevue/config'
import { definePreset } from '@primeuix/themes'
import Material from '@primeuix/themes/material'
import 'primeicons/primeicons.css'
import App from './App.vue'
import { router } from './routes'
import { initAppIcon } from './theme'
import { i18n } from './i18n'

const ProjectTheme = definePreset(Material, {
  semantic: {
    primary: {
      /* eslint-disable @typescript-eslint/naming-convention */
      50: '{violet.50}',
      100: '{violet.100}',
      200: '{violet.200}',
      300: '{violet.300}',
      400: '{violet.400}',
      500: '{violet.500}',
      600: '{violet.600}',
      700: '{violet.700}',
      800: '{violet.800}',
      900: '{violet.900}',
      950: '{violet.950}',
      /* eslint-enable @typescript-eslint/naming-convention */
    },
  },
})

createApp(App)
  .use(router)
  .use(i18n)
  .use(PrimeVue, {
    ripple: true,
    theme: {
      preset: ProjectTheme,
    },
  })
  .mount('#app')
initAppIcon()
