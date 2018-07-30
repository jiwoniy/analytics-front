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
            'margin': '0.5rem 0.4rem'
          }"
          :item-class="'text-ellipsis__default'"
          :selected-item-id="selectedProject.id"
          :item-click="selectProject">
        </list-view>

        <div class="add-project">
          <img class="close" src="/static/img/plus-circle-solid.svg" />
          <span> {{ $t('Add project') }} </span>
        </div>
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
  i18n: {
    messages: {
      'en': {
        'Add project': 'Add project'
      },
      'ko': {
        'Add project': '프로젝트 추가'
      }
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
      setSelectedProjectId: 'myProject/setSelectedProjectId'
    }),
    selectProject (event) {
      if (event.target) {
        const projectId = event.target.id || event.target.parentElement.id
        this.setSelectedProjectId(projectId)
        this.isOpen = !this.isOpen
      }
    },
    clickMenuBar (ev) {
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
    overflow-y: auto;

    .add-project {
      width: calc(100% - 0.8rem);
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 1.4rem;
      padding: 0.5rem 0.4rem;
      img {
        padding-right: 0.2rem;
        width: 25px;
        height: 25px;
      }
    }
  }
}
</style>
