export default {
  SET_PIPELINE: (state, pipeline) => {
    if (pipeline) {
      state.pipeline = pipeline
    }
  }
}
