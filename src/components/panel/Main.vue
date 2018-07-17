<template>
  <transition>
    <section class="main-panel__page">
      <top-panel id="topPanel" class="top">
      </top-panel>
      <div class="work" ref="dragable">
        <left-panel
          id="leftPanel"
          :is-show="isLeftPanelShow"
          :node-tree="nodeTree"
        >
        </left-panel>

        <work-panel
          :is-left-panel-show="isLeftPanelShow"
        >
        </work-panel>
        <right-panel
          :isShow="isRightPanelShow"
          :current-item="currentNodeItem"
        >
        </right-panel>
      </div>
    </section>
  </transition>
</template>

<script>
// import faker from 'faker'
// import * as d3Random from 'd3-random'

import eventController from '@/utils/EventController'
import TopPanel from '@/components/panel/Top'
import LeftPanel from '@/components/panel/Left'
import RightPanel from '@/components/panel/Right'
import WorkPanel from '@/components/panel/Working'

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
      // blocks: [],
      nodeTree: {
        name: 'Project List',
        children: [
          { name: 'Project - 1' },
          { name: 'Project - 2' },
          {
            name: 'Project - 3',
            children: [
              {
                name: 'Data Source',
                children: [
                  { name: 'Data Source - 1' },
                  { name: 'Data Source - 2' }
                ]
              },
              { name: 'Extra 123' },
              { name: 'Extra 456' },
              {
                name: 'Algorithm',
                children: [
                  { name: 'Algorithm - 1' },
                  { name: 'Algorithm - 2' }
                ]
              }
            ]
          }
        ]
      },
      isLeftPanelShow: true,
      isRightPanelShow: false,
      currentNodeItem: null
    }
  },
  created () {
    // for (let i = 0; i <= 10; i += 1) {
    //   this.blocks.push({
    //     id: i,
    //     title: faker.company.bs(),
    //     input: Math.floor(d3Random.randomUniform(0, 3)()),
    //     output: Math.floor(d3Random.randomUniform(0, 3)())
    //   })
    // }
  },
  mounted () {
    eventController.addListner('LEFT_PANEL', (payload) => {
      const { open } = payload
      this.isLeftPanelShow = open
    })

    eventController.addListner('RIGHT_PANEL', (payload) => {
      const { open, item } = payload
      // console.log(payload)
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
  height: var(--app-top_panel-height);
}

.main-panel__page .work {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: calc(100% - var(--app-top_panel-height));
}

// .main-panel__page .Working__page {
  // width: 100%;
  // margin-left: 250px;
// }
</style>
