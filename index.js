let fetch = require('node-fetch');
const { curry, composeP } = require('ramda');
const spAuthenticate = require('./sp-authenticate');

const probe = val => { console.log(val); return val; };

const queryEndpoint = 
    curry((endpoint, cookies) => fetch(`https://${endpoint}/`, { headers: { Cookie: cookies } }));

const access = 
    (endpoint, username, password) => composeP(probe, spAuthenticate)(endpoint, username, password);


module.exports = {
    access
};