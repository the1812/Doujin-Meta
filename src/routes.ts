import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from './pages/Home.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
