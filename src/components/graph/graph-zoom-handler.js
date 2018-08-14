import * as d3Selection from 'd3-selection'
import * as d3Zoom from 'd3-zoom'

// zoom handler
function zoomHandler (context) {
  return d3Zoom.zoom()
    .on('zoom', function () {
      context.graphGroup.attr('transform', d3Selection.event.transform)
    })
    .on('start', function () {
      context.svgElem.style('cursor', 'move')
      context.state.justScaleTransGraph = true
    })
    .on('end', function () {
      if (context.state.justScaleTransGraph) {
        context.state.currentZoomTransform = d3Selection.event.transform
        context.state.justScaleTransGraph = false
      }
      context.svgElem.style('cursor', 'auto')
    })
}

export default zoomHandler
