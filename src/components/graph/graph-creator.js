import * as d3Selection from 'd3-selection'
import * as d3Zoom from 'd3-zoom'
import * as d3Shape from 'd3-shape'

import getNodeShape from './graph-shape'
import GraphNodes from './graph-nodes'
import GraphLinks from './graph-links'
import nodeDragHandler from './graph-node-drag-handler'
import zoomHandler from './graph-zoom-handler'
import contextMenu from './graph-context-menu'

import {
  metaNodeToNode,
  nodeTransformUiNodes,
  nodeTransformSaveNodes,
  linksTransformSaveLink,
  linksTransformUiLinks
} from './node-property-transformer'
import { getLinkId } from '@/utils/normalize'

// constructor
const GraphCreator = function GraphCreatorConstructor (svgElem, uParentCompId, { options, externalCallback }) {
  const graphContext = this

  graphContext.options = options || {}
  graphContext.externalCallback = externalCallback || null
  graphContext.width = options.width || null
  graphContext.height = options.height || null

  graphContext.nodes = new GraphNodes()
  graphContext.links = new GraphLinks()

  graphContext.state = {
    uParentCompId: uParentCompId || 1,
    unLock: false,
    selectedNode: null,
    connectedNodes: [],
    isUpdated: false, // watch for to determine wheter to save or not
    connecting: false,
    capturedTarget: null,
    currentZoomTransform: { k: 0, x: 0, y: 0 },
    justScaleTransGraph: false,
    lastKeyDown: -1,
    shiftNodeDrag: false,
    selectedText: null
  }

  // state proxy
  const stateProxyHandler = {
    set (target, key, value) {
      target[key] = value
      if (key === 'selectedNode') {
        if (graphContext.externalCallback && graphContext.externalCallback.node_select) {
          graphContext.nodes.setSelectedNode(value)
          // highlight select node
          graphContext.drawGraph({ node: true, needUpdate: false })
          graphContext.externalCallback.node_select(value)
        }
      } else if (key === 'isUpdated') {
        if (graphContext.externalCallback && graphContext.externalCallback.watch_update) {
          graphContext.externalCallback.watch_update(value, uParentCompId)
        }
      }
      return true
    }
  }

  graphContext.stateProxy = new Proxy(graphContext.state, stateProxyHandler)
  graphContext.svgElem = svgElem
  graphContext.graphGroup = svgElem.select('#graphGroup')

  // displayed when dragging between nodes
  graphContext.dragLine = graphContext.svgElem.append('path')
    .attr('class', 'draglink hidden')
    .attr('d', 'M0,0L0,0')
    .style('marker-end', 'url(#marker-arrow)')

  graphContext.linkGroup = graphContext
    .graphGroup.append('g').classed(graphContext.constants.linkGroupClass, true)
  graphContext.nodeGroup = graphContext
    .graphGroup.append('g').classed(graphContext.constants.nodeGroupClass, true)

  if (options.saveFile) {
    const file = options.saveFile
    const { nodes, links } = file
    graphContext.nodes = new GraphNodes(nodeTransformUiNodes(nodes))
    graphContext.links = new GraphLinks(linksTransformUiLinks(links))
    graphContext.drawGraph({ needUpdate: false, link: true, node: true })
  }

  const zoomingHandler = zoomHandler(graphContext)
  graphContext.svgElem
    .on('mousedown', function () {
      if (d3Selection.event.target.id === 'svgElem') {
        graphContext.setSelectNode(this, null)
        const existMenu = d3Selection.select('.menu-item')
        if (existMenu.size() > 0) {
          existMenu.remove()
        }
      }
    })
    .call(zoomingHandler)
    .on('dblclick.zoom', null)

  // context menu
  graphContext.nodeMenu = contextMenu(graphContext.graphGroup, 'node').items({
    id: 'node-1',
    name: 'Delete',
    callback: (node) => {
      const result = graphContext.findRelatedLinks(node)
      graphContext.nodes.remove(node)
      result.forEach(function (link) {
        graphContext.links.remove(link)
      })
      graphContext.stateProxy.isUpdated = true
      graphContext.drawGraph({ needUpdate: false, link: true, node: true })
    }
  })

  graphContext.linkMenu = contextMenu(graphContext.graphGroup, 'link').items({
    id: 'link-1',
    name: 'Delete',
    callback: (link) => {
      graphContext.links.remove(link)
      graphContext.drawGraph({ link: true })
    }
  })

  // define method
  graphContext.getUParentCompId = function getUParentCompId () {
    return graphContext.state.uParentCompId
  }

  function getWidth () {
    return graphContext.width
  }

  graphContext.setWidth = function setWidth (width) {
    graphContext.width = width
  }

  function getHeight () {
    return graphContext.height
  }

  graphContext.setHeight = function setHeight (height) {
    graphContext.height = height
  }

  graphContext.setUnlock = function setUnlock (status, uParentCompId) {
    if (uParentCompId === graphContext.state.uParentCompId) {
      graphContext.state.unLock = status
    }
  }

  graphContext.isUnLock = function isUnLock () {
    return graphContext.state.unLock
  }

  // graphContext.getIsUpdated = function getIsUpdated () {
  //   return graphContext.stateProxy.isUpdated
  // }

  // graphContext.setUpdated = function setUpdated () {
  //   graphContext.stateProxy.isUpdated = false
  // }

  graphContext.addNode = function addNode (node) {
    if (graphContext.isUnLock()) {
      graphContext.nodes.add(metaNodeToNode(node))
      graphContext.drawGraph({ needUpdate: true, node: true })
    }
  }

  graphContext.redraw = function redraw ({ updateObject, updateType, pipeline }) {
    // remove
    graphContext.nodeGroup.selectAll('g').remove()
    graphContext.linkGroup.selectAll('path').remove()

    if (pipeline) {
      // set new value
      graphContext.nodes = new GraphNodes(nodeTransformUiNodes(pipeline.nodes))
      graphContext.links = new GraphLinks(linksTransformUiLinks(pipeline.links))
    }

    graphContext.drawGraph({ needUpdate: false, node: true, link: true })
    // // draw
    // if (updateObject === 'pipeline') {
    //   graphContext.drawGraph({ needUpdate: false, node: true, link: true })
    // } else if (updateObject === 'node' && updateType === 'update') {
    //   graphContext.drawGraph({ needUpdate: false, node: true, link: true })
    // }
  }

  graphContext.save = function save () {
    const saveFile = {
      links: [],
      nodes: []
    }

    if (graphContext.nodes.getNodeList().length) {
      saveFile.links = linksTransformSaveLink(graphContext.links.getLinks())
      saveFile.nodes = nodeTransformSaveNodes(graphContext.nodes.getNodes())
      graphContext.stateProxy.isUpdated = false
      return saveFile
    }
    return null
  }

  graphContext.initZoomState = function initZoomState () {
    const initState = d3Zoom.zoomIdentity.translate(0, 0).scale(1)
    graphContext.svgElem.call(zoomingHandler.transform, initState)
  }

  return {
    getUParentCompId: graphContext.getUParentCompId,
    getWidth,
    setWidth: graphContext.setWidth,
    getHeight,
    setHeight: graphContext.setHeight,
    addNode: graphContext.addNode,
    save: graphContext.save,
    setUnlock: graphContext.setUnlock,
    isUnLock: graphContext.isUnLock,
    // isUpdated: graphContext.getIsUpdated,
    // setUpdated: graphContext.setUpdated,
    setZoomInit: graphContext.initZoomState,
    redraw: graphContext.redraw
  }
}

