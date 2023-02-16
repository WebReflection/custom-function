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

### Why only Function?

While writing this I had `Function` as one problematic constructor that cannot be extended due inevitable code evaluation involved while invoking `super()` but it's true that this approach/pattern can be used for any constructor that could be problematic if invoked right away, which is why there is a `custom-function/factory` export too so that anything becomes possible, example:

```js
// const custom = require('custom-function/factory');
import custom from 'custom-function/factory';

// reproduce exactly what this module provides:
const CustomFunction = custom(Function);
class MyFunction extends CustomFunction {}

// go wild with any illegal constructor too
const Div = custom(HTMLDivElement);
class MyDiv extends Div {
  constructor(...childNodes) {
    super(document.createElement('div'));
    this.append(...childNodes);
  }
}

document.body.appendChild(
  new MyDiv(
    new MyDiv('A'),
    new MyDiv('B', 'C')
  )
);
```

### Performance

The [benchmark](./test/benchmark.js) test properties added to a callback using this module VS using a predefined *descriptors* object via `Object.defineProperties` to compare the most possible perf-tuned define properties approach against this module pattern.

Use `npm run bench` to test yourself locally, after cloning this repo.

```
cold run
CustomFunction
  creation: 20.884ms
  metohd: 3.421ms
Object.defineProperties
  creation: 76.917ms
  metohd: 4.838ms

hot run
CustomFunction
  creation: 7.597ms
  metohd: 0.667ms
Object.defineProperties
  creation: 94.064ms
  metohd: 1.359ms
```
