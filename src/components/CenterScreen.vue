<template>
  <Teleport to="body">
    <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <slot></slot>
    </div>
  </Teleport>
</template>
