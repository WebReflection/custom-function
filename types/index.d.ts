/**
 * Default export is a constructor whose `.prototype` is `Function.prototype`, so
 * `class Sub extends CustomFunction` upgrades plain functions without ever calling `Function`
 * as a superclass constructor from this module.
 *
 * When `new Sub(fn)` runs, `Object.setPrototypeOf(fn, new.target.prototype)` is applied and
 * the **same** `fn` object is returned, so it becomes `instanceof Sub` while remaining a
 * callable `Function`.
 *
 * @template {Function} F
 * @param {F} fn Callback to upgrade to `instanceof` the concrete subclass.
 * @returns {F}
 */
declare function CustomFunction<F extends Function>(fn: F): F;
export default CustomFunction;
