<script setup lang="ts">
import { RouterView } from 'vue-router'

</script>

<template>
  <div class="flex flex-col">
    <RouterView v-slot="{ Component, route }">
      <Transition :name="(route.meta.transition as string) || 'fade'">
        <KeepAlive include="Home">
          <component :is="Component" />
        </KeepAlive>
      </Transition>
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
