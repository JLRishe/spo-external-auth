const fetch = require('node-fetch');
const promisifySync = require('./promisify-sync');
const { parseXml, children, firstNodeText } = require('./xml-helpers');
const { compose, composeP, composeK, prop, curry, filter, map, chain, head } = require('ramda');

const se = 'http://www.w3.org/2003/05/soap-envelope';
const wst = 'http://schemas.xmlsoap.org/ws/2005/02/trust';
const wsse = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd';

function getRequestXml(endpoint, username, password) {
    return `<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope"
                        xmlns:a="http://www.w3.org/2005/08/addressing"
                        xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
             <s:Header>
               <a:Action s:mustUnderstand="1">http://schemas.xmlsoap.org/ws/2005/02/trust/RST/Issue</a:Action>
               <a:ReplyTo>
                 <a:Address>http://www.w3.org/2005/08/addressing/anonymous</a:Address>
               </a:ReplyTo>
               <a:To s:mustUnderstand="1">https://login.microsoftonline.com/extSTS.srf</a:To>
               <o:Security s:mustUnderstand="1"
                  xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
                 <o:UsernameToken>
                   <o:Username>${username}</o:Username>
                   <o:Password>${password}</o:Password>
                 </o:UsernameToken>
               </o:Security>
  </s:Header>
  <s:Body>
    <t:RequestSecurityToken xmlns:t="http://schemas.xmlsoap.org/ws/2005/02/trust">
      <wsp:AppliesTo xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy">
        <a:EndpointReference>
          <a:Address>https://${endpoint}/</a:Address>
        </a:EndpointReference>
      </wsp:AppliesTo>
      <t:KeyType>http://schemas.xmlsoap.org/ws/2005/05/identity/NoProofKey</t:KeyType>
      <t:RequestType>http://schemas.xmlsoap.org/ws/2005/02/trust/Issue</t:RequestType>
      <t:TokenType>urn:oasis:names:tc:SAML:1.0:assertion</t:TokenType>
    </t:RequestSecurityToken>
  </s:Body>
</s:Envelope>`;
}

const post = curry((url, body) => fetch(url, { method: 'POST', body }));

const makeStsRequest = post('https://login.microsoftonline.com/extSTS.srf');

const fetchResponseText = r => r.text();

const binarySearchTokenNode = composeK(
  children('BinarySecurityToken', wsse),
  children('RequestedSecurityToken', wst),
  children('RequestSecurityTokenResponse', wst), 
  children('Body', se), 
  children('Envelope', se)
);

const binarySearchToken = compose(firstNodeText, binarySearchTokenNode);

const parseStsResponse = compose(binarySearchToken, parseXml);

const authenticateSts = composeP(parseStsResponse, fetchResponseText, makeStsRequest, promisifySync(getRequestXml));

module.exports = authenticateSts;


