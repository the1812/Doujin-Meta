import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Detail from './pages/Detail/Detail.vue'
import Home from './pages/Home/Home.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/albums/:id',
    component: Detail,
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
