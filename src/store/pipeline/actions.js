import api from '@/api'
import { normalizeArray } from '@/utils/normalize'

export default {
  getPipelineNodes: async ({ dispatch, commit, state }) => {
    const { success: pipelineNodes } = await api.meta.getPipelineNodes()
    if (pipelineNodes) {
      commit('SET_PIPELINES_NODES', normalizeArray(pipelineNodes))
    }
  }
}
