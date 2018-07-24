<template>
  <transition>
    <div id="Footer" class="Foot-panel__page">
      <div v-if="!isOpen" class="fixed">
        <button @click="openReport">
          report
        </button>
      </div>
      <div v-show="isOpen" class="report">
        <div id="draggable" class="split" draggable="true"></div>
        <div id="areaddd" class="area">
          <img class="close" @click="closeRerpot" src="@/assets/img/times-solid.svg" />
          <slot></slot>
        </div>
      </div>

    </div>
  </transition>
</template>

<script>

export default {
  name: 'Foot-Panel',
  data () {
    return {
      Footer: null,
      draggable: null,
      isOpen: false
    }
  },
  methods: {
    // drag (event) {
    // },
    // dragStart () {
    // },
    dragEnd (event) {
      this.Footer.style.height = `${window.innerHeight - event.screenY}px`
    },
    openReport () {
      this.isOpen = true
      this.Footer.style.height = '300px'
    },
    closeRerpot () {
      this.isOpen = false
      this.Footer.style.height = '30px'
    }
  },
  mounted () {
    this.Footer = document.getElementById('Footer')
    this.draggable = document.getElementById('draggable')
    this.draggable.addEventListener('dragend', this.dragEnd, true)
  }
}
</script>

<style lang="scss" scoped>
.Foot-panel__page {
  position: fixed;
  width: 100%;
  background-color: #ffffff;
  height: 30px;
  bottom: 0px;
}

.fixed {
  width: 100%;
}

.report {
  width: 100%;
  position: relative;

  .split {
    width: 100%;
    height: 5px;
    cursor: row-resize;
    background-color: #eee;
    background-repeat: no-repeat;
    border-bottom: 2px solid gray;
  }

  .area {
    height: calc(100% - 10px);
    background-color: #ffffff;
  }

  .close {
    position: absolute;
    right: 0px;
    width: 30px;
    height: 30px;
    color: #676a6c;
  }
}
</style>
