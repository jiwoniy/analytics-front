import _isEmpty from 'lodash.isempty'
import _isEqual from 'lodash.isequal'
import moment from 'moment'

// import store from '@/store'
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
  deleteActivateWorksheet: ({ commit, state }, { worksheetId }) => {
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
  savePipeline: ({ dispatch, commit }, { pipeline }) => {
    if (!_isEmpty(pipeline)) {
      commit('SAVE_PIPELINE', { pipeline })
      // dispatch('setCurrentWorkPipeline', { worksheetId })
    }
  },
  // setCurrentWorkPipeline: ({ commit, state }, payload) => {
  //   const { worksheetId, isInit } = payload
  //   if (worksheetId) {
  //     commit('UPDATE_CURRENT_WORK_PIPELINE_INFO', { worksheetId, isInit })
  //   }
  // },
  // updateActivateWorkPipeline: ({ commit, state }, { currentWorkNodeId }) => {
  //   if (currentWorkNodeId) {
  //     commit('UPDATE_ACTIVATE_PIPELINE', { currentWorkNodeId, type: 'node_delete' })
  //   }
  // },
  setActivatePipelineNodeId: ({ commit, state }, nodeId) => {
    commit('SET_ACTIVATE_PIPELINE_NODE_ID', nodeId)
  },
  updateActivatePipelineNode: ({ commit, state }, { updateType, updatedProp, updatedValue }) => {
    const activatePipelineNodeId = state.activatePipelineNodeId
    const pipelineProxyHandler = {
      set (target, key, value) {
        commit('UPDATE_ACTIVATE_PIPELINE_UPDATE_STATUS', {
          updateType,
          updateObject: 'node',
          updateObjectId: activatePipelineNodeId,
          updateTime: moment().valueOf() })
        return true
      }
    }
    const pipelineProxy = new Proxy(state.pipeline, pipelineProxyHandler)

    if (updateType === 'delete') {
      if (activatePipelineNodeId) {
        commit('DELETE_ACTIVATE_PIPELINE_NODE', { pipelineProxy, activatePipelineNodeId })
      }
    } else if (updateType === 'update') {
      if (!_isEmpty(updatedValue)) {
        const { nodes: currentNodes } = state.pipeline
        if (currentNodes && currentNodes[activatePipelineNodeId]) {
          if (!_isEqual(updatedValue, currentNodes[activatePipelineNodeId][updatedProp])) {
            commit('UPDATE_ACTIVATE_PIPELINE_NODE', { pipelineProxy, activatePipelineNodeId, updatedProp, updatedValue })
          }
        }
      }
    }
  }
  // updateCurrentWorkNodeByMediator: ({ commit, state }, payload) => {
  //   const worksheetId = store.getters['myProject/getSelectedWorksheet'].id
  //   if (worksheetId) {
  //     // TODO
  //     console.log(state.myPipeline[worksheetId])
  //     console.log(payload)
  //   //   commit('UPDATE_WORKSHEETS', { worksheetId, selectedWorksheet: state.selectedWorksheet })
  //   }
  // }
}
