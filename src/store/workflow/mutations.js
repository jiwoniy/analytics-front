export default {
  SET_CURRENT_WORK_FLOW: (state, workflow) => {
    if (workflow) {
      state.currentWorkflow = workflow
    }
  },
  SET_WORKFLOWS: (state, workflows) => {
    if (workflows) {
      state.workflows = workflows
    }
  }
}
