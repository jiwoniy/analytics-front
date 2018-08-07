export default {
  FETCH_META_NODES: (state, { nodes }) => {
    if (nodes) {
      state.nodes = Object.assign({}, state.nodes, {
        ...nodes
      })
    }
  }
}
