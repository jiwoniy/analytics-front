import { normalizeArray } from '@/utils/normalize'

// meta to graph node
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

// graph node to save node
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
  const arr = Object.keys(nodes).map(key => transformNode(nodes[key]))
  // return Object.keys(nodes).map(key => transformNode(nodes[key]))
  return normalizeArray(arr)
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
  return Object.keys(nodes)
    .map(key => nodes[key])
    .map(node => saveNodeTransformNode(node))
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
