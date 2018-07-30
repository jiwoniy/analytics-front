import moment from 'moment'

export default {
  // project
  SET_PROJECTS: (state, projects) => {
    state.projects = projects
  },
  SET_SELECTED_PROJECT: (state, projectId) => {
    state.selectedProjectId = projectId
  },
  // worksheet
  SET_WORKSHEETS: (state, worksheets) => {
    state.worksheets = worksheets
  },
  UPDATE_WORKSHEETS: (state, payload) => {
    const { worksheetId, updateWorksheet } = payload
    if (worksheetId) {
      if (updateWorksheet) {
        // update
        state.worksheets = Object.assign({}, state.worksheets, { [worksheetId]: updateWorksheet })
      } else {
        // delete
        delete state.worksheets[worksheetId]
        state.worksheets = Object.assign({}, state.worksheets)
      }
    }
  },
  SET_SELECTED_WORKSHEETS: (state, worksheetId) => {
    state.selectedWorksheetId = worksheetId
  },
  DELETE_SELECTED_WORKSHEETS: (state, { worksheetId }) => {
    if (worksheetId) {
      if (state.selectedWorksheetId === worksheetId) {
        state.selectedWorksheetId = null
      }
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
