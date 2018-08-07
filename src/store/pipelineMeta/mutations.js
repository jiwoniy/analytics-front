export default {
  FETCH_PIPELINES_META: (state, pipelineMeta) => {
    if (pipelineMeta) {
      state.pipelineMeta = pipelineMeta
    }
  }
}
