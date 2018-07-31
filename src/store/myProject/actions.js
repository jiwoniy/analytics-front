import _isEmpty from 'lodash.isempty'
import _isEqual from 'lodash.isequal'

import store from '@/store'
import api from '@/api'
import { normalizeArray } from '@/utils/normalize'

export default {
  // project
  getProjects: async ({ dispatch, commit }) => {
    const { success } = await api.projects.getMyProjects()
    if (success && success.projects && success.projects.length) {
      const { projects } = success
      commit('SET_PROJECTS', normalizeArray(projects))
      dispatch('setActivateProjectId', projects[0].id)
    }
  },
  setActivateProjectId: async ({ dispatch, commit }, projectId) => {
    if (projectId) {
      commit('SET_ACTIVATE_PROJECT_ID', projectId)
      // TODO api call. To get worksheets
      const { success } = await api.projects.getWorksheets(projectId)
      if (success && success.length) {
        dispatch('setWorksheets', success)
      }
    }
  },

  // worksheet
  setWorksheets: ({ dispatch, commit }, worksheets) => {
    if (worksheets) {
      if (worksheets && worksheets.length) {
        commit('SET_WORKSHEETS', normalizeArray(worksheets))
        dispatch('findWorkSheets')
      }
    }
  },
  setActivateWorksheetId: async ({ dispatch, commit }, worksheetId) => {
    if (worksheetId) {
      commit('SET_ACTIVATE_WORKSHEETS', worksheetId)
      // TODO api call. To get pipeline
      const { success } = await api.projects.getPipeline(worksheetId)
      if (!_isEmpty(success)) {
        dispatch('setPipeline', success)
      }
    }
  },
  updateWorksheets: ({ dispatch, commit, state }, payload) => {
    const { updateType = 'update', worksheetId, key, value: updateValue } = payload

    if (worksheetId && updateType === 'update' && !_isEmpty(updateValue)) {
      if (!_isEqual(updateValue, state.worksheets[worksheetId][key])) {
        const updateWorksheet = Object.assign({}, {
          ...state.worksheets[worksheetId],
          [key]: updateValue })
        updateWorksheet[key] = updateValue
        commit('UPDATE_WORKSHEETS', { worksheetId, updateType, updateWorksheet })
      }
    } else if (worksheetId && updateType === 'delete') {
      commit('UPDATE_WORKSHEETS', { worksheetId, updateType })
      dispatch('findWorkSheets')
    }
  },
  findWorkSheets: ({ dispatch, commit, state }) => {
    const result = Object.keys(state.worksheets)
    if (result && result.length) {
      dispatch('setActivateWorksheetId', result[0])
    }
  },
  deleteSelectedWorksheet: ({ commit, state }, { worksheetId }) => {
    if (worksheetId) {
      commit('DELETE_ACTIVATE_WORKSHEETS', { worksheetId })
    }
  },

  // pipeline
  setPipeline: ({ commit, state }, { pipeline }) => {
    if (pipeline) {
      commit('SET_PIPELINE', { pipeline })
    }
  },
  savePipeline: ({ dispatch, commit }, { pipeline, worksheetId }) => {
    if (!_isEmpty(pipeline) && worksheetId) {
      commit('SAVE_PIPELINE', { pipeline, worksheetId })
      // dispatch('setCurrentWorkPipeline', { worksheetId })
    }
  },
  // setCurrentWorkPipeline: ({ commit, state }, payload) => {
  //   const { worksheetId, isInit } = payload
  //   if (worksheetId) {
  //     commit('UPDATE_CURRENT_WORK_PIPELINE_INFO', { worksheetId, isInit })
  //   }
  // },
  updateCurrentWorkPipeline: ({ commit, state }, { currentWorkNodeId }) => {
    if (currentWorkNodeId) {
      commit('UPDATE_CURRENT_WORK_PIPELINE', { currentWorkNodeId, type: 'node_delete' })
    }
  },
  setActivatePipelineNodeId: ({ commit, state }, nodeId) => {
    commit('SET_ACTIVATE_PIPELINE_NODE_ID', nodeId)
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
