<template>
  <transition>
    <header class="Top__section">
      <menu-list
        class="menu-icon"
        :project-list="projectList">
      </menu-list>

      <div class="right-menu">
        <button @click="clearCache">
          cache clear
        </button>
      </div>
    </header>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'

import MenuList from '@/components/Menu'

export default {
  name: 'Top-Section',
  components: {
    MenuList
  },
  computed: {
    ...mapGetters({
      projectList: 'myProject/getProjectList'
    })
  },
  methods: {
    clearCache () {
      window.localStorage.clear()
    }
  }
}
</script>

<style lang="scss" scoped>
.Top__section {
  position: relative;
  width: 100%;
  height: var(--app-top-panel-height);
  background-color: var(--app-top-panel-color);

  .menu-icon {
    position: absolute;
    top: 0px;
    left: 0px;
  }

  .right-menu {
    position: absolute;
    top: 0px;
    right: 0px;
  }
}
</style>
