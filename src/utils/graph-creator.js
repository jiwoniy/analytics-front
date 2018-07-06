import * as d3Selection from 'd3-selection'
import * as d3Drag from 'd3-drag'
import * as d3Zoom from 'd3-zoom'

// This source from https://github.com/cjrd/directed-graph-creator

// define graphcreator object
const GraphCreator = function GraphCreatorConstructor (svg, nodes, edges) {
  const thisGraph = this
  thisGraph.idct = 0

  thisGraph.nodes = nodes || []
  thisGraph.edges = edges || []

  thisGraph.state = {
    selectedNode: null,
    selectedEdge: null,
    mouseDownNode: null,
    mouseDownLink: null,
    justDragged: false,
    justScaleTransGraph: false,
    lastKeyDown: -1,
    shiftNodeDrag: false,
    selectedText: null
    // graphMouseDown
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

  // svg nodes and edges
  thisGraph.paths = svgG.append('g').selectAll('g')
  thisGraph.circles = svgG.append('g').selectAll('g')

  thisGraph.drag = d3Drag.drag()
    .subject(function (d) {
      // return { x: d.x, y: d.y }
      return d == null ? {x: d3Selection.event.x, y: d3Selection.event.y} : d
    })
    .on('drag', function (args) {
      thisGraph.state.justDragged = true
      thisGraph.dragmove(thisGraph, args)
    })
    .on('end', function () {
      // todo check if edge-mode is selected
    })

  // listen for key events
  d3Selection.select(window).on('keydown', function () {
    // thisGraph.svgKeyDown(thisGraph
    thisGraph.svgKeyDown()
  }).on('keyup', function () {
    // thisGraph.svgKeyUp(thisGraph)
    thisGraph.svgKeyUp()
  })

  svg.on('mousedown', function (d) {
    thisGraph.svgMouseDown(d)
    thisGraph.svgMouseUp(d)
    // thisGraph.svgMouseDown(thisGraph, d)
    // thisGraph.svgMouseUp(thisGraph, d)
  })

  // TODO check....why...??
  svg.on('mouseup', function (d) {
    thisGraph.svgMouseUp(d)
    // thisGraph.svgMouseUp(thisGraph, d)
  })

  // custom
  // svg.on('addnode', function () {
  //   thisGraph.drawNodeGraph()
  // })

  // svg.on('mouseover', function () {
  // })

  // svg.on('mouseout', function () {
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
        // d3Selection.select('body').style('cursor', 'move')
        d3Selection.select('#svgContainer').style('cursor', 'auto')
      }
    })
    .on('end', function () {
      // d3Selection.select('body').style('cursor', 'auto')
      d3Selection.select('#svgContainer').style('cursor', 'auto')
    })

  svg.call(dragSvg).on('dblclick.zoom', null)

  // listen for resize
  // window.onresize = function windowResize () {
  //   thisGraph.updateWindow(svg)
  // }

  // TODO make additional feature - handle download data
  //   d3.select("#download-input").on("click", function(){
  //     var saveEdges = [];
  //     thisGraph.edges.forEach(function(val, i){
  //       saveEdges.push({source: val.source.id, target: val.target.id});
  //     });
  //     var blob = new Blob([window.JSON.stringify({"nodes": thisGraph.nodes, "edges": saveEdges})], {type: "text/plain;charset=utf-8"});
  //     saveAs(blob, "mydag.json");
  //   });

  // TODO make additional feature - handle uploaded data
  //   d3.select("#upload-input").on("click", function(){
  //     document.getElementById("hidden-file-upload").click();
  //   });
  //   d3.select("#hidden-file-upload").on("change", function(){
  //     if (window.File && window.FileReader && window.FileList && window.Blob) {
  //       var uploadFile = this.files[0];
  //       var filereader = new window.FileReader();

  //       filereader.onload = function(){
  //         var txtRes = filereader.result;
  //         // TODO better error handling
  //         try{
  //           var jsonObj = JSON.parse(txtRes);
  //           thisGraph.deleteGraph(true);
  //           thisGraph.nodes = jsonObj.nodes;
  //           thisGraph.setIdCt(jsonObj.nodes.length + 1);
  //           var newEdges = jsonObj.edges;
  //           newEdges.forEach(function(e, i){
  //             newEdges[i] = {source: thisGraph.nodes.filter(function(n){return n.id == e.source;})[0],
  //                         target: thisGraph.nodes.filter(function(n){return n.id == e.target;})[0]};
  //           });
  //           thisGraph.edges = newEdges;
  //           thisGraph.updateGraph();
  //         }catch(err){
  //           window.alert("Error parsing uploaded file\nerror message: " + err.message);
  //           return;
  //         }
  //       };
  //       filereader.readAsText(uploadFile);

  //     } else {
  //       alert("Your browser won't let you save this graph -- try upgrading your browser to IE 10+ or Chrome or Firefox.");
  //     }
  //   });

  //   // handle delete graph
  //   d3.select("#delete-graph").on("click", function(){
  //     thisGraph.deleteGraph(false);
  //   });
}

