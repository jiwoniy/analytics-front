import moment from 'moment'

export default {
  // about project
  getProjects: state => state.projects || {},
  getProjectList: state => Object.keys(state.projects).map(key => state.projects[key]) || [],

  getActivateProjectId: state => state.activateProjectId,
  getActivateProject: state => {
    if (state.activateProjectId) {
      return state.projects[state.activateProjectId]
    }
    return {}
  },

  // about worksheet
  getWorksheets: state => state.worksheets || {},
  getWorksheetList: state => Object.keys(state.worksheets).map(key => state.worksheets[key]) || [],

  getActivateWorksheetId: state => state.activateWorksheetId,
  getActivateWorksheet: state => {
    if (state.activateWorksheetId) {
      return state.worksheets[state.activateWorksheetId]
    }
    return {}
  },

  // about pipeline
  isPipelineUnLock: state => state.pipelineUnLock,
  getActivatePipeline: state => state.pipeline || {},
  getActivatePipelineSyncTime: state => {
    if (state.pipelineSyncTime) {
      return moment(state.pipelineSyncTime).format('YYYY-MM-DD HH:mm')
    }
    return null
  },
  getPipelineUpdateStatus: state => state.pipelineUpdateStatus || {},

  getActivatePipelineNodeId: state => state.activatePipelineNodeId || null,
  getActivatePipelineNodes: state => {
    if (state.pipeline) {
      return state.pipeline.nodes
    }
    return {}
  },
  getActivatePipelineNodeUpdateStatus: state => state.pipelineNodeUpdateStatus || {}
}
