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

/***** COMPOSE *****/
const composeRight = (fn, ...args) =>
  args.reduce((acc, curr) => {
    return (...args_) => curr(acc(...args_))
  }, fn)

const compose = (...args) =>
  composeRight(...args.reverse())

/**
 * Directly callable Array methods
 * --------------------------------------------------------
 */

/***** MAP *****/
const map = partial(reverse(Array.prototype.map))

/***** FILTER *****/
const filter = partial(reverse(Array.prototype.filter))

/***** REDUCE *****/
const reduce = reverse(Array.prototype.reduce)

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

/***** FILTER *****/
const curriedFilter = curry(filter, 2)
// Alternative implementations:
// curry((a, bs) => bs.filter(a))
// arg => partial(reverse(Array.prototype.filter), arg)

/***** REDUCE *****/
const curriedReduce = curry(reduce, 3)
// Alternative implementations:
// curry((a,b,cs) => cs.reduce(b,a))


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
