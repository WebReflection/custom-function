# custom-function

[![Coverage Status](https://coveralls.io/repos/github/WebReflection/custom-function/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/custom-function?branch=main) [![build status](https://github.com/WebReflection/custom-function/actions/workflows/node.js.yml/badge.svg)](https://github.com/WebReflection/custom-function/actions)

<sup>**Social Media Photo by [Aaron Huber](https://unsplash.com/@aahubs) on [Unsplash](https://unsplash.com/)**</sup>

Upgrade plain callables (and other instances) to real subclasses **without** running a problematic superclass constructor—especially `Function`, which would otherwise imply `eval` when used as `super()`.

This library wires the prototype chain once (`Object.setPrototypeOf`) and returns the **same** object, so you keep a native `Function` (or `HTMLDivElement`, etc.) while gaining `instanceof YourClass`, methods, getters, `super`, **private fields**, and every other feature normal `class` syntax supports.

```js
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

## How it works

The default export is a function `CustomFunction` whose **prototype object is `Function.prototype`**. You subclass it as usual:

```js
class Tool extends CustomFunction {
  run() { return this(); }
}
```

When you construct with `new Tool(fn)`, the implementation does **not** call `Function` as a constructor. It only runs:

```js
Object.setPrototypeOf(fn, new.target.prototype);
```

…and returns `fn`. So:

- `fn` is still the original callable (same identity, same engine optimizations).
- `fn instanceof Tool` and `fn instanceof Function` both hold.
- `Tool` can add methods, accessors, private fields, statics, and inheritance exactly like any other class.

The same idea is generalized in **`custom-function/factory`**: pass any constructor `Base`, get a “bridge” whose prototype is `Base.prototype`, and `new Sub(target)` upgrades `target` the same way without ever invoking `Base` from this pattern.

## Why not `Object.assign` or `Object.defineProperties`?

| Approach | Typical use | Limits |
|----------|-------------|--------|
| **`Object.assign(fn, { ... })`** | slap properties on a function | No `class` ergonomics: no real `super`, no private fields, awkward inheritance. |
| **`Object.defineProperties(fn, descriptors)`** | copy accessors / tuned attributes from a prototype | Still **decorates one object at a time**. Each new callable needs descriptor work again; you do not get a shared subclass prototype chain the engine can optimize like a normal class. **Private fields** and natural `super` calls live on the class model, not on “a bag of descriptors” copied onto each instance. |
| **`class extends CustomFunction` (this module)** | one `new Sub(fn)` per callable | Full **JavaScript class** semantics: private fields, `#`, `super.method()`, subclasses, `instanceof`, and a **single** prototype swap per instance instead of re-applying many property definitions. |

In practice, upgrading many functions by repeatedly applying `Object.defineProperties` (even from a precomputed `getOwnPropertyDescriptors` template) is **much slower** than swapping the prototype once. The included [benchmark](./test/benchmark.js) compares the two patterns on creation and repeated method-style updates; run **`npm run bench`** after cloning to see numbers on your machine. Representative runs show creation and hot-path method work **several times faster** with `CustomFunction` than with a tuned `defineProperties` clone of the same prototype.

So: if you want **real classes** around callables (or other instances) without invoking a dangerous `super()`, this pattern is both **faster** than per-instance descriptor augmentation and **more expressive** than anything descriptor-only approaches can model cleanly.

## More examples

### Private fields and `super`

Everything you expect from `class` works on the upgraded function object:

```js
import CustomFunction from 'custom-function';

class BaseFn extends CustomFunction {
  label() {
    return 'base';
  }
}

class SecretFn extends BaseFn {
  #token;
  constructor(fn, token) {
    super(fn);
    this.#token = token;
  }
  label() {
    return `${super.label()}:${this.#token}`;
  }
}

const f = new SecretFn(() => 42, 'abc');
f();              // 42
f.label();        // "base:abc"
f instanceof SecretFn;  // true
f instanceof Function; // true
```

### Any “illegal” constructor: `custom-function/factory`

The default export is specialized for `Function`. The factory export applies the same **prototype swap** to **any** base constructor whose own `super()` would be painful or wrong to run on the instance you already have (for example, you created a DOM node with a factory and only want to subclass behavior):

```js
import custom from 'custom-function/factory';

// Same pattern as the built-in `CustomFunction`:
const CustomFunction = custom(Function);
class MyFunction extends CustomFunction {}

// Example: wrap an existing element without re-running `HTMLDivElement` as super()
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

### Closure Compiler builds

If you need class syntax that Closure Compiler understands better, use:

- **`custom-function/closure`** — class form of the default `Function` bridge.
- **`custom-function/closure-factory`** — class form of the generic factory.

They implement the same `setPrototypeOf` behavior with explicit `class` declarations.

## Exports

| Import | Purpose |
|--------|---------|
| **`custom-function`** | Extend `Function` without calling `Function` as `super()`. |
| **`custom-function/factory`** | Build the same pattern for **any** base class constructor. |
| **`custom-function/closure`** | Closure-friendly `class` variant for `Function`. |
| **`custom-function/closure-factory`** | Closure-friendly `class` variant for `factory`. |

## Performance

The benchmark clones behavior from a small subclass prototype onto many callables either via **`new Sub(fn)`** (this module) or via **`Object.defineProperties(fn, getOwnPropertyDescriptors(Sub.prototype))`**. That is a fair “best effort” for a descriptor-based approach.

```bash
npm run bench
```

Example output shape (numbers vary by hardware):

```
cold run
CustomFunction
  creation: ~21ms
  method:   ~3ms
Object.defineProperties
  creation: ~77ms
  method:   ~5ms

hot run
CustomFunction
  creation: ~8ms
  method:   ~0.7ms
Object.defineProperties
  creation: ~94ms
  method:   ~1.4ms
```

**Takeaway:** one prototype link per instance scales better and stays closer to how engines already optimize ordinary objects and functions than re-materializing properties from descriptor maps on every creation.
