import * as d3Selection from 'd3-selection'

function contextMenu () {
  let height
  let width
  let margin = 0.1
  const items = []
  let rescale = false

  const style = {
    rect: {
      mouseout: {
        fill: 'rgb(244,244,244)',
        stroke: 'white',
        'stroke-width': '1px'
      },
      mouseover: {
        fill: 'rgb(200,200,200)'
      }
    },
    text: {
      fill: 'steelblue',
      'font-size': '13'
    }
  }

  function menu (x, y) {
    d3Selection.select('.context-menu').remove()
    scaleItems()

    // Draw the menu
    d3Selection.select('svg')
      .append('g').attr('class', 'context-menu')
      .selectAll('tmp')
      .data(items).enter()
      .append('g').attr('class', 'menu-entry')
      .style({'cursor': 'pointer'})
      .on('mouseover', function () {
        d3Selection.select(this).select('rect').style(style.rect.mouseover)
      })
      .on('mouseout', function () {
        d3Selection.select(this).select('rect').style(style.rect.mouseout)
      })

    d3Selection.selectAll('.menu-entry')
      .append('rect')
      .attr('x', x)
      .attr('y', function (d, i) { return y + (i * height) })
      .attr('width', width)
      .attr('height', height)
      .style(style.rect.mouseout)

    d3Selection.selectAll('.menu-entry')
      .append('text')
      .text(function (d) { return d })
      .attr('x', x)
      .attr('y', function (d, i) { return y + (i * height) })
      .attr('dy', height - margin / 2)
      .attr('dx', margin)
      .style(style.text)

      // Other interactions
    d3Selection.select('body')
      .on('click', function () {
        d3Selection.select('.context-menu').remove()
      })
  }

  menu.items = function (e) {
    if (!arguments.length) return items
    for (let i in arguments) {
      items.push(arguments[i])
    }
    rescale = true
    return menu
  }

  // Automatically set width, height, and margin;
  function scaleItems () {
    if (rescale) {
      d3Selection.select('svg').selectAll('tmp')
        .data(items).enter()
        .append('text')
        .text(function (d) { return d })
        .style(style.text)
        .attr('x', -1000)
        .attr('y', -1000)
        .attr('class', 'tmp')
      const z = d3Selection.selectAll('.tmp')[0]
        .map(function (x) { return x.getBBox() })
      width = d3Selection.max(z.map(function (x) { return x.width }))
      margin = margin * width
      width = width + 2 * margin
      height = d3Selection.max(z.map(function (x) { return x.height + margin / 2 }))

      // cleanup
      d3Selection.selectAll('.tmp').remove()
      rescale = false
    }
  }

  return menu
}

export default contextMenu
