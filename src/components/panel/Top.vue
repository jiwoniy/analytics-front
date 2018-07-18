<template>
  <transition>
    <div class="top-panel__page">
      <!-- <button @click="save"> save </button>
      <button @click="edit"> edit </button>
      <button @click="refresh"> refresh </button>
      <button @click="load"> load </button> -->
    </div>
  </transition>
</template>

<script>
// import eventController from '@/utils/EventController'

export default {
  name: 'TOP-Panel'
  // methods: {
  //   save () {
  //     eventController.SAVE({})
  //   },
  //   edit () {
  //     eventController.EDIT({})
  //   },
  //   refresh () {
  //     eventController.REFRESH({})
  //   },
  //   load () {
  //     eventController.LOAD({})
  //   }
  // }
}
</script>

<style lang="scss" scoped>
.top-panel__page {
  width: 100%;
  height: var(--app-top-panel-height);
  background-color: var(--app-top-panel-color)
}
</style>
