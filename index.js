let fetch = require('node-fetch');
const _fetch = fetch;
const { curry, composeP } = require('ramda');
const HttpsProxyAgent = require('https-proxy-agent');

const spAuthenticate = require('./sp-authenticate');

function fetchViaProxy(url, options) {
  let instanceOptions = options;

  if (!(options && options.agent) && process.env.HTTP_PROXY) {
    instanceOptions = Object.assign({}, options);
    instanceOptions.agent = new HttpsProxyAgent(process.env.HTTP_PROXY);
  }

  return _fetch(url, instanceOptions);
}

function fiddlerProxyOn() {
  var proxyUrl = "http://127.0.0.1:8888";
  fetch = fetchViaProxy;
  process.env.HTTP_PROXY = proxyUrl;
  process.env.HTTPS_PROXY = proxyUrl;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
}

const probe = val => { console.log(val); return val; };

const queryEndpoint = 
    curry((endpoint, cookies) => fetch(`https://${endpoint}/`, { headers: { Cookie: cookies } }));

const access = 
  (endpoint, username, password) => composeP(probe, spAuthenticate)(endpoint, username, password);

module.exports = {
	access
};