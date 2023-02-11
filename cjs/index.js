'use strict';
/*! (c) Andrea Giammarchi */
const {setPrototypeOf} = Object;

/**
 * Given a `class Test extends CustomFunction {}` a `new Test(() => {})`
 * will returns the provided callback as `instanceof Test`.
 * @param {function} fn the callback that will inherit class methods.
 * @returns {function} the same, yet upgraded, `fn` callback.
 */
function CustomFunction(fn) {
  return setPrototypeOf(fn, new.target.prototype);
}
module.exports = CustomFunction

CustomFunction.prototype = Function.prototype;