GraphCreator.prototype.setIdCt = function setIdCt (idct) {
  this.idct = idct
}

GraphCreator.prototype.constants = {
  graphClass: 'graph',
  defaultTitle: 'random variable',
  selectedClass: 'selected',
  connectClass: 'connect-node',
  circleGClass: 'conceptG',
  activeEditId: 'active-editing',
  BACKSPACE_KEY: 8,
  DELETE_KEY: 46,
  ENTER_KEY: 13,
  nodeRadius: 50
}

/* PROTOTYPE FUNCTIONS */

GraphCreator.prototype.dragmove = function dragmove (d) {
  var thisGraph = this
  if (thisGraph.state.shiftNodeDrag) {
    thisGraph.dragLine.attr('d',
      `M${d.x},${d.y}L${d3Selection.mouse(thisGraph.svgG.node())[0]},${d3Selection.mouse(this.svgG.node())[1]}`)
  } else {
    d.x += d3Selection.event.dx
    d.y += d3Selection.event.dy
    thisGraph.updateGraph()
  }
}

GraphCreator.prototype.deleteGraph = function deleteGraph (skipPrompt) {
  const thisGraph = this
  let doDelete = true
  if (!skipPrompt) {
    doDelete = window.confirm('Press OK to delete this graph')
  }
  if (doDelete) {
    thisGraph.nodes = []
    thisGraph.edges = []
    thisGraph.updateGraph()
  }
}

// /* select all text in element: taken from http://stackoverflow.com/questions/6139107/programatically-select-text-in-a-contenteditable-html-element */
GraphCreator.prototype.selectElementContents = function selectElementContents (el) {
  const range = document.createRange()
  range.selectNodeContents(el)
  const sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
}

// /* insert svg line breaks: taken from http://stackoverflow.com/questions/13241475/how-do-i-include-newlines-in-labels-in-d3-charts */
GraphCreator.prototype.insertTitleLinebreaks = function (gEl, title) {
  const words = title.split(/\s+/g)
  const nwords = words.length
  const el = gEl.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', `-${(nwords - 1) * 7.5}`)

  for (let i = 0; i < words.length; i++) {
    const tspan = el.append('tspan').text(words[i])
    if (i > 0) {
      tspan.attr('x', 0).attr('dy', '15')
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
    thisGraph.edges.splice(thisGraph.edges.indexOf(l), 1)
  })
}

GraphCreator.prototype.replaceSelectEdge = function (d3Path, edgeData) {
  const thisGraph = this
  d3Path.classed(thisGraph.constants.selectedClass, true)
  if (thisGraph.state.selectedEdge) {
    thisGraph.removeSelectFromEdge()
  }
  thisGraph.state.selectedEdge = edgeData
}

GraphCreator.prototype.replaceSelectNode = function (d3Node, nodeData) {
  const thisGraph = this
  d3Node.classed(this.constants.selectedClass, true)
  if (thisGraph.state.selectedNode) {
    thisGraph.removeSelectFromNode()
  }
  thisGraph.state.selectedNode = nodeData
}

