<template>
  <transition>
    <div class="Menu">
      <div class="menubar-container" @click.stop="clickMenuBar($event)">
        <p class="bar1"></p>
        <p class="bar2"></p>
        <p class="bar3"></p>
      </div>
      <div class="menu-container" v-show="isOpen">
        <list-view
          :items="projectList"
          :item-style="{
            'font-size': '1.6rem',
            'margin': '0.5rem'
          }"
          :item-class="'text-ellipsis'"
          :selected-item-id="selectedProject.id"
          :item-click="selectProject">
        </list-view>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'

import ListView from '@/components/ui/ListView'

export default {
  name: 'Menu',
  components: {
    ListView
  },
  data () {
    return {
      isOpen: false
    }
  },
  props: {
    projectList: {
      type: Array,
      default: () => []
    },
    selectedProject: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    ...mapActions({
      setSelectedProject: 'myProject/setSelectedProject'
    }),
    selectProject (event) {
      if (event.target) {
        const projectId = event.target.id || event.target.parentElement.id
        this.setSelectedProject(projectId)
        this.isOpen = !this.isOpen
      }
    },
    clickMenuBar (ev) {
      // ev.currentTarget.classList.toggle('change')
      this.isOpen = !this.isOpen
    }
  }
}
</script>

<style lang="scss" scroped>
.Menu {
  position: relative;

  .menubar-container {
    display: inline-block;
    cursor: pointer;
    margin: 0 10px;

    .bar1, .bar2, .bar3 {
      width: 30px;
      height: 4px;
      background-color: #333;
      margin: 6px 0;
      transition: 0.4s;
    }
  }

  .menu-container {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: #ffffff;
    background-color: #eee;
    z-index: 999;

    width: 250px;
    padding: 0.5rem;
    overflow-y: auto;

    // a {
    //   width: 100%;
    //   margin: 10px;
    //   color: black;
    //   display: block;
    //   text-decoration: none;
    // }
  }
}
</style>
