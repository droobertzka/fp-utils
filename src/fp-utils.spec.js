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
const test = (actual, expected, subject) => {
  if (actual !== expected) throw new Error(`${subject} broken. Expected ${expected}, but got ${actual}`)
}

/**
 * Tests
 * --------------------------------------------------------
 */

// Curry
const sumThree = (x, y, z) => x + y + z
const curriedSumThree = fp.curry(sumThree)
const numsPlusOne = curriedSumThree(1)
const plusFive = numsPlusOne(4)

test(plusFive(9), 14, 'curry')
test(curriedSumThree(1)(4)(9), 14, 'curry')
test(plusFive(10), 15, 'curry')
test(numsPlusOne(3)(6), 10, 'curry')


// Compose & ComposeRight
const addOne = x => x + 1
const addTwo = x => x + 2
const triple = x => x * 3

const tripleThenAdd = compose(addOne, addTwo, triple)
test(tripleThenAdd(4), 15, 'compose')

const addThenTriple = composeRight(addOne, addTwo, triple)
test(addThenTriple(4), 21, 'composeRight')

// Curry + Compose
const multiply = curry((a, b) => (a * b))
const double = multiply(2)
const doublethreetimes = compose(double, double, double)
test(doublethreetimes(3), 24, 'compose')

// Map
const addTen = n => n + 10
const mapAddTen = partial(map, addTen)
const mapResult = mapAddTen([ 0, 1, 2, 3 ])
test(mapResult.toString(), [ 10, 11, 12, 13 ].toString(), 'map')

// Filter
const isEven = x => !(x % 2)
const filterOdds = partial(filter, isEven)
const filterResult = filterOdds([ 1, 2, 4, 5, 6, 7, 7, 10, 12, 101])
test(filterResult.toString(), [ 2, 4, 6, 10, 12 ].toString(), 'filter')

// Reduce
const concatUniq = (acc, curr) =>
  acc.includes(curr) ? acc : acc.concat(curr)
const dedupe = partial(reduce, [], concatUniq)

const dupes = [ 1, 1, 2, 3, 4, 5, 6, 1, 7, 5, 8 ]
const dedupeResult = dedupe(dupes)
test(dedupeResult.toString(), [ 1, 2, 3, 4, 5, 6, 7, 8 ].toString(), 'reduce')

// Curry + Map
const mapPlusFive = curriedMap(plusFive)
const curriedMapResult = mapPlusFive([0, 5, 10, 15 ])
test(curriedMapResult.toString(), [ 5, 10, 15, 20 ].toString(), 'curriedMap')

// Curry + Filter
const filterEvens = curriedFilter(x => x % 2)
const curriedFilterResult = filterEvens([ 1, 2, 4, 5, 6, 7, 7, 10, 12, 101])
test(curriedFilterResult.toString(), [ 1, 5, 7, 7, 101 ].toString(), 'curriedFilter')

// Curry + Reduce
const curriedDedupe = curriedReduce([])(concatUniq)
const curriedDedupeResult = curriedDedupe(dupes)
test(curriedDedupeResult.toString(), [ 1, 2, 3, 4, 5, 6, 7, 8 ].toString(), 'curriedReduce')