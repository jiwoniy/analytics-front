<template>
  <transition>
    <div class="div--home__page">
      <top-panel id="topPanel" class="top"></top-panel>
      <project class="project"></project>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'

import TopPanel from '@/components/panel/Top'
import Project from '@/components/panel/Project'

export default {
  name: 'Home',
  components: {
    TopPanel,
    Project
  },
  methods: {
    ...mapActions({
      setLocale: 'common/setLocale',
      getProjects: 'myProject/getProjects',
      getPipelineMeta: 'pipelineMeta/getPipelineMeta'
    })
  },
  created () {
    this.getProjects()
    this.getPipelineMeta()
  },
  mounted () {
    this.setLocale()
  }
}
</script>

<style lang="scss" scoped>
.div--home__page {
  height: 100%;
}

.div--home__page .top {
  width: 100%;
  height: var(--app-top-panel-height);
}

.div--home__page .project {
  width: 100%;
  height: calc(100% - var(--app-top-panel-height));
}
</style>
