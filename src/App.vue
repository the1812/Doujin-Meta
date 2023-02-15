<script setup lang="ts">
import { RouterView } from 'vue-router'

</script>

<template>
  <div class="flex flex-col">
    <RouterView v-slot="{ Component, route }">
      <Transition :name="(route.meta.transition as string) || 'fade'">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active,
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-24px);
  opacity: 0;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(24px);
  opacity: 0;
}
</style>
