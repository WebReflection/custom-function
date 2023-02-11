const CustomFunction = require('../cjs');

class MyFunction extends CustomFunction {
  invoke(...args) {
    return this(...args);
  }
  toString() {
    return '[native code]';
  }
}

class MyOtherFunction extends MyFunction {
  test(...args) {
    return this(...args);
  }
}

const mf = new MyFunction((a, b) => a + b);
const mof = new MyOtherFunction((a, b) => a * b);

console.assert(mf instanceof Function);
console.assert(mf instanceof MyFunction);
console.assert(!(mf instanceof MyOtherFunction));
console.assert(mf(1, 2) === 3);
console.assert(mf.invoke(1, 2) === 3);
console.assert(mf.toString() === '[native code]');

console.assert(mof instanceof Function);
console.assert(mof instanceof MyFunction);
console.assert(mof instanceof MyOtherFunction);
console.assert(mof(2, 3) === 6);
console.assert(mof.invoke(2, 3) === 6);
console.assert(mof.toString() === '[native code]');
console.assert(mof.test(2, 3) === 6);
