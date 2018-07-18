<template>
  <li>
    <div class="tree-item" @click="toggle">
      <i v-if="!open && isFolder" class="fa fa-angle-right"></i>
      <i v-if="open" class="fa fa-angle-down"></i>

      <drag-item
        v-if="isDragable"
        slot="pipeline-item"
        :item="treeItem">
      </drag-item>
      <span v-if="!isDragable" class="label"> {{ treeItem.name }} </span>
    </div>

    <ul
      v-show="open"
      v-if="isFolder"
    >
      <tree-item
        :is-dragable="isDragable"
        v-for="(child, index) in treeItem.children"
        :tree-item="child"
        :key="`${index}`">
      </tree-item>
    </ul>

  </li>
</template>

<script>
import DragItem from '@/components/ui/DragItem'

export default {
  name: 'Tree-Item',
  components: {
    DragItem
  },
  data () {
    return {
      open: false
    }
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
  },
  computed: {
    isFolder () {
      return this.treeItem.children &&
        this.treeItem.children.length
    }
  },
  methods: {
    toggle () {
      if (this.isFolder) {
        this.open = !this.open
      }
    }
  }
}
</script>

<style scoped lang="scss">
li .tree-item {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex: 0 0 calc(100% - 30px);
  font-size: 18px;

  i {
    flex: 0 0 20px;
  }
}
</style>
