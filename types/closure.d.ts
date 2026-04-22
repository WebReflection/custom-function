/**
 * Closure-compiler-friendly class form of the same upgrade pattern as the default export of
 * `custom-function`: `class Sub extends CustomFunction` and `new Sub(fn)` mutates `fn` with
 * `Object.setPrototypeOf(fn, this.constructor.prototype)` and returns `fn`, so it is
 * `instanceof Sub` without invoking `Function` as `super()`.
 *
 * @template {Function} F
 */
export default class CustomFunction<F extends Function> {
    /**
     * @param {F} fn Callback to upgrade to `instanceof` the concrete subclass.
     * @returns {F}
     */
    constructor(fn: F);
}
