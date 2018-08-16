<template>
  <section
    class="Palete__section"
    :id="`svgElem${uCompId}`"
    v-resize:debounce.250="onResize"
  >

    <toggle-button
      v-if="!readOnly"
      :toggle="isPipelineUnLock"
      :custom-style="{
        'top': '30px'
      }"
      :a-src="'/static/img/lock-open-solid.svg'"
      :b-src="'/static/img/lock-solid.svg'"
    >
    </toggle-button>

    <svg>
      <def-svg></def-svg>
    </svg>

    <div
      v-if="!readOnly"
      class="footer"
    >
      <p v-if="lastSavedTime"> {{ `${$t('Last Update Time')} : ${lastSavedTime}` }}  </p>
    </div>

  </section>
</template>

<script>
import uuidv4 from 'uuid/v4'
import resize from 'vue-resize-directive'
import _isEmpty from 'lodash.isempty'
import _cloneDeep from 'lodash.clonedeep'
import { mapGetters, mapActions } from 'vuex'
import * as d3Selection from 'd3-selection'

import compose from '@/utils/compose'
import eventController from '@/utils/EventController'
import DefSvg from '@/components/common/DefSvg'
import GraphCreator from '@/components/graph/graph-creator'
import ToggleButton from '@/components/ui/ToggleButton'

