<template>
  <section
    class="right-panel__page"
    :class="{ active: isShow }"
  >
      <!-- <button @click="closeRightPanel"> x </button> -->
    <transition name="fade">
      <div>
        {{ currentItem && currentItem.title }}
      </div>
    </transition>
  </section>
</template>

<script>
import eventController from '@/utils/EventController'

export default {
  name: 'Right-Panel',
  props: {
    currentItem: {
      type: Object,
      default: () => {}
    },
    isShow: {
      type: Boolean,
      default: () => false
    }
  },
  methods: {
    closeRightPanel () {
      eventController.RIGHT_PANEL({ open: false })
    }
  }
}
</script>

<style lang="scss" scoped>
.right-panel__page {
  width: 0px;
  height: 100%;
  display: block;
  position: fixed;
  z-index: 1;
  top: var(--app-top_panel-height);
  right: 0;
  background-color: #ffffff;
}

.right-panel__page.active {
  width: 250px;
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
