import { getNodeId } from '@/utils/normalize'

function GraphNodes (nodes) {
  this.nodes = nodes || {}
}

GraphNodes.prototype.getNodes = function getNodes () {
  return this.nodes
}

GraphNodes.prototype.getNodeList = function getNodeList () {
  return Object.keys(this.nodes).map(key => this.nodes[key])
}

// node add
GraphNodes.prototype.add = function add (node) {
  this.nodes[getNodeId(node)] = node
}

// node remove
GraphNodes.prototype.remove = function remove (node) {
  delete this.nodes[getNodeId(node)]
}

GraphNodes.prototype.setSelectClean = function setSelectClean () {
  const graphNodes = this
  Object.keys(this.nodes).map(key => {
    graphNodes.nodes[key].ui_status.selected = false
  })
}

GraphNodes.prototype.setSelectedNode = function setSelectedNode (selectNode) {
  if (selectNode) {
    if (selectNode.ui_status.selected) {
      this.nodes[selectNode.id].ui_status.selected = false
    } else if (!selectNode.ui_status.selected) {
      this.nodes[selectNode.id].ui_status.selected = true
    }
  } else {
    this.setSelectClean()
  }
}

// GraphNodes.prototype.setUnSelectedNode = function setUnSelectedNode (node, links) {
//   const graphNodes = this
//   return Object.keys(graphNodes.nodes).find(nodeId => {
//     return graphNodes.nodes[nodeId].ui_status.selected === true
//   })
// }

GraphNodes.prototype.findConnectedNode = function findConnectedNode (node, links) {
  const connectNodes = []
  Object.keys(links).forEach(key => {
    const { source, target } = links[key]
    if (source.sourceId === node.id) {
      connectNodes.push(target.targetId)
    } else if (target.targetId === node.id) {
      connectNodes.push(source.sourceId)
    }
    // return source.sourceId === node.id || target.targetId === node.id
  })
  return connectNodes
}

export default GraphNodes
