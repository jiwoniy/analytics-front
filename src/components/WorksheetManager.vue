<template>
  <div class="node-manager__container">
    <label class="item-title">
      {{ $t('Worksheet') }}
    </label>

    <div
      class="property-contents__container"
      v-for="item in filterWorksheetItem"
      :key="item.key"
    >
      <label>
        {{ item.key }}
        <wrapper-input
          :is-un-lock="isPipelineUnLock"
          v-model="item.value"
          @wrapperEvent="(value) => wrapperEvent(item.key, value)">
        </wrapper-input>
      </label>

      <div class="footer" @click="remove">
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
  name: 'Worksheet-Manager-Comp',
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
      isPipelineUnLock: 'myProject/isPipelineUnLock',
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
      if (this.isPipelineUnLock) {
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
      if (this.isPipelineUnLock) {
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
.node-manager__container {
  position: relative;
  width: 100%;
  height: calc(100vh - var(--app-top-panel-height) - var(--app-foot-panel-height));
  display: flex;
  flex-direction: column;
}
.node-manager__container .item-title {
  text-align: center;
  font-size: 1.8rem;
}

// .node-manager__container .property-contents__container {
//   .footer {}
// }
  </style>
