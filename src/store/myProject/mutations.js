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
      if (pipeline) {
        state.myPipeline = Object.assign({},
          state.myPipeline,
          { [worksheetId]: {
            edges: pipeline.edges || [],
            nodes: pipeline.edges || {}
          } })
        state.currentWorkPipeline = pipeline
      } else {
        state.myPipeline = Object.assign({},
          state.myPipeline,
          { [worksheetId]: null })
        state.currentWorkPipeline = pipeline
      }
    }
  },
  UPDATE_CURRENT_WORK_PIPELINE: (state, { type, currentWorkNodeId }) => {
    if (type === 'node_delete') {
      const currentNodes = state.currentWorkPipeline.nodes
      delete currentNodes[currentWorkNodeId]
      state.currentWorkPipeline = Object.assign({}, state.currentWorkPipeline, { nodes: currentNodes })
    }
  },
  UPDATE_CURRENT_WORK_PIPELINE_INFO: (state, { worksheetId, isInit = false }) => {
    if (worksheetId) {
      state.currentWorkPipelineInfo = {
        worksheetId,
        saveTime: isInit ? null : moment().valueOf()
      }
    }
  },
  SET_CURRENT_WORK_PIPELINE_NODE: (state, node) => {
    state.currentWorkPipelineNode = node
  },
  UPDATE_CURRENT_WORK_PIPELINE_NODE: (state, { nodeId, key, value }) => {
    if (nodeId) {
      state.currentWorkPipelineNode = Object.assign({}, state.currentWorkPipelineNode, { [key]: value })
    }
  },
  DELETE_CURRENT_WORK_PIPELINE_NODE: (state, { currentWorkNodeId, worksheetId }) => {
  //   if (currentWorkNodeId) {
  //     if (state.myPipeline[worksheetId].nodes) {
  //       const newObject = Object.assign({}, state.myPipeline[worksheetId])
  //       delete state.myPipeline[worksheetId].nodes[currentWorkNodeId]

  //       state.myPipeline = Object.assign({},
  //         state.myPipeline,
  //         { [worksheetId]: newObject })
  //     }
  //   }
  }
}
