<template>
  <section class="Main__section">

    <Split ref="main_split" @onDragEnd="onDragSplitPanel">
      <SplitArea :size="split_size.left" :minSize="50">
        <left-panel
          id="leftPanel"
          :worksheet-list="worksheetList"
          :activate-worksheet="activateWorksheet"
          :pipeline-nodes="pipelineMeta">
        </left-panel>
      </SplitArea>

      <SplitArea class="center-section" :size="split_size.center" :minSize="100">
        <toggle-button
          :click-button="minimizeLeftPanel"
          :toggle="isLeftMinimize"
          :custom-style="{
            'top': '0px',
            'left': '0px'
          }"
          :a-src="'/static/img/angle-right-solid.svg'"
          :b-src="'/static/img/angle-left-solid.svg'"
        >
        </toggle-button>
        <toggle-button
          :toggle="isPipelineUnLock"
          :custom-style="{
            'top': '0px',
            'left': '30px'
          }"
          :click-button="unLock"
          :a-src="'/static/img/lock-open-solid.svg'"
          :b-src="'/static/img/lock-solid.svg'"
        >
        </toggle-button>
        <work-panel>
        </work-panel>
        <toggle-button
          :click-button="minimizeRightPanel"
          :toggle="!isRightMinimize"
          :custom-style="{
            'top': '0px',
            'right': '0px'
          }"
          :a-src="'/static/img/angle-right-solid.svg'"
          :b-src="'/static/img/angle-left-solid.svg'"
        >
        </toggle-button>
      </SplitArea>

      <SplitArea :size="split_size.right" :minSize="20">
        <right-panel>
          <worksheet-manager
            v-if="currentItemType === 'worksheet'"
            slot="worksheet-manager">
          </worksheet-manager>
          <node-manager
            v-if="currentItemType === 'pipeline-node'"
            slot="node-manager">
          </node-manager>
        </right-panel>
      </SplitArea>
    </Split>

    <foot-panel></foot-panel>

  </section>
</template>

<script>
import { mapGetters } from 'vuex'

import eventController from '@/utils/EventController'
import LeftPanel from '@/components/views/Left'
import RightPanel from '@/components/views/Right'
import WorkPanel from '@/components/views/Working'
import FootPanel from '@/components/views/Foot'
import WorksheetManager from '@/components/WorksheetManager'
import NodeManager from '@/components/NodeManager'
import ToggleButton from '@/components/ui/ToggleButton'

export default {
  name: 'Main-Section',
  components: {
    LeftPanel,
    RightPanel,
    WorkPanel,
    FootPanel,
    WorksheetManager,
    NodeManager,
    ToggleButton
  },
  data () {
    return {
      isLeftMinimize: false,
      isRightMinimize: false,
      currentItemType: null,
      split_size: {
        left: 20,
        center: 60,
        right: 20
      }
    }
  },
  computed: {
    ...mapGetters({
      pipelineMeta: 'pipelineMeta/getPipelineMetaList',
      isPipelineUnLock: 'myProject/isPipelineUnLock',
      worksheetList: 'myProject/getWorksheetList',
      activateWorksheet: 'myProject/getActivateWorksheet'
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
    },
    unLock () {
      if (!this.isPipelineUnLock) {
        eventController.EDIT(true)
      }
    }
  },
  mounted () {
    eventController.addListner('RIGHT_PANEL', (payload) => {
      if (payload) {
        const { type } = payload
        this.currentItemType = type
      } else {
        this.currentItemType = 'worksheet'
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.Main__section {
  display: flex;
  flex-direction: column;
  width: 100%;
  z-index: 1;
}

.Main__section .center-section {
  position: relative;
}
</style>
