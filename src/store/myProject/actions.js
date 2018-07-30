import _isEmpty from 'lodash.isempty'
import _isEqual from 'lodash.isequal'

import store from '@/store'
import api from '@/api'
import { normalizeArray } from '@/utils/normalize'

export default {
  // project
  getProjects: async ({ dispatch, commit, state }) => {
    const { success } = await api.projects.getMyProjects()
    if (success && success.projects && success.projects.length) {
      const { projects } = success
      commit('SET_PROJECTS', normalizeArray(projects))
      dispatch('setSelectedProjectId', projects[0].id)
    }
  },
  setSelectedProjectId: ({ dispatch, commit, state }, projectId) => {
    if (projectId) {
      const project = state.projects[projectId]
      commit('SET_SELECTED_PROJECT', projectId)
      dispatch('setWorksheets', project)
    }
  },
  // worksheet
  setWorksheets: ({ dispatch, commit, state }, project) => {
    if (project) {
      const { worksheets } = project
      if (worksheets && worksheets.length) {
        commit('SET_WORKSHEETS', normalizeArray(worksheets))
        dispatch('setSelectedWorksheetId', worksheets[0].id)
      }
    }
  },
  updateWorksheets: ({ commit, state }, payload) => {
    const { worksheetId, key, value: updateValue, type = 'update' } = payload
    if (worksheetId && type === 'update' && !_isEmpty(updateValue)) {
      if (!_isEqual(updateValue, state.worksheets[state.selectedWorksheetId][key])) {
        const updateWorksheet = Object.assign({}, {
          ...state.worksheets[state.selectedWorksheetId],
          [key]: updateValue })
        updateWorksheet[key] = updateValue
        commit('UPDATE_WORKSHEETS', { worksheetId, updateWorksheet })
      }
    } else if (worksheetId && type === 'delete') {
      commit('UPDATE_WORKSHEETS', { worksheetId })
    }
  },
  setSelectedWorksheetId: ({ commit, state }, worksheetId) => {
    if (worksheetId) {
      commit('SET_SELECTED_WORKSHEETS', worksheetId)
    }
  },
  // findWorkSheets: ({ commit, state }) => {
  //   console.log(state.worksheets)
  // },
  deleteSelectedWorksheet: ({ commit, state }, payload) => {
    const { worksheetId } = payload
    if (worksheetId) {
      commit('DELETE_SELECTED_WORKSHEETS', { worksheetId, type: 'delete' })
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
