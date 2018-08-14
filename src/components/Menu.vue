<template>
  <div class="Menu__container">

    <div class="menubar__container" @click.stop.prevent="toggleProject">
      <p class="bar1"></p>
      <p class="bar2"></p>
      <p class="bar3"></p>
    </div>

    <div class="contents-container__wrapper"
      v-show="isProjectModalOpen"
      @click.stop.prevent="toggleProject"
    >
      <div class="contents__container">
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

        <div class="add-project__button" @click.stop="clickAddProject">
          <img src="/static/img/plus-circle-solid.svg" />
          <span> {{ $t('Add project') }} </span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import eventController from '@/utils/EventController'
import ListView from '@/components/ui/ListView'

export default {
  name: 'Menu-Comp',
  components: {
    ListView
  },
  data () {
    return {
      isProjectModalOpen: false
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
    clickAddProject (event) {
      let className = event.target.className || ''

      if (className.indexOf('modal-container__wrapper') > -1 || className.indexOf('add-project') > -1) {
        eventController.SHOW_MODAL({
          position: 'center',
          // size: 'small',
          isNeedAccept: true,
          params: {},
          contentComponent: 'CreateProject'
        })

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
.Menu__container {
  position: relative;
}

.Menu__container .menubar__container {
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

.Menu__container .contents-container__wrapper {
  position: absolute;
  overflow-y: auto;
  top: 30px; // TODO
  width: 250px;
  z-index: 999;

  .contents__container {
    background-color: #ffffff;
  }
}

.Menu__container .add-project__button {
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
</style>
