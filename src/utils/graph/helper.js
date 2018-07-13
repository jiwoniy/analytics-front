function transformNode (node) {
  return {
    id: node.id,
    type: node.id,
    title: node.title,
    input: node.input,
    output: node.output,
    position: {
      x: node.x,
      y: node.y
    }
  }
}

function saveNodeTransformNode (node) {
  return {
    id: node.id,
    type: node.type,
    input: node.input,
    output: node.output,
    title: node.title,
    status: {
      moving: false,
      selected: false
    },
    x: node.position.x,
    y: node.position.y
  }
}

function nodesTransformForSave (nodes) {
  return nodes.map(node => transformNode(node))
}

function edgesTransformForSave (edges) {
  return edges.map(edge => {
    const { source, target } = edge
    return {
      source: transformNode(source),
      target: transformNode(target)
    }
  })
}

function saveNodesTransformToNodes (nodes) {
  return nodes.map(node => saveNodeTransformNode(node))
}

function saveEdgesTransformToEdges (edges) {
  return edges.map(edge => {
    const { source, target } = edge
    return {
      source: saveNodeTransformNode(source),
      target: saveNodeTransformNode(target)
    }
  })
}

export {
  saveNodeTransformNode,
  nodesTransformForSave,
  edgesTransformForSave,
  saveNodesTransformToNodes,
  saveEdgesTransformToEdges
}
