/** Test util **/
const test = (actual, expected, subject) => {
  if (actual !== expected) throw new Error(`${subject} broken. Expected ${expected}, but got ${actual}`)
}

/**
 * Base Utils
 * --------------------------------------------------------
 */

/***** PARTIAL *****/
const partial = (fn, ...args) => {
  return fn.bind(null, ...args)
}

/***** REVERSE *****/
const reverse = fn => (...args) =>
  fn.call(...args.reverse())

/***** DATA-LAST *****/
const dataLast = fn => (...args) => fn.call(args.pop(), ...args)

/***** CURRY *****/
// NOTE: arity param is needed since prototype methods dont have proper length
const curry = (fn, arity = fn.length, args = []) =>
  args.length < arity
    ? (...nextArgs) => curry(fn, arity, args.concat(nextArgs))
    : fn.apply(null, args)

const curryUglyButt = (fn, arity = fn.length, args = []) =>
  args.length < arity
    ? x => curry(fn, arity, args.concat([x]))
    : fn.apply(null, args)

// Simpler curry for use on functions with proper arity (not prototype methods)
const currySimple = (fn, args = []) =>
  args.length < fn.length
    ? x => currySimple(fn, args.concat([x]))
    : fn.apply(null, args)

/***** COMPOSE *****/
const composeVerbose = (...fns) => (...args) => {
  const result = fns.pop()(...args)
  if (!fns.length) return result
  if (fns.length === 1) return fns[0](result)
  return composeVerbose(...fns)(result)
}

const baseComposeLeft = (f, g) => (...args) => g(f(...args))
const composeReduce = (...fns) => fns.reverse().reduce(baseComposeLeft)

// Example:
const sumThree = (x, y, z) => x + y + z
const curriedSumThree = curry(sumThree)
const numsPlusOne = curriedSumThree(1)
const plusFive = numsPlusOne(4)

test(plusFive(9), 14, 'curry')
test(curriedSumThree(1)(4)(9), 14, 'curry')
test(plusFive(10), 15, 'curry')
test(numsPlusOne(3)(6), 10, 'curry')

/***** COMPOSE *****/
const composeRight = (fn, ...args) =>
  args.reduce((acc, curr) => {
    return (...args_) => curr(acc(...args_))
  }, fn)

const compose = (...args) =>
  composeRight(...args.reverse())

// Examples:
const one = x => x + 1
const two = x => x + 2
const triple = x => x * 3
const addThenTriple = composeRight(one, two, triple)
const tripleThenAdd = compose(one, two, triple)
const addThenTripled = addThenTriple(4)
test(addThenTriple(4), 21, 'compose')
test(tripleThenAdd(4), 15, 'compose')

const multiply = curry((a, b) => (a * b))
const double = multiply(2)
const doublethreetimes = compose(double, double, double)
test(doublethreetimes(3), 24, 'compose')

/**
 * Directly callable Array methods
 * --------------------------------------------------------
 */

/***** MAP *****/
const map = partial(reverse(Array.prototype.map))

// Example:
const addTen = n => n + 10
const mapAddTen = partial(map, addTen)
const mapResult = mapAddTen([ 0, 1, 2, 3 ])
test(mapResult.toString(), [ 10, 11, 12, 13 ].toString(), 'map')


/***** FILTER *****/
const filter = partial(reverse(Array.prototype.filter))

// Example:
const isEven = x => !(x % 2)
const filterOdds = partial(filter, isEven)
const filterResult = filterOdds([ 1, 2, 4, 5, 6, 7, 7, 10, 12, 101])
test(filterResult.toString(), [ 2, 4, 6, 10, 12 ].toString(), 'filter')

/***** REDUCE *****/
const reduce = reverse(Array.prototype.reduce)

// Example:
const concatUniq = (acc, curr) =>
  acc.includes(curr) ? acc : acc.concat(curr)
const dedupe = partial(reduce, [], concatUniq)

const dupes = [ 1, 1, 2, 3, 4, 5, 6, 1, 7, 5, 8 ]
const dedupeResult = dedupe(dupes)
test(dedupeResult.toString(), [ 1, 2, 3, 4, 5, 6, 7, 8 ].toString(), 'reduce')

/***** TAIL *****/
// TODO: add tests
const tail = partial(reverse(Array.prototype.slice), 1)


/**
 * Curried, directly callable Array methods
 * --------------------------------------------------------
 */

/***** MAP *****/
const curriedMap = curry(map, 2)
// Alternative implementations:
// curry((a, bs) => bs.map(a))
// arg => partial(reverse(Array.prototype.map), arg)

// Example:
const mapPlusFive = curriedMap(plusFive)
const curriedMapResult = mapPlusFive([0, 5, 10, 15 ])
test(curriedMapResult.toString(), [ 5, 10, 15, 20 ].toString(), 'curriedMap')

/***** FILTER *****/
const curriedFilter = curry(filter, 2)
// Alternative implementations:
// curry((a, bs) => bs.filter(a))
// arg => partial(reverse(Array.prototype.filter), arg)

// Example:
const filterEvens = curriedFilter(x => x % 2)
const curriedFilterResult = filterEvens([ 1, 2, 4, 5, 6, 7, 7, 10, 12, 101])
test(curriedFilterResult.toString(), [ 1, 5, 7, 7, 101 ].toString(), 'curriedFilter')

/***** REDUCE *****/
const curriedReduce = curry(reduce, 3)
// Alternative implementations:
// curry((a,b,cs) => cs.reduce(b,a))

// Example:
const curriedDedupe = curriedReduce([])(concatUniq)
const curriedDedupeResult = curriedDedupe(dupes)
test(curriedDedupeResult.toString(), [ 1, 2, 3, 4, 5, 6, 7, 8 ].toString(), 'curriedReduce')

module.exports = {
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
}
