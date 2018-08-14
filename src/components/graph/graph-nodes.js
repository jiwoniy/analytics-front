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

GraphNodes.prototype.findConnectedNode = function findConnectedNode (node, links) {
  return Object.keys(links).filter(key => {
    const { source, target } = links[key]
    return source.sourceId === node.id || target.targetId === node.id
  })
}

export default GraphNodes
