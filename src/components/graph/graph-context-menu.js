import * as d3Selection from 'd3-selection'

function contextMenu (container, pOptions) {
  const options = pOptions || {}
  const height = options.height || 30
  const width = options.width || 150
  const margin = '0.4rem'
  const items = []
  const idName = 'contextMenu'
  // console.log(container)
  // const contextMenu = d3Selection.select('.context-menu')
  // console.log(contextMenu)

  const contextMenu = container
    .append('g')
    .attr('class', 'context-menu')
    .attr('id', idName)

  function menu (x, y, { link, node }) {
    // scaleItems()

    // Draw the menu
    contextMenu
      .selectAll('.menu-entry')
      .data(items, function (d) {
        return d.id
      })
      .enter()
      .append('g')
      .attr('class', 'menu-entry')
      .on('click', function (d) {
        if (d && d.callback) {
          const obj = d.type === 'link' ? link : node
          d.callback(obj)
        }
        contextMenu.selectAll('.menu-entry').remove()
      })

    d3Selection.selectAll('.menu-entry')
      .append('rect')
      .attr('x', x)
      .attr('y', function (d, i) { return y + (i * height) })
      .attr('width', width)
      .attr('height', height)
      .attr('id', `${idName}-menu-entry`)

    d3Selection.selectAll('.menu-entry')
      .append('text')
      .attr('id', `${idName}-menu-entry-text`)
      .append('tspan')
      .attr('id', `${idName}-menu-entry-text-tspan`)
      .attr('x', x)
      .attr('y', function (d, i) { return y + (i * height) })
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
