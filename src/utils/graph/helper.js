// import _cloneDeep from 'lodash.clonedeep'
import { normalizeArray } from '@/utils/normalize'

// Make Copy (precautions: shallow copy vs deep copy)
function nodeTransformSaveNode (node, isLinks = false) {
  if (isLinks) {
    return {
      id: node.id,
      name: node.name,
      node_type: node.node_type,
      input: node.input,
      output: node.output,
      linkInput: node.linkInput || null,
      linkOutput: node.linkOutput || null,
      ui: {
        position: node.position
      }
    }
  }

  return {
    id: node.id,
    node_type: node.node_type,
    name: node.name,
    input: node.input,
    output: node.output,
    ui: {
      position: node.position
    }
  }
}

function nodeTransformSaveNodes (nodes) {
  return normalizeArray(Object.keys(nodes)
    .map(key => nodeTransformSaveNode(nodes[key])))
}

// Make Copy For use UI Node(precautions: shallow copy vs deep copy)
function nodeTransformUiNode (node, isLinks = false) {
  if (isLinks) {
    return {
      id: node.id,
      node_type: node.node_type,
      input: node.input,
      output: node.output,
      name: node.name,
      linkInput: node.linkInput || null,
      linkOutput: node.linkOutput || null,
      position: node.ui.position,
      status: {
        moving: false,
        selected: false
      }
    }
  }

  return {
    id: node.id,
    node_type: node.node_type,
    input: node.input,
    output: node.output,
    name: node.name,
    position: node.ui.position,
    status: {
      moving: false,
      selected: false
    }
  }
}

function nodeTransformUiNodes (nodes) {
  return normalizeArray(Object.keys(nodes)
    .map(key => nodeTransformUiNode(nodes[key])))
}

function linksTransformSaveLink (links) {
  return links.map(link => {
    const { source, target } = link
    return {
      source: nodeTransformSaveNode(source, true),
      target: nodeTransformSaveNode(target, true)
    }
  })
}

function linksTransformUiLinks (links) {
  return links.map(link => {
    const { source, target } = link
    return {
      source: nodeTransformUiNode(source, true),
      target: nodeTransformUiNode(target, true)
    }
  })
}

export {
  nodeTransformUiNode, // save node => UI node
  nodeTransformUiNodes, // save nodes => UI nodes
  nodeTransformSaveNodes, // UI nodes => save nodes
  linksTransformSaveLink, // UI link => save link
  linksTransformUiLinks // UI links => save links
}
