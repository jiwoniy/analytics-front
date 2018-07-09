<template>
  <transition>
    <section class="div--Working__page">
      <div class="div--Button">
        <!-- <span @click="resetted"> reset </span> -->
        <span @click="openLeftPanel"> left </span>
        <span @click="openRightPanel"> right </span>
      </div>
      <drop-comp>
        <svg-palete slot="svg-container"
          :open-right-panel="openRightPanel"
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
  methods: {
    openLeftPanel (status = true) {
      eventsBus.$emit(events.LEFT_PANEL, {
        open: status
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
