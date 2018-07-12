function GraphNodes (nodes) {
  this.nodes = nodes || []
  this.selectNodeId = null
}

GraphNodes.prototype.getNodes = function getNodes () {
  return this.nodes
}

GraphNodes.prototype.getSelectNodeId = function getSelectNodeId () {
  return this.selectNodeId
}

GraphNodes.prototype.getSelectNode = function getSelectNode () {
  console.log(this.nodes)
  console.log(this.selectNodeId)
  return this.nodes.find(node => node.id === this.selectNodeId)
}

GraphNodes.prototype.setSelectedNode = function setSelectedNode (selectNode) {
  if (selectNode) {
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
  } else {
    this.selectNodeId = null
  }
}

GraphNodes.prototype.add = function add (node) {
  const thisGraphNodes = this
  thisGraphNodes.nodes.push(node)
}

export default GraphNodes
