const fp = require('./fp-utils.js')

/** Test util **/
const test = (actual, expected, subject) => {
  if (actual !== expected) throw new Error(`${subject} broken. Expected ${expected}, but got ${actual}`)
}

// Example:
const sumThree = (x, y, z) => x + y + z
const curriedSumThree = fp.curry(sumThree)
const numsPlusOne = curriedSumThree(1)
const plusFive = numsPlusOne(4)

test(plusFive(9), 14, 'curry')
test(curriedSumThree(1)(4)(9), 14, 'curry')
test(plusFive(10), 15, 'curry')
test(numsPlusOne(3)(6), 10, 'curry')
