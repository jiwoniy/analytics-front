<template>
  <ul class="tree-list">
    <tree-item
      :tree-item="treeItem"
      :is-dragable="isDragable">
    </tree-item>
  </ul>
</template>

<script>
import TreeItem from './TreeItem'

export default {
  components: {
    TreeItem
  },
  props: {
    treeItem: {
      type: Object,
      default: () => {}
    },
    isDragable: {
      type: Boolean,
      default: () => false
    }
  }
}
</script>

<style scoped>
.tree-list ul {
  list-style: none;

  padding-left: 16px;
  margin: 6px 0;
}
</style>
