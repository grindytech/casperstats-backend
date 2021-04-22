const { EventService, CasperServiceByJsonRPC } = require('casper-client-sdk');
const { Execute, RequestRPC } = require('../utils/utils');
const { RpcApiName } = require('../utils/constant');

require('dotenv').config();

module.exports = {
    GetStateRootHash: function (req, res) {
        let id = req.query.id; // JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned
        let b = req.query.b; // Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used

        let params;

        // check b is a number or string to change the params
        if (isNaN(b)) {
            params = [{ "Hash": b }]
        } else {
            params = [{ "Height": b }]
        }

        RequestRPC(id, RpcApiName.get_state_root_hash, params).then(value => {
            res.status(200);
            res.json(value);
        }).catch(err => {
            res.status(500);
            res.json(err)
        })
    },

    QueryState: function (req, res) {
        let id = req.query.id; // JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned
        let s = req.query.s; // Hex-encoded hash of the state root

        let k = req.query.k;
        //key must be a formatted PublicKey or Key. This will take one of the following forms:
        //     01c9e33693951aaac23c49bee44ad6f863eedcd38c084a3a8f11237716a3df9c2c           # PublicKey
        // account-hash-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20  # Key::Account
        // hash-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20        # Key::Hash
        // uref-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20-007    # Key::URef
        // transfer-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20    # Key::Transfer
        // deploy-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20      # Key::DeployInfo

        let command = `${process.env.CASPER_CLIENT} query-state --node-address ${process.env.NETWORK_RPC_API} -k ${k}`;

        if (id) {
            command = command + ` --id ${id}`;
        }

        if (s) {
            command = command + ` -s ${s}`;
        } else {
            // will be take the latest state root hash

        }

        Execute(command).then(value => {
            res.status(200);
            res.json(value);
        }).catch(err => {
            res.status(500);
            res.json(err)
        })
    },

    GetBalance: function (req, res) {

        let id = req.query.id;
        let s = req.query.s; //Hex-encoded hash of the state root
        let p = req.query.p; //The URef under which the purse is stored. This must be a properly formatted URef "uref-<HEX STRING>-<THREE DIGIT INTEGER>"

        let params = [s, p];

        RequestRPC(id, RpcApiName.get_balance, params).then(value => {
            res.status(200);
            res.json(value);
        }).catch(err => {
            res.status(500);
            res.json(err)
        })
    }

};
