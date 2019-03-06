const fp = require('./fp-utils')
const {
  partial,
  reverse,
  curry,
  composeRight,
  compose,
  map,
  reduce,
  filter,
  curriedMap,
  curriedReduce,
  curriedFilter
} = fp

/**
 * Test util
 */
const test = ({ actual, expected, subject, description }) => {
  const passed = actual === expected
  const result = passed ? 'PASSED' : 'FAILED'
  const message = `
  SUBJECT: ${subject} 
  ${result}: ${description}.
  ------------
  EXPECTED: ${expected} 
  ACTUAL:   ${actual}
  ------------
  ************
  `

  if (!passed) throw Error(message)

  console.log(message)
}

/**
 * Tests
 * --------------------------------------------------------
 */

// Curry
const sumThree = (x, y, z) => x + y + z
const curriedSumThree = curry(sumThree)
const numsPlusOne = curriedSumThree(1)
const plusFive = numsPlusOne(4)

test({
  actual: plusFive(9), 
  expected: 9 + 5,
  subject: 'curry',
  description: 'Correctly executes a function that adds 3 numbers'
})
test({
  actual: curriedSumThree(1)(4)(9),
  expected: 1 + 4 + 9,
  subject: 'curry',
  description: 'Correctly executes if repeatedly invoked'
})
test({
  actual: numsPlusOne(3)(6),
  expected: 3 + 6 + 1,
  subject: 'curry',
  description: 'Correctly executes if partially applied then invoked multiple times'
})


// Compose & ComposeRight
const addOne = x => x + 1
const addTwo = x => x + 2
const triple = x => x * 3

const tripleThenAdd = compose(addOne, addTwo, triple)
test({
  actual: tripleThenAdd(4),
  expected: (4 * 3) + 1 + 2,
  subject: 'compose',
  description: 'Correctly executes 3 composed functions'
})

const addThenTriple = composeRight(addOne, addTwo, triple)
test({
  actual: addThenTriple(4),
  expected: (4 + 1 + 2) * 3,
  subject: 'composeRight',
  description: 'Correctly executes 3 functions composed left-to-right'
})

// Curry + Compose
const multiply = curry((a, b) => (a * b))
const double = multiply(2)
const doublethreetimes = compose(double, double, double)
test({
  actual: doublethreetimes(3),
  expected: 3 * 2 * 2 * 2,
  subject: 'compose',
  description: 'Can be combined with a curried function'
})

// Map
const addTen = n => n + 10
const mapAddTen = partial(map, addTen)
const mapResult = mapAddTen([ 0, 1, 2, 3 ])
test({
  actual: mapResult.toString(),
  expected: [ 10, 11, 12, 13 ].toString(),
  subject: 'map',
  description: 'Correctly maps all elements of an Array'
})

// Filter
const isEven = x => !(x % 2)
const filterOdds = partial(filter, isEven)
const filterResult = filterOdds([ 1, 2, 4, 5, 6, 7, 7, 10, 12, 101])
test({
  actual: filterResult.toString(),
  expected: [ 2, 4, 6, 10, 12 ].toString(),
  subject: 'filter',
  description: 'Correctly filters a list down to even numbers'
})

// Reduce
const concatUniq = (acc, curr) =>
  acc.includes(curr) ? acc : acc.concat(curr)
const dedupe = partial(reduce, [], concatUniq)

const dupes = [ 1, 1, 2, 3, 4, 5, 6, 1, 7, 5, 8 ]
const dedupeResult = dedupe(dupes)
test({
  actual: dedupeResult.toString(),
  expected: [ 1, 2, 3, 4, 5, 6, 7, 8 ].toString(),
  subject: 'reduce',
  description: 'Correctly reduces a list down to unique numbers'
})

// Curry + Map
const mapPlusFive = curriedMap(plusFive)
const curriedMapResult = mapPlusFive([0, 5, 10, 15 ])
test({
  actual: curriedMapResult.toString(),
  expected: [ 5, 10, 15, 20 ].toString(),
  subject: 'curriedMap',
  description: 'Correctly maps all elements in an Array'
})

// Curry + Filter
const filterEvens = curriedFilter(x => x % 2)
const curriedFilterResult = filterEvens([ 1, 2, 4, 5, 6, 7, 7, 10, 12, 101])
test({
  actual: curriedFilterResult.toString(),
  expected: [ 1, 5, 7, 7, 101 ].toString(),
  subject: 'curriedFilter',
  description: 'Correctly filters an Array down to odd numbers'
})

// Curry + Reduce
const curriedDedupe = curriedReduce([])(concatUniq)
const curriedDedupeResult = curriedDedupe(dupes)
test({
  actual: curriedDedupeResult.toString(),
  expected: [ 1, 2, 3, 4, 5, 6, 7, 8 ].toString(),
  subject: 'curriedReduce',
  description: 'Correctly reduces a list to unique numbers'
})