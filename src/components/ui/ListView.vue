<template>
  <ul class="list-view__container">
    <li
      class="item-list"
      v-for="(item, itemIndex) in items"
      :key="item.id || `list${itemIndex}`"
    >
      <div
        class="item"
        :class="itemClass"
        :style="itemStyle"
        @click="itemClick"
        :id="item.id"
      >
        <span :class="{ selected: selectedItemId === item.id }"> {{ item.name }} </span>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ListView-Comp',
  props: {
    items: {
      type: Array,
      default: () => []
    },
    selectedItemId: {
      type: [String, Number],
      default: () => ''
    },
    itemClick: {
      type: Function,
      default: () => null
    },
    itemStyle: {
      type: Object,
      default: () => null
    },
    itemClass: {
      type: String,
      default: () => null
    }
  }
}
</script>

<style lang="scss" scoped>
.list-view__container {
  list-style: none;
  width: 100%;
}

.list-view__container .item-list > .item {
  cursor: pointer;

  span {
    color: black;
  }
  .selected {
    color: #6e7eac;
    font-weight: 500;
  }
}
</style>
