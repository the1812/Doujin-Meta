import { createApp } from 'vue'
import './style.css'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/tailwind-light/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import App from './App.vue'
import { router } from './routes'
import { initAppIcon } from './theme'
import { i18n } from './i18n'

createApp(App).use(router).use(i18n).use(PrimeVue, { ripple: true }).mount('#app')
initAppIcon()
