<template>
  <transition>
    <div class="div--Home__page">
      <project></project>
    </div>
  </transition>
</template>

<script>
import Project from '@/components/panel/Project'

export default {
  name: 'home',
  components: {
    Project
  }
}
</script>

<style lang="scss" scoped>
.div--Home__page {
  width: 100px;
  height: 100%;
}
</style>
