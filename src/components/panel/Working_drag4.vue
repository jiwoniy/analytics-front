<template>
  <transition>
    <div class="div--Working__page">
      <div class="div--Button">
        <!-- <span @click="resetted"> reset </span> -->
        <span @click="openLeftPanel"> left </span>
        <span @click="openRightPanel"> right </span>
      </div>
      <svg id="svg_map">
        <defs>
          <g id="pointer" transform="scale(0.8)">
              <path d="M0-1c-14.5-25.6-14.5-25.7-14.5-33.8c0-8.1,6.5-14.6,14.5-14.6s14.5,6.6,14.5,14.6C14.5-26.7,14.5-26.6,0-1z"></path>
              <path d="M0-49c7.7,0,14,6.3,14,14.1c0,8,0,8.1-14,32.8c-14-24.7-14-24.9-14-32.8C-14-42.7-7.7-49,0-49 M0-50c-8.3,0-15,6.8-15,15.1 S-15-26.5,0,0c15-26.5,15-26.5,15-34.9S8.3-50,0-50L0-50z"></path>
          </g>
        </defs>
      </svg>
    </div>
  </transition>
</template>

<script>
import { eventsBus, events } from '@/events'

import * as d3Selection from 'd3-selection'
// import * as d3Zoom from 'd3-zoom'
import * as d3Drag from 'd3-drag'
import 'd3-transition'
// import * as d3Array from 'd3-array'

// https://octoperf.com/blog/2018/04/18/d3-js-drag-and-drop-tutorial/
export default {
  name: 'Working',
  data () {
    return {
      svgContainer: null,
      mapContainer: null,
      width: 600,
      height: 600
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

    const that = this
    this.svgContainer.on('click', function () {
      const mouse = d3Selection.mouse(this)

      const pointer = that.svgContainer
        .append('use')
        .datum({ x: mouse[0], y: mouse[1], selected: false })
        .attr('id', 'currentPointer')
        .attr('href', '#pointer')
        .attr('transform', `translate(${mouse[0]}, ${mouse[1]})scale(0)`)
        .attr('fill', '#039BE5')
        .attr('stroke', '#039BE5')
        .attr('stroke-width', '1px')

      pointer
        .transition()
        .duration(500)
        .attr('transform', `translate(${mouse[0]}, ${mouse[1]})scale(1)`)
        .attr('x', mouse[0])
        .attr('y', mouse[1])
        .attr('transform', 'scale(1)')

      pointer.on('click', function () {
        if (d3Selection.event.ctrlKey) {
          pointer.transition()
            .duration(500)
            .attr('transform', `translate(${pointer.attr('x')}, ${pointer.attr('y')}) scale(0)`)
            .remove()
        } else {
          const datum = pointer.datum()
          if (pointer.datum().selected) {
            datum.selected = false
            pointer
              .datum(datum)
              .transition()
              .duration(500)
              .attr('stroke', '#039BE5')
              .attr('stroke-width', '1px')
          } else {
            datum.selected = true
            pointer
              .datum(datum)
              .transition()
              .duration(500)
              .attr('stroke', '#455A64')
              .attr('stroke-width', '3px')
          }
        }
        d3Selection.event.stopPropagation()
      })

      const dragHandler = d3Drag.drag()
        .on('drag', function (d) {
          d3Selection.select(this)
            .attr('x', d.x = d3Selection.event.x)
            .attr('y', d.y = d3Selection.event.y)
        })
      dragHandler(pointer)
    })
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
