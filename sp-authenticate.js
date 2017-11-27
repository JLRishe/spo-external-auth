const { composeP } = require('ramda');

const getSts = require('./get-sts');
const getAccessCookies = require('./get-access-cookies');

module.exports = 
    (endpoint, username, password) => composeP(getAccessCookies(endpoint), getSts)(endpoint, username, password);