// prototype property
GraphCreator.prototype.constants = {
  nodeGroupClass: 'node-group',
  linkGroupClass: 'link-group',
  connectLinkClass: 'connect-link',
  nodeWrapClass: 'node-wrap',
  nodeHoverClass: 'node-hover',
  nodeSelectedClass: 'node-selected',
  nodeConnectedClass: 'node-connected'
}

GraphCreator.prototype.drawGraph =
  function drawGraph ({ needUpdate = true, link = false, node = false, nodeParam }) {
    const graphContext = this
    if (link && node) {
      graphContext.drawNodes()
      graphContext.drawLinks()
    } else if (link) {
      if (nodeParam) {
        graphContext.drawLinks(nodeParam)
      } else {
        graphContext.drawLinks()
      }
    } else if (node) {
      graphContext.drawNodes()
    }

    if (needUpdate) {
      graphContext.stateProxy.isUpdated = true
    }
  }

// draw node
GraphCreator.prototype.drawNodes = function drawNodes () {
  const graphContext = this

  const nodeDrag = nodeDragHandler(graphContext)
  const exists = graphContext.nodeGroup.selectAll('g')
    .data(graphContext.nodes.getNodeList(), function (d) {
      return d.id
    })

  // update
  exists
    .classed(graphContext.constants.nodeSelectedClass, d => d.ui_status.selected)
    .classed(graphContext.constants.nodeConnectedClass, d => {
      return graphContext.state.connectedNodes.some(function (id) {
        return id === d.id
      })
    })
    .call(graphContext.appendText)

  // enter
  const newNodes = exists
    .enter()
    .append('g')
    .classed(graphContext.constants.nodeWrapClass, true)

  newNodes
    .attr('transform', d => `translate(${d.position.x},${d.position.y})`)
    .on('click', d => graphContext.setSelectNode(this, d))
    .on('contextmenu', function (d) {
      if (graphContext.isUnLock()) {
        // Stop browser the context menu
        d3Selection.event.preventDefault()
        const mousePosition = d3Selection.mouse(this.parentNode)
        graphContext.nodeMenu(mousePosition[0], mousePosition[1], { node: d })
      }
    })
    .call(nodeDrag)
    .call(d => getNodeShape(graphContext, d, graphContext.options.connectValidation))
    .call(graphContext.appendText)

  // remove
  exists.exit().remove()
}

