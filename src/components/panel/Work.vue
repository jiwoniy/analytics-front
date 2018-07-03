<template>
  <transition>
    <div class="div--Work__page">
      <!-- <button @click="showLeft"> show left </button>
      <button @click="showRight"> show right </button> -->
      <working></working>
    </div>
  </transition>
</template>

<script>
import { eventsBus, events } from '@/events'

import Working from '@/components/Working'

export default {
  name: 'Work-Panel',
  components: {
    Working
  },
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
  display: flex;
}
</style>
