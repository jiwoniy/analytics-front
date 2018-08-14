import * as d3Selection from 'd3-selection'
import * as d3Drag from 'd3-drag'

// node drag handler
function nodeDraghandler (context) {
  return d3Drag.drag()
    .subject(function (d) {
      return { x: d.position.x, y: d.position.y }
    })
    .on('start', function (d) {
      if (context.isUnLock()) {
        d.ui_status.moving = true
      }
    })
    .on('drag', function (d) {
      if (context.isUnLock()) {
        // if node selected, can't move
        if (!d.ui_status.selected) {
          d3Selection.select(this)
            .attr('transform', `translate(${d3Selection.event.x}, ${d3Selection.event.y})`)
          d.position.x = d3Selection.event.x
          d.position.y = d3Selection.event.y

          context.drawGraph({ needUpdate: true, node: true, link: true })
        }
      }
    })
    .on('end', function (d) {
      if (context.isUnLock()) {
        if (!d.ui_status.selected) {
          d.ui_status.moving = false
        }
      }
    })
}

export default nodeDraghandler
