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
import * as d3Zoom from 'd3-zoom'
import * as d3Drag from 'd3-drag'

// http://bl.ocks.org/cartoda/de0664ca59ff7277a12c
export default {
  name: 'Working',
  data () {
    return {
      svgContainer: null,
      mapContainer: null,
      zoom: null,
      width: 600,
      height: 600,
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
    zoomIn () {
      // Calculate and set the new zoom level
      this.actualZoomLevel = this.roundFloat(parseFloat(this.actualZoomLevel) + parseFloat(this.zoomStep))
      this.zoom.scale(this.actualZoomLevel)
      // Get the actual position of the container
      const xPosition = d3Selection.event.transform(this.mapContainer.attr('transform')).translate[0]
      const yPosition = d3Selection.event.transform(this.mapContainer.attr('transform')).translate[1]

      // Esecute the transformation setting the actual position and the new zoom level
      this.mapContainer.attr('transform', `translate(${xPosition}, ${yPosition})scale(${this.zoom.scale()})`)
    },
    zoomed () {
      // Function called on the zoom event. It translate the draw on the zoommed point and scale with a certain factor
      // this.mapContainer.attr('transform', `translate(${d3Selection.event.transform.translate})scale(${d3Selection.event.scale})`)
      this.mapContainer.attr('transform', d3Selection.event.transform)
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
    dragged (d, index, datas) {
      d.x = d3Selection.event.x
      d.y = d3Selection.event.y

      // Translate the object on the actual moved point
      // this.mapContainer.attr('transform', `translate(${d.x}, ${d.y})`)
      d3Selection.select(this).attr({
        transform: `translate(${d.x}, ${d.y})`
      })
    },
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
    this.mapContainer.append('image')
      .attr('xlink:href', 'http://wafi.iit.cnr.it/webvis/tmp/tiger.svg')
      .attr('width', 600)
      .attr('height', 600)

    this.mapContainer.append('circle')
      .attr('id', 'circle1')
      .attr('cx', 50)
      .attr('cy', 50)
      .attr('r', 50)
      .style('fill', '#ff0')
      .classed('draggable', true)

    this.mapContainer.append('circle')
      .attr('id', 'circle2')
      .attr('cx', 50)
      .attr('cy', 50)
      .attr('r', 50)
      .style('fill', '#ae2')
      .classed('draggable', true)

    this.mapContainer.append('rect')
      .attr('id', 'rect')
      .attr('x', 50)
      .attr('y', 50)
      .attr('width', 100)
      .attr('height', 50)
      .attr('stroke', '#C1272D')
      .attr('stroke-width', 5)
      .style('fill', '#F7931E')
      .classed('draggable', true)

    // Create the zoom behavior to set for the draw
    this.zoom = d3Zoom.zoom().scaleExtent([this.maxZoomOut, this.maxZoomIn]).on('zoom', this.zoomed)

    // Set the zoom behavior on the container variable (the draw),
    // disable mousedown event for the zoom and set the function to call on the double click event
    this.mapContainer.call(this.zoom).on('mousedown.zoom', null).on('dblclick.zoom', this.zoomIn)

    const nodesDatas = [
      {
        x: 0,
        y: 0
      }, {
        x: 0,
        y: 0
      }, {
        x: 0,
        y: 0
      }
    ]

    function dragged (d, a, b) {
      d.x = d3Selection.event.x
      d.y = d3Selection.event.y
      // Translate the object on the actual moved point
      d3Selection.select(this.id).attr('transform', `translate(${d3Selection.event.x}, ${d3Selection.event.y})`)
    }

    // Set the drag behavior on the objects having the "draggable" class and set their position on the viewport (by the "node_data" matrix)
    // Create the drag and drop behavior to set for the objects crated
    this.mapContainer.selectAll('.draggable')
      .call(d3Drag.drag().subject(this.subject)
        .on('start', this.dragstarted)
        .on('drag', dragged))
      .data(nodesDatas)
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
