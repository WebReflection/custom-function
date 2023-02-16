const CustomFunction = require('../cjs');

const {defineProperties, getOwnPropertyDescriptors} = Object;

const RETURN = 1 << 0;
const UPDATE = 1 << 1;
const SIGNAL = 1 << 2;

const factory = value => (current, operation = RETURN) => {
  if (operation & RETURN)
    return value;
  if (operation & UPDATE)
    value = current;
  if (operation & SIGNAL)
    console.log('updated signal to', value);
};

class AngularSignal extends CustomFunction {
  set(value) {
    this(value, UPDATE | SIGNAL);
  }
  update(callback) {
    this(callback(this()), UPDATE);
  }
}

const xSignal = value => new AngularSignal(factory(value));

const descriptors = getOwnPropertyDescriptors(
  AngularSignal.prototype
);

const aSignal = value => defineProperties(factory(value), descriptors);

console.log('');
console.log('\x1b[1mcold run\x1b[0m');
bench();

setTimeout(() => {
  for (let i = 0; i < xResult.length; i++)
    console.assert(xResult[i]() === aResult[i]());
    console.log('');
    console.log('\x1b[1mhot run\x1b[0m');
  bench();
}, 1000);

// - - -

function benchCreation(callback) {
  console.time('  creation');
  const signals = [];
  for (let i = 0; i < 0xFFFF; i++)
    signals[i] = callback(i);
  console.timeEnd('  creation');
  return signals;
}

function benchMethod(signals) {
  console.time('  metohd');
  for (let i = 0, fn = n => n * 2; i < signals.length; i++)
    signals[i].update(fn);
  console.timeEnd('  metohd');
  return signals;
}

function bench() {
  console.log('CustomFunction');
  setTimeout(() => {
    globalThis.xResult = benchMethod(benchCreation(xSignal));
    console.log('Object.defineProperties');
    setTimeout(() => {
      globalThis.aResult = benchMethod(benchCreation(aSignal));
    }, 100);
  }, 100);
}

