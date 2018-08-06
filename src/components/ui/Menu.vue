<template>
  <transition>
    <div class="Menu">

      <div class="menubar-container" @click.stop.prevent="toggleProject">
        <p class="bar1"></p>
        <p class="bar2"></p>
        <p class="bar3"></p>
      </div>

      <div
        class="modal-container__wrapper"
        v-show="isProjectModalOpen"
        @click.stop.prevent="toggleProject"
      >
        <div class="project-container">
          <list-view
            :items="projectList"
            :item-style="{
              'font-size': '1.6rem',
              'margin': '0.5rem 0.4rem'
            }"
            :item-class="'text-ellipsis__default'"
            :selected-item-id="activateProjectId"
            :item-click="selectProject">
          </list-view>

          <div class="add-project" @click.stop="toggleAddProject">
            <img class="add-project close" src="/static/img/plus-circle-solid.svg" />
            <span class="add-project"> {{ $t('Add project') }} </span>
          </div>
        </div>
      </div>

      <div class="modal-container__wrapper center" v-show="isAddProjectModalOpen" @click.prevent="toggleAddProject">
        <create-project></create-project>
      </div>

    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import ListView from '@/components/ui/ListView'
import CreateProject from '@/components/CreateProject'

export default {
  name: 'Menu',
  components: {
    ListView,
    CreateProject
  },
  data () {
    return {
      isProjectModalOpen: false,
      isAddProjectModalOpen: false
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
    activateProject: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters({
      activateProjectId: 'myProject/getActivateProjectId'
    })
  },
  methods: {
    ...mapActions({
      setActivateProjectId: 'myProject/setActivateProjectId'
    }),
    toggleProject () {
      this.isProjectModalOpen = !this.isProjectModalOpen
    },
    toggleAddProject (event) {
      let className = event.target.className || ''

      if (className.indexOf('modal-container__wrapper') > -1 || className.indexOf('add-project') > -1) {
        this.isAddProjectModalOpen = !this.isAddProjectModalOpen
        if (this.isProjectModalOpen) {
          this.toggleProject()
        }
      }
    },
    selectProject (event) {
      if (event.target) {
        const projectId = event.target.id || event.target.parentElement.id
        this.setActivateProjectId(projectId)
      }
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

  .modal-container__wrapper {
    position: absolute;
    background-color: rgba(0,0,0,0.4);
    width: 100vw;
    height: 100vh;
    z-index: 999;
  }

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-container__wrapper .project-container {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: #eee;

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
