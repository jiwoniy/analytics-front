import _isEmpty from 'lodash.isempty'

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
  UPDATE_WORKSHEETS: (state, { updateType, activateWorksheetId, updateWorksheet }) => {
    if (activateWorksheetId) {
      if (updateType === 'update' && updateWorksheet) {
        // update
        state.worksheets = Object.assign({}, state.worksheets, { [activateWorksheetId]: updateWorksheet })
      } else if (updateType === 'delete') {
        // delete
        delete state.worksheets[activateWorksheetId]
        state.worksheets = Object.assign({}, state.worksheets)

        if (state.activateWorksheetId === activateWorksheetId) {
          state.activateWorksheetId = null
        }
      }
    }
  },

  // pipeline
  SET_ACTIVATE_PIPELINE: (state, { pipeline }) => {
    if (pipeline) {
      if (_isEmpty(pipeline)) {
        state.pipeline = {
          links: pipeline.links || [],
          nodes: pipeline.nodes || {}
        }
      } else {
        // state.pipeline = Object.assign({}, pipeline)
        state.pipeline = pipeline
      }
    }
  },
  SAVE_PIPELINE: (state, { pipeline }) => {
    state.pipeline = Object.assign({},
      ...state.pipeline,
      { links: pipeline.links || [],
        nodes: pipeline.nodes || {}
      })
  },
  SET_ACTIVATE_PIPELINE_NODE_ID: (state, nodeId) => {
    state.activatePipelineNodeId = nodeId
  },
  UPDATE_ACTIVATE_PIPELINE_NODE: (state, { pipelineProxy, activatePipelineNodeId, updatedProp, updatedValue }) => {
    const { nodes: currentNodes } = state.pipeline
    if (currentNodes && currentNodes[activatePipelineNodeId]) {
      currentNodes[activatePipelineNodeId][updatedProp] = updatedValue
      // state.pipeline.nodes = Object.assign({}, state.pipeline.nodes, currentNodes)
      pipelineProxy.nodes = Object.assign({}, state.pipeline.nodes, currentNodes)
    }
  },
  DELETE_ACTIVATE_PIPELINE_NODE: (state, { pipelineProxy, activatePipelineNodeId }) => {
    const { nodes: currentNodes } = state.pipeline
    if (currentNodes && currentNodes[activatePipelineNodeId]) {
      delete currentNodes[activatePipelineNodeId]
      // state.pipelineProxy.nodes = Object.assign({}, currentNodes)
      pipelineProxy.nodes = Object.assign({}, currentNodes)
    }
  },
  UPDATE_ACTIVATE_PIPELINE_UPDATE_STATUS: (state, { updateType, updateObject, updateTime, updateObjectId }) => {
    // pipelineUpdateStatus
    state.pipelineUpdateStatus = Object.assign({}, {
      updateType,
      updateObjectId,
      updateObject,
      updateTime
    })
  }
}
