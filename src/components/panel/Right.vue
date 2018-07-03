<template>
  <transition name="fade">
    <div class="div--Right__page">
      <button @click="closeRightPanel"> x </button>
    </div>
  </transition>
</template>

<script>
import { eventsBus, events } from '@/events'

export default {
  name: 'Right-Panel',
  methods: {
    closeRightPanel () {
      eventsBus.$emit(events.RIGHT_PANEL, {
        open: false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.div--Right__page {
  width: 250px;
  margin-left: 250px;
  height: 100%;
  display: block;
  position: fixed;
  z-index: 1;
  top: 0;
  right: 0;
  background-color: #111;
}

.fade-enter-active {
  animation: fade-in .3s;
}
.fade-leave-active {
  animation: fade-in .3s reverse;
}

@keyframes fade-in {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(calc(100% - 250px));
  }
}
</style>
