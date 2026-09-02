import { defineComponent, KeepAlive, type VNode } from 'vue'
import { type RouteLocationNormalized, RouterView, useRouter } from 'vue-router'

export const App = defineComponent({
  name: 'App',
  setup() {
    const router = useRouter()
    router.afterEach(to => {
      if (to.meta.title instanceof Function) {
        const title = (to.meta.title as (route: RouteLocationNormalized) => string)(to)
        document.title = `${title} - Doujin Meta`
      } else {
        document.title = 'Doujin Meta'
      }
    })

    return () => (
      <div class="flex flex-col">
        <RouterView>
          {({ Component }: { Component: VNode }) => (
            <KeepAlive include="Home">{Component}</KeepAlive>
          )}
        </RouterView>
      </div>
    )
  },
})