GraphCreator.prototype.removeSelectFromNode = function () {
  const thisGraph = this
  thisGraph.circles.filter(function (cd) {
    return cd.id === thisGraph.state.selectedNode.id
  }).classed(thisGraph.constants.selectedClass, false)
  thisGraph.state.selectedNode = null
}

GraphCreator.prototype.removeSelectFromEdge = function () {
  const thisGraph = this
  thisGraph.paths.filter(function (cd) {
    return cd === thisGraph.state.selectedEdge
  }).classed(thisGraph.constants.selectedClass, false)
  thisGraph.state.selectedEdge = null
}

GraphCreator.prototype.pathMouseDown = function pathMouseDown (d3path, d) {
  const thisGraph = this
  const state = thisGraph.state
  d3Selection.event.stopPropagation()
  state.mouseDownLink = d

  if (state.selectedNode) {
    thisGraph.removeSelectFromNode()
  }

  var prevEdge = state.selectedEdge
  if (!prevEdge || prevEdge !== d) {
    thisGraph.replaceSelectEdge(d3path, d)
  } else {
    thisGraph.removeSelectFromEdge()
  }
}

// mousedown on node
GraphCreator.prototype.circleMouseDown = function circleMouseDown (d3node, d) {
  const thisGraph = this
  const state = thisGraph.state
  d3Selection.event.stopPropagation()
  state.mouseDownNode = d
  if (d3Selection.event.shiftKey) {
    state.shiftNodeDrag = d3Selection.event.shiftKey
    // reposition dragged directed edge
    thisGraph.dragLine.classed('hidden', false)
      .attr('d', `M${d.x},${d.y}L${d.x},${d.y}`)
    // return
  }
}

/* place editable text on node in place of svg text */
GraphCreator.prototype.changeTextOfNode = function (d3node, d) {
  const thisGraph = this
  const constants = thisGraph.constants
  const htmlEl = d3node.node()
  d3node.selectAll('text').remove()
  const nodeBCR = htmlEl.getBoundingClientRect()
  const curScale = nodeBCR.width / constants.nodeRadius
  const placePad = 5 * curScale
  const useHW = curScale > 1 ? (nodeBCR.width * 0.71) : (constants.nodeRadius * 1.42)
  // replace with editableconent text
  const d3txt = thisGraph.svg.selectAll('foreignObject')
    .data([d])
    .enter()
    .append('foreignObject')
    .attr('x', nodeBCR.left + placePad)
    .attr('y', nodeBCR.top + placePad)
    .attr('height', 2 * useHW)
    .attr('width', useHW)
    .append('xhtml:p')
    .attr('id', constants.activeEditId)
    .attr('contentEditable', 'true')
    .text(d.title)
    .on('mousedown', function (d) {
      d3Selection.event.stopPropagation()
    })
    .on('keydown', function (d) {
      d3Selection.event.stopPropagation()
      if (d3Selection.event.keyCode === constants.ENTER_KEY && !d3Selection.event.shiftKey) {
        this.blur()
      }
    })
    .on('blur', function (d) {
      d.title = this.textContent
      thisGraph.insertTitleLinebreaks(d3node, d.title)
      d3Selection.select(this.parentElement).remove()
    })
  return d3txt
}

