import moment from 'moment'
import { normalizeArray } from '@/utils/normalize'

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
            nodes: normalizeArray(pipeline.nodes)
          } })
      } else {
        state.myPipeline = Object.assign({},
          state.myPipeline,
          { [worksheetId]: null })
      }
    }
  },
  UPDATE_CURRENT_WORK_PIPELINE: (state, { worksheetId, isInit = false }) => {
    if (worksheetId) {
      state.currentWorkPipelineInfo = {
        worksheetId,
        saveTime: isInit ? null : moment().valueOf()
      }
    }
  },
  SET_CURRENT_WORK_PIPELINE_NODE_ID: (state, payload) => {
    state.currentWorkPipelineNodeId = payload
  },
  UPDATE_CURRENT_WORK_PIPELINE_NODE: (state, { nodeId, key, value }) => {
    if (nodeId) {
      state.currentWorkPipelineNodeId = Object.assign({}, state.currentWorkPipelineNode, { [key]: value })
    }
  },
  DELETE_CURRENT_WORK_PIPELINE_NODE: (state, { currentWorkNodeId, worksheetId }) => {
    if (currentWorkNodeId) {
      if (state.myPipeline[worksheetId].nodes) {
        const newObject = Object.assign({}, state.myPipeline[worksheetId])
        delete state.myPipeline[worksheetId].nodes[currentWorkNodeId]

        state.myPipeline = Object.assign({},
          state.myPipeline,
          { [worksheetId]: newObject })
      }
    }
  }
}
