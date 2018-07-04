<template>
  <transition>
    <div class="div--Working__page">
      <div class="div--Button">
        <!-- <span @click="resetted"> reset </span> -->
        <span @click="openLeftPanel"> left </span>
        <span @click="openRightPanel"> right </span>
      </div>
      <svg id="svg_map"></svg>
    </div>
  </transition>
</template>

<script>
import { eventsBus, events } from '@/events'

import * as d3Selection from 'd3-selection'
import * as d3Zoom from 'd3-zoom'
import * as d3Drag from 'd3-drag'
import * as d3Array from 'd3-array'

// https://bl.ocks.org/mbostock/3127661b6f13f9316be745e77fdfb084
export default {
  name: 'Working',
  data () {
    return {
      svgContainer: null,
      gContainer: null,
      zoom: null,
      width: 600,
      height: 600,
      x: null,
      y: null,
      xAxis: null,
      yAxis: null,
      view: null,
      gX: null,
      gY: null
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
    phyllotaxis (radius) {
      const theta = Math.PI * (3 - Math.sqrt(5))
      return (i) => {
        const r = radius * Math.sqrt(i)
        const a = theta * i
        return {
          x: this.width / 2 + r * Math.cos(a),
          y: this.height / 2 + r * Math.sin(a)
        }
      }
    },
    dragged (d) {
      d3Selection.select(this).attr('cx', d.x = d3Selection.event.x).attr('cy', d.y = d3Selection.event.y)
    },
    zoomed () {
      this.gContainer.attr('transform', d3Selection.event.transform)
    }
  },
  mounted () {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    const margin = { top: 10, right: 10, bottom: 10, left: 10 }
    this.width = windowWidth - margin.left - margin.right
    this.height = windowHeight - margin.top - margin.bottom

    this.svgContainer = d3Selection.select('svg_map')
      .attr('width', this.width)
      .attr('height', this.height)

    const points = d3Array.range(2000).map(this.phyllotaxis(10))

    this.gContainer = this.svgContainer.append('g')

    this.gContainer.selectAll('circle')
      .data(points)
      .enter().append('circle')
      .attr('cx', (d) => { return d.x })
      .attr('cy', (d) => { return d.y })
      .attr('r', 2.5)
      .call(d3Drag.drag())
      .on('drag', this.dragged)

    this.svgContainer.call(d3Zoom.zoom()
      .scaleExtent([1 / 2, 8])
      .on('zoom', this.zoomed))
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
