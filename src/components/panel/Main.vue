<template>
  <transition>
    <section class="main-panel__page">
      <top-panel id="topPanel" class="top">
      </top-panel>
      <div class="work" ref="dragable">
        <left-panel
          id="leftPanel"
          v-show="isLeftPanelShow"
          :blocks="blocks"
        >
        </left-panel>
        <work-panel
          id="rightPanel"
          class="Working__page"
          :class="{ 'isLeftActive': isLeftPanelShow }"
        >
        </work-panel>
        <right-panel
          v-show="isRightPanelShow"
          :current-item="currentNodeItem"
        >
        </right-panel>
      </div>
    </section>
  </transition>
</template>

<script>
import faker from 'faker'

import { eventsBus, events } from '@/events'

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
      blocks: [],
      isLeftPanelShow: true,
      isRightPanelShow: false,
      currentNodeItem: null
    }
  },
  created () {
    for (let i = 0; i <= 10; i += 1) {
      this.blocks.push({
        id: i,
        title: faker.company.bs()
      })
    }
  },
  mounted () {
    eventsBus.$on(events.LEFT_PANEL, (payload) => {
      const { open } = payload
      this.isLeftPanelShow = open
    })

    eventsBus.$on(events.RIGHT_PANEL, (payload) => {
      const { open, item } = payload
      if (open) {
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
  height: 58px;
}

.main-panel__page .work {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: calc(100% - 58px);
}

.main-panel__page .Working__page.isLeftActive {
  // margin-left: 250px;
}
</style>
