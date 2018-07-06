<template>
  <transition>
    <div id="svgContainer" class="palete">
      <!-- <svg id="svg_map" slot="svg-container">
      </svg> -->
    </div>
  </transition>
</template>

<script>
import * as d3Selection from 'd3-selection'

import { eventsBus, events } from '@/events'
import GraphCreator from '@/utils/graph-creator'

export default {
  name: 'Svg-palete',
  data () {
    return {
      svgContainer: null,
      svgGraph: null
    }
  },
  methods: {
    setGraph () {
      const nodes = []
      const edges = []
      this.svgGraph = new GraphCreator(this.svgContainer, nodes, edges)
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
      this.setGraph(this.svgContainer)
    },
    init () {
      this.setSvgContainer()
    }
  },
  mounted () {
    eventsBus.$on(events.SEND_DATA_TRANSFER, (payload) => {
      const { data } = payload
      this.svgGraph.addNode(data)
      // this.nodes = Object.assign([], [ ...this.nodes, data ])
    })

    this.init()
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
