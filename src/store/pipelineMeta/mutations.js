export default {
  SET_PIPELINES_META: (state, pipelineMeta) => {
    if (pipelineMeta) {
      state.pipelineMeta = pipelineMeta
    }
  }
}
