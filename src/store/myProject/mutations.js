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
      if (_isEmpty(pipeline)) {
        state.pipeline = {
          edges: pipeline.edges || [],
          nodes: pipeline.nodes || {}
        }
      } else {
        state.pipeline = pipeline
      }
    }
  },
  SAVE_PIPELINE: (state, { pipeline }) => {
    state.pipeline = Object.assign({},
      ...state.pipeline,
      { edges: pipeline.edges || [],
        nodes: pipeline.nodes || {}
      })
  },
  // UPDATE_ACTIVATE_PIPELINE: (state, { type, currentWorkNodeId }) => {
  //   if (type === 'node_delete') {
  //     const currentNodes = state.currentWorkPipeline.nodes
  //     delete currentNodes[currentWorkNodeId]
  //     state.currentWorkPipeline = Object.assign({}, state.currentWorkPipeline, { nodes: currentNodes })
  //   }
  // },
  // UPDATE_ACTIVATE_PIPELINE_INFO: (state, { worksheetId, isInit = false }) => {
  //   if (worksheetId) {
  //     state.currentWorkPipelineInfo = {
  //       worksheetId,
  //       saveTime: isInit ? null : moment().valueOf()
  //     }
  //   }
  // },
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
