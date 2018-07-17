<template>
  <transition>
    <div class="div--Home__page">
      <project></project>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'

import Project from '@/components/panel/Project'

export default {
  name: 'home',
  components: {
    Project
  },
  methods: {
    ...mapActions({
      setLocale: 'common/setLocale'
    })
  },
  mounted () {
    this.setLocale()
  }
}
</script>

<style lang="scss" scoped>
.div--Home__page {
  height: 100%;
}
</style>
