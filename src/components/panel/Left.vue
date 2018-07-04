<template>
  <transition name="fade">
    <div class="div--Left__page">
      <button @click="closeLeftPanel"> x</button>
    </div>
  </transition>
</template>

<script>
import { eventsBus, events } from '@/events'

export default {
  name: 'LEFT-Panel',
  methods: {
    closeLeftPanel () {
      eventsBus.$emit(events.LEFT_PANEL, {
        open: false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.div--Left__page {
  width: 250px;
  height: 100%;
  display: block;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
}

.fade-enter-active {
  animation: fade-in .3s;
}
.fade-leave-active {
  animation: fade-in .3s reverse;
}

@keyframes fade-in {
  0% {
    transform: translateX(-250px);
  }
  100% {
    transform: translateX(0px);
  }
}
</style>
