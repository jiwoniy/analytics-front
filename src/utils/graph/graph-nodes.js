import { getNodeId } from '@/utils/normalize'

function GraphNodes (nodes) {
  this.nodes = nodes || {}
  this.selectNodeId = null
}

GraphNodes.prototype.getNodes = function getNodes () {
  return Object.keys(this.nodes).map(key => this.nodes[key])
}

GraphNodes.prototype.getSelectNodeId = function getSelectNodeId () {
  return this.selectNodeId
}

GraphNodes.prototype.getSelectNode = function getSelectNode () {
  return this.nodes[this.selectNodeId]
}

GraphNodes.prototype.setSelectedNode = function setSelectedNode (selectNode) {
  if (selectNode) {
    // TODO check!!
    if (selectNode.status.selected) {
      // console.log(selectNode)
      this.nodes[selectNode.id].status.selected = false
      this.selectNodeId = null
    } else if (!selectNode.status.selected) {
      this.nodes[selectNode.id].status.selected = true
      this.selectNodeId = selectNode.id
    }
  } else {
    if (this.selectNodeId) {
      this.nodes[this.selectNodeId].status.selected = false
      this.selectNodeId = null
    }
  }
}

GraphNodes.prototype.add = function add (node) {
  this.nodes[getNodeId(node)] = node
}

GraphNodes.prototype.remove = function add (node) {
  delete this.nodes[getNodeId(node)]
}

export default GraphNodes
