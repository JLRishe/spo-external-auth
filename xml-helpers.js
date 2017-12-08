const { DOMParser } = require('xmldom');
const { prop, compose, head, map  } = require('ramda');

const parseXml = xml => new DOMParser().parseFromString(xml);

const firstNodeText = compose(head, map(prop('textContent')));

module.exports = {
    parseXml,
    firstNodeText
};