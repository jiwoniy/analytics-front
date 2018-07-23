<template>
  <div class="manage-node">
    <div class="item-title">
      <label>
        {{ itemInfo && itemInfo.name }}
      </label>
    </div>

    <div
      class="item-node"
      v-if="itemItemsKey"
      v-for="key in itemItemsKey"
      :key="key"
    >
      <label>
        {{ key }} : {{ itemInfo[key] }}
      </label>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Manage-View',
  props: {
    itemInfo: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    itemItemsKey () {
      if (this.itemInfo) {
        return Object.keys(this.itemInfo)
      }
      return null
    }
  }
}
</script>

<style lang="scss" scoped>
.manage-node {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;

  .item-title label {
    text-align: center;
    // margin: 10px auto;
    font-size: 24px;
  }

  .item-node label {
    text-align: left;
    font-size: 18px;
    // margin: 10px 10px;
  }
}
  </style>
