<template>
  <transition>
    <div class="div--Working__page">
      <div class="div--Button">
        <!-- <span @click="resetted"> reset </span> -->
        <span @click="openLeftPanel"> left </span>
        <span @click="openRightPanel"> right </span>
      </div>
      <svg id="svg_map">
      </svg>
    </div>
  </transition>
</template>

<script>
import { eventsBus, events } from '@/events'

import * as d3Selection from 'd3-selection'
// import * as d3Zoom from 'd3-zoom'
import * as d3Drag from 'd3-drag'
import * as d3Array from 'd3-array'

// https://bl.ocks.org/mbostock/1557377
export default {
  name: 'Working',
  data () {
    return {
      svgContainer: null,
      mapContainer: null,
      zoom: null,
      width: 600,
      height: 600,
      radius: 20,
      innerWidth: 240,
      innerHeight: 125,
      x: null,
      y: null,
      xAxis: null,
      yAxis: null,
      view: null,
      gX: null,
      gY: null,
      maxZoomIn: 2.0,
      maxZoomOut: 0.2,
      zoomStep: 0.2,
      actualZoomLevel: 1.0,
      moveStep: 100
    }
  },
  methods: {
    openLeftPanel () {
      eventsBus.$emit(events.LEFT_PANEL, {
        open: true
      })
    },
    openRightPanel () {
      eventsBus.$emit(events.RIGHT_PANEL, {
        open: true
      })
    },
    roundFloat (value) {
      return value.toFixed(2)
    },
    // Called when drag event starts. It stop the propagation of the click event
    dragstarted (d) {
      d3Selection.event.sourceEvent.stopPropagation()
    },
    // drag (node, test) {
    //   console.log('---drag')
    //   d3Drag.drag()
    //     .on('start', this.dragstarted)
    //     .on('drag', this.dragged)
    // },
    // Called when the drag event occurs (object should be moved)
    // dragmove (d) {
    //   console.log('------dragemove--')
    //   console.log(d)
    //   d3Selection.select(d)
    //     .attr('cx', d.x = Math.max(this.radius, Math.min(this.innerWidth - this.radius, d3Selection.event.x)))
    //     .attr('cy', d.y = Math.max(this.radius, Math.min(this.innerHeight - this.radius, d3Selection.event.y)))
    // },
    subject (d) {
      return d == null ? {x: d3Selection.event.x, y: d3Selection.event.y} : d
    }
  },
  mounted () {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    const margin = { top: 10, right: 10, bottom: 10, left: 10 }
    this.width = windowWidth - margin.left - margin.right
    this.height = windowHeight - margin.top - margin.bottom

    this.svgContainer = d3Selection.select('#svg_map')
      .attr('width', this.width)
      .attr('height', this.height)

    this.mapContainer = this.svgContainer.append('g')

    const radius = this.radius
    const width = this.innerWidth
    const height = this.innerHeight
    function dragmove (d) {
      d3Selection.select(this)
        .attr('cx', d.x = Math.max(radius, Math.min(width - radius, d3Selection.event.x)))
        .attr('cy', d.y = Math.max(radius, Math.min(height - radius, d3Selection.event.y)))
    }

    var drag = d3Drag.drag()
      .subject(this.subject)
      .on('drag', dragmove)

    this.testContainer = this.mapContainer.data(d3Array.range(16).map(() => { return {x: this.innerWidth / 2, y: this.innerHeight / 2} }))
      .enter().append('svg')
      .attr('width', this.innerWidth)
      .attr('height', this.innerHeight)

    this.testContainer.append('circle')
      .attr('r', this.radius)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .call(drag)
  }
}
</script>

<style lang="scss" scoped>
.div--Working__page {
  display: block;
}

.div--Working__page .div--Button {
  display: flex;
  flex-direction: row;
  width: 200px;
  height: 30px;

  span {
    width: 50px;
  }
}
</style>
