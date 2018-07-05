<template>
  <transition>
    <section class="main-panel__page">
      <div ref="dragable">
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
      </div>

      <right-panel v-show="isRightPanelShow"></right-panel>
    </section>
  </transition>
</template>

<script>
import faker from 'faker'

import { eventsBus, events } from '@/events'

import LeftPanel from '@/components/panel/Left'
import RightPanel from '@/components/panel/Right'
import WorkPanel from '@/components/panel/Working'

export default {
  name: 'Work-Panel',
  components: {
    LeftPanel,
    RightPanel,
    WorkPanel
  },
  data () {
    return {
      blocks: [],
      isLeftPanelShow: true,
      isRightPanelShow: false
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
      const { open } = payload
      this.isRightPanelShow = open
    })
  }
}
</script>

<style lang="scss" scoped>
.main-panel__page {
  display: flex;
}
.main-panel__page .Working__page.isLeftActive {
  margin-left: 250px;
}
</style>
