<template>
  <transition>
    <div id="svgContainer" class="palete">
      <img class="lock" v-if="editable" src="@/assets/img/lock-open-solid.svg" />
      <img class="lock" v-if="!editable" src="@/assets/img/lock-solid.svg" />
      <svg>
        <def-svg></def-svg>
      </svg>
    </div>
  </transition>
</template>

<script>
import uuidv4 from 'uuid/v4'
import { mapGetters, mapActions } from 'vuex'
import * as d3Selection from 'd3-selection'

import DefSvg from '@/components/common/DefSvg'
import eventController from '@/utils/EventController'
import GraphCreator from '@/utils/graph/graph-creator'
import compose from '@/utils/compose'

export default {
  name: 'Svg-palete',
  components: {
    DefSvg
  },
  data () {
    return {
      leftPanel: null,
      svgContainer: null,
      svgContainerGroup: null,
      svgGraph: null,
      editable: false,
      leftPanelWidth: null,
      rightPanelWidth: null
    }
  },
  props: {
    openRightPanel: {
      type: Function,
      default: () => {}
    },
    isOpenLeftPanel: {
      type: Boolean,
      default: () => true
    }
  },
  computed: {
    ...mapGetters({
      pipeline: 'pipeline/getPipeline'
    })
  },
  methods: {
    ...mapActions({
      savePipeline: 'pipeline/savePipeline'
    }),
    svgContainerResize () {
      d3Selection.select('#svgContainer').select('svg')
        .attr('width', this.isOpenLeftPanel ? this.width : this.width + this.leftPanelWidth)
        .attr('height', this.height)
    },
    setGraph (svgContainer, options) {
      const callback = {
        node_select: this.nodeSelect
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
      this.svgGraph = new GraphCreator(svgContainer, {
        options: {
          ...options,
          saveFile: this.pipeline,
          connectValidation: composeValidate
        },
        callback })
    },
    removeSvgGraph () {
      if (this.svgGraph) {
        this.svgContainerGroup.remove()
      }
    },
    // TODO resizable
    setSvgContainer () {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      // TODO make constant
      // const leftPanelWidth = 250
      const topPanelHeight = 50

      const margin = { top: 10, right: 10, bottom: 10, left: 10 }
      this.width = windowWidth - this.leftPanelWidth - this.rightPanelWidth
      console.log(this.leftPanelWidth)
      this.height = windowHeight - topPanelHeight - margin.top - margin.bottom

      this.svgContainer = d3Selection.select('#svgContainer').select('svg')
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
      if (nodeItem && nodeItem.status.selected) {
        this.openRightPanel({
          open: true,
          item: nodeItem
        })
      } else if (nodeItem && !nodeItem.status.selected) {
        this.openRightPanel({
          open: false
        })
      } else {
        this.openRightPanel({
          open: false
        })
      }
    },
    init () {
      this.setSvgContainer()
    }
  },
  mounted () {
    eventController.addListner('SEND_DATA_TRANSFER', (payload) => {
      const { data } = payload
      this.svgGraph.addNode({
        ...data,
        id: uuidv4(),
        type: data.node_type,
        position: {
          x: data.position.x * 0.3,
          y: data.position.y * 0.7
        }
      })
    })

    eventController.addListner('SAVE', () => {
      const saveFile = this.svgGraph.save()
      this.savePipeline(saveFile)
    })

    eventController.addListner('EDIT', () => {
      this.editable = !this.editable
      this.svgGraph.setEditable(this.editable)
    })

    eventController.addListner('REFRESH', () => {
      this.removeSvgGraph()
    })

    eventController.addListner('LOAD', () => {
      this.setSvgContainer()
    })

    this.$nextTick(() => {
      this.init()
      this.leftPanelWidth = document.getElementById('leftPanel').clientWidth
      this.rightPanelWidth = document.getElementById('rightPanel').clientWidth
    })
  },
  watch: {
    isOpenLeftPanel (newVal) {
      this.svgContainerResize()
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
}
</style>
