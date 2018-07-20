<template>
  <transition>
    <div class="top-panel__page">
    </div>
  </transition>
</template>

<script>
export default {
  name: 'TOP-Panel'
}
</script>

<style lang="scss" scoped>
.top-panel__page {
  width: 100%;
  height: var(--app-top-panel-height);
  background-color: var(--app-top-panel-color)
}
</style>
