<template>
  <section
    id="leftPanel"
    class="left-panel__page"
  >
    <transition name="fade">
      <div class="drag-item-list" v-show="isShow">
        <drag-comp
          v-for="block in blocks"
          :key="block.id"
          :item="block"
        >
        </drag-comp>
      </div>
    </transition>
    <button class="folder__button" @click="closeLeftPanel"> x </button>
  </section>
</template>

<script>
import eventController from '@/utils/EventController'
import DragComp from '@/components/common/Drag'

export default {
  name: 'LEFT-Panel',
  components: {
    DragComp
  },
  props: {
    blocks: {
      type: Array,
      default: () => []
    },
    isShow: {
      type: Boolean,
      default: () => true
    }
  },
  methods: {
    closeLeftPanel () {
      eventController.LEFT_PANEL({ open: !this.isShow })
    }
  }
}
</script>

<style lang="scss" scoped>
.left-panel__page {
  position: relative;
  display: block;

  .drag-item-list {
    width: var(--app-left_panel-width);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

.left-panel__page .folder__button {
  position: absolute;
  top: 0px;
  right: calc(0px - var(--left-panel-folder-button));
  width: var(--left-panel-folder-button);
  height: var(--left-panel-folder-button);
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
