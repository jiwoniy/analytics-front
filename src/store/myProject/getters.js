export default {
  // about project
  getProjects: state => state.projects || {},
  getProjectList: state => Object.keys(state.projects).map(key => state.projects[key]) || [],
  getSelectedProjectId: state => state.selectedProjectId,
  getSelectedProject: state => {
    if (state.selectedProjectId) {
      return state.projects[state.selectedProjectId]
    }
    return {}
  },

  // about worksheet
  getWorksheets: state => state.worksheets || {},
  getWorksheetList: state => Object.keys(state.worksheets).map(key => state.worksheets[key]) || [],
  getSelectedWorksheetId: state => state.selectedWorksheetId,
  getSelectedWorksheet: state => {
    if (state.selectedWorksheetId) {
      return state.worksheets[state.selectedWorksheetId]
    }
    return {}
  },

  // about pipeline
  getCurrentWorksheetPipelineInfo: state => state.currentWorkPipelineInfo || {},
  getCurrentWorksheetPipeline: state => state.currentWorkPipeline || {},
  getCurrentWorkNode: state => state.currentWorkPipelineNode,
  getCurrentWorkNodeId: state => (state.currentWorkPipelineNode && state.currentWorkPipelineNode.id) || null
}
