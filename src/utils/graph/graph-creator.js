import * as d3Selection from 'd3-selection'
import * as d3Drag from 'd3-drag'
import * as d3Zoom from 'd3-zoom'
import * as d3Shape from 'd3-shape'
// import * as d3Force from 'd3-force'

import getNodeShape from './graph-shape'
import GraphNodes from './graph-nodes'
import GraphLinks from './graph-links'

import { getLinkId } from '@/utils/normalize'
import {
  nodeTransformUiNode,
  nodeTransformUiNodes,
  nodeTransformSaveNodes,
  linksTransformSaveLink,
  linksTransformUiLinks
} from './helper'
// import contextMenu from './context-menu'

// This source from https://github.com/cjrd/directed-graph-creator
const GraphCreator = function GraphCreatorConstructor (svg, { options, callback }) {
  const thisGraph = this

  this.options = options || {}
  this.callback = callback || null
  this.width = options.width || null
  this.height = options.height || null

  this.nodes = new GraphNodes()
  this.links = new GraphLinks()

  this.state = {
    editable: false,
    selectedNode: null,
    isUpdated: false, // watch this for to determine wheter to save or not
    contextNode: null,
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
          // To highlight select node
          thisGraph.drawGraph({ node: true, needUpdate: false })
          thisGraph.callback.node_select(value)
        }
      } else if (key === 'isUpdated') {
        if (thisGraph.callback && thisGraph.callback.watch_update) {
          thisGraph.callback.watch_update(value)
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
    // const file = JSON.parse(options.saveFile)
    const file = options.saveFile
    this.nodes = new GraphNodes(nodeTransformUiNodes(file.nodes))
    this.links = new GraphLinks(linksTransformUiLinks(file.links))
    this.drawGraph({ needUpdate: false, link: true, node: true })
  }

  const dragSvg = d3Zoom.zoom()
    .on('zoom', function () {
      thisGraph.zoomed()
    })
    .on('start', function () {
      thisGraph.svg.style('cursor', 'move')
    })
    .on('end', function () {
      thisGraph.svg.style('cursor', 'auto')
    })

  // const menu = contextMenu().items('first item', 'second option', 'whatever, man')
  this.svg
    .on('mousedown', function () {
      thisGraph.setSelectNode(this, null)
    })
    // .on('mouseup', function (d) {
    // thisGraph.svgMouseUp(this, null)
    // })
    .call(dragSvg)
    .on('dblclick.zoom', null)

  // listen for dragging
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

  this.isEditable = function isEditable () {
    return thisGraph.state.editable
  }

  this.getIsUpdated = function getIsUpdated () {
    return thisGraph.stateProxy.isUpdated
  }

  this.setUpdated = function setUpdated () {
    thisGraph.stateProxy.isUpdated = false
  }

  this.addNode = function addNode (node) {
    if (thisGraph.isEditable()) {
      thisGraph.nodes.add(nodeTransformUiNode(node))
      thisGraph.drawGraph({ node: true })
    }
  }

  this.redraw = function redraw ({ updateObject, updateType, pipeline }) {
    thisGraph.nodesGroup.selectAll('g').remove()
    thisGraph.pathsGroup.selectAll('path').remove()

    thisGraph.nodes = new GraphNodes(nodeTransformUiNodes(pipeline.nodes))
    thisGraph.links = new GraphLinks(linksTransformUiLinks(pipeline.links))

    if (updateObject === 'pipeline') {
      thisGraph.drawGraph({ needUpdate: false, node: true, link: true })
    } else if (updateObject === 'node' && updateType === 'update') {
      thisGraph.drawGraph({ needUpdate: false, node: true, link: false })
    } else if (updateObject === 'node' && updateType === 'delete') {
      thisGraph.drawGraph({ needUpdate: false, node: true, link: true })
    }
  }

  this.save = function save (node) {
    const saveFile = {
      links: [],
      nodes: []
    }

    if (thisGraph.links.getLinkList().length || thisGraph.nodes.getNodeList().length) {
      saveFile.links = linksTransformSaveLink(thisGraph.links.getLinks())
      saveFile.nodes = nodeTransformSaveNodes(thisGraph.nodes.getNodes())

      thisGraph.stateProxy.isUpdated = false
      return saveFile
    }
    return null
  }

  this.initZoomState = function initZoomState () {
    const t = d3Zoom.zoomIdentity.translate(0, 0).scale(1)
    thisGraph.svg.call(dragSvg.transform, t)
  }

  return {
    addNode: this.addNode,
    save: this.save,
    setEditable: this.setEditable,
    isEditable: this.isEditable,
    isUpdated: this.getIsUpdated,
    setUpdated: this.setUpdated,
    setWidth: this.setWidth,
    setZoomInit: this.initZoomState,
    getWidth,
    setHeight: this.setHeight,
    getHeight,
    redraw: this.redraw
  }
}

