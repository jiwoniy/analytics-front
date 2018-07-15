import * as d3Selection from 'd3-selection'
import * as d3Drag from 'd3-drag'
import * as d3Zoom from 'd3-zoom'
// import * as d3Force from 'd3-force'
import * as d3Shape from 'd3-shape'

// import onChange from '@/helper/onChange'

import {
  saveNodeTransformNode,
  nodesTransformForSave,
  edgesTransformForSave,
  saveNodesTransformToNodes,
  saveEdgesTransformToEdges
} from './helper'
import GraphNodes from './graph-nodes'
import GraphEddes from './graph-edges'

// This source from https://github.com/cjrd/directed-graph-creator
const GraphCreator = function GraphCreatorConstructor (svg, options) {
  const thisGraph = this

  this.options = options || {}
  this.width = options.width
  this.hegith = options.hegith

  this.nodes = new GraphNodes()
  this.edges = new GraphEddes()

  this.state = {
    editable: false,
    selectedNode: null,
    contextNode: null,
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

  // watch state
  const stateProxyHandler = {
    set (target, key, value) {
      target[key] = value
      if (key === 'selectedNode') {
        if (thisGraph.options && thisGraph.options.nodeSelectCallback) {
          // node 중에 선택된 값이 무엇인지 확인하고..
          // 오른창을 닫기 위해 클릭...
          thisGraph.nodes.setSelectedNode(value)
          thisGraph.options.nodeSelectCallback(value)
        }
      }
      return true
    }
  }
  this.stateProxy = new Proxy(this.state, stateProxyHandler)

  this.svg = svg
  this.svgG = svg.select('#graphG')

  // displayed when dragging between nodes
  this.dragLine = this.svg.append('svg:path')
    .attr('class', 'link dragline hidden')
    .attr('d', 'M0,0L0,0')
    .style('marker-end', 'url(#mark-end-arrow)')

  this.pathsGroup = this.svgG.append('g').classed('path-group', true)
  this.rectsGroup = this.svgG.append('g').classed('rect-group', true)

  if (options.saveFile) {
    const file = JSON.parse(options.saveFile)
    this.nodes = new GraphNodes(saveNodesTransformToNodes(file.nodes))
    this.edges = new GraphEddes(saveEdgesTransformToEdges(file.edges))

    this.drawNodes()
    this.drawLinks()
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

  this.svg.on('mousedown', function (d) {
    thisGraph.setSelectNode(this, null)
  })

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

  this.svg.call(dragSvg).on('dblclick.zoom', null)

  // listen for resize
  // window.onresize = function windowResize () {
  //   thisGraph.updateWindow(svg)
  // }
}

// GraphCreator.prototype.setIdCt = function setIdCt (idct) {
//   this.idct = idct
// }

GraphCreator.prototype.constants = {
  // graphClass: 'graph',
  // defaultTitle: 'random variable',
  selectedClass: 'selected',
  // circleGClass: 'conceptG',
  // rectGClass: 'conceptG',
  nodeGClass: 'node-wrap',
  nodeHoverClass: 'node-hover',
  nodeSelectedClass: 'node-selected',
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
  const x = d3Selection.mouse(thisGraph.svgG.node())[0]
  const y = d3Selection.mouse(this.svgG.node())[1]
  // TODO
  thisGraph.dragLine.attr('d',
    `M${d.x},${d.y}L${x},${y}`)
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

GraphCreator.prototype.appendText = function appendText (nodeElement, insertText) {
  function dotme (selectText) {
    const words = insertText.split(/\s+/)
    const insertedText = selectText.append('tspan').text(insertText)
    const ellipsis = selectText.append('tspan').attr('class', 'elip').text('...')

    const width = parseFloat(200) - ellipsis.node().getComputedTextLength()
    // const numWords = words.length

    while (insertedText.node().getComputedTextLength() > width && words.length) {
      words.pop()
      insertedText.text(words.join(' '))
    }
  }

  nodeElement.append('text')
    .attr('transform', 'translate(100, 25)')
    .classed('dotme', true)
    .call(dotme)
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

// Important Node drag handler
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

          // when node draging edges also shoud be updated by new position
          context.drawLinks(d)
        } else {
          context.state.justDragged = true
          context.dragLine.classed('hidden', false)
          context.dragLink(d)
        }
      }
    })
    .on('end', function (d) {
      if (context.state.editable) {
        if (context.state.justDragged) {
          context.state.justDragged = false
          context.dragLine.classed('hidden', true)
          if (context.state.capturedTarget) {
            const newEdge = {
              source: d,
              target: context.state.capturedTarget
            }
            context.edges.add(newEdge)
            context.drawLinks()
            context.state.capturedTarget = null
          }
        }
      }
    })
}

// let data
// if (dragingNode.id === d.source.id) {
//   data = {
//     source: [d3Selection.event.x, d3Selection.event.y],
//     target: [d.target.x, d.target.y]
//   }
//   // edges를 업데이트 해줘야 한다.
// } else {
//   data = {
//     source: [d.source.x, d.source.y],
//     target: [d3Selection.event.x, d3Selection.event.y]
//   }
// }

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

GraphCreator.prototype.addNode = function addNode (node) {
  if (this.state.editable) {
    this.nodes.add(saveNodeTransformNode(node))
    this.drawNodes()
  }
}

