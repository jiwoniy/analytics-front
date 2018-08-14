// import * as d3Selection from 'd3-selection'

function contextMenu (container, type, pOptions) {
  // type : link or node
  const options = pOptions || {}
  const height = options.height || 30
  const width = options.width || 150
  const margin = '0.4rem'
  const items = []
  const idName = 'contextMenu'

  // context-menu.scss
  const contextMenu = container
    .append('g')
    .attr('class', 'context-menu')
    .attr('id', `${idName}-${type}`)

  function menu (xPosition, yPosition, { link, node }) {
    // scaleItems()

    // Draw the menu
    const selectMenu = contextMenu
      .selectAll('.menu-item')
      .data(items, function (d) {
        return d.id
      })

    const appendMenu = selectMenu
      .enter()
      .append('g')
      .attr('class', 'menu-item')
      .on('click', function (d) {
        if (d && d.callback) {
          const obj = type === 'link' ? link : node
          d.callback(obj)
        }
        contextMenu.selectAll('.menu-item').remove()
      })

    appendMenu
      .append('rect')
      .attr('x', xPosition)
      .attr('y', function (d, i) { return yPosition + (i * height) })
      .attr('width', width)
      .attr('height', height)
      .attr('id', `${idName}-menu-item`)

    appendMenu
      .append('text')
      .attr('id', `${idName}-menu-item-text`)
      .append('tspan')
      .attr('id', `${idName}-menu-item-text-tspan`)
      .attr('x', xPosition)
      .attr('y', function (d, i) { return yPosition + (i * height) })
      .attr('dy', height / 2)
      .attr('dx', margin)
      .text(d => d.name)
  }

  menu.remove = function () {
    contextMenu.remove()
  }

  menu.items = function (e) {
    if (!arguments.length) return items
    for (let i in arguments) {
      items.push(arguments[i])
    }
    // rescale = true
    return menu
  }

  // Automatically set width, height, and margin;
  // function scaleItems () {
  //   if (rescale) {
  //     container.selectAll('tmp')
  //       .data(items).enter()
  //       // .append('text')
  //       // .text(function (d) { return d })
  //       .style(style.text)
  //       .attr('x', -1000)
  //       .attr('y', -1000)
  //       .attr('class', 'tmp')
  //     const z = d3Selection.selectAll('.tmp')[0]
  //       .map(function (x) { return x.getBBox() })
  //     width = d3Selection.max(z.map(function (x) { return x.width }))
  //     margin = margin * width
  //     width = width + 2 * margin
  //     height = d3Selection.max(z.map(function (x) { return x.height + margin / 2 }))

  //     // cleanup
  //     d3Selection.selectAll('.tmp').remove()
  //     rescale = false
  //   }
  // }

  return menu
}

// const menu = contextMenu().items('first item', 'second option', 'whatever, man')
export default contextMenu
