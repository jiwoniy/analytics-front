const compose = (fns, right = true) => {
  if (right) {
    // return fns.reduceRight((prevFn, nextFn) => (...args) => nextFn(prevFn(...args)),
    //   value => value)
    return fns.reduceRight(function (prevFn, nextFn) {
      return function (args) {
        return nextFn(prevFn(...args))
      }
    }, value => value)
  }
  return fns.reduce((prevFn, nextFn) => (...args) => nextFn(prevFn(...args)),
    value => value)
}

// const compose2 = (f, g) => (...args) => f(g(...args))
// const compose = (...fns) => fns.reduce(compose2)
// const pipe = (...fns) => fns.reduceRight(compose2)

// [0, 1, 2, 3, 4].reduce(function(accumulator, currentValue, currentIndex, array) {
//   return accumulator + currentValue;
// }, 10);

export default compose
