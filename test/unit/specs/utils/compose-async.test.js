import compose from '@/utils/compose'

test('compose async test', async () => {
  function returnPromise (param) {
    return new Promise((resolve) => {
      resolve(param)
    })
  }

  const example = compose([
    async () => {
      const result = await returnPromise('test1')
      return result
    },
    async () => {
      const result = await returnPromise('test2')
      return result
    }
  ], true)
  const result = await example(2)
  expect(result).toBe('test2')
})

// test('compose async test', async () => {
//   function returnPromise (param) {
//     return new Promise((resolve) => {
//       resolve(param)
//     })
//   }

//   const example = compose([
//     () => returnPromise(3),
//     () => returnPromise(5)
//   ], true)
//   const result = await example()
//   expect(result).toBe(5)
// })

// test('compose async test', async () => {
//   function returnPromise (param) {
//     return new Promise((resolve) => {
//       resolve(param)
//     })
//   }

//   const example = compose([
//     () => returnPromise(3),
//     () => returnPromise(5)
//   ], true)
//   const result = await example(5)
//   expect(result).toBe(5)
// })
