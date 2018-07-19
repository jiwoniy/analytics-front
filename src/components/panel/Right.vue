<template>
  <section
    class="right-panel__page"
    :class="{ active: localIsShow }"
  >
    <transition name="fade">
      <manage-view
        :node-info="filterCurrentItem">
      </manage-view>
    </transition>
    <div class="folder__button">
      <i id="close" @click="closeRightPanel" v-if="isShow && localIsShow" class="fa fa-angle-double-right" style="font-size:24px"></i>
      <i id="open" @click="closeRightPanel" v-if="isShow && !localIsShow" class="fa fa-angle-double-left" style="font-size:24px"></i>
    </div>
  </section>
</template>

<script>
import ManageView from '@/components/ui/ManageView'

export default {
  name: 'Right-Panel',
  components: {
    ManageView
  },
  data () {
    return {
      localIsShow: false
    }
  },
  props: {
    currentItem: {
      type: Object,
      default: () => null
    },
    isShow: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    filterCurrentItem () {
      // only throw editable info
      return this.currentItem
    }
  },
  methods: {
    closeRightPanel (event) {
      const id = event.target.id
      if (id === 'open' && this.isShow) {
        this.localIsShow = true
      } else {
        this.localIsShow = false
      }
    }
  },
  watch: {
    isShow (newValue) {
      this.localIsShow = newValue
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

.right-panel__page .folder__button {
  display: block;
  position: absolute;
  cursor: pointer;
  top: 0px;
  left: calc(0px - var(--app-left-panel-folder-button));
  width: var(--app-left-panel-folder-button);
  height: var(--app-left-panel-folder-button);
  z-index: var(--app-left-panel-zIndex);
  i {
    position: relative;
    top: 40%;
    transform: perspective(1px) translateY(-50%);
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
    transform: translateX(100%);
  }
  100% {
    transform: translateX(calc(100% - 250px));
  }
}
</style>
