<template>
  <transition>
    <div class="top-panel__page">
      <menu-list
        class="menu-icon"
        :project-list="projectList">
      </menu-list>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'

import MenuList from '@/components/ui/Menu'

export default {
  name: 'TOP-Panel',
  components: {
    MenuList
  },
  computed: {
    ...mapGetters({
      projectList: 'myProject/getProjectList'
    })
  }
}
</script>

<style lang="scss" scoped>
.top-panel__page {
  position: relative;
  width: 100%;
  height: var(--app-top-panel-height);
  background-color: var(--app-top-panel-color);

  .menu-icon {
    position: absolute;
    top: 0px;
    left: 0px;
  }
}
</style>
