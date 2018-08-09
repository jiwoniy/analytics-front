<template>
  <div :id="uCompId" class="manage-node">
    <div class="item-title">
      <label>
        {{ $t('Node') }}
      </label>
    </div>

    <div
      class="item-node basic"
      v-if="filterNodeBasicProperties"
      v-for="item in filterNodeBasicProperties"
      :key="item.key"
    >
      <wrapper-input
        v-if="!readOnly"
        :is-un-lock="isPipelineUnLock"
        v-model="item.value"
        @wrapperEvent="(value) => wrapperEvent(item.key, value)">
      </wrapper-input>
    </div>
    <!-- <wrapper-selection
      :show-placeholder="true"
      :options="options"
      v-model="test"
      @wrapperEvent="(value) => wrapperEvent('test', value)">
    </wrapper-selection> -->

    <!-- <tabs>
      <tab name="Services" :selected="true">
        <h1>What we do</h1>
      </tab>
      <tab name="Pricing">
        <h1>How much we do it for</h1>
      </tab>
      <tab name="About Us">
        <h1>Why we do it</h1>
      </tab>
    </tabs> -->

    <!-- <div
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
      </label>
    </div>

    <div class="right-footer" v-if="!readOnly" @click="remove">
      <wrapper-button
        :button-text="$t('Delete')">
      </wrapper-button>
    </div> -->

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import eventController from '@/utils/EventController'
import WrapperButton from '@/components/ui/Wrapper/Button'
import WrapperInput from '@/components/ui/Wrapper/Input'
import Tabs from '@/components/ui/Tabs'
import Tab from '@/components/ui/Tab'
import WrapperSelection from '@/components/ui/Wrapper/Selection'

export default {
  name: 'Node-Manager-View',
  components: {
    WrapperButton,
    WrapperInput,
    Tabs,
    Tab,
    WrapperSelection
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
      // options: [
      //   {
      //     id: '1',
      //     label: '11',
      //     value: 1
      //   },
      //   {
      //     id: '2',
      //     label: '22',
      //     value: 2
      //   },
      //   {
      //     id: '3',
      //     label: '33',
      //     value: 3
      //   }
      // ]
    }
  },
  beforeMount () {
    this.uCompId = this._uid
  },
  computed: {
    ...mapGetters({
      isPipelineUnLock: 'myProject/isPipelineUnLock',
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
      if (!this.readOnly && this.isPipelineUnLock) {
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
