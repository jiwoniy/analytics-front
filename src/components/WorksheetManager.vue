<template>
  <div class="manage-node">
    <div class="item-title">
      <label>
        {{ $t('Worksheet') }}
      </label>
    </div>

    <div
      class="item-node"
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import eventController from '@/utils/EventController'
import WrapperButton from '@/components/ui/Wrapper/Button'
import WrapperInput from '@/components/ui/Wrapper/Input'

export default {
  name: 'Worksheet-Manager-View',
  components: {
    WrapperButton,
    WrapperInput
  },
  i18n: {
    messages: {
      'en': {
        'Delete': 'Delete',
        'Worksheet': 'Worksheet'
      },
      'ko': {
        'Delete': '삭제',
        'Worksheet': '워크시트'
      }
    }
  },
  computed: {
    ...mapGetters({
      isPipelineEditable: 'myProject/isPipelineEditable',
      activateWorksheet: 'myProject/getActivateWorksheet',
      activateWorksheetId: 'myProject/getActivateWorksheetId'
    }),
    filterWorksheetItem () {
      return Object.keys(this.activateWorksheet)
        .map(key => ({ key, value: this.activateWorksheet[key] }))
        .filter(item => item.key !== 'id')
    }
  },
  methods: {
    ...mapActions({
      updateWorksheets: 'myProject/updateWorksheets'
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
              this.updateWorksheets({
                updateType: 'delete',
                worksheetId: this.activateWorksheetId
              })
            }
          }
        })
      }
    },
    wrapperEvent (key, value) {
      if (this.isPipelineEditable) {
        this.updateWorksheets({
          updateType: 'update',
          worksheetId: this.activateWorksheetId,
          updatedProp: key,
          updatedValue: value
        })
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
