import {
  createRouter,
  createWebHashHistory,
  RouteLocationNormalized,
  RouteRecordRaw,
} from 'vue-router'
import Detail from './pages/Detail/Detail.vue'
import Home from './pages/Home/Home.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home },
  {
    path: '/albums/:name/:id',
    component: Detail,
    meta: {
      title: (route: RouteLocationNormalized) => {
        return route.params.name
      },
    },
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
