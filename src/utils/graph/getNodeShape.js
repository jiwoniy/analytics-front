import * as d3Selection from 'd3-selection'
import * as d3Drag from 'd3-drag'

function checkLinkValidate (source, target) {
  // source.id !== target.id
  // source.type !== target.type
  return source.id !== target.id && source.type !== target.type
}

// Output drag handler
function circleOutputDraghandler ({ context, linkOutput }) {
  return d3Drag.drag()
    .subject(function (d) {
      return { x: d.x, y: d.y }
    })
    .on('drag', function (d) {
      context.dragLine.classed('hidden', false)
      context.state.connecting = true
      const x = d3Selection.event.x + linkOutput.cx
      const y = d3Selection.event.y + linkOutput.cy
      context.dragLine.attr('d',
        `M${d.x + linkOutput.cx},${d.y + linkOutput.cy}L${x},${y}`)
    })
    .on('end', function (d) {
      context.dragLine.classed('hidden', true)
      if (context.state.connecting) {
        if (context.state.capturedTarget) {
          if (checkLinkValidate({ ...d, linkOutput }, context.state.capturedTarget)) {
            const newEdge = {
              source: {
                ...d,
                linkOutput
              },
              target: context.state.capturedTarget
            }
            context.edges.add(newEdge)
            context.drawLinks()
          }
          context.state.capturedTarget = null
        }
        context.state.connecting = false
      }
    })
}

function getNodeShape (context, selections) {
  if (selections.size() === 1) {
    const bindingData = selections.datum()
    const { input, output } = bindingData
    selections.append('rect')
      .attr('width', 200)
      .attr('height', 50)

    const increaseInputValue = (Math.floor(200 / (input * 2))) * 2
    const startPositionInput = Math.floor(200 / (input * 2))
    for (let circleIn = 0; circleIn < input; circleIn += 1) {
      selections.append('circle')
        .classed('data-input', true)
        .attr('id', `input-${circleIn}`)
        .attr('cx', startPositionInput + (increaseInputValue * circleIn))
        .attr('cy', 0)
        .attr('r', 10)
        .on('mouseover', function (d) {
          if (context.state.connecting) {
            d3Selection.select(this).classed('hover', true)
            context.state.capturedTarget = {
              ...d,
              linkInput: {
                cx: startPositionInput + (increaseInputValue * circleIn),
                cy: 0,
                id: this.id,
                index: circleIn
              }
            }
          }
        })
        .on('mouseout', function (d) {
          context.state.capturedTarget = null
          d3Selection.select(this).classed('hover', false)
        })
    }

    const increaseOutputValue = (Math.floor(200 / (output * 2))) * 2
    const startPositionOutput = Math.floor(200 / (output * 2))
    for (let circleOut = 0; circleOut < output; circleOut += 1) {
      selections.append('circle')
        .classed('data-output', true)
        .attr('id', `output-${circleOut}`)
        .attr('cx', startPositionOutput + (increaseOutputValue * circleOut))
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
          linkOutput: {
            cx: startPositionOutput + (increaseOutputValue * circleOut),
            cy: 50,
            id: `output-${circleOut}`,
            index: circleOut
          }
        }))
    }
  } else {
    selections
      .call((selection) => {
        selection.append('rect')
          .attr('width', 200)
          .attr('height', 50)
        selection.each(drawCircle)

        function drawCircle (d, i) {
          const { input, output } = d
          const increaseInputValue = (Math.floor(200 / (input * 2))) * 2
          const startPositionInput = Math.floor(200 / (input * 2))
          for (let circleIn = 0; circleIn < input; circleIn += 1) {
            d3Selection.select(this).append('circle')
              .classed('data-input', true)
              .attr('id', `input-${circleIn}`)
              .attr('cx', startPositionInput + (increaseInputValue * circleIn))
              .attr('cy', 0)
              .attr('r', 10)
              .on('mouseover', function (d) {
                if (context.state.connecting) {
                  d3Selection.select(this).classed('hover', true)
                  context.state.capturedTarget = {
                    ...d,
                    linkInput: {
                      cx: startPositionInput + (increaseInputValue * circleIn),
                      cy: 0,
                      id: this.id,
                      index: circleIn
                    }
                  }
                }
              })
              .on('mouseout', function (d) {
                context.state.capturedTarget = null
                d3Selection.select(this).classed('hover', false)
              })
          }

          const increaseOutputValue = (Math.floor(200 / (output * 2))) * 2
          const startPositionOutput = Math.floor(200 / (output * 2))
          for (let circleOut = 0; circleOut < output; circleOut += 1) {
            d3Selection.select(this).append('circle')
              .classed('data-output', true)
              .attr('id', `output-${circleOut}`)
              .attr('cx', startPositionOutput + (increaseOutputValue * circleOut))
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
                linkOutput: {
                  cx: startPositionOutput + (increaseOutputValue * circleOut),
                  cy: 50,
                  id: `output-${circleOut}`,
                  index: circleOut
                }
              }))
          }
        }
      })
  }
}

export default getNodeShape
