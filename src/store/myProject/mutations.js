import moment from 'moment'

export default {
  // project
  SET_PROJECTS: (state, projects) => {
    state.projects = projects
  },
  SET_SELECTED_PROJECT: (state, project) => {
    state.selectedProject = project
  },
  // worksheet
  SET_WORKSHEETS: (state, worksheets) => {
    state.worksheets = worksheets
  },
  UPDATE_WORKSHEETS: (state, payload) => {
    const { worksheetId, selectedWorksheet } = payload
    if (worksheetId && selectedWorksheet) {
      state.worksheets = Object.assign({}, state.worksheets, { [worksheetId]: selectedWorksheet })
    }
  },
  SET_SELECTED_WORKSHEETS: (state, worksheet) => {
    state.selectedWorksheet = worksheet
  },
  UPDATE_SELECTED_WORKSHEETS: (state, { key, value }) => {
    if (state.selectedWorksheet) {
      state.selectedWorksheet = Object.assign({}, state.selectedWorksheet, { [key]: value })
    }
  },
  // pipeline
  SAVE_PIPELINE: (state, { pipeline, worksheetId }) => {
    if (worksheetId) {
      state.myPipeline = Object.assign({}, state.myPipeline, { [worksheetId]: pipeline })
    }
  },
  UPDATE_CURRENT_WORK_PIPELINE: (state, { worksheetId, isLoad = false }) => {
    if (worksheetId) {
      state.currentWorkPipelineInfo = {
        worksheetId,
        saveTime: isLoad ? null : moment().valueOf()
      }
    }
  },
  SET_CURRENT_WORK_PIPELINE_NODE: (state, payload) => {
    state.currentWorkPipelineNode = payload
  },
  UPDATE_CURRENT_WORK_PIPELINE_NODE: (state, { nodeId, key, value }) => {
    if (nodeId) {
      state.currentWorkPipelineNode = Object.assign({}, state.currentWorkPipelineNode, { [key]: value })
    }
  }
}
