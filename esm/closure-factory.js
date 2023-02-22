/*! (c) Andrea Giammarchi - ISC */
const {setPrototypeOf} = Object;

/**
 * @param {Function} Class any base class to extend without passing through it via super() call.
 * @returns {Function} an extensible class for the passed one.
 * @example
 *  // creating this very same module utility
 *  import custom from 'custom-function/factory';
 *  const CustomFunction = custom(Function);
 *  class MyFunction extends CustomFunction {}
 *  const mf = new MyFunction(() => {});
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
