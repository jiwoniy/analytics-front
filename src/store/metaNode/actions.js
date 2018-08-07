import api from '@/api'
import { normalizeArray } from '@/utils/normalize'

export default {
  fetchMetaNodes: async ({ dispatch, commit, state }) => {
    const { success: metaNodeGroups } = await api.meta.getMetaNodeGroups()
    if (metaNodeGroups) {
      metaNodeGroups.forEach(metaNodeGroup => {
        commit('FETCH_META_NODES', {
          nodes: normalizeArray(metaNodeGroup.nodes)
        })
      })
    }
  }
}
