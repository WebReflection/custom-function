# custom-function

[![Coverage Status](https://coveralls.io/repos/github/WebReflection/custom-function/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/custom-function?branch=main) [![build status](https://github.com/WebReflection/custom-function/actions/workflows/node.js.yml/badge.svg)](https://github.com/WebReflection/custom-function/actions)

<sup>**Social Media Photo by [Aaron Huber](https://unsplash.com/@aahubs) on [Unsplash](https://unsplash.com/)**</sup>

Literally the only sane way, if not the fastest one, to extend the `Function` class **without evaluation**.

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

### Why using a Class?

`Object.assign(fn, {...extras})` can augment `fn` but it cannot have accessors, private fields, `super.method(...args)` calls, and so on, while with this module, everything possible with classes is possible with functions too.

`Object.defineProperties` can have accessors and not all enumerable and writable fields, but it still cannot set private fields or allow `super.method(...args)` calls.

On top of these limitations, adding *O(n)* features requires more effort than swapping once the prototypal chain, where the original `Function.prototype` root of the chain will be preserved regardless.

As summary: every solution to date that is not based on native `class extends` feature is somehow limited, likely slower, surely inferior in terms of DX.
