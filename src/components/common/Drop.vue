<template>
  <div
    class="drop__container"
    @dragover="allowDrop"
    @drop="drop"
  >
    <slot name="svg-container"></slot>
  </div>
</template>

<script>
import eventController from '@/utils/EventController'

export default {
  name: 'Drop-Comp',
  methods: {
    allowDrop (event) {
      event.preventDefault()
    },
    drop (event) {
      const position = {
        x: (event.x * 0.3) || 100,
        y: (event.y * 0.7) || 100
      }
      const data = event.dataTransfer.getData('data')
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

<style scoped>
.drop__container {
  width: 100%;
  height: 100%;
}
</style>
