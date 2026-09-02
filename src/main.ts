import { definePreset } from '@primeuix/themes'

import './style.css'
import Material from '@primeuix/themes/material'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'

import 'primeicons/primeicons.css'
import { App } from './App'
import { i18n } from './i18n'
import { router } from './routes'
import { initAppIcon } from './theme'

const ProjectTheme = definePreset(Material, {
  semantic: {
    primary: {
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
