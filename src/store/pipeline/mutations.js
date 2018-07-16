export default {
  SAVE_PIPELINE: (state, pipeline) => {
    if (pipeline) {
      state.pipeline = pipeline
    }
  }
}
