<template>
  <transition name="fade">
    <section id="leftPanel" class="left-panel__page">
      <button @click="closeLeftPanel"> x </button>

      <div class="drag-item-list">
        <drag-comp
          v-for="block in blocks"
          :key="block.id"
          :item="block"
        >
        </drag-comp>
      </div>

    </section>
  </transition>
</template>

<script>
import { eventsBus, events } from '@/events'

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
    }
  },
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
.left-panel__page {
  width: 250px;
  height: 100%;
  display: block;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;

  .drag-item-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
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
