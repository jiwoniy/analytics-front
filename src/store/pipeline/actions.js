export default {
  setPipeline: ({ commit, state }, pipeline) => {
    if (pipeline) {
      // TODO type check
      commit('SET_PIPELINE', pipeline)
    }
  }
}
