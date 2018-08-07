export default {
  getMetaNodesList: state => Object.keys(state.nodes).map(key => state.nodes[key]) || [],
  getMetaNodes: state => state.nodes
}
