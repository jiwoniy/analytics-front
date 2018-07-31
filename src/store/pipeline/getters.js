export default {
  getPipelineMetaList: state => Object.keys(state.pipelineMeta).map(key => state.pipelineMeta[key]) || [],
  getPipelineMeta: state => state.pipelineMeta
}
