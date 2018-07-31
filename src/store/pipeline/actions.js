import api from '@/api'
import { normalizeArray } from '@/utils/normalize'

export default {
  getPipelineMeta: async ({ dispatch, commit, state }) => {
    const { success: pipelineMeta } = await api.meta.getPipelineMeta()
    if (pipelineMeta) {
      commit('SET_PIPELINES_META', normalizeArray(pipelineMeta))
    }
  }
}
