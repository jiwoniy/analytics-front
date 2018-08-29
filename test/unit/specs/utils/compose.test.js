import compose from '@/utils/compose'

test('compose with wrong arguments(not array) ==> throw error', () => {
  const example = compose({}, true)
  expect(example).toEqual(new Error('first argument should be array'))
})

// test('compose with throw wrong arguments(not function)', () => {
//   const example = compose([
//     'test',
//     'test'
//   ], true)
//   expect(example).toEqual(new Error('The array must consist of functions.'))
// })

// test('compose with throw exception', () => {
//   const example = compose([
//     () => { throw new Error('manual exception') }
//   ], true)
//   const result = example(123)
//   expect(result).toEqual(new Error(`exception in function: Error: manual exception`))
// })

// test('compose without argument', () => {
//   const add = x => (y = 0) => x + y
//   const multiply = x => (y = 1) => x * y

//   const example = compose([
//     add(1),
//     multiply(2)
//   ], true)
//   const result = example()
//   expect(result).toBe(2)
// })

// test('compose(argument 2) - from left to right', () => {
//   const add = x => (...args) => {
//     const y = args[0] || 0
//     return x + y
//   }
//   const multiply = x => (...args) => {
//     const y = args[0] || 1
//     return x * y
//   }

//   const example = compose([
//     add(1),
//     multiply(2)
//   ], true)
//   const result = example(2)
//   expect(result).toBe(6)
// })

// test('compose(argument 1) - from left to right', () => {
//   const add = x => (...args) => {
//     const y = args[0] || 0
//     return x + y
//   }
//   const multiply = x => (...args) => {
//     const y = args[0] || 1
//     return x * y
//   }

//   const example = compose([
//     add(1),
//     multiply(2),
//     multiply(3)
//   ], true)
//   const result = example(2)
//   expect(result).toBe(18)
// })

// test('compose(argument 3) - from left to right', () => {
//   const add = x => (...args) => {
//     const y = args[0] || 0
//     return x + y
//   }
//   const multiply = x => (...args) => {
//     const y = args[0] || 1
//     return x * y
//   }

//   const example = compose([
//     add(1),
//     multiply(2),
//     multiply(3)
//   ], true)
//   const result = example(2, 3, 4)
//   expect(result).toBe(18)
// })

// test('compose(argument 2) - from right to left', () => {
//   const add = x => (...args) => {
//     const y = args[0] || 0
//     return x + y
//   }
//   const multiply = x => (...args) => {
//     const y = args[0] || 0
//     return x * y
//   }

//   const example = compose([
//     add(1),
//     multiply(2)
//   ], false)
//   const result = example(2)
//   expect(result).toBe(5)
// })

// test('compose(argument 3) - from right to left', () => {
//   const add = x => (...args) => {
//     const y = args[0] || 0
//     return x + y
//   }
//   const multiply = x => (...args) => {
//     const y = args[0] || 0
//     return x * y
//   }

//   const example = compose([
//     multiply(2),
//     add(4),
//     add(3)
//   ], false)
//   const result = example(2)
//   expect(result).toBe(18)
// })

// test('compose(argument array) - from right to left', () => {
//   const add = x => (...args) => {
//     const y = args[0] || 0
//     return x + y
//   }
//   const multiply = x => (...args) => {
//     const y = args[0] || 0
//     return x * y
//   }

//   const example = compose([
//     multiply(2),
//     add(2)
//   ], false)
//   const result = example(4, 5, 1)
//   expect(result).toBe(12)
// })
