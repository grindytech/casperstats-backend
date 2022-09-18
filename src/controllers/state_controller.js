const { RequestRPC, QueryState, GetBalance,
    GetBalanceByAccountHash, GetBalanceByState, GetNetWorkRPC } = require('../utils/common');
const { GetValidators, GetCurrentEraValidators, GetNextEraValidators,
    GetBids, GetValidatorData, GetValidatorInformation, GetRangeBids } = require('../utils/validator');
const { RpcApiName } = require('../utils/constant');

require('dotenv').config();

const NodeCache = require("node-cache");
const { GetLatestDeployCostByType } = require('../models/deploy');
const { GetRangeDelegator } = require("../models/delegator");
const { GetRangeEraRewards, GetLatestEra } = require("../models/era");
const { GetDateByEra } = require("../models/era_id");

const get_validators_cache = new NodeCache({ stdTTL: process.env.CACHE_GET_VALIDATORS || 300 });
const get_bids_cache = new NodeCache({ stdTTL: process.env.CACHE_GET_ERA_VALIDATORS || 7200 });
const get_current_era_validators_cache = new NodeCache({ stdTTL: process.env.CACHE_GET_ERA_VALIDATORS || 7200 });
const get_validator_cache = new NodeCache({ stdTTL: process.env.CACHE_GET_VALIDATOR || 300 });
const get_range_delegator_cache = new NodeCache({ stdTTL: process.env.CACHE_GET_RANGE_DELEGATOR || 300});
const get_range_era_rewards_cache = new NodeCache({ stdTTL: process.env.CACHE_GET_RANGE_ERA_REWARDS || 300});
const get_next_era_validators_cache = new NodeCache({ stdTTL: process.env.CACHE_GET_ERA_VALIDATORS || 7200 });

module.exports = {
    get_validators_cache,
    get_bids_cache,
    get_validator_cache,
    get_current_era_validators_cache,
    get_range_delegator_cache,
    get_range_era_rewards_cache,
    get_next_era_validators_cache,

    GetBalanceAccountHash: async function (req, res) {
        const account_hash = req.params.account_hash;
        try {
            const url = await GetNetWorkRPC();
            const balance = await GetBalanceByAccountHash(url, account_hash);
            res.status(200);
            res.json(balance);
        } catch (err) {
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
        } catch (err) {
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

    GetCurrentEraValidators: async function (req, res) {

        try {
            const url = await GetNetWorkRPC();
            const era_validators = await GetCurrentEraValidators(url);
            get_current_era_validators_cache.set("get-era-validators", era_validators);
            res.status(200).json(era_validators);
        } catch (err) {
            res.send(err);
        }

    },

    GetNextEraValidators: async function (req, res) {
        try {
            const url = await GetNetWorkRPC();
            const era_validators = await GetNextEraValidators(url);
            get_next_era_validators_cache.set("get-era-validators", era_validators);
            res.status(200).json(era_validators);
        } catch (err) {
            res.send(err);
        }
    },

    GetBids: async function (req, res) {
        try {
            // const url = await GetNetWorkRPC();
            // const block = await RequestRPC(url, RpcApiName.get_block, []);
            
            const era_id = await GetLatestEra();
            if(get_bids_cache.has(`era_id: '${era_id}'`)){
                res.status(200).json(get_bids_cache.get(`era_id: '${era_id}'`))
            }else{
                const current_era_id = era_id - 1;
                if(get_bids_cache.has(`era_id: '${current_era_id}'`)){
                    get_bids_cache.del(`era_id: '${current_era_id}'`);
                }
                const bids = await GetBids();
                get_bids_cache.set(`era_id: '${era_id}'`, bids);
                res.status(200).json(bids);
            }

        } catch (err) {
            res.send(err);
        }
    },

    getRangeBids: async function (req, res) {
        try{
            const start = req.query.start;
            const count = req.query.count;
            const bids = await GetRangeBids(start, count);
            res.status(200).json(bids);
        }catch (err) {
            res.send(err);
        }
    },

    GetValidator: async function (req, res) {
        try {
            const address = req.params.address;
            const url = await GetNetWorkRPC();
            let data = await GetValidatorData(url, address);

            // add additonal information
            try {
                data.information = await GetValidatorInformation(address);
            } catch (err) {
                data.information = null;
            }
            get_validator_cache.set(address, data);
            res.status(200);
            res.json(data);
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    },

    GetRangeDelegator: async function (req, res) {
        try{   
            const validator = req.query.validator;
            const start = Number(req.query.start);
            const count = Number(req.query.count);
            const data = await GetRangeDelegator(validator, start, count);
            get_range_delegator_cache.set(`validator: '${validator}' start: ${start} count: ${count}`, data);
            res.status(200);
            res.json(data);

        }catch (err) {
            console.log(err);
            res.send(err);
        }
    },

    GetRangeEraRewards: async function (req, res) {
        try{
            const validator = req.query.validator;
            const start = req.query.start;
            const count = req.query.count;

            const data = await GetRangeEraRewards(validator, start, count);
            if(data.length > 0){
                for(let i = 0; i< data.length; i++){
                    const timestamp = await GetDateByEra(data[i].era);
                    data[i].timestamp = timestamp;
                }
            }
            get_range_era_rewards_cache.set(`validator: '${validator}' start: ${start} count: ${count}`, data)
            res.status(200);
            res.json(data);
        }catch (err) {
            console.log(err);
            res.send(err);
        }
    },

    GetBalanceState: async function (req, res) {
        const account_hash = req.query.account_hash;
        const state = req.query.state;
        try {
            const url = await GetNetWorkRPC();
            const result = await GetBalanceByState(url, account_hash, state);
            res.json(result);
        } catch (err) {
            res.send(err);
        }
    },

    GetLatestTransaction: async function (req, res) {
        const type = req.params.type;
        try {
            let cost = (await GetLatestDeployCostByType(type)).cost;
            if(type == "delegate") {
                if(Number(cost) < Number(process.env.MIN_DELEGATE_FEE)) {
                    cost = Number(process.env.MIN_DELEGATE_FEE);
                }
            }
            res.status(200).json({
                type: type,
                fee: cost.toString()
            })
        } catch (err) {
            res.status(500).send(`Can not get latest cost of ${type} transaction`);
        }
    }
};
