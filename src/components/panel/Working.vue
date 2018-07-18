<template>
  <transition>
    <section class="div--Working__page">
      <div id="tool-box" class="tool-box">
        <button @click="save"> save </button>
        <button @click="edit"> edit </button>
        <button @click="refresh"> refresh </button>
        <button @click="load"> load </button>
        <button @click="showModal"> modal </button>
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
import eventController from '@/utils/EventController'
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
      eventController.LEFT_PANEL({ open: true })
    },
    openRightPanel (payload) {
      eventController.RIGHT_PANEL(payload)
    },
    save () {
      eventController.SAVE({})
    },
    edit () {
      eventController.EDIT({})
    },
    refresh () {
      eventController.REFRESH({})
    },
    load () {
      eventController.LOAD({})
    },
    showModal () {
      eventController.SHOW_MODAL({})
    }
  }
}
</script>

<style lang="scss" scoped>
.div--Working__page {
  position: relative;
  display: block;
  width: 100%;
}

.div--Working__page .tool-box {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 50px;
  top: 50px;
}
</style>
