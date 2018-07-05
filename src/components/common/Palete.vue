<template>
  <transition>
    <div class="palete">
      <svg id="svg_map" slot="svg-container">
      </svg>
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
      // svgContentsGroup: null,
      nodesType: []
    }
  },
  methods: {
    setSvgContainer () {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      // TODO make constant
      const leftPanelWidth = 250
      const topPanelHeight = 50

      const margin = { top: 10, right: 10, bottom: 10, left: 10 }
      this.width = windowWidth - leftPanelWidth - margin.left - margin.right
      this.height = windowHeight - topPanelHeight - margin.top - margin.bottom

      this.svgContainer = d3Selection.select('#svg_map')
        .attr('width', this.width)
        .attr('height', this.height)

      const nodes = []
      const edges = []

      const graph = new GraphCreator(this.svgContainer, nodes, edges)
      graph.setIdCt(2)
    },
    init () {
      this.setSvgContainer()
    }
    // updateNodes () {
    //   console.log('--updateNodes--')
    //   console.log(this.nodesType)
    // }
  },
  mounted () {
    eventsBus.$on(events.SEND_DATA_TRANSFER, (payload) => {
      const { data } = payload
      this.nodesType = Object.assign([], [ ...this.nodesType, data ])
    })

    this.init()
  }
  // updated () {
  //   console.log('--updated')
  // },
  // watch: {
  //   nodesType (newValue, old) {
  //     this.updateNodes()
  //     // console.log('--nodesType value')
  //   }
  // }
}
</script>

<style lang="scss" scoped>
.palete {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
