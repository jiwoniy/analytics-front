function isPromise (object) {
  if (Promise && Promise.resolve) {
    return Promise.resolve(object) === object
  }
  return false
}

export default isPromise
