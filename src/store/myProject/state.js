const pipeline = {
  nodes: {},
  edges: []
}

export default {
  projects: {},
  activateProjectId: null,

  worksheets: {},
  activateWorksheetId: null,

  pipeline,
  pipelineUpdateStatus: {
    updateType: null,
    updateObject: null,
    updateTime: null
  },

  activatePipelineNodeId: null
}
