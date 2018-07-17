// import Axios from '@/plugins/axios'
import apiHandler from '@/helper/apiHandler'

import projetSchema from './mockup/project-schema.json'

function returnPromise (param) {
  return new Promise((resolve) => {
    resolve(param)
  })
}

// const baseUrl = '/xxxxx'
export default {
  getMyProjects () {
    // const params = {}
    return apiHandler(returnPromise(projetSchema))
    // return apiHandler(Axios.post(baseUrl, params))
  }
}
