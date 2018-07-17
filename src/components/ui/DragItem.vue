<template>
  <transition>
    <div
      class="drag-container"
      @dragstart="drag($event, item)"
      draggable="true"
    >
      <div class="drag-item">
        <h5> {{ item.title }} </h5>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Drag-Component',
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
.drag-container {
  display: block;

  .drag-item {
    padding: 10px;
    margin: 10px;
    height: 50px;
    background: rgba(black, 0.4);

    &.is-moving {
      transform: scale(1.5);
      background: rgba(black, 0.8);
    }
  }
}
</style>