// draw link
const linkLineGenerator = d3Shape.linkHorizontal()
GraphCreator.prototype.drawLinks = function drawLinks (dragingNode) {
  const graphContext = this

  function draw (nodes) {
    const exists = graphContext.linkGroup
      .selectAll('path').data(graphContext.links.getLinkList(), d => getLinkId(d))

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

        return linkLineGenerator(data)
      })

    // enter
    const newLinks = exists
      .enter()
      .append('path')
      .classed(graphContext.constants.connectLinkClass, true)

    newLinks
      .attr('d', function (d) {
        const { source, target } = d
        const sourceNode = nodes[source.sourceId]
        const targetNode = nodes[target.targetId]
        const data = {
          source: [sourceNode.position.x + source.linkOutput.cx, sourceNode.position.y + source.linkOutput.cy],
          target: [targetNode.position.x + target.linkInput.cx, targetNode.position.y + target.linkInput.cy]
        }
        return linkLineGenerator(data)
      })
      .on('contextmenu', function (d) {
        if (graphContext.isUnLock()) {
          // Stop the context menu
          d3Selection.event.preventDefault()
          const mousePosition = d3Selection.mouse(this)
          graphContext.linkMenu(mousePosition[0], mousePosition[1], { link: d })
        }
      })

    // remove
    exists.exit().remove()
  }

  const nodes = graphContext.nodes.getNodes()
  draw(nodes)
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

GraphCreator.prototype.setSelectNode = function setSelectNode (context, data) {
  const graphContext = this
  graphContext.setUnSelectNode()
  graphContext.state.connectedNodes = []

  if (data) {
    const isSelected = data.ui_status.selected
    const connectedNodesIds = graphContext.findConnectedNode(data)
    graphContext.state.connectedNodes = connectedNodesIds

    this.stateProxy.selectedNode = isSelected ? null : data
  } else {
    this.stateProxy.selectedNode = null
  }
}

GraphCreator.prototype.setUnSelectNode = function setUnSelectNode () {
  const graphContext = this
  graphContext.nodes.setSelectClean()
}

GraphCreator.prototype.findConnectedNode = function findConnectedNode (node) {
  const graphContext = this

  return this.nodes.findConnectedNode(node, graphContext.links.getLinks())
}

GraphCreator.prototype.findRelatedLinks = function findRelatedLinks (node) {
  return this.links.findLinks(node)
}

export default GraphCreator
