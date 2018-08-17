<template>
  <div :id="uCompId" class="node-manager__container">
    <label class="title">
      {{ $t('Node') }}
    </label>

    <div class="property-contents__container">
      <div
        class="property-item"
        v-if="filterNodeBasicProperties"
        v-for="item in filterNodeBasicProperties"
        :key="item.key"
      >
        <label> {{ item.key }} </label>

        <wrapper-ui-container
          v-if="!readOnly"
          :is-un-lock="isPipelineUnLock"
          :uiType="'input'"
          :item-value="item.value"
          :item-key="item.key"
          :wrapper-event="(value) => wrapperEvent(item.key, value)"
        >
        </wrapper-ui-container>
      </div>
    </div>

    <div class="property-contents__container">
      <div
        class="property-item"
        v-if="filterNodeParamProperties"
        v-for="(item, propertiesIndex) in filterNodeParamProperties"
        :key="item.id || propertiesIndex"
      >
        <label> {{ item.parameter_key }} </label>

          <wrapper-ui-container
            v-if="!readOnly"
            :is-un-lock="isPipelineUnLock"
            :uiType="item.ui_type"
            :item-value="item.value"
            :item-key="item.parameter_key"
            :wrapper-event="(value) => wrapperPropEvent(propertiesIndex, item.parameter_key, value)"
          >
          </wrapper-ui-container>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import _cloneDeep from 'lodash.clonedeep'

import { objectTransformKeyValueArray } from '@/utils/objectTransformArray'
import WrapperUiContainer from '@/components/ui/Wrapper/Container'
import Tabs from '@/components/ui/Tabs'
import Tab from '@/components/ui/Tab'

export default {
  name: 'Node-Manager-Comp',
  components: {
    WrapperUiContainer,
    Tabs,
    Tab
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
      isPipelineUnLock: 'myProject/isPipelineUnLock',
      getActivatePipelineNodes: 'myProject/getActivatePipelineNodes',
      activatePipelineNodeId: 'myProject/getActivatePipelineNodeId'
    }),
    filterNodeParamProperties () {
      const activateNode = this.getActivatePipelineNodes[this.activatePipelineNodeId]
      if (activateNode && activateNode.properties) {
        return activateNode.properties.map((item, idx) => {
          return {
            id: item.id || idx,
            ui_type: item.ui_type,
            parameter_key: item.parameter_key,
            value: item.value
          }
        })
      }
      return null
    },
    filterNodeBasicProperties () {
      const activateNode = this.getActivatePipelineNodes[this.activatePipelineNodeId]
      if (activateNode) {
        return objectTransformKeyValueArray(activateNode)
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
    },
    wrapperPropEvent (propertiesIndex, key, value) {
      const activateNode = this.getActivatePipelineNodes[this.activatePipelineNodeId]
      if (!this.readOnly && this.isPipelineUnLock) {
        const newProps = _cloneDeep(activateNode.properties)
        newProps[propertiesIndex].value = value
        this.updateActivatePipelineNode({
          updateType: 'update',
          updatedProp: 'properties',
          updatedValue: newProps
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
  background-color: rgb(248, 248, 248);
  position: relative;
  width: 100%;
  height: 100%;
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
