<template>
  <transition>
    <div class="div--Work__page">
      <left-panel v-show="isLeftPanelShow"></left-panel>
      <right-panel v-show="isRightPanelShow"></right-panel>
      <work-panel
        class="Working__page"
        :class="{ 'isLeftActive': isLeftPanelShow }"
      ></work-panel>
    </div>
  </transition>
</template>

<script>
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
      isLeftPanelShow: true,
      isRightPanelShow: false
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
.div--Work__page {
  display: flex;
}
.div--Work__page .Working__page.isLeftActive {
  margin-left: 250px;
}
</style>
