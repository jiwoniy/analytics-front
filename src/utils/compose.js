const compose = (fns, left = true) => {
  if (fns && Array.isArray(fns)) {
    const fun = left ? 'reduce' : 'reduceRight'
    return fns[fun](function (prev, next) {
      if (typeof prev === 'function' && typeof next === 'function') {
        return function (...arg) {
          try {
            return next(prev(...arg))
          } catch (e) {
            return new Error(`exception in function: ${e}`)
          }
        }
      }
      return new Error('The array must consist of functions.')
    }, function (...value) {
      return value || []
    })
  }
  return new Error('first argument should be array')
}

export default compose
