<template>
  <defs>
    <g id="nodeShape_0_0">
      <rect width='200' height='50'/>
    </g>

    <g id="nodeShape_0_1">
      <rect width='200' height='50'/>
      <circle cx="100" cy="50" r="5"></circle>
    </g>

    <g id="nodeShape_0_2">
      <rect width='200' height='50'/>
      <circle cx="50" cy="50" r="5"></circle>
      <circle cx="150" cy="50" r="5"></circle>
    </g>

    <g id="nodeShape_1_0">
      <rect width='200' height='50'/>
      <circle cx="100" cy="00" r="5"></circle>
    </g>

    <g id="nodeShape_1_1">
      <rect width='200' height='50'/>
      <circle cx="100" cy="0" r="5"></circle>
      <circle cx="100" cy="50" r="5"></circle>
    </g>

    <g id="nodeShape_1_2">
      <rect width='200' height='50'/>
      <circle cx="100" cy="0" r="5"></circle>
      <circle cx="50" cy="50" r="5"></circle>
      <circle cx="150" cy="50" r="5"></circle>
    </g>

    <g id="nodeShape_2_0">
      <rect width='200' height='50'/>
      <circle cx="50" cy="0" r="5"></circle>
      <circle cx="150" cy="0" r="5"></circle>
    </g>

    <g id="nodeShape_2_1">
      <rect width='200' height='50'/>
      <circle cx="50" cy="0" r="5"></circle>
      <circle cx="150" cy="0" r="5"></circle>
      <circle cx="100" cy="50" r="5"></circle>
    </g>

    <g id="nodeShape_2_2">
      <rect width='200' height='50'/>
      <circle cx="50" cy="0" r="5"></circle>
      <circle cx="150" cy="0" r="5"></circle>
      <circle cx="50" cy="50" r="5"></circle>
      <circle cx="150" cy="50" r="5"></circle>
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
export default {
  name: 'Define-Node-Shape'
}
