<template>
  <transition>
    <div class="div--Work__page">
      Work panel
      <button @click="showLeft"> show left </button>
      <button @click="showRight"> show right </button>
    </div>
  </transition>
</template>

<script>
import { eventsBus, events } from '@/events'

export default {
  name: 'Work-Panel',
  methods: {
    showLeft () {
      eventsBus.$emit(events.LEFT_PANEL, {
        open: true
      })
    },
    showRight () {
      eventsBus.$emit(events.RIGHT_PANEL, {
        open: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.div--Work__page {
  width: 100%;
  display: flex;
  height: 100%;
}
</style>
