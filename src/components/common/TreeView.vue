<template>
  <li>
    <div
      :class="{bold: isFolder}"
      @click="toggle"
      @dblclick="changeType">
      {{ models.name }}
      <span v-if="isFolder">[{{open ? '-' : '+'}}]</span>
    </div>
    <ul v-show="open" v-if="isFolder">
      <item
        class="item"
        v-for="(model, index) in models.children"
        :models="model"
        :key="`${index}`"
      >
        {{ model.name }}
      </item>
      <li class="add" @click="addChild">+</li>
    </ul>
  </li>
</template>

<script>
// import TreeView from '@/components/common/TreeView'
// import DragItem from '@/components/common/DragItem'

export default {
  // components: {
  // DragItem,
  // TreeView
  // },
  props: {
    models: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      open: false
    }
  },
  computed: {
    isFolder: function () {
      return this.models.children &&
        this.models.children.length
    }
  },
  methods: {
    toggle: function () {
      if (this.isFolder) {
        this.open = !this.open
      }
    },
    changeType: function () {
      if (!this.isFolder) {
        // Vue.set(this.model, 'children', [])
        this.addChild()
        this.open = true
      }
    },
    addChild: function () {
      this.models.children.push({
        name: 'new stuff'
      })
    }
  }
}
</script>

<style lang="scss">
.item {
  cursor: pointer;
}
.bold {
  font-weight: bold;
}
ul {
  padding-left: 1em;
  line-height: 1.5em;
  list-style-type: dot;
}
</style>
