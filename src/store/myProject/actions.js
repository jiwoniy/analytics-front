import api from '@/api'
import { normalizeArray } from '@/utils/normalize'

export default {
  getProjects: async ({ dispatch, commit, state }) => {
    const { success: projects } = await api.projects.getMyProjects()
    if (projects && projects.length) {
      commit('SET_PROJECTS', normalizeArray(projects))
      dispatch('setSelectedProject', projects[0].id)
    }
  },
  setSelectedProject: ({ dispatch, commit, state }, projectId) => {
    if (projectId) {
      const project = state.projects[projectId]
      commit('SET_SELECTED_PROJECT', project)
      dispatch('setWorksheets', project)
    }
  },
  setWorksheets: ({ dispatch, commit, state }, project) => {
    if (project) {
      const { worksheets } = project
      if (worksheets.length) {
        commit('SET_WORKSHEETS', normalizeArray(worksheets))
        dispatch('setSelectedWorksheet', worksheets[0].id)
      }
    }
  },
  setSelectedWorksheet: ({ commit, state }, worksheetId) => {
    if (worksheetId) {
      const worksheet = state.worksheets[worksheetId]
      commit('SET_SELECTED_WORKSHEETS', worksheet)
    }
  }
}
