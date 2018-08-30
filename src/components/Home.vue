<template>
  <section class="Home__section">
    <top-panel id="topPanel"></top-panel>
    <project></project>
  </section>
</template>

<script>
import { mapActions } from 'vuex'

import TopPanel from '@/components/views/Top'
import Project from '@/components/views/Project'

export default {
  name: 'Home-Section',
  components: {
    TopPanel,
    Project
  },
  methods: {
    ...mapActions({
      setLocale: 'common/setLocale',
      fetchProjects: 'myProject/fetchProjects',
      fetchPipelineMeta: 'pipelineMeta/fetchPipelineMeta',
      fetchMetaNodes: 'metaNode/fetchMetaNodes'
    })
  },
  created () {
    this.fetchProjects()
    this.fetchPipelineMeta()
    this.fetchMetaNodes()
  },
  mounted () {
    this.setLocale()
  }
}
</script>

<style scoped>
.Home__section {
  height: 100%;
}
</style>
