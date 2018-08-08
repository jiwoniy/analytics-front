<template>
  <transition>
    <div
      :id="`svgContainer${uCompId}`"
      class="palete"
      v-resize:debounce.250="onResize"
    >
      <img
        class="lock"
        v-if="!readMode && isPipelineEditable"
        src="@/assets/img/lock-open-solid.svg" />
      <img class="lock"
        v-if="!readMode && !isPipelineEditable"
        src="@/assets/img/lock-solid.svg" />
      <svg class="svg-graph">
        <def-svg></def-svg>
      </svg>
      <div class="palete-footer">
        <p v-if="lastSavedTime"> {{ `${$t('Last Update Time')} : ${lastSavedTime}` }}  </p>
      </div>
    </div>
  </transition>
</template>

<script>
import uuidv4 from 'uuid/v4'
import { mapGetters, mapActions } from 'vuex'
import * as d3Selection from 'd3-selection'
import resize from 'vue-resize-directive'
import _isEmpty from 'lodash.isempty'
import _cloneDeep from 'lodash.clonedeep'

import DefSvg from '@/components/common/DefSvg'
import eventController from '@/utils/EventController'
import GraphCreator from '@/utils/graph/graph-creator'
import compose from '@/utils/compose'

// TODO Make read, read/write mode
export default {
  name: 'Svg-palete',
  components: {
    DefSvg
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
      svgGraph: null,
      svgContainer: null,
      svgContainerGroup: null
    }
  },
  props: {
    readMode: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    ...mapGetters({
      isPipelineEditable: 'myProject/isPipelineEditable',
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
      setPipelineEditable: 'myProject/setPipelineEditable',
      savePipeline: 'myProject/savePipeline',
      setActivatePipelineNodeId: 'myProject/setActivatePipelineNodeId'
    }),
    onResize (elem) {
      if (this.svgContainer) {
        this.svgContainer
          .attr('width', elem.offsetWidth)
          .attr('height', elem.offsetHeight)
      }

      if (this.svgGraph) {
        this.svgGraph.setZoomInit()
        this.svgGraph.setWidth(elem.offsetWidth)
        this.svgGraph.setHeight(elem.offsetHeight)
      }
    },
    getTypeNode (id) {
      return this.metaNodes[id]
    },
    setGraph (svgContainer, options) {
      const callback = {
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
      this.svgGraph = new GraphCreator(svgContainer, this.uCompId, {
        options: {
          ...options,
          saveFile: _isEmpty(this.activatePipeline) ? null : _cloneDeep(this.activatePipeline),
          connectValidation: composeValidate
        },
        callback })

      this.svgGraph.setZoomInit()
    },
    refreshGraph ({ updateObject, updateType }) {
      // updateObject = pipeline or node
      // updateType = init or update or delete
      // TODO make it clear when refresh..
      if (this.svgGraph) {
        this.svgGraph.redraw({
          pipeline: _cloneDeep(this.activatePipeline),
          updateObject,
          updateType
        })
      }
    },
    saveGraph () {
      if (this.svgGraph) {
        const saveFile = this.svgGraph.save()
        if (saveFile) {
          this.savePipeline({ pipeline: _cloneDeep(saveFile) })
        }
      }
    },
    removeSvgGraph () {
      if (this.svgGraph) {
        this.svgContainerGroup.remove()
      }
    },
    setSvgContainer () {
      // const margin = { top: 10, right: 10, bottom: 10, left: 10 }
      this.width = this.$el.offsetWidth
      this.height = this.$el.offsetHeight

      this.svgContainer = d3Selection.select(`#svgContainer${this.uCompId}`).select('svg')
        .attr('width', this.width)
        .attr('height', this.height)
      this.svgContainerGroup = this.svgContainer
        .append('g')
        .attr('id', 'graphG')
        .classed('graph', true)

      this.setGraph(this.svgContainer, {
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
      if (this.uCompId === uCompId && isGraphUpdate && !this.readMode) {
        this.saveGraph()
      }
    },
    initEventListner () {
      eventController.addListner('SEND_DATA_TRANSFER', (payload) => {
        const { data } = payload
        // TODO Node Type Check!!
        const sendData = Object.assign({}, data, this.getTypeNode(data.node_type_id))
        this.svgGraph.addNode({
          ...sendData,
          id: uuidv4()
        })
      })

      eventController.addListner('SAVE', () => {
        this.saveGraph()
      })

      eventController.addListner('REFRESH', () => {
        this.svgGraph.setZoomInit()
      })

      eventController.addListner('LOAD', () => {
        this.init()
      })

      eventController.addListner('EDIT', () => {
        this.setPipelineEditable(!this.isPipelineEditable)
      })
    },
    init () {
      this.removeSvgGraph()
      this.setSvgContainer()
    }
  },
  beforeMount () {
    this.uCompId = this._uid
  },
  beforeDestroy () {
    if (!this.readMode) {
      eventController.removeListner('SEND_DATA_TRANSFER')
      eventController.removeListner('SAVE')
      eventController.removeListner('REFRESH')
      eventController.removeListner('LOAD')
      eventController.removeListner('EDIT')
    }
  },
  mounted () {
    if (!this.readMode) {
      this.initEventListner()
    }

    this.$nextTick(() => {
      this.init()
    })

    // window.onresize = function(){thisGraph.updateWindow(svg);}
  },
  watch: {
    isPipelineEditable (newValue) {
      if (this.svgGraph && !this.readMode) {
        this.svgGraph.setEditable(newValue, this.uCompId)
      }
    },
    activateWorksheetId (newValue) {
      this.init()
    },
    activatePipelineUpdateStatus (newValue) {
      if (newValue && newValue.updateType === 'init') {
        this.refreshGraph({ updateObject: 'pipeline', updateType: 'init' })
      }
    },
    activatePipelineNodeUpdateStatus (newValue) {
      if (newValue && (newValue.updateType === 'delete' || newValue.updateType === 'update')) {
        this.refreshGraph({ updateObject: 'node', updateType: newValue.updateType })
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/utils/graph/graph-creator.scss';
</style>

<style lang="scss" scoped>
.palete {
  position: relative;
  width: 100%;
  height: 100%;
  display: block;
  background-color: rgb(248, 248, 248);

  .lock {
    position: absolute;
    left: 0px;
    top: var(--app-left-panel-folder-button);
    width: 50px;
    height: 50px;
    font-size: 18px;
  }

  .palete-footer {
    position: absolute;
    right: 0px;
    bottom: var(--app-foot-panel-height);
    p {
      margin: 0.4rem;
    }
  }
}
</style>
