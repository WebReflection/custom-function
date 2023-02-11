# custom-function

[![Coverage Status](https://coveralls.io/repos/github/WebReflection/custom-function/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/custom-function?branch=main) [![build status](https://github.com/WebReflection/custom-function/actions/workflows/node.js.yml/badge.svg)](https://github.com/WebReflection/custom-function/actions)

Literally the only sane way, if not the fastest one, to extend the `Function` class **witohut evaluation**.

```js
// const CustomFunction = require('custom-function');
import CustomFunction from 'custom-function';

class MyFunction extends CustomFunction {
  invoke(...args) {
    return this(...args);
  }
  toString() {
    return '[native code]';
  }
}

const cf = new MyFunction((a, b) => a + b);
cf(1, 2);         // 3
cf.invoke(1, 2);  // 3
cf.toString();    // "[native code]"
```
