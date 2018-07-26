<template>
  <div class="manage-node">
    <div class="item-title">
      <label>
        {{ currentItemType }}
      </label>
    </div>

    <div
      class="item-node"
      v-if="currentItemType === 'worksheet'"
      v-for="item in filterWorksheetItem"
      :key="item.key"
    >
      <label>
        {{ item.key }}
        <wrapper-input v-model="item.value" @wrapperEvent="(value) => wrapperEvent(item.key, value)"></wrapper-input>
      </label>
    </div>

    <div
      class="item-node"
      v-if="currentItemType === 'pipeline-tools' && filterCurrentWorkNode"
      v-for="item in filterCurrentWorkNode"
      :key="item.key"
    >
      <label>
        {{ item.key }}
        <wrapper-input v-model="item.value" @wrapperEvent="(value) => wrapperEvent(item.key, value)"></wrapper-input>
      </label>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import WrapperInput from '@/components/ui/Wrapper/Input'

export default {
  name: 'Manage-View',
  components: {
    WrapperInput
  },
  props: {
    currentItemType: {
      type: String,
      default: () => 'worksheet' // pipeline-tools'
    }
  },
  computed: {
    ...mapGetters({
      selectedWorksheet: 'myProject/getSelectedWorksheet',
      currentWorkNode: 'myProject/getCurrentWorkNode'
    }),
    filterWorksheetItem () {
      return Object.keys(this.selectedWorksheet)
        .map(key => ({ key, value: this.selectedWorksheet[key] }))
        .filter(item => item.key !== 'id')
    },
    filterCurrentWorkNode () {
      if (this.currentWorkNode) {
        return Object.keys(this.currentWorkNode)
          .map(key => ({ key, value: this.currentWorkNode[key] }))
          .filter(item => item.key !== 'status' && item.key !== 'id')
          // TODO utils filter 만들기...lodash 찾아보기
      }
      return null
    }
  },
  methods: {
    ...mapActions({
      updateSelectedWorksheet: 'myProject/updateSelectedWorksheet',
      updateCurrentWorkPipelineNode: 'myProject/updateCurrentWorkPipelineNode'
    }),
    wrapperEvent (key, value) {
      if (this.currentItemType === 'worksheet') {
        this.updateSelectedWorksheet({
          worksheetId: this.selectedWorksheet.id,
          key,
          value
        })
      } else if (this.currentItemType === 'pipeline-tools') {
        this.updateCurrentWorkPipelineNode({
          nodeId: this.currentWorkNode.id,
          key,
          value
        })
      }
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
