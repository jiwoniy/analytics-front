<template>
  <section
    id="rightPanel"
    class="right-panel__page">
    <transition name="fade">
      <manage-view
        :node-info="filterCurrentItem">
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
