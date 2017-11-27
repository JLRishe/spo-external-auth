const { curry, prop, compose, both, equals  } = require('ramda');

const toArray = Array.from.bind(Array);

const propMatch = curry((propName, value) => compose(equals(value), prop(propName)));

module.exports = {
	toArray,
	propMatch
};