// call to propagate changes to graph
GraphCreator.prototype.drawGraph = function drawGraph () {
  const thisGraph = this
  thisGraph.drawLinks()
  thisGraph.drawNodes()
}

GraphCreator.prototype.drawNodes = function drawNodes () {
  const thisGraph = this
  const consts = thisGraph.constants

  const datas = thisGraph.nodes.getNodes()
  const exists = d3Selection.select('.rect-group').selectAll('g').data(datas, function (d) {
    return d.id
  })

  // exists.classed(thisGraph.constants.selectedClass, d => d.status.selected)

  exists.exit().remove()

  const newGs = exists
    .enter()
    .append('g')

  const rectDrag = rectDraghandler(thisGraph)
  newGs.classed(consts.nodeGClass, true)
    .attr('transform', function (d) {
      return `translate(${d.x},${d.y})`
    })
    .on('mouseover', function (d) {
      d3Selection.select(this).select('use')
        .classed(consts.nodeHoverClass, true)

      if (thisGraph.state.justDragged && (thisGraph.nodes.getSelectNode().type !== d.type)) {
        d3Selection.select(this).classed(consts.connectClass, true)
        thisGraph.state.capturedTarget = d
      }
    })
    .on('mouseout', function (d) {
      // d3Selection.select(this).classed(consts.nodeHoverClass, false)
      d3Selection.select(this).select('use')
        .classed(consts.nodeHoverClass, false)
      d3Selection.select(this).classed(consts.connectClass, false)
    })
    .on('click', function (d) {
      thisGraph.setSelectNode(this, d)
    })
    .on('dblclick', function (d) {
      thisGraph.removeNode(d)
    })
    .call(rectDrag)

  newGs.append('use')
    .attr('xlink:href', d => `#nodeShape_${d.input}_${d.output}`)

  // d3Selection.selectAll('circle')
  //   .on('mouseover', function (d) {
  //     console.log(d)
  //     console.log('--circle mouse over')
  //   })

  newGs.each(function (d) {
    thisGraph.appendText(d3Selection.select(this), d.title)
  })
}

GraphCreator.prototype.drawLinks = function drawLinks (dragingNode) {
  const thisGraph = this

  function draw () {
    const lineGenerator = d3Shape.linkHorizontal()

    const exists = d3Selection.select('.path-group').selectAll('path').data(thisGraph.edges.getEdges(), function (d) {
      return `${String(d.source.id)}-${String(d.target.id)}`
    })

    // update
    exists
      // .classed(consts.selectedClass, function (d) {
      //   return d === state.selectedEdge
      // })
      .attr('d', function (d) {
        if (dragingNode) { // draging node
          if (dragingNode.id === d.source.id) {
            d.source.x = dragingNode.x
            d.source.y = dragingNode.y
          } else if (dragingNode.id === d.target.id) {
            d.target.x = dragingNode.x
            d.target.y = dragingNode.y
          }
        }

        const data = {
          source: [d.source.x, d.source.y],
          target: [d.target.x, d.target.y]
        }

        return lineGenerator(data)
      })

    // enter
    exists.enter()
      .append('path')
      .classed('link', true)
      .attr('d', function (d) {
        const data = {
          source: [d.source.x, d.source.y],
          target: [d.target.x, d.target.y]
        }
        return lineGenerator(data)
      })
      .on('dblclick', function (d) {
        thisGraph.edges.remove(d)
        thisGraph.drawLinks()
      })

    exists.exit().remove()
  }

  draw()
}

// node를 선택한 다음 벌어지는 동작
GraphCreator.prototype.setSelectNode = function setSelectNode (context, data) {
  const consts = this.constants

  if (data) {
    this.stateProxy.selectedNode = data
    d3Selection.select(context)
      .select('use').classed(consts.nodeSelectedClass, true)
  } else {
    this.rectsGroup.selectAll('g.node-wrap').selectAll('use.node-selected')
      .classed(consts.nodeSelectedClass, false)
    this.stateProxy.selectedNode = null
  }
}

GraphCreator.prototype.removeNode = function removeNode (node) {
  const relatedEdges = this.findRelatedEdges(node)
  if (relatedEdges.length) {
    relatedEdges.forEach(edge => this.edges.remove(edge))
  }
  this.nodes.remove(node)
  this.drawGraph()
}

GraphCreator.prototype.findRelatedEdges = function findRelatedEdges (node) {
  return this.edges.findEdges(node)
}

GraphCreator.prototype.zoomed = function zoomed () {
  this.state.justScaleTransGraph = true

  d3Selection.select(`.${this.constants.graphClass}`)
    .attr('transform', d3Selection.event.transform)
}

GraphCreator.prototype.setEditable = function setEditable (status) {
  this.state.editable = status
}

GraphCreator.prototype.save = function save () {
  const saveFile = {
    edges: [],
    nodes: []
  }

  if (this.edges.getEdges().length && this.nodes.getNodes()) {
    saveFile.edges = edgesTransformForSave(this.edges.getEdges())
    saveFile.nodes = nodesTransformForSave(this.nodes.getNodes())

    return JSON.stringify(saveFile)
  }
  return null
}

export default GraphCreator
