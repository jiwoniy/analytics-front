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
  normalizeArray,
  getNodeId,
  getLinkId
}
