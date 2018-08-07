// import Axios from '@/plugins/axios'
import apiHandler from '@/helper/apiHandler'

import pipelineNodesSchema from './mockup/pipeline-nodes.json'
import metaNodesSchema from './mockup/meta-nodes.json'

function returnPromise (param) {
  return new Promise((resolve) => {
    resolve({ data: param })
  })
}

// const baseUrl = '/xxxxx'
export default {
  getMetaNodeGroups () {
    // const params = {}
    return apiHandler(returnPromise(metaNodesSchema))
    // return apiHandler(Axios.post(baseUrl, params))
  },
  getPipelineMeta () {
    // const params = {}
    return apiHandler(returnPromise(pipelineNodesSchema))
    // return apiHandler(Axios.post(baseUrl, params))
  }
}
