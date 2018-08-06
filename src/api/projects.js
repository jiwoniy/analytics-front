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
  // project
  getMyProjects () {
    // return apiHandler(Axios.post(baseUrl, params))
    return apiHandler(returnPromise(storageFun.getProjects()))
  },
  createProject ({ projectName, projectDesc }) {
    return apiHandler(returnPromise(storageFun.createProject({
      projectName,
      projectDesc
    })))
  },

  // worksheet
  getWorksheets (projectId) {
    return apiHandler(returnPromise(storageFun.getWorksheets(projectId)))
  },
  createWorksheet (projectId, { worksheetName, worksheetDesc }) {
    return apiHandler(returnPromise(storageFun.createWorksheet(projectId, {
      worksheetName,
      worksheetDesc
    })))
  },
  updateWorksheet (projectId, worksheetId, worksheet) {
    return apiHandler(returnPromise(storageFun.updateWorksheet(projectId, worksheetId, worksheet)))
  },
  deleteWorksheet (projectId, worksheetId) {
    return apiHandler(returnPromise(storageFun.deleteWorksheet(projectId, worksheetId)))
  },
  // pipeline
  getPipeline (worksheetId) {
    return apiHandler(returnPromise(storageFun.getPipelines(worksheetId)))
  },
  updatePipeline (projectId, worksheetId, pipeline) {
    return apiHandler(returnPromise(storageFun.updatePipeline(projectId, worksheetId, pipeline)))
  }
}
