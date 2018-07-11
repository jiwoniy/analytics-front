<template>
  <transition>
    <div
      class="drop-container"
      @dragover="allowDrop"
      @drop="drop"
    >
      <slot name="svg-container"></slot>
    </div>
  </transition>
</template>

<script>
import eventController from '@/utils/EventController'

export default {
  name: 'Drop-Component',
  methods: {
    allowDrop (event) {
      event.preventDefault()
    },
    drop (event) {
      const position = {
        x: event.x || 100,
        y: event.y || 100
      }
      const data = event.dataTransfer.getData('data')
      // TODO check json data
      if (data) {
        eventController.SEND_DATA_TRANSFER({
          data: {
            ...JSON.parse(data),
            position
          }
        })
      }
      event.preventDefault()
    }
  }
}
</script>

<style lang="scss" scoped>
.drop-container {
  width: 100%;
  height: 100%;
}
</style>
