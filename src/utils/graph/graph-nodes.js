import { getNodeId } from '@/utils/normalize'

function GraphNodes (nodes) {
  this.nodes = nodes || {}
}

GraphNodes.prototype.getNodeList = function getNodeList () {
  return Object.keys(this.nodes).map(key => this.nodes[key])
}

GraphNodes.prototype.getNodes = function getNodes () {
  return this.nodes
}

GraphNodes.prototype.setSelectClean = function setSelectClean () {
  const that = this
  Object.keys(this.nodes).map(key => {
    that.nodes[key].status.selected = false
  })
}

GraphNodes.prototype.setSelectedNode = function setSelectedNode (selectNode) {
  if (selectNode) {
    if (selectNode.status.selected) {
      this.nodes[selectNode.id].status.selected = false
    } else if (!selectNode.status.selected) {
      this.nodes[selectNode.id].status.selected = true
    }
  } else {
    this.setSelectClean()
  }
}

GraphNodes.prototype.add = function add (node) {
  this.nodes[getNodeId(node)] = node
}

GraphNodes.prototype.remove = function add (node) {
  delete this.nodes[getNodeId(node)]
}

export default GraphNodes
