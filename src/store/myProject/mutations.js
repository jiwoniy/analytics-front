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
  UPDATE_WORKSHEETS: (state, payload) => {
    const { worksheetId, selectedWorksheet } = payload
    if (worksheetId && selectedWorksheet) {
      state.worksheets[worksheetId] = selectedWorksheet
    }
  },
  SET_SELECTED_WORKSHEETS: (state, worksheet) => {
    state.selectedWorksheet = worksheet
  },
  UPDATE_SELECTED_WORKSHEETS: (state, { key, value }) => {
    if (state.selectedWorksheet) {
      state.selectedWorksheet[key] = value
    }
  },
  SAVE_PIPELINE: (state, { pipeline, worksheetId }) => {
    if (pipeline && worksheetId) {
      state.myPipeline[worksheetId] = pipeline
    }
  }
}
