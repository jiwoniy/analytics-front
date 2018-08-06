import moment from 'moment'
import _isEmpty from 'lodash.isempty'
import _isEqual from 'lodash.isequal'
import _debounce from 'lodash.debounce'

import { setting } from '@/config'
import api from '@/api'
import { normalizeObject, normalizeArray } from '@/utils/normalize'

export default {
  // project
  getProjects: async ({ dispatch, commit }) => {
    const { success } = await api.projects.getMyProjects()
    if (success && success.length) {
      commit('FETCH_PROJECTS', normalizeArray(success))
      dispatch('setActivateProjectId', success[0].id)
    }
  },
  setActivateProjectId: async ({ dispatch, commit }, projectId) => {
    if (projectId) {
      commit('SET_ACTIVATE_PROJECT_ID', projectId)
      const { success } = await api.projects.getWorksheets(projectId)
      if (success) {
        dispatch('fetchWorksheets', success)
      }
    }
  },
  createProject: async ({ dispatch, commit }, { projectName, projectDesc }) => {
    const { success } = await api.projects.createProject({ projectName, projectDesc })
    if (success) {
      commit('ADD_PROJECT', normalizeObject(success))
      dispatch('setActivateProjectId', success.id)
    }
  },

  // worksheet
  fetchWorksheets: ({ dispatch, commit, state }, worksheets) => {
    if (worksheets && worksheets.length) {
      commit('FETCH_WORKSHEETS', normalizeArray(worksheets))
      dispatch('findActivateWorksheets')
    } else if (worksheets) {
      commit('FETCH_WORKSHEETS', {})
      dispatch('setActivateWorksheetId', null)
    }
  },
  createWorksheet: async ({ dispatch, commit, state }, { worksheetName, worksheetDesc }) => {
    const projectId = state.activateProjectId
    const { success } = await api.projects.createWorksheet(projectId, { worksheetName, worksheetDesc })

    commit('ADD_WORKSHEET', normalizeObject(success))
    dispatch('setActivateWorksheetId', success.id)
  },
  setActivateWorksheetId: async ({ dispatch, commit }, worksheetId) => {
    commit('SET_ACTIVATE_WORKSHEETS', worksheetId)
    const { success } = await api.projects.getPipeline(worksheetId)
    if (!_isEmpty(success)) {
      dispatch('setActivatePipeline', { pipeline: success })
    }
  },
  findActivateWorksheets: ({ dispatch, commit, state }) => {
    const result = Object.keys(state.worksheets)
    if (result && result.length) {
      dispatch('setActivateWorksheetId', result[0])
    }
  },
  updateWorksheets: ({ dispatch, commit, state }, { updateType, updatedProp, updatedValue }) => {
    const activateWorksheetId = state.activateWorksheetId
    if (activateWorksheetId && updateType === 'update' && !_isEmpty(updatedValue)) {
      if (!_isEqual(updatedValue, state.worksheets[activateWorksheetId][updatedProp])) {
        const updateWorksheet = Object.assign({}, {
          ...state.worksheets[activateWorksheetId],
          [updatedProp]: updatedValue })
        updateWorksheet[updatedProp] = updatedValue
        commit('UPDATE_WORKSHEETS', { activateWorksheetId, updateType, updateWorksheet })
      }
    } else if (activateWorksheetId && updateType === 'delete') {
      commit('UPDATE_WORKSHEETS', { activateWorksheetId, updateType })
      dispatch('findActivateWorksheets')
    }
  },
  syncWorksheetsWithServer: async ({ dispatch, commit, state }, { worksheetId, updateType }) => {
    const projectId = state.activateProjectId
    if (updateType === 'delete') {
      const { success, error } = await api.projects.deleteWorksheet(projectId, worksheetId)
      if (success) {
        console.log(`worksheet: ${worksheetId} delete success`)
      } else if (error) {
        // TODO How to handle
        console.log(`worksheet: ${worksheetId} delete error`)
      }
    } else if (updateType === 'update') {
      const { success, error } = await api.projects.updateWorksheet(projectId, worksheetId, state.worksheets[worksheetId])
      if (success) {
        console.log(`worksheet: ${worksheetId} update success`)
      } else if (error) {
        // TODO How to handle
        console.log(`worksheet: ${worksheetId} update error`)
      }
    }
  },

  // pipeline
  setActivatePipeline: ({ commit, state }, { pipeline }) => {
    if (pipeline) {
      commit('SET_ACTIVATE_PIPELINE', { pipeline })
      commit('UPDATE_ACTIVATE_PIPELINE_UPDATE_STATUS', { updateType: 'init' })
    }
  },
  savePipeline: ({ dispatch, commit }, { pipeline }) => {
    commit('SAVE_PIPELINE', { pipeline })
  },
  syncPipelineWithServer: _debounce(async ({ state }, { pipeline }) => {
    const projectId = state.activateProjectId
    const worksheetId = state.activateWorksheetId

    // TODO 만약 api로 쏜다면 직렬화를 해야함...
    const { success, error } = await api.projects.updatePipeline(projectId, worksheetId, pipeline)
    if (success) {
      console.log(`pipeline: ${worksheetId} update success`)
    } else if (error) {
      // TODO How to handle
      console.log(`pipeline: ${worksheetId} update error`)
    }
  }, setting.saveTimer),

  // pipeline node
  setPipelineEditable: ({ commit, state }, editable) => {
    commit('SET_PIPELINE_EDITABLE', editable)
  },
  setActivatePipelineNodeId: ({ commit, state }, nodeId) => {
    commit('SET_ACTIVATE_PIPELINE_NODE_ID', nodeId)
  },
  findConnectLinks: ({ commit, state }, activatePipelineNodeId) => {
    const { links: currentLinks } = state.pipeline
    return Object.keys(currentLinks).filter(key => {
      const { source, target } = currentLinks[key]
      return source.sourceId === activatePipelineNodeId || target.targetId === activatePipelineNodeId
    })
  },
  updateActivatePipelineNode: async ({ dispatch, commit, state }, { updateType, updatedProp, updatedValue }) => {
    const activatePipelineNodeId = state.activatePipelineNodeId
    const pipelineProxyHandler = {
      set (target, key, value) {
        commit('UPDATE_ACTIVATE_PIPELINE_NODE_UPDATE_STATUS', {
          updateType,
          updateObject: 'node',
          updateObjectId: activatePipelineNodeId,
          updateTime: moment().valueOf() })
        dispatch('savePipeline', { pipeline: state.pipeline })
        return true
      }
    }
    const pipelineProxy = new Proxy(state.pipeline, pipelineProxyHandler)

    if (updateType === 'delete') {
      if (activatePipelineNodeId) {
        const connectLinks = await dispatch('findConnectLinks', activatePipelineNodeId)
        commit('DELETE_CONNECT_LINK', { pipelineProxy, linkIdList: connectLinks })
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
}
