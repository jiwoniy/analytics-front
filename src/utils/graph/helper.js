function transformNode (node, isEdges = false) {
  if (isEdges) {
    return {
      id: node.id,
      node_type: node.node_type,
      name: node.name,
      input: node.input,
      output: node.output,
      linkInput: node.linkInput || null,
      linkOutput: node.linkOutput || null,
      position: {
        x: node.x,
        y: node.y
      }
    }
  }
  return {
    id: node.id,
    node_type: node.node_type,
    name: node.name,
    input: node.input,
    output: node.output,
    position: {
      x: node.x,
      y: node.y
    }
  }
}

function saveNodeTransformNode (node, isEdges = false) {
  if (isEdges) {
    return {
      id: node.id,
      node_type: node.node_type,
      input: node.input,
      output: node.output,
      name: node.name,
      linkInput: node.linkInput || null,
      linkOutput: node.linkOutput || null,
      status: {
        moving: false,
        selected: false
      },
      x: node.position.x,
      y: node.position.y
    }
  }

  // console.log('-------')
  // console.log(node)

  return {
    id: node.id,
    node_type: node.node_type,
    input: node.input,
    output: node.output,
    name: node.name,
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
      source: transformNode(source, true),
      target: transformNode(target, true)
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
      source: saveNodeTransformNode(source, true),
      target: saveNodeTransformNode(target, true)
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
