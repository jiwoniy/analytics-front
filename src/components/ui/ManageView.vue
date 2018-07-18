<template>
  <div class="manage-node">
    <div class="node-title">
      <label>
        {{ nodeInfo && nodeInfo.name }}
      </label>
    </div>

    <div
      class="node-item"
      v-if="nodeItemsKey"
      v-for="key in nodeItemsKey"
      :key="key"
    >
      <label>
        {{ key }} : {{ nodeInfo[key] }}
      </label>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Manage-View',
  props: {
    nodeInfo: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    nodeItemsKey () {
      if (this.nodeInfo) {
        return Object.keys(this.nodeInfo)
      }
      return null
    }
  }
}
</script>

<style lang="scss" scoped>
.manage-node {
  width: 100%;
  display: flex;
  flex-direction: column;

  .node-title label {
    text-align: center;
    // margin: 10px auto;
    font-size: 24px;
  }

  .node-item label {
    text-align: left;
    font-size: 18px;
    // margin: 10px 10px;
  }
}
  </style>
