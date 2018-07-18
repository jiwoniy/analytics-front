<template>
  <transition>
    <section class="main-panel__page">
      <top-panel id="topPanel" class="top">
      </top-panel>
      <div class="work" ref="dragable">
        <left-panel
          id="leftPanel"
          :is-show="isLeftPanelShow"
          :project-list="projectList"
          :selected-project="selectedProject"
          :worksheet-list="worksheetList"
          :selected-worksheet="selectedWorksheet"
          :pipeline-nodes="pipelineNodes">
        </left-panel>

        <work-panel :is-left-panel-show="isLeftPanelShow">
        </work-panel>

        <right-panel
          :isShow="isRightPanelShow"
          :current-item="currentNodeItem">
        </right-panel>
      </div>
    </section>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'

import eventController from '@/utils/EventController'
import TopPanel from '@/components/panel/Top'
import LeftPanel from '@/components/panel/Left'
import RightPanel from '@/components/panel/Right'
import WorkPanel from '@/components/panel/Working'
import pipelineNodesSchema from '@/api/mockup/pipeline-nodes.json'

export default {
  name: 'Work-Panel',
  components: {
    TopPanel,
    LeftPanel,
    RightPanel,
    WorkPanel
  },
  data () {
    return {
      pipelineNodes: pipelineNodesSchema,
      isLeftPanelShow: true,
      isRightPanelShow: false,
      currentNodeItem: null
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
  mounted () {
    eventController.addListner('LEFT_PANEL', (payload) => {
      const { open } = payload
      this.isLeftPanelShow = open
    })

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

.main-panel__page .top {
  width: 100%;
  height: var(--app-top-panel-height);
}

.main-panel__page .work {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: calc(100% - var(--app-top-panel-height));
}
</style>
