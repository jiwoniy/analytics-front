export default {
  SET_PIPELINES_NODES: (state, pipelineNodes) => {
    if (pipelineNodes) {
      state.pipelineNodes = pipelineNodes
    }
  }
}
