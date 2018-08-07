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
        <wrapper-input
          :is-editable="isPipelineEditable"
          v-model="item.value"
          @wrapperEvent="(value) => wrapperEvent(item.key, value)">
        </wrapper-input>
      </label>

      <div class="right-footer" @click="remove">
        <wrapper-button
          :button-text="$t('Delete')">
        </wrapper-button>
      </div>
    </div>

    <!-- node -->
    <div
      class="item-node"
      v-if="currentItemType === 'pipeline-node' && filterActivatePipelineNode"
      v-for="item in filterActivatePipelineNode"
      :key="item.key"
    >
      <label>
        {{ item.key }}
        <wrapper-input
          :is-editable="isPipelineEditable"
          v-model="item.value"
          @wrapperEvent="(value) => wrapperEvent(item.key, value)">
        </wrapper-input>
      </label>

      <div class="right-footer" @click="remove">
        <wrapper-button
          :button-text="$t('Delete')">
        </wrapper-button>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import eventController from '@/utils/EventController'
import WrapperButton from '@/components/ui/Wrapper/Button'
import WrapperInput from '@/components/ui/Wrapper/Input'

export default {
  name: 'Manage-View',
  components: {
    WrapperButton,
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
      isPipelineEditable: 'myProject/isPipelineEditable',
      activateWorksheet: 'myProject/getActivateWorksheet',
      activateWorksheetId: 'myProject/getActivateWorksheetId',
      getActivatePipelineNodes: 'myProject/getActivatePipelineNodes',
      activatePipelineNodeId: 'myProject/getActivatePipelineNodeId'
    }),
    filterWorksheetItem () {
      return Object.keys(this.activateWorksheet)
        .map(key => ({ key, value: this.activateWorksheet[key] }))
        .filter(item => item.key !== 'id')
    },
    filterActivatePipelineNode () {
      const activateNode = this.getActivatePipelineNodes[this.activatePipelineNodeId]
      if (activateNode) {
        return Object.keys(activateNode)
          .map(key => ({ key, value: activateNode[key] }))
          .filter(item => item.key !== 'status' && item.key !== 'id' && item.key !== 'ui')
      //     // TODO utils filter 만들기...lodash 찾아보기
      }
      return null
    }
  },
  methods: {
    ...mapActions({
      updateWorksheets: 'myProject/updateWorksheets',
      updateActivatePipelineNode: 'myProject/updateActivatePipelineNode'
    }),
    remove () {
      if (this.isPipelineEditable) {
        eventController.SHOW_MODAL({
          position: 'center',
          // size: 'x-small',
          isNeedAccept: true,
          contentComponent: 'Confirmation',
          params: {},
          callback: (isAccept) => {
            if (isAccept) {
              if (this.currentItemType === 'worksheet') {
                this.updateWorksheets({
                  updateType: 'delete',
                  worksheetId: this.activateWorksheetId
                })
              } else if (this.currentItemType === 'pipeline-node') {
                this.updateActivatePipelineNode({
                  updateType: 'delete'
                })
              }
            }
          }
        })
      }
    },
    wrapperEvent (key, value) {
      if (this.isPipelineEditable) {
        if (this.currentItemType === 'worksheet') {
          this.updateWorksheets({
            updateType: 'update',
            worksheetId: this.activateWorksheetId,
            updatedProp: key,
            updatedValue: value
          })
        } else if (this.currentItemType === 'pipeline-node') {
          this.updateActivatePipelineNode({
            updateType: 'update',
            updatedProp: key,
            updatedValue: value
          })
        }
      } else {
        return false
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
