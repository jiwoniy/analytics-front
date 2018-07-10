<template>
  <transition>
    <section class="div--Working__page">
      <div class="div--Button">
        <!-- <span @click="openLeftPanel"> left </span>
        <span @click="openRightPanel"> right </span> -->
      </div>
      <drop-comp>
        <svg-palete
          slot="svg-container"
          :open-right-panel="openRightPanel"
          :is-open-left-panel="isLeftPanelShow"
        >
        </svg-palete>
      </drop-comp>
    </section>
  </transition>
</template>

<script>
import { eventsBus, events } from '@/events'

import DropComp from '@/components/common/Drop'
import SvgPalete from '@/components/common/Palete'

export default {
  name: 'Working',
  components: {
    DropComp,
    SvgPalete
  },
  props: {
    isLeftPanelShow: {
      type: Boolean,
      default: () => true
    }
  },
  methods: {
    openLeftPanel (status = true) {
      eventsBus.$emit(events.LEFT_PANEL, {
        open: true
      })
    },
    openRightPanel (payload) {
      eventsBus.$emit(events.RIGHT_PANEL, payload)
    }
  }
}
</script>

<style lang="scss" scoped>
.div--Working__page {
  display: block;
  width: 100%;
}

.div--Working__page .div--Button {
  display: flex;
  flex-direction: row;
  width: 200px;
  height: 30px;

  span {
    width: 50px;
  }
}
</style>
