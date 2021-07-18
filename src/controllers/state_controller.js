const { RequestRPC, QueryState, GetBalance, GetBalanceByAccountHash, GetBalanceByState, GetNetWorkRPC} = require('../utils/common');
const { GetValidators, GetEraValidators, GetBids, GetValidatorData } = require('../utils/validator');
const { RpcApiName } = require('../utils/constant');

require('dotenv').config();

const NodeCache = require("node-cache");
const get_validators_cache = new NodeCache({ stdTTL: process.env.CACHE_GET_VALIDATORS || 60 });
const get_bids_cache = new NodeCache({ stdTTL: process.env.CACHE_GET_BIDS || 60 });

module.exports = {
    get_validators_cache,
    get_bids_cache,
    
    GetBalanceAccountHash: async function (req, res) {
        const account_hash = req.params.account_hash;
        try { 
            const url = await GetNetWorkRPC();
            const balance = await GetBalanceByAccountHash(url, account_hash);
            res.status(200);
            res.json(balance);
        }catch(err) {
            res.send(err);
        }
    },

    GetBalanceAddress: async function (req, res) {
        let address = req.params.address;
        try {  
            const url = await GetNetWorkRPC();
            const balance = await GetBalance(url, address);
            res.status(200);
            res.json(balance);
        }catch(err) {
            res.send(err);
        }
    },

    QueryState: async function (req, res) {
        let k = req.params.key;
        //key must be a formatted PublicKey or Key. This will take one of the following forms:
        //     01c9e33693951aaac23c49bee44ad6f863eedcd38c084a3a8f11237716a3df9c2c           # PublicKey
        // account-hash-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20  # Key::Account
        // hash-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20        # Key::Hash
        // uref-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20-007    # Key::URef
        // transfer-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20    # Key::Transfer
        // deploy-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20      # Key::DeployInfo

        QueryState(k).then(value => {
            res.status(200);
            res.json(value);
        }).catch(err => {
            console.log(err);
            res.send(err);
        })
    },

    GetAuctionInfo: async function (req, res) {
        const url = await GetNetWorkRPC();
        RequestRPC(url, RpcApiName.get_auction_info, []).then(value => {
            res.status(200);
            res.json(value.result);
        }).catch(err => {
            res.send(err);
        })
    },

    GetValidators: async function (req, res) {
        const number = req.params.number;
        try {
            const validators = await GetValidators(number);
            get_validators_cache.set(number, validators);
            res.status(200).json(validators);
        } catch (err) {
            res.send(err);
        }
    },

    GetEraValidators: async function (req, res) {

        try {
            const era_validators = await GetEraValidators();
            res.status(200);
            res.json(era_validators);
        } catch (err) {
            res.send(err);
        }

    },

    GetBids: async function (req, res) {
        try {
            const bids = await GetBids();
            get_bids_cache.set("get-bids", bids);
            res.status(200).json(bids);

        } catch (err) {
            res.send(err);
        }
    },

    GetValidator: async function (req, res) {
        try {
            const address = req.params.address;
            const url = await GetNetWorkRPC();
            const data = await GetValidatorData(url, address);
            res.status(200);
            res.json(data);
        } catch(err) {
            console.log(err);
            res.send(err);
        }
    },

    GetBalanceState: async function (req, res) {
        const account_hash = req.query.account_hash;
        const state = req.query.state;
        try{
            const url = await GetNetWorkRPC();
            const result = await GetBalanceByState(url, account_hash, state);
            res.json(result);
        }catch(err) {   
            res.send(err);
        }
    }
};
