const compose = (fns) => {
  if (fns && Array.isArray(fns)) {
    // const fun = left ? 'reduce' : 'reduceRight'
    const fun = 'reduce'
    return fns[fun](function (prev, next) {
      if ((prev === null && typeof next === 'function') || (typeof prev === 'function' && typeof next === 'function')) {
        return function (source, target, ...args) {
          try {
            if (prev) {
              return next(source, target, prev(source, target, ...args))
            }
            return next(source, target, ...args)
          } catch (e) {
            return new Error(`exception in function: ${e}`)
          }
        }
      }
      return new Error('The array must consist of functions.')
    }, null)
  }
  return new Error('first argument should be array')
}

export default compose
