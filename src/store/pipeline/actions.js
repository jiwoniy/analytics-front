export default {
  savePipeline: ({ commit, state }, pipeline) => {
    if (pipeline) {
      // TODO type check
      commit('SAVE_PIPELINE', pipeline)
    }
  }
}
