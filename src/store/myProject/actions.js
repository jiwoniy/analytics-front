import _isEmpty from 'lodash.isempty'
import _isEqual from 'lodash.isequal'

import store from '@/store'
import api from '@/api'
import { normalizeArray } from '@/utils/normalize'

export default {
  // project
  getProjects: async ({ dispatch, commit, state }) => {
    const { success } = await api.projects.getMyProjects()
    const { projects } = success
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
  // worksheet
  setWorksheets: ({ dispatch, commit, state }, project) => {
    if (project) {
      const { worksheets } = project
      if (worksheets.length) {
        commit('SET_WORKSHEETS', normalizeArray(worksheets))
        dispatch('setSelectedWorksheet', worksheets[0].id)
      }
    }
  },
  updateWorksheetsByMediator: ({ commit, state }, payload) => {
    const { worksheetId } = payload
    if (worksheetId) {
      commit('UPDATE_WORKSHEETS', { worksheetId, selectedWorksheet: state.selectedWorksheet })
    }
  },
  setSelectedWorksheet: ({ commit, state }, worksheetId) => {
    if (worksheetId) {
      const worksheet = state.worksheets[worksheetId]
      commit('SET_SELECTED_WORKSHEETS', worksheet)
    }
  },
  updateSelectedWorksheet: ({ commit, state }, payload) => {
    const { worksheetId, key, value: updateValue } = payload
    if (!_isEmpty(updateValue)) {
      if (!_isEqual(updateValue, state.selectedWorksheet[key])) {
        commit('UPDATE_SELECTED_WORKSHEETS', { worksheetId, key, value: updateValue })
      }
    }
  },
  // pipeline
  savePipeline: ({ dispatch, commit, state }, payload) => {
    if (payload.worksheetId) {
      // TODO type check
      commit('SAVE_PIPELINE', payload)
      dispatch('setCurrentWorkPipeline', payload)
    }
  },
  setCurrentWorkPipeline: ({ commit, state }, payload) => {
    if (payload && payload.worksheetId) {
      // TODO type check
      commit('UPDATE_CURRENT_WORK_PIPELINE', payload)
    }
  },
  setCurrentWorkPipelineNode: ({ commit, state }, payload) => {
    commit('SET_CURRENT_WORK_PIPELINE_NODE', payload)
  },
  updateCurrentWorkPipelineNode: ({ commit, state }, payload) => {
    const { nodeId, key, value: updateValue } = payload
    if (!_isEmpty(updateValue)) {
      if (!_isEqual(updateValue, state.currentWorkPipelineNode[key])) {
        commit('UPDATE_CURRENT_WORK_PIPELINE_NODE', { nodeId, key, value: updateValue })
      }
    }
  },
  updateCurrentWorkNodeByMediator: ({ commit, state }, payload) => {
    const worksheetId = store.getters['myProject/getSelectedWorksheet'].id
    if (worksheetId) {
      // TODO
      console.log(state.myPipeline[worksheetId])
      console.log(payload)
    //   commit('UPDATE_WORKSHEETS', { worksheetId, selectedWorksheet: state.selectedWorksheet })
    }
  }
}
