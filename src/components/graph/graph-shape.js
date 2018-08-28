import * as d3Selection from 'd3-selection'
import * as d3Drag from 'd3-drag'

// function checkLinkValidate (source, target) {
//   return source.id !== target.id
// }

function drawTooltip (selection, d, inOut, xPosition) {
  const tooltip = selection
    .append('g')
    .classed('tooltip', true)
    .attr('transform', `translate(${xPosition + 7},
      ${inOut === 'input' ? -30 : 50})`) // base rect height

  tooltip
    .append('rect')
    .attr('width', 100)
    .attr('height', 30)
    .attr('rx', 10)
    .attr('ry', 10)

  tooltip
    .append('text')
    // .text(d.node_type)
    .attr('transform', 'translate(50,15)') // base rect height
}

function removeTooltip (selection) {
  selection.select('.tooltip').remove()
}

// Output drag handler
function circleOutputDraghandler ({ context, linkOutput, isCanConnect }) {
  return d3Drag.drag()
    // .filter(function (d) {
    //   return true
    // })
    .subject(function (d) {
      return { x: d.position.x, y: d.position.y }
    })
    .on('drag', function (d) {
      if (context.isUnLock()) {
        context.dragLine.classed('hidden', false)
        context.state.connecting = true

        const originX = d.position.x + linkOutput.cx
        const originY = d.position.y + linkOutput.cy

        const mouse = d3Selection.mouse(this)
        const ToX = mouse[0] + d.position.x
        const ToY = mouse[1] + d.position.y

        // const ToX = d3Selection.event.x + linkOutput.cx
        // const ToY = d3Selection.event.y + linkOutput.cy

        const transform = context.state.currentZoomTransform
        context.dragLine.attr('d',
          `M${originX},${originY}L${ToX},${ToY}`)
          .attr('transform', transform)
      }
    })
    .on('end', function (d) {
      context.dragLine.classed('hidden', true)
      if (context.state.connecting) {
        if (context.state.capturedTarget) {
          if (isCanConnect({ ...d, linkOutput }, context.state.capturedTarget)) {
            const newLink = {
              source: {
                sourceId: d.id,
                linkOutput
              },
              target: context.state.capturedTarget
            }
            context.links.add(newLink)
            context.drawGraph({ link: true })
          }
          context.state.capturedTarget = null
        }
        context.state.connecting = false
      }
    })
}

function getNodeShape (context, selections, isCanConnect) {
  function drawCircle (d, type) {
    if (type === 'input') {
      const { input } = d
      const increaseInputValue = (Math.floor(200 / (input * 2))) * 2
      const startPositionInput = Math.floor(200 / (input * 2))
      for (let circleIn = 0; circleIn < input; circleIn += 1) {
        const inputCircle = d3Selection.select(this).append('circle')

        inputCircle.classed('data-input', true)
          .attr('id', `input-${circleIn}`)
          .attr('cx', startPositionInput + (increaseInputValue * circleIn))
          .attr('cy', 0)
          .attr('r', 10)
          .on('mouseover', function (d) {
            if (context.state.connecting) {
              d3Selection.select(this).classed('hover', true)
              context.state.capturedTarget = {
                targetId: d.id,
                linkInput: {
                  cx: startPositionInput + (increaseInputValue * circleIn),
                  cy: 0,
                  id: this.id,
                  index: circleIn
                }
              }
            } else if (!context.state.connecting) {
              d3Selection.select(this).classed('hover', true)
              drawTooltip(d3Selection.select(this.parentNode), d, 'input', startPositionInput + (increaseInputValue * circleIn))
            }
          })
          .on('mouseout', function (d) {
            if (context.state.connecting) {
              d3Selection.select(this).classed('hover', false)
              context.state.capturedTarget = null
            } else {
              d3Selection.select(this).classed('hover', false)
              removeTooltip(d3Selection.select(this.parentNode))
            }
          })
      }
    } else if (type === 'output') {
      const { output } = d
      const increaseOutputValue = (Math.floor(200 / (output * 2))) * 2
      const startPositionOutput = Math.floor(200 / (output * 2))
      for (let circleOut = 0; circleOut < output; circleOut += 1) {
        const ouputCircle = d3Selection.select(this).append('circle')

        ouputCircle.classed('data-output', true)
          .attr('id', `output-${circleOut}`)
          .attr('cx', startPositionOutput + (increaseOutputValue * circleOut))
          .attr('cy', 50)
          .attr('r', 10)
          .on('mouseover', function (d) {
            drawTooltip(d3Selection.select(this.parentNode), d, 'output', startPositionOutput + (increaseOutputValue * circleOut))
            d3Selection.select(this).classed('hover', true)
          })
          .on('mouseout', function (d) {
            removeTooltip(d3Selection.select(this.parentNode))
            d3Selection.select(this).classed('hover', false)
          })
          .call(circleOutputDraghandler({
            context,
            linkOutput: {
              cx: startPositionOutput + (increaseOutputValue * circleOut),
              cy: 50,
              id: `output-${circleOut}`,
              index: circleOut
            },
            // isCanConnect: checkLinkValidate
            isCanConnect: isCanConnect
          }))
      }
    }
  }

  if (selections.size() === 1) {
    const bindingData = selections.datum()
    drawCircle.call(selections.node(), bindingData, 'input')
    selections.append('rect')
      .attr('width', 200)
      .attr('height', 50)

    drawCircle.call(selections.node(), bindingData, 'output')
  } else {
    selections
      .call((selection) => {
        selection.each(function (d) {
          return drawCircle.call(this, d, 'input')
        })
        selection.append('rect')
          .attr('width', 200)
          .attr('height', 50)
        selection.each(function (d) {
          return drawCircle.call(this, d, 'output')
        })
      })
  }
}

export default getNodeShape
