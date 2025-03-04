<script setup lang="ts">
import { RouteLocationNormalized, RouterView, useRouter } from 'vue-router'

const router = useRouter()
router.afterEach(to => {
  if (to.meta.title instanceof Function) {
    const titleFunc = to.meta.title as (route: RouteLocationNormalized) => string
    document.title = `${titleFunc(to)} - Doujin Meta`
  } else {
    document.title = 'Doujin Meta'
  }
})
</script>

<template>
  <div class="flex flex-col">
    <RouterView v-slot="{ Component }">
      <!-- <Transition :name="(route.meta.transition as string) || 'fade'"> -->
      <KeepAlive include="Home">
        <component :is="Component" />
      </KeepAlive>
      <!-- </Transition> -->
    </RouterView>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
