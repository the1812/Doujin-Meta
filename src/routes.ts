import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { Detail } from './pages/Detail/Detail'
import { Home } from './pages/Home/Home'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/albums/:id',
    name: 'album',
    component: Detail,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
