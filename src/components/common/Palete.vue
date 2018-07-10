<template>
  <transition>
    <div id="svgContainer" class="palete">
    </div>
  </transition>
</template>

<script>
import * as d3Selection from 'd3-selection'

import { eventsBus, events } from '@/events'
import GraphCreator from '@/utils/graph/graph-creator'

export default {
  name: 'Svg-palete',
  data () {
    return {
      svgContainer: null,
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
  methods: {
    svgContainerResize () {
      d3Selection.select('#svgContainer').select('svg')
        .attr('width', this.isOpenLeftPanel ? this.width : this.width + this.leftPanelWidth)
        .attr('height', this.height)
    },
    setGraph (svgContainer, options) {
      this.svgGraph = new GraphCreator(svgContainer, {
        ...options,
        nodeSelectCallback: this.nodeSelect
      })
      this.svgGraph.setIdCt(2)
      this.svgGraph.updateGraph()
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

      this.svgContainer = d3Selection.select('#svgContainer').append('svg')
        .attr('width', this.width)
        .attr('height', this.height)

      this.setGraph(this.svgContainer, {
        width: this.width,
        height: this.height
      })
    },
    nodeSelect (nodeItem) {
      if (nodeItem.status.selected) {
        this.openRightPanel({
          open: true,
          item: nodeItem
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
    eventsBus.$on(events.SEND_DATA_TRANSFER, (payload) => {
      const { data } = payload
      this.svgGraph.addNode(data)
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
@import '../../styles/graph-creator.scss';
</style>

<style lang="scss" scoped>
.palete {
  width: 100%;
  height: 100%;
  display: block;
  background-color: rgb(248, 248, 248)
}
</style>
