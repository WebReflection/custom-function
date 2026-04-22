const { setPrototypeOf } = Object;

/**
 * Closure-compiler-friendly variant of the default export of `custom-function/factory`:
 * returns a `class Custom` whose prototype chain is wired to `Class.prototype` without
 * invoking `Class` as a constructor.
 *
 * For `class Sub extends custom(Base)` and `new Sub(target)`, `Object.setPrototypeOf(target,
 * this.constructor.prototype)` runs and the **same** `target` is returned, so it becomes
 * `instanceof Sub` while typically remaining `instanceof Base` for a suitable `target`.
 *
 * @template {abstract new (...args: any[]) => object} C
 * @param {C} Class Base constructor whose `.prototype` is linked from `Custom.prototype`.
 * @returns {new (target: InstanceType<C>) => InstanceType<C>}
 * @example
 * // creating this very same module utility
 * import custom from 'custom-function/closure-factory';
 * const CustomFunction = custom(Function);
 * class MyFunction extends CustomFunction {}
 * const mf = new MyFunction(() => {});
 */
export default Class => {
  class Custom {
    constructor(fn) {
      return setPrototypeOf(fn, this.constructor.prototype);
    }
  }
  // I am really sorry you are still using closure compiler
  setPrototypeOf(Custom.prototype, Class.prototype);
  return Custom;
};