// mouseup on nodes
GraphCreator.prototype.circleMouseUp = function (d3node, d) {
  const thisGraph = this
  const state = thisGraph.state
  const constants = thisGraph.constants
  // reset the states
  state.shiftNodeDrag = false
  d3node.classed(constants.connectClass, false)

  const mouseDownNode = state.mouseDownNode

  if (!mouseDownNode) {
    return
  }

  thisGraph.dragLine.classed('hidden', true)

  if (mouseDownNode !== d) {
    // we're in a different node: create new edge for mousedown edge and add to graph
    const newEdge = {source: mouseDownNode, target: d}
    const filtRes = thisGraph.paths.filter(function (d) {
      if (d.source === newEdge.target && d.target === newEdge.source) {
        thisGraph.edges.splice(thisGraph.edges.indexOf(d), 1)
      }
      return d.source === newEdge.source && d.target === newEdge.target
    })
    if (!filtRes[0].length) {
      thisGraph.edges.push(newEdge)
      thisGraph.updateGraph()
    }
  } else {
    // we're in the same node
    if (state.justDragged) {
      // dragged, not clicked
      state.justDragged = false
    } else {
      // clicked, not dragged
      if (d3Selection.event.shiftKey) {
        // shift-clicked node: edit text content
        const d3txt = thisGraph.changeTextOfNode(d3node, d)
        const txtNode = d3txt.node()
        thisGraph.selectElementContents(txtNode)
        txtNode.focus()
      } else {
        if (state.selectedEdge) {
          thisGraph.removeSelectFromEdge()
        }
        const prevNode = state.selectedNode

        if (!prevNode || prevNode.id !== d.id) {
          thisGraph.replaceSelectNode(d3node, d)
        } else {
          thisGraph.removeSelectFromNode()
        }
      }
    }
  }
  state.mouseDownNode = null
  // return
} // end of circles mouseup

// mousedown on main svg
GraphCreator.prototype.svgMouseDown = function svgMouseDown () {
  this.state.graphMouseDown = true
}

// mouseup on main svg
GraphCreator.prototype.svgMouseUp = function svgMouseUp () {
  const thisGraph = this
  const state = thisGraph.state
  const constants = thisGraph.constants

  if (state.justScaleTransGraph) {
    // dragged not clicked
    state.justScaleTransGraph = false
  } else if (state.graphMouseDown && d3Selection.event.shiftKey) {
    // clicked not dragged from svg
    const xycoords = d3Selection.mouse(thisGraph.svgG.node())
    const d = {
      id: thisGraph.idct++,
      title: constants.defaultTitle,
      x: xycoords[0],
      y: xycoords[1]
    }
    thisGraph.nodes.push(d)
    thisGraph.updateGraph()

    // make title of text immediently editable
    const d3txt = thisGraph.changeTextOfNode(thisGraph.circles.filter(function (dval) {
      return dval.id === d.id
    }), d)
    const txtNode = d3txt.node()
    thisGraph.selectElementContents(txtNode)
    txtNode.focus()
  } else if (state.shiftNodeDrag) {
    // dragged from node
    state.shiftNodeDrag = false
    thisGraph.dragLine.classed('hidden', true)
  }
  state.graphMouseDown = false
}

// .on("mouseleave",function(){
//   d3.select(this)
//     .attr("fill", "red")
//     .transition().duration(1000)
//     .attr("fill", "blue");
// });

// GraphCreator.prototype.drawNodeGraph = function drawNodeGraph () {
// }

// make our logic
GraphCreator.prototype.addNode = function addNode (node) {
  // this.svg.dispatch('addnode')
  const thisGraph = this
  const constants = thisGraph.constants

  // what is "idct"

  // const xycoords = d3Selection.mouse(thisGraph.svgG.node())
  const newNode = {
    id: thisGraph.idct++,
    title: node.title || constants.defaultTitle,
    x: 300,
    y: 300
    // x: xycoords[0],
    // y: xycoords[1]
  }
  // console.log(newNode)
  thisGraph.nodes.push(newNode)
  thisGraph.updateGraph()

  // // make title of text immediently editable
  // const d3txt = thisGraph.changeTextOfNode(thisGraph.circles.filter(function (dval) {
  //   return dval.id === d.id
  // }), d)
  // const txtNode = d3txt.node()
  // thisGraph.selectElementContents(txtNode)
  // txtNode.focus()
}

