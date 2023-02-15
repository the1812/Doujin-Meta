import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Detail from './pages/Detail.vue'
import Home from './pages/Home.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home, meta: { transition: 'slide-left' } },
  { path: '/albums/:name/:id', component: Detail, meta: { transition: 'slide-right' } },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
