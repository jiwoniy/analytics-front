<template>
  <div :id="uCompId" class="manage-node">
    <div class="item-title">
      <label>
        {{ $t('Node') }}
      </label>
    </div>

    <!-- <label>
      {{ item.key }} : {{ item.value }}
      <wrapper-input
        :is-un-lock="isPipelineUnLock"
        v-model="item.value"
        @wrapperEvent="(value) => wrapperEvent(item.key, value)">
      </wrapper-input>
    </label> -->
    <div
      class="item-node basic"
      v-if="filterNodeBasicProperties"
      v-for="item in filterNodeBasicProperties"
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
    </div>

    <br />
    <p> Parameter </p>

    <div
      class="item-node"
      v-if="filterNodeParamProperties"
      v-for="item in filterNodeParamProperties"
      :key="item.id"
    >
      <label>
        {{ item }}
        <wrapper-input
          :is-un-lock="isPipelineUnLock"
          v-model="item.value"
          @wrapperEvent="(value) => wrapperEvent(item.name, value)">
        </wrapper-input>

        <!-- <wrapper-selection>
        </wrapper-selection> -->
      </label>
    </div>

    <div class="right-footer" v-if="!readOnly" @click="remove">
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
import WrapperInput from '@/components/ui/Wrapper/Input'
// import WrapperSelection from '@/components/ui/Wrapper/Selection'

export default {
  name: 'Node-Manager-View',
  components: {
    WrapperButton,
    WrapperInput
    // WrapperSelection
  },
  props: {
    readOnly: {
      type: Boolean,
      default: () => false
    }
  },
  i18n: {
    messages: {
      'en': {
        'Delete': 'Delete',
        'Node': 'Node'
      },
      'ko': {
        'Delete': '삭제',
        'Node': '노드'
      }
    }
  },
  data () {
    return {
      uCompId: null
    }
  },
  beforeMount () {
    this.uCompId = this._uid
  },
  computed: {
    ...mapGetters({
      isPipelineUnLock: 'myProject/isPipelineEditable',
      getActivatePipelineNodes: 'myProject/getActivatePipelineNodes',
      activatePipelineNodeId: 'myProject/getActivatePipelineNodeId'
    }),
    filterNodeParamProperties () {
      const activateNode = this.getActivatePipelineNodes[this.activatePipelineNodeId]
      if (activateNode && activateNode.properties) {
        return activateNode.properties
          .map(item => ({
            id: item.id || item.name,
            name: item.name,
            value: item.value
          }))
        //   // .filter(item => item.key === 'properties')
      }
      return null
    },
    filterNodeBasicProperties () {
      const activateNode = this.getActivatePipelineNodes[this.activatePipelineNodeId]
      if (activateNode) {
        return Object.keys(activateNode)
          .map(key => ({ key, value: activateNode[key] }))
          .filter(item => item.key === 'name' ||
            item.key === 'desc')
      }
      return null
    }
  },
  methods: {
    ...mapActions({
      updateActivatePipelineNode: 'myProject/updateActivatePipelineNode'
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
              this.updateActivatePipelineNode({
                updateType: 'delete'
              })
            }
          }
        })
      }
    },
    wrapperEvent (key, value) {
      if (this.isPipelineUnLock) {
        this.updateActivatePipelineNode({
          updateType: 'update',
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
  background-color: rgb(248, 248, 248);
  position: relative;
  width: 100%;
  height: 100%;
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
