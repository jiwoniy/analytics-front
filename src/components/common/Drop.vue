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
import { eventsBus, events } from '@/events'

export default {
  name: 'Drop-Component',
  methods: {
    allowDrop (event) {
      event.preventDefault()
    },
    drop (event) {
      const data = event.dataTransfer.getData('data')
      eventsBus.$emit(events.SEND_DATA_TRANSFER, {
        data: JSON.parse(data)
      })
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
