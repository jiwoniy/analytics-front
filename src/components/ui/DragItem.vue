<template>
  <div
    class="drag__container"
    @dragstart="drag($event, item)"
    draggable="true"
  >
    <div class="drag-item__container">
      <slot name="drag-item"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Drag-Comp',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    drag (ev, item) {
      ev.dataTransfer.setData('data', JSON.stringify(item))
    }
  }
}
</script>

<style lang="scss" scoped>
.drag__container {
  width: 100%;
  display: block;

  .drag-item__container {
    // padding: 10px;
    // margin: 10px;
    // background: rgba(black, 0.4);

    &.is-moving {
      transform: scale(1.5);
      // background: rgba(black, 0.8);
    }
  }
}
</style>
