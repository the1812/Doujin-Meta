import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('./pages/Home/Home').then(({ Home }) => Home),
  },
  {
    path: '/albums/:id',
    name: 'album',
    component: () => import('./pages/Detail/Detail').then(({ Detail }) => Detail),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
