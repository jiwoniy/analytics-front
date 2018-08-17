<template>
  <div class="node-manager__container">
    <label class="title">
      {{ $t('Worksheet') }}
    </label>

    <div class="property-contents__container">
      <div
        class="property-item"
        v-for="item in filterWorksheetItem"
        :key="item.key"
      >
        <label> {{ item.key }} </label>
          <wrapper-ui-container
            :is-un-lock="true"
            :uiType="'input'"
            :item-key="item.key"
            :item-value="item.value"
            :wrapper-event="(value) => wrapperEvent(item.key, value)">
          </wrapper-ui-container>
      </div>
    </div>

    <div class="footer" @click="remove">
      <wrapper-button
        :button-text="$t('Delete')">
      </wrapper-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import eventController from '@/utils/EventController'
import WrapperButton from '@/components/ui/Wrapper/Button'
import WrapperUiContainer from '@/components/ui/Wrapper/Container'

export default {
  name: 'Worksheet-Manager-Comp',
  components: {
    WrapperButton,
    WrapperUiContainer
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
      eventController.SHOW_MODAL({
        position: 'center',
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
    },
    wrapperEvent (key, value) {
      this.updateWorksheets({
        updateType: 'update',
        worksheetId: this.activateWorksheetId,
        updatedProp: key,
        updatedValue: value
      })
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
.node-manager__container .title {
  text-align: center;
  font-size: 1.8rem;
}

.node-manager__container .property-contents__container {
  margin: 0.4rem;
  border: 0.5px solid darken(#ffffff, 5%);

  .property-item {
    margin: 0.2rem;
  }
}
  </style>
