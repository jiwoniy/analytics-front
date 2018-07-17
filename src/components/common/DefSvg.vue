<template>
  <defs>
    <marker
      id="marker-arrow"
      viewBox="0 -5 10 10"
      refX="10"
      markerWidth="6"
      markerHeight="6"
      orient="auto"
      stroke-width="10"
      stroke="#333"
    >
      <path d="M0,-5L10,0L0,5" />
    </marker>

    <marker
      id="marker-fail"
      viewBox="0 0 10 10"
      refX="5"
      refY="5"
      markerWidth="6"
      markerHeight="6"
      stroke="red"
      stroke-width="10"
      fill="none"
      orient="auto"
    >
      <path d = "M 0 0 L 10 10 M 0 10 L 10 0"/>
    </marker>

  </defs>
</template>

<script>
export default {
  name: 'Define-Svg'
}
</script>