// keydown on main svg
GraphCreator.prototype.svgKeyDown = function svgKeyDown () {
  const thisGraph = this
  const state = thisGraph.state
  const constants = thisGraph.constants

  // make sure repeated key presses don't register for each keydown
  if (state.lastKeyDown !== -1) {
    return
  }

  state.lastKeyDown = d3Selection.event.keyCode
  const selectedNode = state.selectedNode
  const selectedEdge = state.selectedEdge

  switch (d3Selection.event.keyCode) {
    case constants.BACKSPACE_KEY:
    case constants.DELETE_KEY:
      d3Selection.event.preventDefault()
      if (selectedNode) {
        thisGraph.nodes.splice(thisGraph.nodes.indexOf(selectedNode), 1)
        thisGraph.spliceLinksForNode(selectedNode)
        state.selectedNode = null
        thisGraph.updateGraph()
      } else if (selectedEdge) {
        thisGraph.edges.splice(thisGraph.edges.indexOf(selectedEdge), 1)
        state.selectedEdge = null
        thisGraph.updateGraph()
      }
      break
  }
}

GraphCreator.prototype.svgKeyUp = function svgKeyUp () {
  this.state.lastKeyDown = -1
}

// call to propagate changes to graph
GraphCreator.prototype.updateGraph = function updateGraph () {
  const thisGraph = this
  const consts = thisGraph.constants
  const state = thisGraph.state

  thisGraph.paths = thisGraph.paths.data(thisGraph.edges, function (d) {
    return `${String(d.source.id)}+${String(d.target.id)}`
  })
  const paths = thisGraph.paths

  // update existing paths
  paths.style('marker-end', 'url(#end-arrow)')
    .classed(consts.selectedClass, function (d) {
      return d === state.selectedEdge
    })
    .attr('d', function (d) {
      return `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`
    })

  // add new paths
  paths.enter()
    .append('path')
    .style('marker-end', 'url(#end-arrow)')
    .classed('link', true)
    .attr('d', function (d) {
      return `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`
    })
    .on('mousedown', function (d) {
      thisGraph.pathMouseDown(thisGraph, d3Selection.select(this), d)
    })
    .on('mouseup', function (d) {
      state.mouseDownLink = null
    })

  // remove old links
  paths.exit().remove()

  // update existing nodes
  thisGraph.circles = thisGraph.circles.data(thisGraph.nodes, function (d) {
    return d.id
  })

  thisGraph.circles.attr('transform', function (d) {
    return `translate(${d.x},${d.y})`
  })
  // add new nodes
  const newGs = thisGraph.circles.enter()
    .append('g')

  newGs.classed(consts.circleGClass, true)
    .attr('transform', function (d) {
      return `translate(${d.x},${d.y})`
    })
    .on('mouseover', function (d) {
      if (state.shiftNodeDrag) {
        d3Selection.select(this).classed(consts.connectClass, true)
      }
    })
    .on('mouseout', function (d) {
      d3Selection.select(this).classed(consts.connectClass, false)
    })
    .on('mousedown', function (d) {
      thisGraph.circleMouseDown(d3Selection.select(this), d)
    })
    .on('mouseup', function (d) {
      thisGraph.circleMouseUp(d3Selection.select(this), d)
    })
    .call(thisGraph.drag)

  newGs.append('circle')
    .attr('r', String(consts.nodeRadius))

  newGs.each(function (d) {
    thisGraph.insertTitleLinebreaks(d3Selection.select(this), d.title)
  })

  // remove old nodes
  thisGraph.circles.exit().remove()
}

GraphCreator.prototype.zoomed = function zoomed () {
  this.state.justScaleTransGraph = true

  d3Selection.select(`.${this.constants.graphClass}`)
    .attr('transform', d3Selection.event.transform)
    // .attr('transform', `translate(${d3Selection.event.translate}) scale(${d3Selection.event.scale})`)
}

// TODO change vue element
// GraphCreator.prototype.updateWindow = function updateWindow (svg) {
//   const docEl = document.documentElement
//   const bodyEl = document.getElementsByTagName('body')[0]
//   var x = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth
//   var y = window.innerHeight || docEl.clientHeight || bodyEl.clientHeight
//   svg.attr('width', x).attr('height', y)
// }

// // warn the user when leaving
// window.onbeforeunload = function(){
//   return "Make sure to save your graph locally before leaving :-)";
// };

export default GraphCreator
