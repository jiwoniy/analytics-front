<template>
  <li class="node-tree">
    <span class="label">{{ nodeTree.name }}</span>

    <ul v-if="nodeTree.children && nodeTree.children.length">
      <node-tree
        v-for="(child, index) in nodeTree.children"
          :nodeTree="child"
        :key="`${index}`"
      >
      </node-tree>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'Node-Tree',
  props: {
    nodeTree: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
