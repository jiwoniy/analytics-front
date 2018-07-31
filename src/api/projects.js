// import Axios from '@/plugins/axios'
import apiHandler from '@/helper/apiHandler'

import projetSchema from './mockup/project-schema.json'
import worksheetSchema from './mockup/worksheets-schema.json'

function returnPromise (param) {
  return new Promise((resolve) => {
    resolve({ data: param })
  })
}

// const baseUrl = '/xxxxx'
export default {
  getMyProjects () {
    // const params = {}
    return apiHandler(returnPromise(projetSchema))
    // return apiHandler(Axios.post(baseUrl, params))
  },
  getWorksheets (projectId) {
    return apiHandler(returnPromise(worksheetSchema.worksheets[projectId]))
  },
  getPipeline (worksheetId) {
    return apiHandler(returnPromise({}))
  }
}
