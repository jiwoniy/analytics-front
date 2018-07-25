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
        {{ key }}
        <wrapper-input v-model="itemInfo[key]" @wrapperEvent="(value) => wrapperEvent(key, value)"></wrapper-input>
      </label>
    </div>

  </div>
</template>

<script>
import WrapperInput from '@/components/ui/Wrapper/Input'

export default {
  name: 'Manage-View',
  components: {
    WrapperInput
  },
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
  },
  methods: {
    wrapperEvent (key, value) {
      // TODO find solution
      // this.itemInfo[key] = value
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
