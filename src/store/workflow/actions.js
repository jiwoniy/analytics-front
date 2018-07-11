export default {
  setCurrentWorkflow: ({ commit, state }, workflow) => {
    if (workflow) {
      // TODO type check
      commit('SET_CURRENT_WORK_FLOW', workflow)
    }
  },
  setWorkflows: ({ commit, state }, workflows) => {
    if (workflows) {
      // TODO type check
      commit('SET_WORKFLOWS', workflows)
    }
  }
}
