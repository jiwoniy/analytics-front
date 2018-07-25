export default {
  SET_PROJECTS: (state, projects) => {
    state.projects = projects
  },
  SET_SELECTED_PROJECT: (state, project) => {
    state.selectedProject = project
  },
  SET_WORKSHEETS: (state, worksheets) => {
    state.worksheets = worksheets
  },
  SET_SELECTED_WORKSHEETS: (state, worksheet) => {
    state.selectedWorksheet = worksheet
  },
  SAVE_PIPELINE: (state, { pipeline, worksheetId }) => {
    if (pipeline && worksheetId) {
      state.myPipeline[worksheetId] = pipeline
    }
  }
}
