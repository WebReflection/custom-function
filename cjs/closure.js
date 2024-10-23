'use strict';
const {setPrototypeOf} = Object;

/**
 * Given a `class Test extends CustomFunction {}` a `new Test(() => {})`
 * will returns the provided callback as `instanceof Test`.
 * @param {function} fn the callback that will inherit class methods.
 * @returns {function} the same, yet upgraded, `fn` callback.
 */
module.exports = class CustomFunction {
  constructor(fn) {
    return setPrototypeOf(fn, this.constructor.prototype);
  }
}

// I am really sorry you are still using closure compiler
setPrototypeOf(CustomFunction.prototype, Function.prototype);
