import api from '@/api'
import { normalizeArray } from '@/utils/normalize'

export default {
  fetchPipelineMeta: async ({ dispatch, commit, state }) => {
    const { success: pipelineMeta } = await api.meta.getPipelineMeta()
    if (pipelineMeta) {
      commit('FETCH_PIPELINES_META', normalizeArray(pipelineMeta))
    }
  }
}
