<template>
  <transition>
    <div class="div--Project__page">
      <main-panel></main-panel>
    </div>
  </transition>
</template>

<script>
import MainPanel from '@/components/panel/Main'

export default {
  name: 'project',
  components: {
    MainPanel
  }
}
</script>

<style lang="scss" scoped>
.div--Project__page {
  height: 100%;
  display: flex;
  flex-direction: row;
}
</style>
