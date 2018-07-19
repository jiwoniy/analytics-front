import isPromise from '@/utils/isPromise'

function run (prev, next, arg) {
  if (isPromise(prev(arg))) {
    return prev(arg)
      .then(res => next(res))
  }

  return next(prev(arg))
}

const compose = (fns, left = true) => {
  if (fns && Array.isArray(fns)) {
    const fun = left ? 'reduce' : 'reduceRight'
    return fns[fun](function (prev, next) {
      if (typeof prev === 'function' && typeof next === 'function') {
        return function (arg) {
          try {
            if (arg === null || arg === undefined) {
              return run(prev, next, null)
            }

            return run(prev, next, arg)
          } catch (e) {
            return new Error(`exception in function: ${e}`)
          }
        }
      }
      return new Error('The array must consist of functions.')
    }, value => value)
  }
  return new Error('first argument should be array')
}

// flow
// pipeline

export default compose
