import * as d3Selection from 'd3-selection'
import * as d3Drag from 'd3-drag'

// Output drag handler
function circleOutputDraghandler ({ context, cx, cy }) {
  return d3Drag.drag()
    .subject(function (d) {
      return { x: d.x, y: d.y }
    })
    .on('drag', function (d) {
      context.dragLine.classed('hidden', false)
      context.state.connecting = true
      const x = d3Selection.event.x + cx
      const y = d3Selection.event.y + cy
      context.dragLine.attr('d',
        `M${d.x + cx},${d.y + cy}L${x},${y}`)
    })
    .on('end', function (d) {
      context.dragLine.classed('hidden', true)
      if (context.state.connecting) {
        if (context.state.capturedTarget) {
          const newEdge = {
            source: d,
            target: context.state.capturedTarget
          }
          context.edges.add(newEdge)
          context.drawLinks()
          context.state.capturedTarget = null
        }
        context.state.connecting = false
      }
    })
}

function getNodeShape (context, selection) {
  const bindingData = selection.datum()
  const { input, output } = bindingData

  selection.append('rect')
    .attr('width', 200)
    .attr('height', 50)

  const increaseInputValue = (Math.floor(200 / (input * 2))) * 2
  const startPositionInput = Math.floor(200 / (input * 2))
  for (let circleIn = 0; circleIn < input; circleIn += 1) {
    selection.append('circle')
      .classed('data-input', true)
      .attr('cx', startPositionInput + (increaseInputValue * circleIn))
      .attr('cy', 0)
      .attr('r', 10)
      .on('mouseover', function (d) {
        console.log('--input mouse over---')     
        if (context.state.connecting) {
          d3Selection.select(this).classed('hover', true)
          context.state.capturedTarget = d
        }
      })
      .on('mouseout', function (d) {
        context.state.capturedTarget = null
        d3Selection.select(this).classed('hover', false)
      })
  }

  const increaseOutputValue = (Math.floor(200 / (output * 2))) * 2
  const startPosition = Math.floor(200 / (output * 2))
  for (let circleOut = 0; circleOut < output; circleOut += 1) {
    selection.append('circle')
      .classed('data-output', true)
      .attr('cx', startPosition + (increaseOutputValue * circleOut))
      .attr('cy', 50)
      .attr('r', 10)
      .on('mouseover', function (d) {
        d3Selection.select(this).classed('hover', true)
      })
      .on('mouseout', function (d) {
        d3Selection.select(this).classed('hover', false)
      })
      .call(circleOutputDraghandler({
        context,
        cx: startPosition + (increaseOutputValue * circleOut),
        cy: 50
      }))
  }
}

export default getNodeShape
