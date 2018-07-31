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
        dispatch('findWorkSheets')
      }
    }
  },
  updateWorksheets: ({ dispatch, commit, state }, payload) => {
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
      dispatch('findWorkSheets')
    }
  },
  setSelectedWorksheetId: ({ commit, state }, worksheetId) => {
    if (worksheetId) {
      commit('SET_SELECTED_WORKSHEETS', worksheetId)
    }
  },
  findWorkSheets: ({ dispatch, commit, state }) => {
    const result = Object.keys(state.worksheets)
    if (result && result.length) {
      dispatch('setSelectedWorksheetId', result[0])
    }
  },
  deleteSelectedWorksheet: ({ commit, state }, payload) => {
    const { worksheetId } = payload
    if (worksheetId) {
      commit('DELETE_SELECTED_WORKSHEETS', { worksheetId, type: 'delete' })
    }
  },
  // pipeline
  savePipeline: ({ dispatch, commit, state }, payload) => {
    const { pipeline, worksheetId } = payload
    if (worksheetId) {
      commit('SAVE_PIPELINE', { pipeline, worksheetId })
      dispatch('setCurrentWorkPipeline', { worksheetId })
    }
  },
  setCurrentWorkPipeline: ({ commit, state }, payload) => {
    const { worksheetId, isInit } = payload
    if (worksheetId) {
      commit('UPDATE_CURRENT_WORK_PIPELINE_INFO', { worksheetId, isInit })
    }
  },
  updateCurrentWorkPipeline: ({ commit, state }, { currentWorkNodeId }) => {
    if (currentWorkNodeId) {
      commit('UPDATE_CURRENT_WORK_PIPELINE', { currentWorkNodeId, type: 'node_delete' })
    }
  },
  setCurrentWorkPipelineNode: ({ commit, state }, node) => {
    commit('SET_CURRENT_WORK_PIPELINE_NODE', node)
  },
  updateCurrentWorkPipelineNode: ({ commit, state }, payload) => {
    const { nodeId, key, value: updateValue } = payload
    if (!_isEmpty(updateValue)) {
      if (!_isEqual(updateValue, state.currentWorkPipelineNode[key])) {
        commit('UPDATE_CURRENT_WORK_PIPELINE_NODE', { nodeId, key, value: updateValue })
      }
    }
  },
  deleteCurrentWorkPipelineNode: ({ dispatch, commit, state }, payload) => {
    const { currentWorkNodeId } = payload
    if (currentWorkNodeId) {
      // commit('DELETE_CURRENT_WORK_PIPELINE_NODE', { currentWorkNodeId, worksheetId })
      dispatch('setCurrentWorkPipelineNode', null)
      dispatch('updateCurrentWorkPipeline', { currentWorkNodeId })
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
