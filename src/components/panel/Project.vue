<template>
  <transition>
    <div class="div--Project__page">
      <!-- <left-side v-show="isLeftPanelShow"></left-side> -->
      <work></work>
      <!-- <right-side v-show="isRightPanelShow"></right-side> -->
    </div>
  </transition>
</template>

<script>
import { eventsBus, events } from '@/events'

import Work from '@/components/panel/Work'
import RightSide from '@/components/panel/RightSide'
import LeftSide from '@/components/panel/LeftSide'

export default {
  name: 'project',
  components: {
    Work,
    LeftSide,
    RightSide
  },
  data () {
    return {
      isLeftPanelShow: false,
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
.div--Project__page {
  height: 100%;
  display: flex;
  flex-direction: row;
}
</style>
