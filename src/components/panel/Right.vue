<template>
  <transition name="fade">
    <section class="right-panel__page">
      <button @click="closeRightPanel"> x </button>
      <div>
        {{ currentItem && currentItem.title }}
      </div>
    </section>
  </transition>
</template>

<script>
import eventController from '@/utils/EventController'

export default {
  name: 'Right-Panel',
  props: {
    currentItem: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    closeRightPanel () {
      eventController.LEFT_PANEL({ open: false })
    }
  }
}
</script>

<style lang="scss" scoped>
.right-panel__page {
  width: 250px;
  // margin-left: 250px;
  height: 100%;
  display: block;
  position: fixed;
  z-index: 1;
  // top: 0;
  top: var(--app-top_panel-height);
  right: 0;
  background-color: #ffffff;
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
