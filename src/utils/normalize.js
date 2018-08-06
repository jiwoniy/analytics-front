function normalizeArray (datas, pIdentity = 'id') {
  if (datas && Array.isArray(datas)) {
    const normalizeObj = {}
    datas.forEach(data => {
      normalizeObj[data[pIdentity]] = { ...data }
    })
    return normalizeObj
  }
  return null
}

function normalizeObject (data, pIdentity = 'id') {
  if (data) {
    const normalizeObj = {}
    normalizeObj[data[pIdentity]] = { ...data }
    return normalizeObj
  }
  return null
}

function getNodeId (data, pIdentity = 'id') {
  if (data) {
    return data[pIdentity]
  }
  return null
}

function getLinkId (data, pIdentity = 'id') {
  if (data) {
    return data[pIdentity]
  }
  return null
}

export {
  normalizeObject,
  normalizeArray,
  getNodeId,
  getLinkId
}
