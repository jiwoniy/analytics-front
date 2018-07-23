import * as d3Selection from 'd3-selection'
import * as d3Drag from 'd3-drag'
import * as d3Zoom from 'd3-zoom'
// import * as d3Force from 'd3-force'
import * as d3Shape from 'd3-shape'

// import onChange from '@/helper/onChange'
import { getEdgeId } from '@/utils/normalize'

import {
  saveNodeTransformNode,
  nodesTransformForSave,
  edgesTransformForSave,
  saveNodesTransformToNodes,
  saveEdgesTransformToEdges
} from './helper'
import getNodeShape from './getNodeShape'
import GraphNodes from './graph-nodes'
import GraphEddes from './graph-edges'
// import contextMenu from './context-menu'

// This source from https://github.com/cjrd/directed-graph-creator
const GraphCreator = function GraphCreatorConstructor (svg, { options, callback }) {
  const thisGraph = this

  this.options = options || {}
  this.callback = callback || null
  this.width = options.width || null
  this.height = options.height || null

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
    connecting: false,
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
        if (thisGraph.callback && thisGraph.callback.node_select) {
          thisGraph.nodes.setSelectedNode(value)
          thisGraph.callback.node_select(value)
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
    .attr('class', 'link hidden')
    .attr('d', 'M0,0L0,0')
    .style('marker-end', 'url(#marker-arrow)')

  this.pathsGroup = this.svgG.append('g').classed('path-group', true)
  this.nodesGroup = this.svgG.append('g').classed('node-group', true)

  if (options.saveFile) {
    const file = JSON.parse(options.saveFile)
    this.nodes = new GraphNodes(saveNodesTransformToNodes(file.nodes))
    this.edges = new GraphEddes(saveEdgesTransformToEdges(file.edges))

    this.drawNodes()
    this.drawLinks()
  }

  // listen for key events
  d3Selection.select(window)
    .on('keydown', function () {
      thisGraph.svgKeyDown()
    })
    .on('keyup', function () {
      thisGraph.svgKeyUp()
    })

  // const menu = contextMenu().items('first item', 'second option', 'whatever, man')
  this.svg
    .on('mousedown', function () {
      // console.log(d3Selection.event.buttons)
      thisGraph.setSelectNode(this, null)
    })
    // var x = event.buttons;
    // .on('contextmenu', function () {
    //   d3Selection.event.preventDefault()
    // menu(d3Selection.mouse(this)[0], d3Selection.mouse(this)[1])
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

  this.setWidth = function setWidth (payload) {
    thisGraph.width = payload
  }

  function getWidth () {
    return thisGraph.width
  }

  this.setHeight = function setHeight (payload) {
    thisGraph.height = payload
  }

  function getHeight () {
    return thisGraph.height
  }

  this.setEditable = function setEditable (status) {
    thisGraph.state.editable = status
  }

  this.addNode = function addNode (node) {
    if (thisGraph.state.editable) {
      thisGraph.nodes.add(saveNodeTransformNode(node))
      thisGraph.drawNodes()
    }
  }

  this.save = function save (node) {
    const saveFile = {
      edges: [],
      nodes: []
    }

    if (thisGraph.edges.getEdges().length || thisGraph.nodes.getNodes()) {
      saveFile.edges = edgesTransformForSave(thisGraph.edges.getEdges())
      saveFile.nodes = nodesTransformForSave(thisGraph.nodes.getNodes())

      return JSON.stringify(saveFile)
    }
    return null
  }

  return {
    addNode: this.addNode,
    save: this.save,
    setEditable: this.setEditable,
    setWidth: this.setWidth,
    getWidth,
    setHeight: this.setHeight,
    getHeight
  }
}

GraphCreator.prototype.constants = {
  // graphClass: 'graph',
  // defaultTitle: 'random variable',
  selectedClass: 'selected',
  // circleGClass: 'conceptG',
  // rectGClass: 'conceptG',
  nodeGClass: 'node-group',
  nodeWrapClass: 'node-wrap',
  nodeHoverClass: 'node-hover',
  nodeSelectedClass: 'node-selected',
  connectClass: 'connect-node',
  activeEditId: 'active-editing',
  BACKSPACE_KEY: 8,
  DELETE_KEY: 46,
  ENTER_KEY: 13,
  nodeRadius: 50
}

GraphCreator.prototype.state = {
  editable: false,
  selectedNode: null,
  contextNode: null,
  selectedEdge: null,
  mouseDownNode: null,
  mouseDownLink: null,
  justDragged: false,
  connecting: false,
  capturedTarget: null,
  justScaleTransGraph: false,
  lastKeyDown: -1,
  shiftNodeDrag: false,
  selectedText: null
}

GraphCreator.prototype.dragLink = function dragLink (d) {
  const x = d3Selection.mouse(this.svgG.node())[0]
  const y = d3Selection.mouse(this.svgG.node())[1]
  // TODO
  this.dragLine.attr('d',
    `M${d.x},${d.y}L${x},${y}`)
}

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

// remove edges associated with a node
GraphCreator.prototype.spliceLinksForNode = function spliceLinksForNode (node) {
  const thisGraph = this
  const toSplice = thisGraph.edges.filter(function (l) {
    return (l.source === node || l.target === node)
  })
  toSplice.map(function (l) {
    // thisGraph.edges.splice(thisGraph.edges.indexOf(l), 1)
  })
}

// Important Node drag handler
function nodeDraghandler (context) {
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
          // move node
          d3Selection.select(this)
            .attr('transform', `translate(${d3Selection.event.x}, ${d3Selection.event.y})`)
          d.x = d3Selection.event.x
          d.y = d3Selection.event.y

          context.drawLinks(d)
        }
      }
    })
    // .on('end', function (d) {
    //   if (context.state.editable) {
    //     if (context.state.justDragged) {
    //       context.state.justDragged = false
    //       context.dragLine.classed('hidden', true)
    //       if (context.state.capturedTarget) {
    //         const newEdge = {
    //           source: d,
    //           target: context.state.capturedTarget
    //         }
    //         context.edges.add(newEdge)
    //         context.drawLinks()
    //         context.state.capturedTarget = null
    //       }
    //     }
    //   }
    // })
}

