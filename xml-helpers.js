const { DOMParser } = require('xmldom');
const { curry, filter, prop, compose, head, map, both  } = require('ramda');
const { toArray, propMatch } = require('./func-helpers');

const parseXml = xml => new DOMParser().parseFromString(xml);

const isMatch = (name, ns) => both(propMatch('localName', name), propMatch('namespaceURI', ns));

const children = curry((name, ns, node) => compose(filter(isMatch(name, ns)), toArray, prop('childNodes'))(node));
const firstNodeText = compose(head, map(prop('textContent')));

module.exports = {
	parseXml,
	children,
	firstNodeText
};