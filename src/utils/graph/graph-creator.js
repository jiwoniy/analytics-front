import * as d3Selection from 'd3-selection'
import * as d3Drag from 'd3-drag'
import * as d3Zoom from 'd3-zoom'
// import * as d3Force from 'd3-force'
import * as d3Shape from 'd3-shape'

import GraphNodes from './graph-nodes'
import GraphEddes from './graph-edges'

// This source from https://github.com/cjrd/directed-graph-creator
const GraphCreator = function GraphCreatorConstructor (svg, options) {
  const thisGraph = this
  thisGraph.idct = 0

  thisGraph.options = options || {}
  thisGraph.width = options.width
  thisGraph.hegith = options.hegith

  thisGraph.nodes = new GraphNodes()
  thisGraph.edges = new GraphEddes()

  thisGraph.state = {
    editable: false,
    selectedNode: null,
    selectedEdge: null,
    mouseDownNode: null,
    mouseDownLink: null,
    justDragged: false,
    capturedTarget: null,
    justScaleTransGraph: false,
    lastKeyDown: -1,
    shiftNodeDrag: false,
    selectedText: null
  }

  // define arrow markers for graph links
  const defs = svg.append('svg:defs')
  defs.append('svg:marker')
    .attr('id', 'end-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', '32')
    .attr('markerWidth', 3.5)
    .attr('markerHeight', 3.5)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')

  // define arrow markers for leading arrow
  defs.append('svg:marker')
    .attr('id', 'mark-end-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 7)
    .attr('markerWidth', 3.5)
    .attr('markerHeight', 3.5)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')

  thisGraph.svg = svg
  thisGraph.svgG = svg.append('g')
    .classed(thisGraph.constants.graphClass, true)
  const svgG = thisGraph.svgG

  // displayed when dragging between nodes
  thisGraph.dragLine = svgG.append('svg:path')
    .attr('class', 'link dragline hidden')
    .attr('d', 'M0,0L0,0')
    .style('marker-end', 'url(#mark-end-arrow)')

  thisGraph.paths = svgG.append('g').classed('path-group', true).selectAll('g')
  thisGraph.rects = svgG.append('g').classed('rect-group', true).selectAll('g')
  if (options.saveFile) {
    const file = JSON.parse(options.saveFile)
    thisGraph.nodes = new GraphNodes(thisGraph.transfromInitNodes(file.nodes))
    thisGraph.edges = new GraphEddes(file.edges)

    thisGraph.updateNodesGraph()
    thisGraph.updateLinksGraph(true)
    // thisGraph.nodes.getNodes().forEach(node => thisGraph.addNode(node))
    // const nodes = thisGraph.transfromInitNodes(thisGraph.nodes.getNodes())
    // thisGraph.addNodes(nodes)
    // thisGraph.updateLinksGraph()
  }

  /*
  thisGraph.drag = d3Drag.drag()
    .subject(function (d) {
      return { x: d.x, y: d.y }
      // return d == null ? {x: d3Selection.event.x, y: d3Selection.event.y} : d
    })
    .on('drag', function (args) {
      // thisGraph.state.justDragged = true
      // thisGraph.dragmove(args)
    })
    .on('end', function () {
      // thisGraph.dragLine.classed('hidden', false)
      // todo check if edge-mode is selected
    })
  */

  // listen for key events
  // d3Selection.select(window).on('keydown', function () {
  //   // thisGraph.svgKeyDown(thisGraph
  //   thisGraph.svgKeyDown()
  // }).on('keyup', function () {
  //   // thisGraph.svgKeyUp(thisGraph)
  //   thisGraph.svgKeyUp()
  // })
  // .on('mouseup', function () {
  //   // thisGraph.svgKeyDown()
  // }).on('mousedown', function () {
  //   // thisGraph.svgKeyDown()
  // })

  // thisGraph.svg.on('mousedown', function (d) {
  // thisGraph.svgMouseDown(d)
  // })

  // thisGraph.svg.on('mouseup', function (d) {
  // thisGraph.svgMouseUp(d)
  // })

  // thisGraph.svg.on('click', function (d) {
  // })

  // listen for dragging
  const dragSvg = d3Zoom.zoom()
    .on('zoom', function () {
      if (d3Selection.event.sourceEvent.shiftKey) {
        // TODO  the internal d3 state is still changing
        return false
      } else {
        thisGraph.zoomed()
        // thisGraph.zoomed(thisGraph)
      }
      return true
    })
    .on('start', function () {
      const ael = d3Selection.select(`#${thisGraph.constants.activeEditId}`).node()
      if (ael) {
        ael.blur()
      }
      if (!d3Selection.event.sourceEvent.shiftKey) {
        d3Selection.select('#svgContainer').style('cursor', 'auto')
      }
    })
    .on('end', function () {
      d3Selection.select('#svgContainer').style('cursor', 'auto')
    })

  svg.call(dragSvg).on('dblclick.zoom', null)

  // listen for resize
  // window.onresize = function windowResize () {
  //   thisGraph.updateWindow(svg)
  // }
}

GraphCreator.prototype.setIdCt = function setIdCt (idct) {
  this.idct = idct
}

GraphCreator.prototype.constants = {
  graphClass: 'graph',
  defaultTitle: 'random variable',
  selectedClass: 'selected',
  // circleGClass: 'conceptG',
  // rectGClass: 'conceptG',
  nodeGClass: 'data-node',
  nodeHoverClass: 'data-node-hover',
  connectClass: 'connect-node',
  activeEditId: 'active-editing',
  BACKSPACE_KEY: 8,
  DELETE_KEY: 46,
  ENTER_KEY: 13,
  nodeRadius: 50
}

/* PROTOTYPE FUNCTIONS */
// GraphCreator.prototype.dragmove = function dragmove (d) {
//   var thisGraph = this
//   if (thisGraph.state.shiftNodeDrag) {
//     thisGraph.dragLine.attr('d',
//       `M${d.x},${d.y}L${d3Selection.mouse(thisGraph.svgG.node())[0]},${d3Selection.mouse(this.svgG.node())[1]}`)
//   } else {
//     d.x += d3Selection.event.dx
//     d.y += d3Selection.event.dy
//     thisGraph.updateGraph()
//   }
// }

GraphCreator.prototype.dragLink = function dragLink (d) {
  const thisGraph = this
  thisGraph.dragLine.attr('d',
    `M${d.x},${d.y}L${d3Selection.mouse(thisGraph.svgG.node())[0]},
    ${d3Selection.mouse(this.svgG.node())[1]}`)
}

// EDITABLE
// GraphCreator.prototype.deleteGraph = function deleteGraph (skipPrompt) {
//   const thisGraph = this
//   let doDelete = true
//   if (!skipPrompt) {
//     doDelete = window.confirm('Press OK to delete this graph')
//   }
//   if (doDelete) {
//     // thisGraph.nodes = []
//     // thisGraph.edges = []
//     thisGraph.updateGraph()
//   }
// }

// /* select all text in element: taken from http://stackoverflow.com/questions/6139107/programatically-select-text-in-a-contenteditable-html-element */
// GraphCreator.prototype.selectElementContents = function selectElementContents (el) {
//   const range = document.createRange()
//   range.selectNodeContents(el)
//   const sel = window.getSelection()
//   sel.removeAllRanges()
//   sel.addRange(range)
// }

// /* insert svg line breaks: taken from http://stackoverflow.com/questions/13241475/how-do-i-include-newlines-in-labels-in-d3-charts */
GraphCreator.prototype.insertTitleLinebreaks = function (gEl, title) {
  const words = title.split(/\s+/g)
  // const nwords = words.length
  const el = gEl.append('text')
    .attr('x', '50px')
    .attr('dy', '25px')
    // .attr('dy', `-${(nwords - 1) * 7.5}`)

  for (let i = 0; i < words.length; i++) {
    const tspan = el.append('tspan').text(words[i])
    if (i > 0) {
      // tspan.attr('x', 0).attr('dy', '15')
      tspan.attr('x', '50px')
        .attr('dy', '15')
    }
  }
}

// // remove edges associated with a node
GraphCreator.prototype.spliceLinksForNode = function spliceLinksForNode (node) {
  const thisGraph = this
  const toSplice = thisGraph.edges.filter(function (l) {
    return (l.source === node || l.target === node)
  })
  toSplice.map(function (l) {
    // thisGraph.edges.splice(thisGraph.edges.indexOf(l), 1)
  })
}

// GraphCreator.prototype.replaceSelectEdge = function (d3Path, edgeData) {
//   const thisGraph = this
//   d3Path.classed(thisGraph.constants.selectedClass, true)
//   if (thisGraph.state.selectedEdge) {
//     thisGraph.removeSelectFromEdge()
//   }
//   thisGraph.state.selectedEdge = edgeData
// }

// GraphCreator.prototype.replaceSelectNode = function (d3Node, nodeData) {
//   const thisGraph = this
//   d3Node.classed(this.constants.selectedClass, true)
//   if (thisGraph.state.selectedNode) {
//     thisGraph.removeSelectFromNode()
//   }
//   thisGraph.state.selectedNode = nodeData
// }

// GraphCreator.prototype.removeSelectFromNode = function () {
//   const thisGraph = this
//   thisGraph.rects.filter(function (cd) {
//     return cd.id === thisGraph.state.selectedNode.id
//   }).classed(thisGraph.constants.selectedClass, false)
//   thisGraph.state.selectedNode = null
// }

// GraphCreator.prototype.removeSelectFromEdge = function () {
//   const thisGraph = this
//   thisGraph.paths.filter(function (cd) {
//     return cd === thisGraph.state.selectedEdge
//   }).classed(thisGraph.constants.selectedClass, false)
//   thisGraph.state.selectedEdge = null
// }

// GraphCreator.prototype.pathMouseDown = function pathMouseDown (d3path, d) {
//   const thisGraph = this
//   const state = thisGraph.state
//   d3Selection.event.stopPropagation()
//   state.mouseDownLink = d

//   if (state.selectedNode) {
//     thisGraph.removeSelectFromNode()
//   }

//   var prevEdge = state.selectedEdge
//   if (!prevEdge || prevEdge !== d) {
//     thisGraph.replaceSelectEdge(d3path, d)
//   } else {
//     thisGraph.removeSelectFromEdge()
//   }
// }

// mousedown on node
// GraphCreator.prototype.rectMouseDown = function rectMouseDown (d3node, d) {
//   const thisGraph = this
//   const state = thisGraph.state
//   d3Selection.event.stopPropagation()
//   state.mouseDownNode = d
//   if (d3Selection.event.shiftKey) {
//     state.shiftNodeDrag = d3Selection.event.shiftKey
//     // reposition dragged directed edge
//     // thisGraph.dragLine.classed('hidden', false)
//       .attr('d', `M${d.x},${d.y}L${d.x},${d.y}`)
//     // return
//   }
// }

/* place editable text on node in place of svg text */
// GraphCreator.prototype.changeTextOfNode = function (d3node, d) {
//   const thisGraph = this
//   const constants = thisGraph.constants
//   const htmlEl = d3node.node()
//   d3node.selectAll('text').remove()
//   const nodeBCR = htmlEl.getBoundingClientRect()
//   const curScale = nodeBCR.width / constants.nodeRadius
//   const placePad = 5 * curScale
//   const useHW = curScale > 1 ? (nodeBCR.width * 0.71) : (constants.nodeRadius * 1.42)
//   // replace with editableconent text
//   const d3txt = thisGraph.svg.selectAll('foreignObject')
//     .data([d])
//     .enter()
//     .append('foreignObject')
//     .attr('x', nodeBCR.left + placePad)
//     .attr('y', nodeBCR.top + placePad)
//     .attr('height', 2 * useHW)
//     .attr('width', useHW)
//     .append('xhtml:p')
//     .attr('id', constants.activeEditId)
//     .attr('contentEditable', 'true')
//     .text(d.title)
//     .on('mousedown', function (d) {
//       d3Selection.event.stopPropagation()
//     })
//     .on('keydown', function (d) {
//       d3Selection.event.stopPropagation()
//       if (d3Selection.event.keyCode === constants.ENTER_KEY && !d3Selection.event.shiftKey) {
//         this.blur()
//       }
//     })
//     .on('blur', function (d) {
//       d.title = this.textContent
//       thisGraph.insertTitleLinebreaks(d3node, d.title)
//       d3Selection.select(this.parentElement).remove()
//     })
//   return d3txt
// }

// mouseup on nodes
// GraphCreator.prototype.rectMouseUp = function (d3node, d) {
//   const thisGraph = this
//   const state = thisGraph.state
//   const constants = thisGraph.constants
//   // reset the states
//   state.shiftNodeDrag = false
//   d3node.classed(constants.connectClass, false)

//   const mouseDownNode = state.mouseDownNode

//   if (!mouseDownNode) {
//     return
//   }

//   // thisGraph.dragLine.classed('hidden', true)

//   if (mouseDownNode !== d) {
//     // we're in a different node: create new edge for mousedown edge and add to graph
//     const newEdge = {source: mouseDownNode, target: d}
//     const filtRes = thisGraph.paths.filter(function (d) {
//       if (d.source === newEdge.target && d.target === newEdge.source) {
//         // thisGraph.edges.splice(thisGraph.edges.indexOf(d), 1)
//       }
//       return d.source === newEdge.source && d.target === newEdge.target
//     })
//     if (!filtRes[0].length) {
//       // thisGraph.edges.push(newEdge)
//       thisGraph.updateGraph()
//     }
//   } else {
//     // we're in the same node
//     if (state.justDragged) {
//       // dragged, not clicked
//       // state.justDragged = false
//     } else {
//       // clicked, not dragged
//       if (d3Selection.event.shiftKey) {
//         // shift-clicked node: edit text content
//         const d3txt = thisGraph.changeTextOfNode(d3node, d)
//         const txtNode = d3txt.node()
//         thisGraph.selectElementContents(txtNode)
//         txtNode.focus()
//       } else {
//         if (state.selectedEdge) {
//           thisGraph.removeSelectFromEdge()
//         }
//         const prevNode = state.selectedNode

//         if (!prevNode || prevNode.id !== d.id) {
//           thisGraph.replaceSelectNode(d3node, d)
//         } else {
//           thisGraph.removeSelectFromNode()
//         }
//       }
//     }
//   }
//   state.mouseDownNode = null
//   // return
// } // end of circles mouseup

// mousedown on main svg
// GraphCreator.prototype.svgMouseDown = function svgMouseDown () {
//   this.state.graphMouseDown = true
// }

// mouseup on main svg
// GraphCreator.prototype.svgMouseUp = function svgMouseUp () {
//   const thisGraph = this
//   const state = thisGraph.state
//   const constants = thisGraph.constants

//   if (state.justScaleTransGraph) {
//     // dragged not clicked
//     state.justScaleTransGraph = false
//   } else if (state.graphMouseDown && d3Selection.event.shiftKey) {
//     // clicked not dragged from svg
//     const xycoords = d3Selection.mouse(thisGraph.svgG.node())
//     const d = {
//       id: thisGraph.idct++,
//       title: constants.defaultTitle,
//       x: xycoords[0],
//       y: xycoords[1]
//     }
//     thisGraph.nodes.add(d)
//     thisGraph.updateGraph()

//     // make title of text immediently editable
//     const d3txt = thisGraph.changeTextOfNode(thisGraph.rects.filter(function (dval) {
//       return dval.id === d.id
//     }), d)
//     const txtNode = d3txt.node()
//     thisGraph.selectElementContents(txtNode)
//     txtNode.focus()
//   } else if (state.shiftNodeDrag) {
//     // dragged from node
//     state.shiftNodeDrag = false
//     // thisGraph.dragLine.classed('hidden', true)
//   }
//   state.graphMouseDown = false
// }

// GraphCreator.prototype.svgClicked = function svgClicked () {
// }

function rectDraghandler (context) {
  return d3Drag.drag()
    .subject(function (d) {
      return { x: d.x, y: d.y }
    })
    .on('start', function (d) {
      if (context.state.editable) {
        d.status.moving = true
      }
    })
    .on('drag', function (d) {
      if (context.state.editable) {
        if (!d.status.selected) {
          d3Selection.select(this)
            .attr('transform', `translate(${d3Selection.event.x}, ${d3Selection.event.y})`)
          d.x = d3Selection.event.x
          d.y = d3Selection.event.y
          context.updateLinksGraph()
        } else {
          context.state.justDragged = true
          context.dragLine.classed('hidden', false)
          context.dragLink(d)
        }
      }
    })
    .on('end', function (d) {
      if (context.state.editable) {
        d.status.moving = false
        if (context.state.justDragged) {
          context.state.justDragged = false
          context.dragLine.classed('hidden', true)
          if (context.state.capturedTarget) {
            const newEdge = {
              source: d,
              target: context.state.capturedTarget
            }
            context.edges.add(newEdge)
            context.updateLinksGraph()
            context.state.capturedTarget = null
          }
        }
      }
    })
}

GraphCreator.prototype.transfromNodeInit = function transfromNodeInit (node) {
  const thisGraph = this
  const consts = thisGraph.constants
  const newNode = {
    id: node.id,
    title: node.title || consts.defaultTitle,
    position: {
      x: node.position.x * 0.3, // just by expericene
      y: node.position.y
    },
    status: {
      moving: false,
      selected: false
    },
    x: node.position.x * 0.3,
    y: node.position.y
  }
  return newNode
}

GraphCreator.prototype.transfromInitNodes = function transfromInitNodes (nodes) {
  const thisGraph = this
  return nodes.map(node => thisGraph.transfromNodeInit(node))
}

GraphCreator.prototype.addNode = function addNode (node) {
  const thisGraph = this
  if (thisGraph.state.editable) {
    thisGraph.nodes.add(thisGraph.transfromNodeInit(node))
    thisGraph.updateNodesGraph()
  }
}

// keydown on main svg
// GraphCreator.prototype.svgKeyDown = function svgKeyDown () {
//   const thisGraph = this
//   const state = thisGraph.state
//   const constants = thisGraph.constants

//   // make sure repeated key presses don't register for each keydown
//   if (state.lastKeyDown !== -1) {
//     return
//   }

//   state.lastKeyDown = d3Selection.event.keyCode
//   const selectedNode = state.selectedNode
//   const selectedEdge = state.selectedEdge

//   switch (d3Selection.event.keyCode) {
//     case constants.BACKSPACE_KEY:
//     case constants.DELETE_KEY:
//       d3Selection.event.preventDefault()
//       if (selectedNode) {
//         thisGraph.nodes.splice(thisGraph.nodes.indexOf(selectedNode), 1)
//         thisGraph.spliceLinksForNode(selectedNode)
//         state.selectedNode = null
//         thisGraph.updateGraph()
//       } else if (selectedEdge) {
//         thisGraph.edges.splice(thisGraph.edges.indexOf(selectedEdge), 1)
//         state.selectedEdge = null
//         thisGraph.updateGraph()
//       }
//       break
//   }
// }

// GraphCreator.prototype.svgKeyUp = function svgKeyUp () {
//   this.state.lastKeyDown = -1
// }

// call to propagate changes to graph
GraphCreator.prototype.updateGraph = function updateGraph () {
  const thisGraph = this
  thisGraph.updateLinksGraph()
  thisGraph.updateNodesGraph()
}

GraphCreator.prototype.updateNodesGraph = function updateNodesGraph () {
  const thisGraph = this
  const consts = thisGraph.constants

  const datas = thisGraph.nodes.getNodes()
  const exits = d3Selection.select('.rect-group').selectAll('g').data(datas)

  exits.classed(thisGraph.constants.selectedClass, d => d.status.selected)

  const newGs = exits
    .enter()
    .append('g')

  const rectDrag = rectDraghandler(thisGraph)
  newGs.classed(consts.nodeGClass, true)
    .attr('transform', function (d) {
      return `translate(${d.x},${d.y})`
    })
    .on('mouseover', function (d) {
      d3Selection.select(this).classed(consts.nodeHoverClass, true)
      if (thisGraph.state.justDragged && (thisGraph.nodes.getSelectNode() !== d.id)) {
        d3Selection.select(this).classed(consts.connectClass, true)
        thisGraph.state.capturedTarget = d
      }
    })
    .on('mouseout', function (d) {
      d3Selection.select(this).classed(consts.nodeHoverClass, false)
      d3Selection.select(this).classed(consts.connectClass, false)
      thisGraph.state.capturedTarget = null
    })
    // .on('mousedown', function (d) {
    // thisGraph.circleMouseDown(d3Selection.select(this), d)
    // })
    // .on('mouseup', function (d) {
    //   thisGraph.circleMouseUp(d3Selection.select(this), d)
    // })
    .on('click', function (d) {
      thisGraph.nodes.setSelectedNode(d)
      thisGraph.updateNodesGraph()
      if (thisGraph.options && thisGraph.options.nodeSelectCallback) {
        thisGraph.options.nodeSelectCallback(d)
      }
    })
    .call(rectDrag)
    // .on('dblclick', function (d) {
    //   d.selected = true
    //   d3Selection.select(this).classed(thisGraph.constants.selectedClass, true)
    // })
    // 2px solid #62b77a

  newGs.append('rect')
  newGs.each(function (d) {
    thisGraph.insertTitleLinebreaks(d3Selection.select(this), d.title)
  })

  exits.exit().remove()
}

GraphCreator.prototype.updateLinksGraph = function updateLinksGraph (isLoad = false) {
  const thisGraph = this
  const state = thisGraph.state
  const consts = thisGraph.constants
  function draw () {
    const lineGenerator = d3Shape.linkHorizontal()

    const exists = d3Selection.select('.path-group').selectAll('path').data(thisGraph.edges.getEdges(), function (d) {
      return `${String(d.source.id)}-${String(d.target.id)}`
    })

    // update
    exists
      .classed(consts.selectedClass, function (d) {
        return d === state.selectedEdge
      })
      .attr('d', function (d) {
        // rect 200 width, 50 height
        console.log('----------------exist---')
        console.log(`isLoad: ${isLoad}`)
        console.log(d)
        const data = {
          source: [d.source.x + 100, d.source.y + 50],
          target: [d.target.x + 100, d.target.y]
        }
        return lineGenerator(data)
        // return `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`
      })

    // enter
    exists.enter()
      .append('path')
      .classed('link', true)
      .attr('d', function (d) {
        const data = {
          source: [d.source.x + 100, d.source.y + 50],
          target: [d.target.x + 100, d.target.y]
        }
        return lineGenerator(data)
        // return `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`
      })
      // .on('mousedown', function (d) {
      //   thisGraph.pathMouseDown(thisGraph, d3Selection.select(this), d)
      // })
      // .on('mouseup', function (d) {
      //   state.mouseDownLink = null
      // })

    // remove
    exists.exit().remove()
  }

  draw()
}

GraphCreator.prototype.zoomed = function zoomed () {
  this.state.justScaleTransGraph = true

  d3Selection.select(`.${this.constants.graphClass}`)
    .attr('transform', d3Selection.event.transform)
    // .attr('transform', `translate(${d3Selection.event.translate}) scale(${d3Selection.event.scale})`)
}

GraphCreator.prototype.setEditable = function setEditable (status) {
  this.state.editable = status
}

GraphCreator.prototype.save = function save () {
  console.log('GraphCreator save action')
  const saveFile = {
    edges: [],
    nodes: []
  }
  if (this.edges.getEdges().length && this.nodes.getNodes()) {
    this.edges.getEdges().forEach(edge => {
      saveFile.edges.push(edge)
    })
    this.nodes.getNodes().forEach(node => {
      saveFile.nodes.push({
        id: node.id,
        title: node.title,
        position: {
          x: node.x,
          y: node.y
        }
      })
    })

    return JSON.stringify(saveFile)
  }
  return null
}

export default GraphCreator
