const pipeline = {
  nodes: {},
  links: []
}

export default {
  projects: {},
  activateProjectId: null,

  worksheets: {},
  activateWorksheetId: null,

  pipeline,
  pipelineUpdateStatus: {},

  activatePipelineNodeId: null,
  pipelineNodeUpdateStatus: {
    updateType: null,
    updateTime: null,
    updateObjectId: null,
    updateObject: null
  }
}
