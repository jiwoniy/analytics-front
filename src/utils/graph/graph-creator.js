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
import getNodeShape from './getNodeShape'
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
  this.rectsGroup = this.svgG.append('g').classed('node-group', true)

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

GraphCreator.prototype.dragLink = function dragLink (d) {
  const thisGraph = this
  const x = d3Selection.mouse(thisGraph.svgG.node())[0]
  const y = d3Selection.mouse(this.svgG.node())[1]
  // TODO
  thisGraph.dragLine.attr('d',
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

          // when node draging edges also shoud be updated by new position
          context.drawLinks(d)
        // } else {
        //   if (d.output > 0) {
        //     context.state.justDragged = true
        //     context.dragLine.classed('hidden', false)
        //     context.dragLink(d)
        //   }
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

GraphCreator.prototype.canNodeLink = function canNodeLink (source, target) {
  if (this.state.justDragged && target.input > 0 && source.type !== target.type) {
    return true
  }
  return false
}

GraphCreator.prototype.drawNodes = function drawNodes () {
  const thisGraph = this
  const consts = thisGraph.constants

  const datas = thisGraph.nodes.getNodes()
  const exists = d3Selection.select('.node-group').selectAll('g').data(datas, function (d) {
    return d.id
  })

  // exists.classed(thisGraph.constants.selectedClass, d => d.status.selected)

  exists.exit().remove()

  // .node-wrap
  const newGs = exists
    .enter()
    .append('g')

  const nodeDrag = nodeDraghandler(thisGraph)

  newGs.classed(consts.nodeWrapClass, true)
    .attr('transform', function (d) {
      return `translate(${d.x},${d.y})`
    })
    .on('mouseover', function (d) {
      // if (thisGraph.canNodeLink(thisGraph.nodes.getSelectNode(), d)) {
      // d3Selection.select(this).classed(consts.connectClass, true)
      // console.log(this)
      // console.log(d3Selection.select(this).selectAll('.data-input'))
      // thisGraph.state.capturedTarget = d
      // }
    })
    .on('mouseout', function (d) {
      // d3Selection.select(this).classed(consts.nodeHoverClass, false)
      // d3Selection.select(this).select('use')
      //   .classed(consts.nodeHoverClass, false)
      // d3Selection.select(this).classed(consts.connectClass, false)
    })
    .on('click', function (d) {
      thisGraph.setSelectNode(this, d)
    })
    .on('dblclick', function (d) {
      thisGraph.removeNode(d)
    })
    .call((d) => getNodeShape(thisGraph, d))
    .call(nodeDrag)

  // newGs.append('use')
  //   .attr('xlink:href', d => `#nodeShape_${d.input}_${d.output}`)

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
      .classed(consts.nodeSelectedClass, true)
  } else {
    this.rectsGroup.selectAll('.node-selected')
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
