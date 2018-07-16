function getNodeShape (context) {
  const bindingData = context.datum()
  const { input, output } = bindingData

  context.append('rect')
    .attr('width', 200)
    .attr('height', 50)

  const increaseInputValue = (Math.floor(200 / (input * 2))) * 2
  const startPositionInput = Math.floor(200 / (input * 2))
  for (let circleIn = 0; circleIn < input; circleIn += 1) {
    context.append('circle')
      .style('class', 'data-input')
      .attr('cx', startPositionInput + (increaseInputValue * circleIn))
      .attr('cy', 0)
      .attr('r', 10)
  }

  const increaseOutputValue = (Math.floor(200 / (output * 2))) * 2
  const startPosition = Math.floor(200 / (output * 2))
  for (let circleOut = 0; circleOut < output; circleOut += 1) {
    context.append('circle')
      .style('class', 'data-output')
      .attr('cx', startPosition + (increaseOutputValue * circleOut))
      .attr('cy', 50)
      .attr('r', 10)
  }
}

export default getNodeShape
