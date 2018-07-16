<template>
  <defs>
    <g id="nodeShape_0_0" class="def-node">
      <rect width='200' height='50'/>
    </g>

    <g id="nodeShape_0_1" class="def-node">
      <rect width='200' height='50'/>
      <circle cx="100" cy="50" r="10" class="data-output"></circle>
    </g>

    <g id="nodeShape_0_2" class="def-node">
      <rect width='200' height='50'/>
      <circle cx="50" cy="50" r="10" class="data-output"></circle>
      <circle cx="150" cy="50" r="10" class="data-output"></circle>
    </g>

    <g id="nodeShape_1_0" class="def-node">
      <rect width='200' height='50'/>
      <circle cx="100" cy="00" r="10" class="data-input"></circle>
    </g>

    <g id="nodeShape_1_1" class="def-node">
      <rect width='200' height='50'/>
      <circle cx="100" cy="0" r="10" class="data-input"></circle>
      <circle cx="100" cy="50" r="10" class="data-output"></circle>
    </g>

    <g id="nodeShape_1_2" class="def-node">
      <rect width='200' height='50'/>
      <circle cx="100" cy="0" r="10" class="data-input"></circle>
      <circle cx="50" cy="50" r="10" class="data-output"></circle>
      <circle cx="150" cy="50" r="10" class="data-output"></circle>
    </g>

    <g id="nodeShape_2_0" class="def-node">
      <rect width='200' height='50'/>
      <circle cx="50" cy="0" r="10" class="data-input"></circle>
      <circle cx="150" cy="0" r="10" class="data-input"></circle>
    </g>

    <g id="nodeShape_2_1" class="def-node">
      <rect width='200' height='50'/>
      <circle cx="50" cy="0" r="10" class="data-input"></circle>
      <circle cx="150" cy="0" r="10" class="data-input"></circle>
      <circle cx="100" cy="50" r="10" class="data-output"></circle>
    </g>

    <g id="nodeShape_2_2" class="def-node">
      <rect width='200' height='50'/>
      <circle cx="50" cy="0" r="10" class="data-input"></circle>
      <circle cx="150" cy="0" r="10" class="data-input"></circle>
      <circle cx="50" cy="50" r="10" class="data-output"></circle>
      <circle cx="150" cy="50" r="10" class="data-output"></circle>
    </g>

    <marker id="end-arrow" viewBox="0 -5 10 10" refX="32"
      markerWidth="3.5" markerHeight="3.5"
      orient="auto">
      <path d="M0,-5L10,0L0,5" />
    </marker>

    <marker id="mark-end-arrow" viewBox="0 -5 10 10" refX="7"
      markerWidth="3.5" markerHeight="3.5"
      orient="auto">
      <path d="M0,-5L10,0L0,5" />
    </marker>
  </defs>
</template>

<script>
// import * as d3Selection from 'd3-selection'

export default {
  name: 'Define-Node-Shape'
  // mounted () {
  //   d3Selection.selectAll('.def-node circle')
  //     .on('mouseover', function () {
  //       d3Selection.select(this).classed('active', true)
  //     })

  //   d3Selection.selectAll('.active')
  //     .on('mouseout', function () {
  //       console.log('--mouseout-')
  //       d3Selection.select(this).classed('active', false)
  //     })
  // }
}

</script>

<style>
.def-node {
  cursor: pointer;
  fill: #ffffff;
  stroke: #676a6c;
  stroke-width: 1.5;
}

.def-node .data-input {
  stroke: blue;
  stroke-width: 2;
}
/* .def-node .data-input.active {
  fill: blue;
} */

.def-node .data-output {
  stroke: red;
  stroke-width: 2;
}

/* .def-node .data-output.active {
  fill: red; */
/* } */
</style>
