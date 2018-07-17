<template>
  <transition>
    <div id="svgContainer" class="palete">
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

export default {
  name: 'Svg-palete',
  components: {
    DefSvg
  },
  data () {
    return {
      svgContainer: null,
      svgContainerG: null,
      svgGraph: null,
      leftPanelWidth: null
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
      this.svgGraph = new GraphCreator(svgContainer, {
        ...options,
        nodeSelectCallback: this.nodeSelect,
        saveFile: this.pipeline
      })
    },
    removeSvgGraph () {
      if (this.svgGraph) {
        this.svgContainerG.remove()
      }
    },
    setSvgContainer () {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      // TODO make constant
      const leftPanelWidth = 250
      const topPanelHeight = 50

      const margin = { top: 10, right: 10, bottom: 10, left: 10 }
      this.width = windowWidth - leftPanelWidth - margin.left - margin.right
      this.height = windowHeight - topPanelHeight - margin.top - margin.bottom

      this.svgContainer = d3Selection.select('#svgContainer').select('svg')
        .attr('width', this.width)
        .attr('height', this.height)
      this.svgContainerG = this.svgContainer
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
        type: data.id,
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
      this.svgGraph.setEditable(true)
    })

    eventController.addListner('REFRESH', () => {
      this.removeSvgGraph()
    })

    eventController.addListner('LOAD', () => {
      this.setSvgContainer()
    })

    this.init()

    this.$nextTick(() => {
      this.leftPanelWidth = document.getElementById('leftPanel').offsetWidth
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
@import '../../utils/graph/graph-creator.scss';
</style>
<style lang="scss" scoped>
.palete {
  width: 100%;
  height: 100%;
  display: block;
  background-color: rgb(248, 248, 248)
}
</style>
