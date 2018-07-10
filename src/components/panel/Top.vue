<template>
  <transition>
    <div class="top-panel__page">
      top
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
  // min-height: 58px;
  height: var(--app-top_panel-height);
}
</style>
