<template>
  <transition>
    <section class="main-panel__page">

        <Split ref="Main_Split">
          <SplitArea :size="size.left" :minSize="50">
            <div class="work" ref="dragable">
              <left-panel
                id="leftPanel"
                :project-list="projectList"
                :selected-project="selectedProject"
                :worksheet-list="worksheetList"
                :selected-worksheet="selectedWorksheet"
                :pipeline-nodes="pipelineNodes">
              </left-panel>
            </div>
          </SplitArea>
          <SplitArea class="center-section" :size="size.center" :minSize="100">
             <div class="folder__button" @click="minimizeLeftPanel">
              <img v-show="isLeftMinimize" src="@/assets/img/angle-right-solid.svg" />
              <img v-show="!isLeftMinimize" src="@/assets/img/angle-left-solid.svg" />
            </div>
            <work-panel>
            </work-panel>
            <div class="folder__button_right" @click="minimizeRightPanel">
              <img v-show="!isRightMinimize" src="@/assets/img/angle-right-solid.svg" />
              <img v-show="isRightMinimize" src="@/assets/img/angle-left-solid.svg" />
            </div>
          </SplitArea>
          <SplitArea :size="size.right" :minSize="50">
            <right-panel
              :isShow="isRightPanelShow"
              :current-item="currentNodeItem">
            </right-panel>
          </SplitArea>
        </Split>

    </section>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'

import eventController from '@/utils/EventController'
import LeftPanel from '@/components/panel/Left'
import RightPanel from '@/components/panel/Right'
import WorkPanel from '@/components/panel/Working'
import pipelineNodesSchema from '@/api/mockup/pipeline-nodes.json'

export default {
  name: 'Work-Panel',
  components: {
    LeftPanel,
    RightPanel,
    WorkPanel
  },
  data () {
    return {
      pipelineNodes: pipelineNodesSchema,
      isLeftMinimize: false,
      isRightMinimize: true,
      isRightPanelShow: false,
      currentNodeItem: null,
      size: {
        left: 20,
        center: 75,
        right: 5
      }
    }
  },
  computed: {
    ...mapGetters({
      projectList: 'myProject/getProjectList',
      selectedProject: 'myProject/getSelectedProject',
      worksheetList: 'myProject/getWorksheetList',
      selectedWorksheet: 'myProject/getSelectedWorksheet'
    })
  },
  methods: {
    minimizeLeftPanel () {
      // TODO observe drag
      this.isLeftMinimize = !this.isLeftMinimize
      const remain = 100 - this.size.right
      if (this.isLeftMinimize) {
        this.size.left = 5
        this.size.center = remain - this.size.left
      } else {
        this.size.left = 20
        this.size.center = remain - this.size.left
      }
    },
    minimizeRightPanel () {
      // TODO observe drag
      this.isRightMinimize = !this.isRightMinimize
      const remain = 100 - this.size.left
      if (this.isRightMinimize) {
        // left
        this.size.right = 5
        this.size.center = remain - this.size.right
      } else {
        this.size.right = 20
        this.size.center = remain - this.size.right
      }
    }
    // resize () {
    //   console.log('resize')
    // },
    // reset () {
    //   console.log(this.$refs.mySplit.reset())
    // }
  },
  mounted () {
    eventController.addListner('RIGHT_PANEL', (payload) => {
      const { open, item } = payload
      if (open && item) {
        this.currentNodeItem = item
      } else {
        this.currentNodeItem = null
      }
      this.isRightPanelShow = open
    })
  }
}
</script>

<style lang="scss" scoped>
.main-panel__page {
  display: flex;
  flex-direction: column;
}

.main-panel__page .work {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
}

.main-panel__page .center-section {
  position: relative;
  .folder__button {
    display: block;
    position: absolute;
    cursor: pointer;
    top: 0px;
    left: 0px;
    width: var(--app-left-panel-folder-button);
    height: var(--app-left-panel-folder-button);
    z-index: var(--app-left-panel-zIndex);
    img {
      position: relative;
      width: 30px;
      height: 30px;
    }
  }
  .folder__button_right {
    display: block;
    position: absolute;
    cursor: pointer;
    top: 0px;
    right: 0px;
    width: var(--app-left-panel-folder-button);
    height: var(--app-left-panel-folder-button);
    z-index: var(--app-left-panel-zIndex);
    img {
      position: relative;
      width: 30px;
      height: 30px;
    }
  }
}
</style>
