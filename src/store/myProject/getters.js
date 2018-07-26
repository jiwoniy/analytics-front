export default {
  // about project
  getProjects: state => state.projects || {},
  getProjectList: state => Object.keys(state.projects).map(key => state.projects[key]) || [],
  getSelectedProject: state => state.selectedProject || {},
  // about worksheet
  getWorksheets: state => state.worksheets || {},
  getWorksheetList: state => Object.keys(state.worksheets).map(key => state.worksheets[key]) || [],
  getSelectedWorksheet: state => state.selectedWorksheet || {},
  // about pipeline
  getCurrentWorksheetPipelineInfo: state => state.currentWorkPipelineInfo || {},
  getCurrentWorksheetPipeline: state => {
    const { selectedWorksheet, myPipeline } = state
    let worksheetId = selectedWorksheet && selectedWorksheet.id
    if (worksheetId) {
      return myPipeline[worksheetId]
    }
    return null
  },
  getCurrentWorkNode: state => state.currentWorkPipelineNode
}
