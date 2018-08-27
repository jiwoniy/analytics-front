<template>
  <div
    class="icon__section"
    id="iconContainer"
    v-if="isShow"
    @click="open">
    <div class="icon__container">
      <div class="icon"></div>
    </div>
  </div>
</template>

<script>
import eventController from '@/utils/EventController'

export default {
  name: 'Read-Pipeline-Comp',
  data () {
    return {
      iconContainer: null
    }
  },
  props: {
    isShow: {
      type: Boolean,
      default: () => false
    }
  },
  methods: {
    open () {
      eventController.SHOW_MODAL({
        position: 'center',
        size: 'large',
        contentComponent: 'ReadOnlyPalete'
      })
    }
  },
  mounted () {
    this.iconContainer = document.getElementById('iconContainer')
  }
}
</script>

<style scoped lang="scss">
.icon__section {
  position: absolute;
  cursor: pointer;
  z-index: 1000;
  right: 0px;
  bottom: 0px;
}

.icon__section .icon__container {
  position: relative;

  .icon {
    position: relative;
    background-color: #1E90FF;
    width: 57px;
    height: 57px;
    border-radius: 30px;
  }
}
</style>
