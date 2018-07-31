import moment from 'moment'

export default {
  // project
  SET_PROJECTS: (state, projects) => {
    if (projects) {
      state.projects = projects
    }
  },
  SET_ACTIVATE_PROJECT_ID: (state, projectId) => {
    if (projectId) {
      state.activateProjectId = projectId
    }
  },

  // worksheet
  SET_WORKSHEETS: (state, worksheets) => {
    if (worksheets) {
      state.worksheets = worksheets
    }
  },
  SET_ACTIVATE_WORKSHEETS: (state, worksheetId) => {
    state.activateWorksheetId = worksheetId
  },
  UPDATE_WORKSHEETS: (state, { updateType, worksheetId, updateWorksheet }) => {
    if (worksheetId) {
      if (updateType === 'update' && updateWorksheet) {
        // update
        state.worksheets = Object.assign({}, state.worksheets, { [worksheetId]: updateWorksheet })
      } else {
        // delete
        delete state.worksheets[worksheetId]
        state.worksheets = Object.assign({}, state.worksheets)
      }
    }
  },
  DELETE_ACTIVATE_WORKSHEETS: (state, { worksheetId }) => {
    if (worksheetId) {
      if (state.activateWorksheetId === worksheetId) {
        state.activateWorksheetId = null
      }
    }
  },

  // pipeline
  SET_PIPELINE: (state, { pipeline }) => {
    if (pipeline) {
      state.pipeline = pipeline
    }
  },
  SAVE_PIPELINE: (state, { pipeline, worksheetId }) => {
    state.pipeline = Object.assign({},
      ...state.pipeline,
      { edges: pipeline.edges || [],
        nodes: pipeline.nodes || {}
      })
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
  SET_ACTIVATE_PIPELINE_NODE_ID: (state, nodeId) => {
    state.activatePipelineNodeId = nodeId
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
