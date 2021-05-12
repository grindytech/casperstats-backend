const { RequestRPC, GetBalance, QueryState } = require('../utils/utils');
const { GetValidator, GetEraValidators, GetBids } = require('../utils/validator');
const { RpcApiName } = require('../utils/constant');

require('dotenv').config();

module.exports = {

    GetBalance: async function (req, res) {

        let id = req.query.id;
        let s = req.query.s; //Hex-encoded hash of the state root
        let p = req.query.p; //The URef under which the purse is stored. This must be a properly formatted URef "uref-<HEX STRING>-<THREE DIGIT INTEGER>"

        let params = [s, p];

        RequestRPC(RpcApiName.get_balance, params, id).then(value => {
            res.status(200);
            res.json(value);
        }).catch(err => {
            res.status(500);
            res.json(err)
        })
    },

    GetBalanceV2: async function (req, res) {
        let address = req.params.address;

        try {  
            const balance = await GetBalance(address);
            res.status(200);
            res.json(balance);
        }catch(err) {
            // res.status(500);
            res.json(err);
        }


    },

    QueryState: async function (req, res) {
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

        QueryState(k, s, id).then(value => {
            res.status(200);
            res.json(value);
        }).catch(err => {
            res.status(500);
            res.json(err);
        })
    },

    GetAuctionInfo: async function (req, res) {
        RequestRPC(RpcApiName.get_auction_info, []).then(value => {
            res.status(200);
            res.json(value.result);
        }).catch(err => {
            res.status(500);
            res.json(err)
        })
    },

    GetValidators: async function (req, res) {
        const number = req.params.number;
        try {
            const validators = await GetValidator(number);
            res.status(200);
            res.json(validators);

        } catch (err) {
            res.status(500);
            res.json(err);
        }
    },

    GetEraValidators: async function (req, res) {

        try {
            const era_validators = await GetEraValidators();
            res.status(200);
            res.json(era_validators);

        } catch (err) {
            res.status(500);
            res.json(err);
        }

    },

    GetBids: async function (req, res) {
        try {
            const bids = await GetBids();
            res.status(200);
            res.json(bids);

        } catch (err) {
            res.status(500);
            res.json(err);
        }
    }
};
