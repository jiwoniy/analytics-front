<template>
  <section
    id="rightPanel"
    class="right-panel__page">
    <transition name="fade">
      <manage-view
        :item-info="filterCurrentItem && filterCurrentItem.item">
      </manage-view>
    </transition>
  </section>
</template>

<script>
import ManageView from '@/components/ui/ManageView'

export default {
  name: 'Right-Panel',
  components: {
    ManageView
  },
  props: {
    type: {
      type: String,
      default: () => 'worksheet' // worksheet, node
    },
    currentItem: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    filterCurrentItem () {
      // TODO only throw editable info
      return this.currentItem
    }
  }
}
</script>

<style lang="scss" scoped>
.right-panel__page {
  display: block;
  position: relative;
  margin: 0 10px;
  width: calc(100% - 20px);
  height: 100%;
  z-index: 1;
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
