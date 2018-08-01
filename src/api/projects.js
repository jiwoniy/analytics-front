// import Axios from '@/plugins/axios'
import apiHandler from '@/helper/apiHandler'

import storageFun from '@/plugins/localStorage'

function returnPromise (param) {
  return new Promise((resolve) => {
    resolve({ data: param })
  })
}

// const baseUrl = '/xxxxx'
// TODO set rest api
export default {
  getMyProjects () {
    // return apiHandler(Axios.post(baseUrl, params))
    return apiHandler(returnPromise(storageFun.getProjects()))
  },
  // updateProject (projectId, project) {
  // },
  // deleteProject (projectId) {
  // },
  getWorksheets (projectId) {
    return apiHandler(returnPromise(storageFun.getWorksheets(projectId)))
  },
  updateWorksheet (projectId, worksheetId, worksheet) {
    return apiHandler(returnPromise(storageFun.updateWorksheet(projectId, worksheetId, worksheet)))
  },
  deleteWorksheet (projectId, worksheetId) {
    return apiHandler(returnPromise(storageFun.deleteWorksheet(projectId, worksheetId)))
  },
  getPipeline (worksheetId) {
    return apiHandler(returnPromise(storageFun.getPipelines(worksheetId)))
  },
  updatePipeline (projectId, worksheetId, pipeline) {
    return apiHandler(returnPromise(storageFun.updatePipeline(projectId, worksheetId, pipeline)))
  }
}