// call to propagate changes to graph
GraphCreator.prototype.drawGraph = function drawGraph () {
  const thisGraph = this
  thisGraph.drawLinks()
  thisGraph.drawNodes()
}

GraphCreator.prototype.canNodeLink = function canNodeLink (source, target) {
  if (this.state.justDragged && target.input > 0 && source.id !== target.id) {
    return true
  }
  return false
}

GraphCreator.prototype.drawNodes = function drawNodes () {
  const thisGraph = this
  const consts = thisGraph.constants

  const datas = thisGraph.nodes.getNodes()

  const exists = this.nodesGroup.selectAll('g').data(datas, function (d) {
    return d.id
  })

  // exists.classed(thisGraph.constants.selectedClass, d => d.status.selected)
  const nodeDrag = nodeDraghandler(thisGraph)
  // .node-wrap
  const newGs = exists
    .enter()
    .append('g')
    .classed(consts.nodeWrapClass, true)

  newGs
    .attr('transform', function (d) {
      return `translate(${d.x},${d.y})`
    })
    // .on('mouseover', function (d) {})
    // .on('mouseout', function (d) {})
    .on('click', function (d) {
      thisGraph.setSelectNode(this, d)
    })
    .on('dblclick', function (d) {
      thisGraph.removeNode(d)
    })
    .call(nodeDrag)
    .call(d => getNodeShape(thisGraph, d, thisGraph.options.connectValidation))

  newGs.each(function (d) {
    thisGraph.appendText(d3Selection.select(this), d.name)
  })

  this.nodesGroup.exit().remove()
}

GraphCreator.prototype.drawLinks = function drawLinks (dragingNode) {
  const thisGraph = this

  function draw () {
    const lineGenerator = d3Shape.linkHorizontal()

    const exists = d3Selection.select('.path-group').selectAll('path').data(thisGraph.edges.getEdges(), function (d) {
      return getEdgeId(d)
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
          source: [d.source.x + d.source.linkOutput.cx, d.source.y + d.source.linkOutput.cy],
          target: [d.target.x + d.target.linkInput.cx, d.target.y + d.target.linkInput.cy]
          // source: [d.source.x, d.source.y],
          // target: [d.target.x, d.target.y]
        }

        return lineGenerator(data)
      })

    // enter
    exists.enter()
      .append('path')
      .classed('link', true)
      .attr('d', function (d) {
        const data = {
          source: [d.source.x + d.source.linkOutput.cx, d.source.y + d.source.linkOutput.cy],
          target: [d.target.x + d.target.linkInput.cx, d.target.y + d.target.linkInput.cy]
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
      .classed(consts.nodeSelectedClass, true)
  } else {
    this.nodesGroup.selectAll('.node-selected')
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

export default GraphCreator
