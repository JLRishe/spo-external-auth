const { compose, __, apply, bind, curry, partial } = require('ramda');
const probe = val => { console.log(val); return val; };

const resolved = Promise.resolve();
const then = curry((f, p) => p.then(f));
const allArgs = (...args) => args;

module.exports = f => compose(then(__, resolved), partial(f), allArgs);