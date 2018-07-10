function GraphEdges (edges) {
  this.edges = edges || []
}

GraphEdges.prototype.getNodes = function getNodes () {
  return this.edges
}

GraphEdges.prototype.isDuplicate = function isDuplicate (newEdge) {
  const thisGraphEdges = this
  const result = thisGraphEdges.getNodes().some(existEdge => {
    const { source: existSource, target: existTarget } = existEdge
    const { source: newSource, target: newTarget } = newEdge
    return existSource.id === newSource.id && existTarget.id === newTarget.id
  })
  return result
}

GraphEdges.prototype.add = function add (newEdge) {
  const thisGraphEdges = this
  if (!thisGraphEdges.isDuplicate(newEdge)) {
    thisGraphEdges.edges.push(newEdge)
  }
}

export default GraphEdges
