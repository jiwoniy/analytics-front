<template>
  <div class="manage-node">
    <div class="item-title">
      <label>
        {{ currentItemType }}
      </label>
    </div>

    <!-- worksheet -->
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

      <div class="right-footer" @click="remove">
        <button class="button__default"> {{ $t('Delete') }} </button>
      </div>
    </div>

    <!-- node -->
    <div
      class="item-node"
      v-if="currentItemType === 'pipeline-node' && filterCurrentWorkNode"
      v-for="item in filterCurrentWorkNode"
      :key="item.key"
    >
      <label>
        {{ item.key }}
        <wrapper-input v-model="item.value" @wrapperEvent="(value) => wrapperEvent(item.key, value)"></wrapper-input>
      </label>

      <div class="right-footer" @click="remove">
        <button class="button__default"> {{ $t('Delete') }} </button>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import eventController from '@/utils/EventController'
import WrapperInput from '@/components/ui/Wrapper/Input'

export default {
  name: 'Manage-View',
  components: {
    WrapperInput
  },
  i18n: {
    messages: {
      'en': {
        'Delete': 'Delete'
      },
      'ko': {
        'Delete': '삭제'
      }
    }
  },
  props: {
    currentItemType: {
      type: String,
      default: () => 'worksheet' // pipeline-node'
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
      updateWorksheets: 'myProject/updateWorksheets',
      deleteSelectedWorksheet: 'myProject/deleteSelectedWorksheet',
      updateCurrentWorkPipelineNode: 'myProject/updateCurrentWorkPipelineNode'
    }),
    remove () {
      eventController.SHOW_MODAL({
        position: 'center',
        size: 'small',
        isNeedAccept: true,
        params: {},
        callback: (isAccept) => {
          if (isAccept) {
            this.deleteSelectedWorksheet({
              worksheetId: this.selectedWorksheet.id
            })
          }
        }
      })
    },
    wrapperEvent (key, value) {
      if (this.currentItemType === 'worksheet') {
        this.updateWorksheets({
          worksheetId: this.selectedWorksheet.id,
          key,
          value
        })
      } else if (this.currentItemType === 'pipeline-node') {
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
  height: calc(100vh - var(--app-top-panel-height) - var(--app-foot-panel-height));
  display: flex;
  flex-direction: column;

  .item-title label {
    text-align: center;
    font-size: 1.8rem;
  }

  .item-node label {
    text-align: left;
    font-size: 1rem;
  }

  .right-footer {
    position: absolute;
    right: 0px;
    bottom: var(--app-foot-panel-height);
  }
}
  </style>
