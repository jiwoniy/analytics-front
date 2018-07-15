import { getEdgeId } from '@/utils/normalize'

function GraphEdges (edges) {
  this.edges = edges || {}
}

GraphEdges.prototype.getEdges = function getEdges () {
  return Object.keys(this.edges).map(key => this.edges[key])
}

GraphEdges.prototype.isDuplicate = function isDuplicate (newEdge) {
  if (this.edges[getEdgeId(newEdge)]) {
    return true
  }

  return false
}

GraphEdges.prototype.findEdges = function findEdges (node) {
  const results = Object.keys(this.edges)
    .map(key => this.edges[key])
    .filter(edge => {
      return edge.sourceId === node.id || edge.targetId === node.id
    })
  return results
}

GraphEdges.prototype.add = function add (edge) {
  const thisGraphEdges = this
  if (!thisGraphEdges.isDuplicate(edge)) {
    thisGraphEdges.edges[getEdgeId(edge)] = {
      ...edge,
      sourceId: edge.source.id,
      targetId: edge.target.id
    }
  }
}

GraphEdges.prototype.remove = function add (edge) {
  delete this.edges[getEdgeId(edge)]
}

export default GraphEdges