// TODO Make read, read/write mode
export default {
  name: 'Palete-Section',
  components: {
    DefSvg,
    ToggleButton
  },
  directives: {
    resize
  },
  i18n: {
    messages: {
      'en': {
        'Last Update Time': 'Last Update Time'
      },
      'ko': {
        'Last Update Time': '최종 수정시간'
      }
    }
  },
  data () {
    return {
      uCompId: null,
      svgElem: null, // svg element
      graphGroup: null, // g element
      graphInstance: null // instance
    }
  },
  props: {
    readOnly: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    ...mapGetters({
      isPipelineUnLock: 'myProject/isPipelineUnLock',
      activateWorksheetId: 'myProject/getActivateWorksheetId',
      activatePipeline: 'myProject/getActivatePipeline',
      activatePipelineSyncTime: 'myProject/getActivatePipelineSyncTime',
      activatePipelineUpdateStatus: 'myProject/getPipelineUpdateStatus',
      activatePipelineNodeUpdateStatus: 'myProject/getActivatePipelineNodeUpdateStatus',
      metaNodes: 'metaNode/getMetaNodes'
    }),
    lastSavedTime () {
      return this.activatePipelineSyncTime
    }
  },
  methods: {
    ...mapActions({
      setPipelineUnLock: 'myProject/setPipelineUnLock',
      savePipeline: 'myProject/savePipeline',
      setActivatePipelineNodeId: 'myProject/setActivatePipelineNodeId'
    }),
    onResize (elem) {
      if (this.svgElem) {
        this.svgElem
          .attr('width', elem.offsetWidth)
          .attr('height', elem.offsetHeight)
      }

      if (this.graphInstance) {
        this.graphInstance.setZoomInit()
        this.graphInstance.setWidth(elem.offsetWidth)
        this.graphInstance.setHeight(elem.offsetHeight)
      }
    },
    updateLock (lock) {
      this.setPipelineUnLock(lock)
    },
    getTypeNode (id) {
      return this.metaNodes[id]
    },
    setGraph (svgElem, options) {
      const externalCallback = {
        node_select: this.nodeSelect,
        watch_update: this.watchGraphUpdate
      }

      // TODO method chaning
      function validate (isFirst) {
        return function (args) {
          if (isFirst) {
            // 비교로직
            return [true, ...args]
          } else {
            // 비교로직
            if (!args[0]) {
              return false
            } else {
              // 비교로직
              return [true, ...args]
            }
          }
        }
      }
      const composeValidate = compose([
        validate(true),
        validate()
      ], true)

      this.graphInstance = new GraphCreator(svgElem, this.uCompId, {
        options: {
          ...options,
          saveFile: _isEmpty(this.activatePipeline) ? null : _cloneDeep(this.activatePipeline),
          connectValidation: composeValidate
        },
        externalCallback })

      this.graphInstance.setZoomInit()
    },
    refreshGraph ({ updateObject, updateType }) {
      // updateObject = pipeline or node
      // updateType = init or update or delete
      // TODO make it clear when refresh..
      if (this.graphInstance) {
        this.graphInstance.redraw({
          pipeline: _cloneDeep(this.activatePipeline),
          updateObject,
          updateType
        })
      }
    },
    saveGraph () {
      if (this.graphInstance) {
        const saveFile = this.graphInstance.save()
        if (saveFile) {
          this.savePipeline({ pipeline: _cloneDeep(saveFile) })
        }
      }
    },
    removeGraph () {
      if (this.graphInstance && this.graphGroup) {
        this.graphGroup.remove()
      }
    },
    setSvgElem () {
      this.width = this.$el.offsetWidth
      this.height = this.$el.offsetHeight

      this.svgElem = d3Selection.select(`#svgElem${this.uCompId}`).select('svg')
        .attr('width', this.width)
        .attr('height', this.height)
        .attr('id', 'svgElem')
      this.graphGroup = this.svgElem
        .append('g')
        .attr('id', 'graphGroup')
        .classed('graph', true)

      this.setGraph(this.svgElem, {
        width: this.width,
        height: this.height
      })
    },
    nodeSelect (nodeItem) {
      if (nodeItem && nodeItem.ui_status.selected) {
        eventController.RIGHT_PANEL({
          item: _cloneDeep(nodeItem),
          type: 'pipeline-node'
        })
        this.setActivatePipelineNodeId(nodeItem.id)
      } else {
        eventController.RIGHT_PANEL()
        this.setActivatePipelineNodeId(null)
      }
    },
    watchGraphUpdate (isGraphUpdate, uCompId) {
      if (this.uCompId === uCompId && isGraphUpdate && !this.readOnly) {
        this.saveGraph()
      }
    },
    initEventListner () {
      eventController.addListner('SEND_DATA_TRANSFER', (payload) => {
        const { data } = payload
        const sendData = Object.assign({}, data, this.getTypeNode(data.node_type_id))
        this.graphInstance.addNode({
          ...sendData,
          id: uuidv4()
        })
      })

      eventController.addListner('SAVE', () => {
        this.saveGraph()
      })

      eventController.addListner('REFRESH', () => {
        this.graphInstance.setZoomInit()
      })

      eventController.addListner('LOAD', () => {
        this.init()
      })

      eventController.addListner('EDIT', () => {
        this.updateLock(true)
      })
    },
    init () {
      this.removeGraph()
      this.setSvgElem()
    }
  },
  beforeMount () {
    this.uCompId = this._uid
  },
  beforeDestroy () {
    if (!this.readOnly) {
      eventController.removeListner('SEND_DATA_TRANSFER')
      eventController.removeListner('SAVE')
      eventController.removeListner('REFRESH')
      eventController.removeListner('LOAD')
      eventController.removeListner('EDIT')
    }
  },
  mounted () {
    if (!this.readOnly) {
      this.initEventListner()
    }

    this.$nextTick(() => {
      this.init()
    })
  },
  watch: {
    isPipelineUnLock (newValue) {
      if (this.graphInstance && !this.readOnly) {
        this.graphInstance.setUnlock(newValue, this.uCompId)
      }
    },
    activateWorksheetId (newValue) {
      this.init()
    },
    activatePipelineUpdateStatus (newValue) {
      // 현재는 init 밖에 없음
      if (newValue && newValue.updateType === 'init') {
        this.refreshGraph({ updateObject: 'pipeline', updateType: 'init' })
      }
    },
    activatePipelineNodeUpdateStatus (newValue) {
      // 현재는 update 밖에 없음
      if (newValue && (newValue.updateType === 'update')) {
        this.refreshGraph({ updateObject: 'node', updateType: newValue.updateType })
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/components/graph/graph-creator.scss';
@import '@/components/graph/context-menu.scss';
</style>

<style lang="scss" scoped>
.Palete__section {
  position: relative;
  width: 100%;
  height: 100%;
  display: block;
  background-color: rgb(248, 248, 248);
}

.Palete__section .footer {
  position: absolute;
  right: 0px;
  bottom: var(--app-foot-panel-height);
  p {
    margin: 0.4rem;
  }
}
</style>
