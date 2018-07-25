<template>
  <transition>
    <section class="main-panel__page">

      <Split ref="main_split" @onDragEnd="onDragSplitPanel">
        <SplitArea :size="split_size.left" :minSize="50">
          <div class="left-section" ref="dragable">
            <left-panel
              id="leftPanel"
              :worksheet-list="worksheetList"
              :selected-worksheet="selectedWorksheet"
              :pipeline-nodes="pipelineNodes">
            </left-panel>
          </div>
        </SplitArea>

        <SplitArea class="center-section" :size="split_size.center" :minSize="100">
          <div class="folder__button" @click="minimizeLeftPanel">
            <img v-show="isLeftMinimize" src="/static/img/angle-right-solid.svg" />
            <img v-show="!isLeftMinimize" src="/static/img/angle-left-solid.svg" />
          </div>
          <work-panel>
          </work-panel>
          <div class="folder__button_right" @click="minimizeRightPanel">
            <img v-show="!isRightMinimize" src="/static/img/angle-right-solid.svg" />
            <img v-show="isRightMinimize" src="/static/img/angle-left-solid.svg" />
          </div>
        </SplitArea>

        <SplitArea :size="split_size.right" :minSize="20">
          <right-panel
            :current-item="currentNodeItem">
          </right-panel>
        </SplitArea>
      </Split>

      <foot-panel></foot-panel>

    </section>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'

import eventController from '@/utils/EventController'
import LeftPanel from '@/components/panel/Left'
import RightPanel from '@/components/panel/Right'
import WorkPanel from '@/components/panel/Working'
import FootPanel from '@/components/panel/Foot'
// import pipelineNodesSchema from '@/api/mockup/pipeline-nodes.json'

export default {
  name: 'Work-Panel',
  components: {
    LeftPanel,
    RightPanel,
    WorkPanel,
    FootPanel
  },
  data () {
    return {
      // pipelineNodes: pipelineNodesSchema,
      isLeftMinimize: false,
      isRightMinimize: false,
      currentNodeItem: null,
      split_size: {
        left: 20,
        center: 55,
        right: 20
      }
    }
  },
  computed: {
    ...mapGetters({
      pipelineNodes: 'pipeline/getPipelineNodesList',
      worksheetList: 'myProject/getWorksheetList',
      selectedWorksheet: 'myProject/getSelectedWorksheet'
    })
  },
  methods: {
    minimizeLeftPanel () {
      this.isLeftMinimize = !this.isLeftMinimize
      const remain = 100 - this.split_size.right
      if (this.isLeftMinimize) {
        this.split_size.left = 1
        this.split_size.center = remain - this.split_size.left
      } else {
        this.split_size.left = 20
        this.split_size.center = remain - this.split_size.left
      }
    },
    minimizeRightPanel () {
      this.isRightMinimize = !this.isRightMinimize
      const remain = 100 - this.split_size.left
      if (this.isRightMinimize) {
        this.split_size.right = 1
        this.split_size.center = remain - this.split_size.right
      } else {
        this.split_size.right = 20
        this.split_size.center = remain - this.split_size.right
      }
    },
    resize () {
      this.$refs.main_split.reset()
    },
    onDragSplitPanel (size) {
      this.split_size = {
        left: size[0],
        center: size[1],
        right: size[2]
      }
    }
  },
  mounted () {
    eventController.addListner('RIGHT_PANEL', (payload) => {
      const { item, type } = payload
      if (item) {
        this.currentNodeItem = {
          item,
          dataType: type
        }
      } else {
        this.currentNodeItem = {
          item: this.selectedWorksheet,
          dataType: 'worksheet'
        }
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.main-panel__page {
  display: flex;
  flex-direction: column;
  width: 100%;
  z-index: 1;
}

.main-panel__page .left-section {
  display: flex;
  flex-direction: row;
}

.main-panel__page .center-section {
  position: relative;
  .folder__button {
    z-index: 2;
    display: block;
    position: absolute;
    cursor: pointer;
    top: 0px;
    left: 0px;
    width: var(--app-left-panel-folder-button);
    height: var(--app-left-panel-folder-button);
    img {
      position: relative;
      width: 30px;
      height: 30px;
    }
  }
  .folder__button_right {
    z-index: 2;
    display: block;
    position: absolute;
    cursor: pointer;
    top: 0px;
    right: 0px;
    width: var(--app-left-panel-folder-button);
    height: var(--app-left-panel-folder-button);
    img {
      position: relative;
      width: 30px;
      height: 30px;
    }
  }
}
</style>
