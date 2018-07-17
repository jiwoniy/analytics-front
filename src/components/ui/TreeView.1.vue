<template>
  <div class="tree">
    <ul class="tree-list">
      <node-tree :node-tree="nodeTree"></node-tree>
    </ul>
  </div>
</template>

<script>
import NodeTree from './NodeTree'

export default {
  components: {
    NodeTree
  },
  props: {
    nodeTree: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style>
.tree-list ul {
  padding-left: 16px;
  margin: 6px 0;
}
</style>
