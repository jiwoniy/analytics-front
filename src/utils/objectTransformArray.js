function objectTransformArray (obj) {
  return Object.keys(obj)
    .map(key => obj[key])
}

function objectTransformKeyValueArray (obj) {
  return Object.keys(obj)
    .map(key => ({ key, value: obj[key] }))
}

export {
  objectTransformArray,
  objectTransformKeyValueArray
}
