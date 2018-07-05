<template>
  <transition>
    <div class="palete">
      <svg id="svg_map" slot="svg-container">
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
import * as d3Selection from 'd3-selection'

import { eventsBus, events } from '@/events'
export default {
  name: 'Svg-palete',
  data () {
    return {
      svgArea: null,
      nodesType: {}
    }
  },
  mounted () {
    eventsBus.$on(events.SEND_DATA_TRANSFER, (payload) => {
      const { data } = payload
      this.nodesType = data
    })

    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    const margin = { top: 10, right: 10, bottom: 10, left: 10 }
    this.width = windowWidth - margin.left - margin.right
    this.height = windowHeight - margin.top - margin.bottom

    this.svgArea = d3Selection.select('#svg_map')
      .attr('width', this.width)
      .attr('height', this.height)
  }
  // watch: {
  //   nodesType (newValue) {
  //     console.log('--nodesType value')
  //     console.log(newValue)
  //   }
  // }
}
</script>

<style lang="scss" scoped>
.palete {
  display: block;
}
</style>
