<template>
  <transition>
    <div class="div--Project__page">
      <main-panel></main-panel>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'

import MainPanel from '@/components/panel/Main'

export default {
  name: 'project',
  components: {
    MainPanel
  },
  methods: {
    ...mapActions({
      getProjects: 'myProject/getProjects'
    })
  },
  mounted () {
    this.getProjects()
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
