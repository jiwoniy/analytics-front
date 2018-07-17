<template>
  <ul>
    <li
      class="item-list"
      v-for="(item, itemIndex) in items"
      :key="item.id || `list${itemIndex}`"
    >
      <div
        class="item"
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
  name: 'List-Comp',
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
    }
  }
}
</script>

<style lang="scss" scoped>
.item-list > .item {
  cursor: pointer;
    span {
    font-weight: 500;
    color: #6e7eac;
  }
  .selected {
    color:red;
    font-weight: 500;
  }
}
</style>
