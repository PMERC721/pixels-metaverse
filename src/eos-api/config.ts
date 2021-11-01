import { Api, JsonRpc } from 'eosjs'
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');

const contract = 'yijiaxunkeji';

const network = {
    blockchain: 'eos',
    protocol: 'https',
    host: 'api-kylin.eosasia.one',
    port: 443,
    chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
}

const defaultPrivateKey = "5JSAusb6xRiunAo5x9qCwk7MMATxLEEKHWDa5FmLpXVLoXBbCsU"; // kylin yijiaxunkeji active
const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
const url = network.protocol + '://' + network.host + ':' + network.port;

const rpc = new JsonRpc(url)
const api = new Api({
    rpc,
    signatureProvider,
    chainId: network.chainId
});

export { api, JsSignatureProvider, contract, network, rpc }