GraphCreator.prototype.constants = {
  selectedClass: 'selected',
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

// Important Node drag handler
function nodeDraghandler (context) {
  return d3Drag.drag()
    .subject(function (d) {
      return { x: d.position.x, y: d.position.y }
    })
    .on('start', function (d) {
      if (context.isEditable()) {
        d.status.moving = true
      }
    })
    .on('drag', function (d) {
      if (context.isEditable()) {
        if (!d.status.selected) {
          // move node
          d3Selection.select(this)
            .attr('transform', `translate(${d3Selection.event.x}, ${d3Selection.event.y})`)
          d.position.x = d3Selection.event.x
          d.position.y = d3Selection.event.y

          context.drawGraph({ node: true, link: true })
        }
      }
    })
    .on('end', function (d) {
      if (context.isEditable()) {
        if (!d.status.selected) {
          d.status.moving = false
        }
      }
    })
}

// called by addNode, removeNode, drageNode, add & remove link
GraphCreator.prototype.drawGraph = function drawGraph ({ needUpdate = true, link = false, node = false, nodeParam }) {
  const thisGraph = this
  if (link && node) {
    thisGraph.drawLinks()
    thisGraph.drawNodes()
  } else if (link) {
    if (nodeParam) {
      thisGraph.drawLinks(nodeParam)
    } else {
      thisGraph.drawLinks()
    }
  } else if (node) {
    thisGraph.drawNodes()
  }

  if (needUpdate) {
    thisGraph.stateProxy.isUpdated = true
  }
}

GraphCreator.prototype.drawNodes = function drawNodes () {
  const thisGraph = this
  const consts = thisGraph.constants
  const datas = thisGraph.nodes.getNodeList()

  // TODO exists와 newGs의 분리
  // filter가 가능한 부분?
  const exists = this.nodesGroup.selectAll('g')
    .data(datas, function (d) {
      return d.id
    })

  const nodeDrag = nodeDraghandler(thisGraph)
  exists
    .classed(thisGraph.constants.nodeSelectedClass, d => d.status.selected)
    .call(thisGraph.appendText)

  const newGs = exists
    .enter()
    .append('g')
    .classed(consts.nodeWrapClass, true)

  newGs
    .attr('transform', function (d) {
      return `translate(${d.position.x},${d.position.y})`
    })
    .on('click', function (d) {
      thisGraph.setSelectNode(this, d)
    })
    .call(nodeDrag)
    .call(d => getNodeShape(thisGraph, d, thisGraph.options.connectValidation))
  newGs.call(thisGraph.appendText)

  exists.exit().remove()
}

GraphCreator.prototype.appendText = function appendText (nodes) {
  nodes.append('text')
    .attr('transform', 'translate(100, 30)') // rect size is 200, 50
    .classed('dotme', true)
    .text(function (d) {
      // lenght < 17
      const text = d.name
      let result = text
      if (text.length > 16) {
        result = `${text.slice(0, 20)}...`
      }
      return result
    })
}

GraphCreator.prototype.drawLinks = function drawLinks (dragingNode) {
  const thisGraph = this

  function draw (nodes) {
    const lineGenerator = d3Shape.linkHorizontal()

    const exists = thisGraph.pathsGroup
      .selectAll('path').data(thisGraph.links.getLinkList(), function (d) {
        return getLinkId(d)
      })

    // update
    exists
      .attr('d', function (d) {
        const { source, target } = d
        const sourceNode = nodes[source.sourceId]
        const targetNode = nodes[target.targetId]

        if (dragingNode) { // draging node
          if (dragingNode.id === d.source.sourceId) {
            sourceNode.position.x = dragingNode.position.x
            sourceNode.position.y = dragingNode.position.y
          } else if (dragingNode.id === d.target.targetId) {
            targetNode.position.x = dragingNode.position.x
            targetNode.position.y = dragingNode.position.y
          }
        }

        const data = {
          source: [sourceNode.position.x + source.linkOutput.cx, sourceNode.position.y + source.linkOutput.cy],
          target: [targetNode.position.x + target.linkInput.cx, targetNode.position.y + target.linkInput.cy]
        }

        return lineGenerator(data)
      })

    // enter
    exists.enter()
      .append('path')
      .classed('link', true)
      .attr('d', function (d) {
        const { source, target } = d
        const sourceNode = nodes[source.sourceId]
        const targetNode = nodes[target.targetId]
        const data = {
          source: [sourceNode.position.x + source.linkOutput.cx, sourceNode.position.y + source.linkOutput.cy],
          target: [targetNode.position.x + target.linkInput.cx, targetNode.position.y + target.linkInput.cy]
        }
        return lineGenerator(data)
      })
      .on('dblclick', function (d) {
        if (thisGraph.isEditable()) {
          thisGraph.links.remove(d)
          thisGraph.drawGraph({ link: true })
        }
      })

    // remove
    exists.exit().remove()
  }

  const nodes = thisGraph.nodes.getNodes()
  draw(nodes)
}

GraphCreator.prototype.setSelectNode = function setSelectNode (context, data) {
  if (data) {
    const isSelected = data.status.selected
    this.stateProxy.selectedNode = isSelected ? null : data
  } else {
    this.stateProxy.selectedNode = null
  }
}

GraphCreator.prototype.findRelatedLinks = function findRelatedLinks (node) {
  return this.links.findLinks(node)
}

GraphCreator.prototype.zoomed = function zoomed () {
  this.state.justScaleTransGraph = true

  this.svgG.attr('transform', d3Selection.event.transform)
}

// GraphCreator.prototype.svgMouseDown = function svgMouseDown () {
// console.log('--mouse down--')
//   this.state.graphMouseDown = true
// const t = d3Zoom.zoomIdentity.translate(0, 0).scale(1)
// console.log(d3Selection(this).transform)
// console.log(t)
// this.svgG.call(() => d3Selection.transform, t)
// }

// GraphCreator.prototype.svgMouseUp = function svgMouseUp () {
//   if (this.state.justScaleTransGraph) {
//     this.state.justScaleTransGraph = false
//   }

//   this.state.graphMouseDown = false
// }

export default GraphCreator
