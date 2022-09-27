import { createApp } from 'vue'
import './style.css'
import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import App from './App.vue'
import { router } from './routes'

createApp(App).use(router).mount('#app')
