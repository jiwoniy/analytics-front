<template>
  <transition>
    <div class="div--Working__page">
      <div class="div--Button">
        <span @click="resetted"> reset </span>
        <span @click="openLeftPanel"> left </span>
        <span @click="openRightPanel"> right </span>
      </div>
      <svg>
        <!-- <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop  offset="0.0%" stop-color="#2c7bb6"></stop>
            <stop  offset="12.5%" stop-color="#00a6ca"></stop>
            <stop  offset="25.0%" stop-color="#00ccbc"></stop>
            <stop  offset="37.5%" stop-color="#90eb9d"></stop>
            <stop  offset="50.0%" stop-color="#ffff8c"></stop>
            <stop  offset="62.5%" stop-color="#f9d057"></stop>
            <stop  offset="75.0%" stop-color="#f29e2e"></stop>
            <stop  offset="87.5%" stop-color="#e76818"></stop>
            <stop offset="100.0%" stop-color="#d7191c"></stop>
          </linearGradient>
        </defs> -->
      </svg>
    </div>
  </transition>
</template>

<script>
import { eventsBus, events } from '@/events'

import * as d3 from 'd3-selection'
import { zoom as d3zoom, zoomIdentity } from 'd3-zoom'
import { scaleLinear } from 'd3-scale'
import { axisBottom, axisRight } from 'd3-axis'

// https://bl.ocks.org/mbostock/db6b4335bf1662b413e7968910104f0f
export default {
  name: 'Working',
  data () {
    return {
      svgContainer: null,
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
    zoomed () {
      this.view.attr('transform', d3.event.transform)
      this.gX.call(this.xAxis.scale(d3.event.transform.rescaleX(this.x)))
      this.gY.call(this.yAxis.scale(d3.event.transform.rescaleY(this.y)))
    },
    resetted () {
      this.svgContainer.transition()
        .duration(750)
        .call(this.zoom.transform, zoomIdentity)
    },
    customAxis (g) {
      g.select('.domain').remove()
      g.selectAll('.tick text').remove()
      g.selectAll('.tick:not(:first-of-type) line')
        .attr('stroke', '#777')
        .attr('stroke-dasharray', '2,2')
    }
  },
  mounted () {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    const margin = { top: 10, right: 10, bottom: 10, left: 10 }
    this.width = windowWidth - margin.left - margin.right
    this.height = windowHeight - margin.top - margin.bottom

    this.svgContainer = d3.select('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')

    this.zoom = d3zoom()
      .scaleExtent([1, 40])
      // .translateExtent([[-100, -100], [this.width + 90, this.height + 100]])
      .on('zoom', this.zoomed)

    this.x = scaleLinear()
      .domain([-1, this.width + 1])
      .range([-1, this.width + 1])
      // .domain([0, this.width])
      // .range([0, this.width])

    this.y = scaleLinear()
      .domain([-1, this.height + 1])
      .range([-1, this.height + 1])
      // .domain([0, this.height])
      // .range([0, this.height])

    this.xAxis = axisBottom(this.x)
      .ticks((this.width + 2) / (this.height + 2) * 10)
      .tickSize(this.height)
      // .tickPadding(8 - this.height)
      .tickPadding(this.height)

    this.yAxis = axisRight(this.y)
      .ticks(10)
      .tickSize(this.width)
      // .tickPadding(8 - this.width)
      .tickPadding(this.width)

    this.view = this.svgContainer.append('rect')
      // .attr('class', 'view')
      .attr('x', 0.5)
      .attr('y', 0.5)
      .attr('fill', 'transparent')
      .attr('width', this.width)
      .attr('height', this.height)

    this.gX = this.svgContainer
      .append('g')
      .call(this.xAxis)
      .call(this.customAxis)

    this.gY = this.svgContainer
      .append('g')
      .call(this.yAxis)
      .call(this.customAxis)

    this.svgContainer.call(this.zoom)
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

.view {
  // fill: url(#gradient);
  fill: transparent;
  // stroke: #000
}

.axis path {
  display: none;
}

.axis line {
  stroke-opacity: 0.3;
  shape-rendering: crispEdges;
}

// button {
//   position: absolute;
//   top: 20px;
//   left: 20px;
// }
</style>
