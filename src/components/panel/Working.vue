<template>
  <transition>
    <section class="working__page">
      <div id="tool-box" class="tool-box">
        <button @click="save"> save </button>
        <button @click="edit"> edit </button>
        <button @click="refresh"> recover </button>
        <button @click="load"> Reload </button>
        <button @click="openModal"> modal </button>
        <button @click="openEditor"> editor </button>
      </div>
      <drop-comp>
        <svg-palete
          slot="svg-container">
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
  methods: {
    save () {
      eventController.SAVE({})
    },
    edit () {
      eventController.EDIT(true)
    },
    refresh () {
      eventController.REFRESH({})
    },
    load () {
      eventController.LOAD({})
    },
    openModal () {
      eventController.SHOW_MODAL({
        position: 'center',
        size: 'large',
        contentComponent: 'Palete'
      })
    },
    openEditor () {
      eventController.SHOW_MODAL({
        position: 'center',
        size: 'large',
        contentComponent: 'CodeEditor'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.working__page {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
}

.working__page .tool-box {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 50px;
  top: 100px;
  z-index: 999;
}
</style>
