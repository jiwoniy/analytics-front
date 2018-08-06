import _isEmpty from 'lodash.isempty'

export default {
  // project
  FETCH_PROJECTS: (state, projects) => {
    if (projects) {
      state.projects = projects
    }
  },
  ADD_PROJECT: (state, project) => {
    if (project) {
      state.projects = Object.assign({}, state.projects, {
        ...project
      })
    }
  },

  SET_ACTIVATE_PROJECT_ID: (state, projectId) => {
    if (projectId) {
      state.activateProjectId = projectId
    }
  },

  // worksheet
  FETCH_WORKSHEETS: (state, worksheets) => {
    if (worksheets) {
      state.worksheets = worksheets
    }
  },
  ADD_WORKSHEET: (state, worksheet) => {
    if (worksheet) {
      state.worksheets = Object.assign({}, state.worksheets, {
        ...worksheet
      })
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
  SET_PIPELINE_EDITABLE: (state, editable) => {
    state.pipelineEditable = editable
  },
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
  SET_PIPELINE_SYNC_TIME: (state, syncTime) => {
    state.pipelineSyncTime = syncTime
  },
  UPDATE_ACTIVATE_PIPELINE_UPDATE_STATUS: (state, { updateType }) => {
    state.pipelineUpdateStatus = Object.assign({}, { updateType })
  },

  // pipeline node
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
  DELETE_CONNECT_LINK: (state, { pipelineProxy, linkIdList }) => {
    if (linkIdList.length) {
      const { links: currentLinks } = state.pipeline
      linkIdList.forEach(id => {
        delete currentLinks[id]
      })
      pipelineProxy.links = Object.assign({}, currentLinks)
    }
  },
  UPDATE_ACTIVATE_PIPELINE_NODE_UPDATE_STATUS: (state, { updateType, updateObject, updateTime, updateObjectId }) => {
    // pipelineUpdateStatus
    state.pipelineNodeUpdateStatus = Object.assign({}, {
      updateType,
      updateTime,
      updateObjectId,
      updateObject
    })
  }
}
