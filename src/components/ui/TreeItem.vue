<template>
  <li>
    <div class="tree-item" @click="toggle">
      <img v-if="!open && isFolder" src="/static/img/angle-right-solid.svg" />
      <img v-if="open" src="/static/img/angle-down-solid.svg" />

      <div v-if="!isNodeitemDragable" class="text-ellipsis__default">
        <span> {{ treeItem.name }} </span>
      </div>

      <drag-item
        v-if="isNodeitemDragable"
        slot="pipeline-item"
        :item="treeItem">
        <p slot="drag-item" class="text-ellipsis__default"> {{ treeItem.name }} </p>
      </drag-item>
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
    },
    isNodeitemDragable () {
      return true && (this.treeItem.input || this.treeItem.output)
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
  font-size: 1.4rem;

  img {
    width: 15px;
    height: 15px;
  }

  i {
    flex: 0 0 20px;
  }
}

</style>
