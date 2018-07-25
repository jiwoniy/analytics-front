export default {
  getPipelineNodesList: state => Object.keys(state.pipelineNodes).map(key => state.pipelineNodes[key]) || [],
  getPipelineNodes: state => state.pipelineNodes
}
