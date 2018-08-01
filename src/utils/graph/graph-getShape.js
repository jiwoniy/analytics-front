import * as d3Selection from 'd3-selection'
import * as d3Drag from 'd3-drag'

function checkLinkValidate (source, target) {
  return source.id !== target.id
}

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
    .text(d.node_type)
    .attr('transform', 'translate(50,15)') // base rect height
}

function removeTooltip (selection) {
  selection.select('.tooltip').remove()
}

// Output drag handler
function circleOutputDraghandler ({ context, linkOutput, isCanConnect }) {
  return d3Drag.drag()
    .subject(function (d) {
      return { x: d.x, y: d.y }
    })
    // .on('start', function (d) {
    // d3Selection.select(this)
    //   .attr('x', d.x = d3Selection.event.x)
    //   .attr('y', d.y = d3Selection.event.y)
    // })
    .on('drag', function (d) {
      if (context.isEditable()) {
        context.dragLine.classed('hidden', false)
        context.state.connecting = true

        const originX = d.x + linkOutput.cx
        const originY = d.y + linkOutput.cy

        const ToX = d3Selection.event.x + linkOutput.cx
        const ToY = d3Selection.event.y + linkOutput.cy

        context.dragLine.attr('d',
          `M${originX},${originY}L${ToX},${ToY}`)
      }
    })
    .on('end', function (d) {
      context.dragLine.classed('hidden', true)
      if (context.state.connecting) {
        if (context.state.capturedTarget) {
          // TODO method chaning
          // isCanConnect({ ...d, linkOutput }, context.state.capturedTarget))[0]
          if (isCanConnect({ ...d, linkOutput }, context.state.capturedTarget)) {
            const newLink = {
              source: {
                ...d,
                linkOutput
              },
              target: context.state.capturedTarget
            }
            context.links.add(newLink)
            context.drawLinks()
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
            d3Selection.select(this).classed('hover', true)
            drawTooltip(d3Selection.select(this.parentNode), d, 'input', startPositionInput + (increaseInputValue * circleIn))
            if (context.state.connecting) {
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
            d3Selection.select(this).classed('hover', false)
            removeTooltip(d3Selection.select(this.parentNode))
            context.state.capturedTarget = null
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
            isCanConnect: isCanConnect || checkLinkValidate
          }))
      }
    }
  }

  if (selections.size() === 1) {
    const bindingData = selections.datum()
    // const { input, output } = bindingData
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
