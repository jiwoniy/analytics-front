<template>
  <div
    class="Toggle-Button__container"
    @click="clickButton"
    :style="customStyle"
  >
    <img v-show="toggle" :src="aSrc" />
    <img v-show="!toggle" :src="bSrc" />
  </div>
</template>

<script>
export default {
  name: 'Toggle-Button',
  props: {
    clickButton: {
      type: Function,
      default: () => {}
    },
    customStyle: {
      type: Object,
      default: () => null
    },
    toggle: {
      type: Boolean,
      default: () => false
    },
    // TODO default image
    aSrc: {
      type: String,
      default: () => '/static/img/angle-right-solid.svg'
    },
    bSrc: {
      type: String,
      default: () => '/static/img/angle-left-solid.svg'
    }
  }
}
</script>

<style lang="scss" scoped>
.Toggle-Button__container {
  cursor: pointer;
  z-index: 2;
  display: block;
  position: absolute;

  width: var(--app-left-panel-folder-button);
  height: var(--app-left-panel-folder-button);
  img {
    position: relative;
    width: 30px;
    height: 30px;
  }
}
</style>
