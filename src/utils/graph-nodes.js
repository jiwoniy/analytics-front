function GraphNodes (nodes) {
  this.nodes = nodes || []
  this.selectNodeId = null
}

GraphNodes.prototype.getNodes = function getNodes () {
  return this.nodes
}

GraphNodes.prototype.getSelectNode = function getSelectNode () {
  return this.selectNodeId
}

GraphNodes.prototype.setSelectedNode = function setSelectedNode (selectNode) {
  this.nodes.forEach(node => {
    if (selectNode.id === node.id && node.status.selected) {
      node.status.selected = false
      this.selectNodeId = null
    } else if (selectNode.id === node.id && !node.status.selected) {
      node.status.selected = true
      this.selectNodeId = selectNode.id
    } else {
      node.status.selected = false
      this.selectNodeId = null
    }
  })
}

GraphNodes.prototype.add = function add (node) {
  const thisGraphNodes = this
  thisGraphNodes.nodes.push(node)
}

export default GraphNodes
