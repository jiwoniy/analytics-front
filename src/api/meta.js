// import Axios from '@/plugins/axios'
import apiHandler from '@/helper/apiHandler'

import pipelineNodesSchema from './mockup/pipeline-nodes.json'

function returnPromise (param) {
  return new Promise((resolve) => {
    resolve({ data: param })
  })
}

// const baseUrl = '/xxxxx'
export default {
  getPipelineMeta () {
    // const params = {}
    return apiHandler(returnPromise(pipelineNodesSchema))
    // return apiHandler(Axios.post(baseUrl, params))
  }
}
