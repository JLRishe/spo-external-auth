const fetch = require('node-fetch');
const { compose, composeP, prop, curry, map, fromPairs, split, tail } = require('ramda');

const userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36';
const signInUrl = endpoint => `https://${endpoint}/_forms/default.aspx?wa=wsignin1.0`;
const signInHeaders = endpoint => ({ Host: endpoint, 'User-Agent': userAgent });

const postWithHeaders = curry((url, headers, body) => fetch(url, { method: 'POST', redirect: 'manual', body, headers }));

const requestAccessTokens = endpoint => postWithHeaders(signInUrl(endpoint), signInHeaders(endpoint));
		
const splitCookie = compose(tail, split(/^([^=]+)=/));
const getCookies = compose(/*fromPairs, map(splitCookie), */prop('set-cookie'), r => r.headers.raw());

const getAccessCookies = endpoint => composeP(getCookies, requestAccessTokens(endpoint));

module.exports = getAccessCookies;